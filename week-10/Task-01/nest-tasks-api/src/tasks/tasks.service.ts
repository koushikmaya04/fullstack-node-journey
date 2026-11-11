import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './repositories/tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  findAll() { return this.tasksRepository.findAll(); }

  async findOne(id: number) {
    const task = await this.tasksRepository.findOne(id);
    if (!task) throw new NotFoundException('Task ' + id + ' not found');
    return task;
  }

  create(input: CreateTaskDto) { return this.tasksRepository.create(input); }

  async update(id: number, updates: UpdateTaskDto) {
    const task = await this.tasksRepository.update(id, updates);
    if (!task) throw new NotFoundException('Task ' + id + ' not found');
    return task;
  }

  async remove(id: number): Promise<void> {
    const removed = await this.tasksRepository.remove(id);
    if (!removed) throw new NotFoundException('Task ' + id + ' not found');
  }
}
