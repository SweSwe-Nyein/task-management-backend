import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Task } from './schemas/tasks.schema';
import { TaskRepository } from './repository/tasks.repository';
import { TaskDto } from './dto/tasks.dto';
import { Types } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(createTaskDto: TaskDto): Promise<Task> {
    const createdTask = await this.taskRepository.create(createTaskDto);
    return createdTask;
  }

  async findAll(query: { status?: string, page: number, limit: number }): Promise<{ tasks: Task[], total: number }> {
    const { status, page, limit } = query;
    const skip = (page - 1) * limit;

    const tasks = await this.taskRepository.findAll({ status, skip, limit });
    const total = await this.taskRepository.countAll({ status });

    return { tasks, total };
  }

  async updateOne(taskId: string, data: TaskDto) {
    await this.taskRepository.updateOne(taskId, data);
  }

  async markAsDone(taskId: string) {
    return await this.taskRepository.updateOne(taskId, { status: 'done' });
  }

  async findById(taskId: string) {
    return await this.taskRepository.findById(taskId);
  }

  async delete(id: string) {
    return await this.taskRepository.delete(id);
  }

  async getTaskCounts(q: { q: string }): Promise<{ todo: number, in_progress: number, done: number }> {
    return await this.taskRepository.getTaskCounts(q);
  }

  async hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }
}
