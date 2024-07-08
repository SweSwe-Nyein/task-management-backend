import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { RegisterDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: RegisterDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(query: { q: string }): Promise<User[]> {
    let filters: mongoose.FilterQuery<UserDocument> = {
      $or: [
        { full_name: new RegExp(query.q, 'i') },
        { email: new RegExp(query.q, 'i') },
      ],
    };

    if (!query.q) {
      filters = {};
    }

    let result = await this.userModel.find(filters).sort({ createdAt: -1 })

    return result
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async updateOne(userId: string, data: Partial<User>) {
    this.userModel.updateOne({ _id: userId }, { $set: data }).exec();
  }

  async findById(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }

  async delete(id: string) {
    return await this.userModel.deleteMany({ _id: id });
  }
}
