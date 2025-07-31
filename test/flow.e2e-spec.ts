import { HttpStatus, type INestApplication } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import type { App } from "supertest/types";

import { AppModule } from "./../src/app.module";

describe("Protected Routes (e2e)", () => {
  let app: INestApplication<App>;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer()).post("/auth/sign-in").send({
      username: "admin",
      password: "123456",
    });

    accessToken = (res.body as { accessToken: string }).accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it("/employees", async () => {
    return request(app.getHttpServer())
      .get("/employees")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);
  });
});
