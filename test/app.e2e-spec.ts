import { faker } from "@faker-js/faker";
import { HttpStatus, type INestApplication } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { generateCpf } from "cpf_and_cnpj-generator";
import * as request from "supertest";
import type { App } from "supertest/types";

import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/ (GET)", async () => {
    return await request(app.getHttpServer())
      .get("/")
      .expect(HttpStatus.OK)
      .expect("Hello World!");
  });

  it("/admin-employees (POST)", async () => {
    return await request(app.getHttpServer())
      .post("/admin-employees")
      .send({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: faker.internet.username(),
        password: faker.internet.password(),
        cpf: generateCpf(),
      })
      .expect(HttpStatus.CREATED)
      .expect((res: request.Response) => {
        expect(res.body).toHaveProperty("id");
      });
  });
});
