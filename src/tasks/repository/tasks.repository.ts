import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Task, TasksDocument } from '../schemas/tasks.schema';
import { TaskDto } from '../dto/tasks.dto';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TasksDocument>) {}

  async create(createTaskDto: TaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async findAll(query: { status?: string, skip: number, limit: number, user_id: Types.ObjectId }): Promise<Task[]> {
    const filters: mongoose.FilterQuery<TasksDocument> = {};
    
    if (query.status) {
      filters.status = query.status;
      filters.user_id = query.user_id;
    }

    return await this.taskModel.find(filters).skip(query.skip).limit(query.limit).sort({ createdAt: -1 }).exec();
  }

  async countAll(query: { status?: string, user_id: Types.ObjectId }): Promise<number> {
    const filters: mongoose.FilterQuery<TasksDocument> = {};
    filters.user_id = query.user_id;
    if (query.status) {
      filters.status = query.status;
    }

    return await this.taskModel.countDocuments(filters).exec();
  }

  async updateOne(user_id: Types.ObjectId, taskId: string, data: Partial<TaskDto>) {
    this.taskModel.updateOne({ _id: taskId, user_id }, { $set: data }).exec();

  }

  async findById(user_id: Types.ObjectId, taskId: string) {
    return this.taskModel.findOne({ _id: taskId, user_id }).exec();
  }

  async delete(user_id: Types.ObjectId, taskId: string) {
    return await this.taskModel.deleteOne({ _id: taskId, user_id});
  }

  async getTaskCounts(user_id: Types.ObjectId, query: { q: string }): Promise<{ todo: number, in_progress: number, done: number }> {
    let filters: mongoose.FilterQuery<TasksDocument> = { user_id: user_id, $or: [
      { title: new RegExp(query.q, 'i') },
      { description: new RegExp(query.q, 'i') },
    ], };
    if (!query.q) {
      filters = {};
      filters.user_id = user_id;
    }
  
    // Count tasks based on their status
    const [todoCount, inProgressCount, doneCount] = await Promise.all([
      this.taskModel.countDocuments({ ...filters, status: 'todo' }),
      this.taskModel.countDocuments({ ...filters, status: 'in_progress' }),
      this.taskModel.countDocuments({ ...filters, status: 'done' }),
    ]);
  
    return { todo: todoCount, in_progress: inProgressCount, done: doneCount };
  }
}
