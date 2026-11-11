import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

  async register(input: RegisterDto) {
    const user = await this.users.create(input);
    return { user: this.publicUser(user), accessToken: await this.token(user.id, user.email) };
  }

  async login(input: LoginDto) {
    const user = await this.users.findByEmailWithPassword(input.email);
    const valid = user ? await bcrypt.compare(input.password, user.passwordHash) : false;
    if (!user || !valid) throw new UnauthorizedException('Invalid email or password');
    return { user: this.publicUser(user), accessToken: await this.token(user.id, user.email) };
  }

  private token(userId: number, email: string) {
    return this.jwt.signAsync({ sub: userId, email });
  }

  private publicUser(user: { id: number; name: string; email: string }) {
    return { id: user.id, name: user.name, email: user.email };
  }
}
