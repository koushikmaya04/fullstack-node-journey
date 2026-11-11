import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly users: Repository<UserEntity>) {}
  findAll(): Promise<UserEntity[]> {
    return this.users.find({ relations: { tasks: true }, order: { id: 'ASC' } });
  }
  create(input: CreateUserDto): Promise<UserEntity> {
    return this.users.save(this.users.create(input));
  }
}
