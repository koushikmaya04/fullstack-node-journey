import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TypeOrmTasksRepository extends TasksRepository {
  constructor(@InjectRepository(TaskEntity) private readonly tasks: Repository<TaskEntity>) { super(); }

  findAllForUser(userId: number): Promise<TaskEntity[]> {
    return this.tasks.createQueryBuilder('task').leftJoinAndSelect('task.user', 'user')
      .where('user.id = :userId', { userId }).orderBy('task.id', 'ASC').getMany();
  }

  findOneForUser(id: number, userId: number): Promise<TaskEntity | null> {
    return this.tasks.createQueryBuilder('task').leftJoinAndSelect('task.user', 'user')
      .where('task.id = :id', { id }).andWhere('user.id = :userId', { userId }).getOne();
  }

  createForUser(input: CreateTaskDto, userId: number): Promise<TaskEntity> {
    const task = this.tasks.create({
      title: input.title.trim(), description: input.description?.trim() || null,
      completed: false, user: { id: userId } as TaskEntity['user'],
    });
    return this.tasks.save(task);
  }

  async updateForUser(id: number, userId: number, updates: UpdateTaskDto): Promise<TaskEntity | null> {
    const task = await this.findOneForUser(id, userId);
    if (!task) return null;
    Object.assign(task, updates);
    return this.tasks.save(task);
  }

  async removeForUser(id: number, userId: number): Promise<boolean> {
    const result = await this.tasks.createQueryBuilder().delete().from(TaskEntity)
      .where('id = :id', { id }).andWhere('user_id = :userId', { userId }).execute();
    return (result.affected ?? 0) > 0;
  }
}
