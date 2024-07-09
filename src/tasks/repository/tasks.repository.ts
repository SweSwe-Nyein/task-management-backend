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

  async findAll(query: { status?: string, skip: number, limit: number }): Promise<Task[]> {
    const filters: mongoose.FilterQuery<TasksDocument> = {};
    
    if (query.status) {
      filters.status = query.status;
    }

    return await this.taskModel.find(filters).skip(query.skip).limit(query.limit).sort({ createdAt: -1 }).populate('assignee', 'full_name').exec();
  }

  async countAll(query: { status?: string }): Promise<number> {
    const filters: mongoose.FilterQuery<TasksDocument> = {};

    if (query.status) {
      filters.status = query.status;
    }

    return await this.taskModel.countDocuments(filters).exec();
  }

  async updateOne(taskId: string, data: Partial<TaskDto>) {
    this.taskModel.updateOne({ _id: taskId }, { $set: data }).exec();

  }

  async findById(taskId: string) {
    return this.taskModel.findOne({ _id: taskId }).populate('assignee', 'full_name').exec();
  }

  async delete(taskId: string) {
    return await this.taskModel.deleteOne({ _id: taskId});
  }

  async getTaskCounts(query: { q: string }): Promise<{ todo: number, in_progress: number, done: number }> {
    let filters: mongoose.FilterQuery<TasksDocument> = { $or: [
      { title: new RegExp(query.q, 'i') },
      { description: new RegExp(query.q, 'i') },
    ], };
    if (!query.q) {
      filters = {};
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
