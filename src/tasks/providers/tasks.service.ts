import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_YEAR)
  deleteInactiveEmployeesAndRelationsForOneYear(): void {
    // This is just an example of a scheduled task.
    // You can add more methods with different cron expressions as needed.
    // It can be used to perform periodic tasks such as cleaning up data, sending notifications, etc.
    this.logger.verbose(
      "Deleting 1 year inactive employees and respective relations...",
    );
  }

  @Cron(CronExpression.EVERY_WEEK)
  sendWeeklyEmployeeReportsToManager(): void {
    // Send a email or any other notification to the manager
    // with the weekly report of the employees.
    // This is just a placeholder for the actual implementation.
    this.logger.verbose("Sending weekly employee reports to manager...");
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  notifyPendingEmployeeDocuments(): void {
    // Notify the employees about their pending documents.
    // This is just a placeholder for the actual implementation.
    this.logger.verbose("Notifying employees about pending documents...");
  }
}
