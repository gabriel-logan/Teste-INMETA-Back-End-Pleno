import { Module } from "@nestjs/common";

import { TasksService } from "./providers/tasks.service";

@Module({
  providers: [TasksService],
})
export class TasksModule {}
