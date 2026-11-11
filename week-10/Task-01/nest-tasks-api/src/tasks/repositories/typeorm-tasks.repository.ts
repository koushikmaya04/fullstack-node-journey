import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TypeOrmTasksRepository extends TasksRepository {
  constructor(
    @InjectRepository(TaskEntity) private readonly tasks: Repository<TaskEntity>,
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
  ) { super(); }

  findAll(): Promise<TaskEntity[]> {
    return this.tasks.find({ relations: { user: true }, order: { id: 'ASC' } });
  }

  findOne(id: number): Promise<TaskEntity | null> {
    return this.tasks.findOne({ where: { id }, relations: { user: true } });
  }

  async create(input: CreateTaskDto): Promise<TaskEntity> {
    const user = await this.users.findOneBy({ id: input.userId });
    if (!user) throw new NotFoundException('User ' + input.userId + ' not found');
    return this.tasks.save(this.tasks.create({
      title: input.title,
      description: input.description,
      completed: false,
      user,
    }));
  }

  async update(id: number, updates: UpdateTaskDto): Promise<TaskEntity | null> {
    const task = await this.findOne(id);
    if (!task) return null;
    Object.assign(task, updates);
    return this.tasks.save(task);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.tasks.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
