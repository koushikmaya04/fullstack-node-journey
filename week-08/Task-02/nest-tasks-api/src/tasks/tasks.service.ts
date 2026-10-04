import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task';
import { TaskStatus } from './task-status';

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];
  private nextId = 1;

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  create(dto: CreateTaskDto): Task {
    const task: Task = {
      id: this.nextId++,
      title: dto.title,
      description: dto.description,
      status: dto.status ?? TaskStatus.PENDING,
    };

    this.tasks.push(task);
    return task;
  }

  update(id: number, dto: UpdateTaskDto): Task {
    const task = this.findOne(id);
    Object.assign(task, dto);
    return task;
  }

  remove(id: number): void {
    const index = this.tasks.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    this.tasks.splice(index, 1);
  }
}