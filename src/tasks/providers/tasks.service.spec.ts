import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { TasksService } from "./tasks.service";

describe("TasksService", () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("deleteInactiveEmployeesAndRelationsForOneYear", () => {
    it("should log a verbose message", () => {
      const spy = jest.spyOn(service["logger"], "verbose");

      service.deleteInactiveEmployeesAndRelationsForOneYear();

      expect(spy).toHaveBeenCalledWith(
        "Deleting 1 year inactive employees and respective relations...",
      );
    });
  });

  describe("sendWeeklyEmployeeReportsToManager", () => {
    it("should log a verbose message", () => {
      const spy = jest.spyOn(service["logger"], "verbose");

      service.sendWeeklyEmployeeReportsToManager();

      expect(spy).toHaveBeenCalledWith(
        "Sending weekly employee reports to manager...",
      );
    });
  });

  describe("notifyPendingEmployeeDocuments", () => {
    it("should log a verbose message", () => {
      const spy = jest.spyOn(service["logger"], "verbose");

      service.notifyPendingEmployeeDocuments();

      expect(spy).toHaveBeenCalledWith(
        "Notifying employees about pending documents...",
      );
    });
  });
});
