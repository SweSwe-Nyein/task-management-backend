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

  async findAll(query: { status?: string, page: number, limit: number, user_id: Types.ObjectId }): Promise<{ tasks: Task[], total: number }> {
    const { status, page, limit, user_id } = query;
    const skip = (page - 1) * limit;

    const tasks = await this.taskRepository.findAll({ status, skip, limit, user_id });
    const total = await this.taskRepository.countAll({ status, user_id });

    return { tasks, total };
  }

  async updateOne(user_id: Types.ObjectId, taskId: string, data: TaskDto) {
    await this.taskRepository.updateOne(user_id, taskId, data);
  }

  async markAsDone(user_id: Types.ObjectId, taskId: string) {
    return await this.taskRepository.updateOne(user_id, taskId, { status: 'done' });
  }

  async findById(user_id: Types.ObjectId, taskId: string) {
    return await this.taskRepository.findById(user_id, taskId);
  }

  async delete(user_id: Types.ObjectId, id: string) {
    return await this.taskRepository.delete(user_id, id);
  }

  async getTaskCounts(user_id: Types.ObjectId, q: { q: string }): Promise<{ todo: number, in_progress: number, done: number }> {
    return await this.taskRepository.getTaskCounts(user_id, q);
  }

  async hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }
}
