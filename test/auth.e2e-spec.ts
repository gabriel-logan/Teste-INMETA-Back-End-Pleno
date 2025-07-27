import { HttpStatus, type INestApplication } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
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

  describe("signIn", () => {
    it("should sign in with valid credentials (POST)", () => {
      return request(app.getHttpServer())
        .post("/auth/sign-in")
        .send({
          username: "string",
          password: "123456",
        })
        .expect(HttpStatus.OK)
        .expect({
          accessToken: expect.any(String) as string,
        });
    });

    it("should return unauthorized for invalid password credentials (POST)", () => {
      return request(app.getHttpServer())
        .post("/auth/sign-in")
        .send({
          username: "string",
          password: "wrongPassword",
        })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: "Invalid username or password",
          error: "Unauthorized",
        });
    });

    it("should return unauthorized for invalid username credentials (POST)", () => {
      return request(app.getHttpServer())
        .post("/auth/sign-in")
        .send({
          username: "wrongUsername",
          password: "123456",
        })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: "Invalid username or password",
          error: "Unauthorized",
        });
    });
  });
});
