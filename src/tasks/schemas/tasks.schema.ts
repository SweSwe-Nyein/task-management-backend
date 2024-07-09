import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type TasksDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  user_id: Types.ObjectId;

  @Prop({ index: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  assignee: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['todo', 'done', 'in_progress'],
    default: 'todo',
  })
  status: string;

  @Prop()
  due_date: Date;

  @Prop()
  hashdRt: string;

  @Prop()
  createdAt: Date;
}

const TasksSchema = SchemaFactory.createForClass(Task);

export { TasksSchema };
