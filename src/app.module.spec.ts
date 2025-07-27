import { Test, type TestingModule } from "@nestjs/testing";

import { AppModule } from "./app.module";

describe("AppModule", () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });
});
