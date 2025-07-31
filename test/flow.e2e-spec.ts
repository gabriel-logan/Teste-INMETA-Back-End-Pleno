import { HttpStatus, type INestApplication } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { join } from "path";
import * as request from "supertest";
import type { App } from "supertest/types";

import { AppModule } from "./../src/app.module";
import { authenticate } from "./utils/auth";
import { createFakeCommonEmployee } from "./utils/fake-data";

describe("Protected Routes Flow (e2e)", () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let fakeData: {
    employeeId: string;
    firstName: string;
    lastName: string;
    password: string;
    cpf: string;
  };
  let documentType1: { id: string; name: string };
  let documentType2: { id: string; name: string };
  let documentToSend: {
    documentName: string;
    documentStatus: {
      documentId: string;
      status: string;
    };
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Authenticate to get the access token
    accessToken = await authenticate(app);

    fakeData = {
      employeeId: "",
      ...createFakeCommonEmployee(),
    };

    const existingDocumentType = await request(app.getHttpServer())
      .get("/document-types")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    const existingDocumentTypeBody = existingDocumentType.body as {
      id: string;
      name: string;
    }[];

    if (existingDocumentTypeBody.length > 1) {
      documentType1 = existingDocumentTypeBody[0];
      documentType2 = existingDocumentTypeBody[1];
    } else {
      const [newType1, newType2] = await Promise.all([
        request(app.getHttpServer())
          .post("/document-types")
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ name: "CPF" })
          .expect(HttpStatus.CREATED),
        request(app.getHttpServer())
          .post("/document-types")
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ name: "CNPJ" })
          .expect(HttpStatus.CREATED),
      ]);

      documentType1 = newType1.body as { id: string; name: string };
      documentType2 = newType2.body as { id: string; name: string };
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return unauthorized for protected route without token or invalid token", async () => {
    return request(app.getHttpServer())
      .get("/employees")
      .set("Authorization", "Bearer invalidToken")
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.message).toMatch(/Unauthorized|invalid/i);
      });
  });

  it("should retrieve the list of employees", async () => {
    return request(app.getHttpServer())
      .get("/employees")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);
  });

  it("should create a new employee", async () => {
    const res = await request(app.getHttpServer())
      .post("/employees")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        firstName: fakeData.firstName,
        lastName: fakeData.lastName,
        password: fakeData.password,
        cpf: fakeData.cpf,
      })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body).toHaveProperty("id");
      });

    fakeData.employeeId = (res.body as { id: string }).id;
  });

  it("should link an employee to a document type", async () => {
    return request(app.getHttpServer())
      .post(`/document-type-linkers/${fakeData.employeeId}/link`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        documentTypeIds: [documentType1.id, documentType2.id],
      })
      .expect(HttpStatus.OK);
  });

  it("should list missing documents for an employee", async () => {
    const res = await request(app.getHttpServer())
      .get(`/documents/missing/all`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    const body = res.body as {
      documents: Array<{
        id: string;
        status: string;
        documentUrl: string;
        createdAt: string;
        updatedAt: string;
        employee: {
          id: string;
          firstName: string;
          lastName: string;
          fullName: string;
          username: string;
          contractStatus: string;
          cpf: string;
          role: string;
          createdAt: string;
          updatedAt: string;
        };
        documentType: {
          id: string;
          name: string;
          createdAt: string;
          updatedAt: string;
        };
      }>;
      total: number;
      page: number;
      limit: number;
    };

    expect(Array.isArray(body.documents)).toBe(true);

    expect(body.documents.length).toBeGreaterThan(0);

    expect(typeof body.total).toBe("number");
    expect(typeof body.page).toBe("number");
    expect(typeof body.limit).toBe("number");

    for (const item of body.documents) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("status", "missing");
      expect(item).toHaveProperty("documentUrl");
      expect(item).toHaveProperty("createdAt");
      expect(item).toHaveProperty("updatedAt");

      expect(item).toHaveProperty("employee");
      expect(item.employee).toMatchObject({
        id: expect.any(String) as string,
        firstName: expect.any(String) as string,
        lastName: expect.any(String) as string,
        username: expect.any(String) as string,
        contractStatus: expect.any(String) as string,
        cpf: expect.any(String) as string,
        role: expect.any(String) as string,
        createdAt: expect.any(String) as string,
        updatedAt: expect.any(String) as string,
      });

      expect(item).toHaveProperty("documentType");
      expect(item.documentType).toMatchObject({
        id: expect.any(String) as string,
        name: expect.any(String) as string,
        createdAt: expect.any(String) as string,
        updatedAt: expect.any(String) as string,
      });
    }
  });

  it("should get an missing document by employee ID", async () => {
    const res = await request(app.getHttpServer())
      .get(`/documents/employee/${fakeData.employeeId}/statuses?status=missing`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    const body = res.body as {
      documentStatuses: [
        {
          documentName: string;
          documentStatus: {
            documentId: string;
            status: string;
          };
        },
      ];
    };

    documentToSend = body.documentStatuses[0];
  });

  it("Should find specific file document and status should be 'missing'", async () => {
    const res = await request(app.getHttpServer())
      .get(`/documents/${documentToSend.documentStatus.documentId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    const body = res.body as {
      documentId: string;
      status: string;
    };

    expect(body).toHaveProperty("status", "missing");
  });

  it("should send a document for an employee", async () => {
    const filePath: string | undefined = join(
      __dirname,
      "fixtures",
      "sample.pdf",
    );

    if (!filePath) {
      throw new Error(
        "File not found or corrupted. Please check the file path.",
      );
    }

    expect(documentToSend).toBeDefined();

    return request(app.getHttpServer())
      .post(`/document-files/${documentToSend.documentStatus.documentId}/send`)
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("documentFile", filePath)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body).toHaveProperty(
          "message",
          expect.any(String) as string,
        );
        expect(res.body).toHaveProperty(
          "documentUrl",
          expect.any(String) as string,
        );
      });
  });

  it("Should find specific sent document and status should be 'available'", async () => {
    const res = await request(app.getHttpServer())
      .get(`/documents/${documentToSend.documentStatus.documentId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    const body = res.body as {
      documentId: string;
      status: string;
    };

    expect(body).toHaveProperty("status", "available");
  });
});
