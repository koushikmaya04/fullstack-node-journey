import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './repositories/tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly repository: TasksRepository) {}
  findAll(userId: number) { return this.repository.findAllForUser(userId); }
  async findOne(id: number, userId: number) {
    const task = await this.repository.findOneForUser(id, userId);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }
  create(input: CreateTaskDto, userId: number) { return this.repository.createForUser(input, userId); }
  async update(id: number, userId: number, updates: UpdateTaskDto) {
    const task = await this.repository.updateForUser(id, userId, updates);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }
  async remove(id: number, userId: number): Promise<void> {
    if (!await this.repository.removeForUser(id, userId)) throw new NotFoundException('Task not found');
  }
}
