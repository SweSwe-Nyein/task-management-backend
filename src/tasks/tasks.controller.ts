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
    return await this.tasksService.create({ ...createTaskDto, assignee: new Types.ObjectId(createTaskDto.assignee), user_id: new Types.ObjectId(user_id) });
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.tasksService.findAll({ status, page, limit});
  }

  @Get('counts')
  async getTaskCounts(@Query() q: { q: string }) {
    return await this.tasksService.getTaskCounts(q);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tasksService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: TaskDto) {
    return await this.tasksService.updateOne(id, {...updateUserDto, assignee: new Types.ObjectId(updateUserDto.assignee)});
  }

  @Patch(':id/mark-as-done')
  async markAsDone(@Param('id') id: string) {
    return await this.tasksService.markAsDone(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasksService.delete(id);
  }
}