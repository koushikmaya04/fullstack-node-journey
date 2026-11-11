import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskEntity } from '../src/tasks/entities/task.entity';
import { TasksRepository } from '../src/tasks/repositories/tasks.repository';
import { TasksService } from '../src/tasks/tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  const repository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('returns tasks from the repository', async () => {
    const tasks = [{ id: 1, title: 'Learn NestJS' }] as TaskEntity[];
    repository.findAll.mockResolvedValue(tasks);

    await expect(service.findAll()).resolves.toBe(tasks);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('delegates task creation to the repository abstraction', async () => {
    const input = { title: 'Learn NestJS', userId: 1 };
    const created = { id: 1, ...input, completed: false } as TaskEntity;
    repository.create.mockResolvedValue(created);

    await expect(service.create(input)).resolves.toBe(created);
    expect(repository.create).toHaveBeenCalledWith(input);
  });

  it('returns a task when its id exists', async () => {
    const task = { id: 1, title: 'Learn NestJS' } as TaskEntity;
    repository.findOne.mockResolvedValue(task);

    await expect(service.findOne(1)).resolves.toBe(task);
  });

  it('throws NotFoundException when a task does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws NotFoundException when updating a missing task', async () => {
    repository.update.mockResolvedValue(null);

    await expect(service.update(999, { completed: true })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws NotFoundException when deleting a missing task', async () => {
    repository.remove.mockResolvedValue(false);

    await expect(service.remove(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('completes deletion when the repository removes the task', async () => {
    repository.remove.mockResolvedValue(true);

    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(repository.remove).toHaveBeenCalledWith(1);
  });
});
