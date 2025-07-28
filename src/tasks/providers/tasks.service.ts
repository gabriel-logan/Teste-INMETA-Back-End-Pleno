import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_YEAR)
  delete1yearInactiveEmployeesAndRespectiveRelations(): void {
    this.logger.log(
      "Deleting 1 year inactive employees and respective relations...",
    );
  }
}
