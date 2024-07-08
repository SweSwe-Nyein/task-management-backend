export * from './tokens.type';

export type User = {
  _id?: string;
  full_name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  hashdRt?: string | null;
};

export type Task = {
  title?: string;
  description?: string;
  status?: 'todo' | 'done' | 'in_progress';
  due_date?: Date;
}