import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.users.find({
      relations: { tasks: true },
      order: { id: 'ASC' },
    });
  }

  async create(input: CreateUserDto): Promise<UserEntity> {
    try {
      const user = this.users.create({
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
      });
      return await this.users.save(user);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      ) {
        throw new ConflictException('A user with this email already exists');
      }
      throw error;
    }
  }
}
