import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { TaskDto } from './dto/tasks.dto';
import { TasksService } from './tasks.service';
import { Query } from '@nestjs/common/decorators';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller("tasks")
export class TaskController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@GetCurrentUserId() user_id: string, @Body() createTaskDto: TaskDto) {
    return await this.tasksService.create({ ...createTaskDto, user_id: new Types.ObjectId(user_id) });
  }

  @Get()
  async findAll(
    @GetCurrentUserId() user_id: string,
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.tasksService.findAll({ status, page, limit, user_id: new Types.ObjectId(user_id)});
  }

  @Get('counts')
  async getTaskCounts(@GetCurrentUserId() user_id: string, @Query() q: { q: string }) {
    return await this.tasksService.getTaskCounts(new Types.ObjectId(user_id), q);
  }

  @Get(':id')
  async findOne(@GetCurrentUserId() user_id: string, @Param('id') id: string) {
    return await this.tasksService.findById(new Types.ObjectId(user_id), id);
  }

  @Patch(':id')
  async update(@GetCurrentUserId() user_id: string, @Param('id') id: string, @Body() updateUserDto: TaskDto) {
    return await this.tasksService.updateOne(new Types.ObjectId(user_id), id, updateUserDto);
  }

  @Patch(':id/mark-as-done')
  async markAsDone(@GetCurrentUserId() user_id: string, @Param('id') id: string) {
    return await this.tasksService.markAsDone(new Types.ObjectId(user_id), id);
  }

  @Delete(':id')
  async remove(@GetCurrentUserId() user_id: string, @Param('id') id: string) {
    return await this.tasksService.delete(new Types.ObjectId(user_id), id);
  }
}