import { HttpStatus, type INestApplication } from "@nestjs/common";
import * as request from "supertest";
import type { App } from "supertest/types";

const adminCredentials = {
  username: process.env.TEST_USERNAME,
  password: process.env.TEST_PASSWORD,
};

export async function authenticate(
  app: INestApplication<App>,
): Promise<string> {
  const res = await request(app.getHttpServer())
    .post("/auth/sign-in")
    .send({
      username: adminCredentials.username,
      password: adminCredentials.password,
    })
    .expect(HttpStatus.OK)
    .expect((res) => {
      const body = res.body as { accessToken: string };

      expect(body).toHaveProperty("accessToken");
      expect(typeof body.accessToken).toBe("string");
    });

  return (res.body as { accessToken: string }).accessToken;
}
