import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './../users/users.service';

import { Tokens, User } from './../types';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<Tokens> {
    const user: User = await this.userService.findUserByEmail(dto.email);

    if (!user) throw new ForbiddenException('Invalid Credentials.');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) throw new ForbiddenException('Invalid Credentials.');

    const tokens = await this.getTokens(user);

    const rtHash = await this.hashPassword(tokens.refresh_token);

    await this.userService.updateOne(user._id, { hashdRt: rtHash });

    return tokens;
  }

  async logout(userId: string) {
    await this.userService.updateOne(userId, { hashdRt: null });
  }

  async refreshTokens(userId: string, rt: string) {
    const user: User = await this.userService.findById(userId);

    if (!user || !user.hashdRt) throw new ForbiddenException('Access Denied.');

    const rtMatches = await bcrypt.compare(rt, user.hashdRt);

    if (!rtMatches) throw new ForbiddenException('Access Denied.');

    const tokens = await this.getTokens(user);

    const rtHash = await this.hashPassword(tokens.refresh_token);

    await this.userService.updateOne(user._id, { hashdRt: rtHash });
    return tokens;
  }

  async register(dto: RegisterDto): Promise<Tokens> {
    const existingUser: User = await this.userService.findUserByEmail(dto.email);
    if (existingUser) throw new ForbiddenException('Email already in use.');

    const user: User = await this.userService.create(dto);

    const tokens = await this.getTokens(user);

    const rtHash = await this.hashPassword(tokens.refresh_token);

    await this.userService.updateOne(user._id, { hashdRt: rtHash });
    return tokens;
  }

  async getProfile(id: string) {
    const user = await this.userService.findById(id);

    user.password = null;
    user.hashdRt = null;

    return user;
  }

  async getTokens(user: User) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
        },
        {
          secret: 'at-secret',
          expiresIn: '24h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
        },
        {
          secret: 'rt-secret',
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }
}
