import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { QueryFailedError, Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly users: Repository<UserEntity>) {}

  async create(input: RegisterDto): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(input.password, 12);
    try {
      return await this.users.save(this.users.create({
        name: input.name.trim(), email: input.email.trim().toLowerCase(), passwordHash,
      }));
    } catch (error) {
      if (error instanceof QueryFailedError && (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505') {
        throw new ConflictException('An account with this email already exists');
      }
      throw error;
    }
  }

  findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return this.users.createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
      .getOne();
  }
}
