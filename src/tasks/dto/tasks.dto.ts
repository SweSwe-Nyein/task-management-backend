import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class TaskDto {
  @IsEmpty()
  user_id: Types.ObjectId;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  assignee: Types.ObjectId;

  @IsNotEmpty()
  status: 'todo' | 'done' | 'in_progress';

  @IsNotEmpty()
  due_date: Date;
}
