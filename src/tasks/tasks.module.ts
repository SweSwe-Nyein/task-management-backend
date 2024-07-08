import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TaskController } from './tasks.controller';
import { TasksSchema, Task } from './schemas/tasks.schema';
import { TaskRepository } from './repository/tasks.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Task.name, schema: TasksSchema}]),
  ],
  exports: [MongooseModule, TaskRepository, TasksService],
  providers: [TasksService, TaskRepository],
  controllers: [TaskController],
})

export class TasksModule {}