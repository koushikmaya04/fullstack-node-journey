import { Test, TestingModule } from '@nestjs/testing';
import { TaskEntity } from '../src/tasks/entities/task.entity';
import { TasksRepository } from '../src/tasks/repositories/tasks.repository';
import { TasksService } from '../src/tasks/tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  const repository = { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn(), update: jest.fn(), remove: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: TasksRepository, useValue: repository }],
    }).compile();
    service = module.get<TasksService>(TasksService);
  });

  it('delegates creation to the repository abstraction', async () => {
    const created = { id: 1, title: 'Learn NestJS', completed: false } as TaskEntity;
    repository.create.mockResolvedValue(created);
    await expect(service.create({ title: 'Learn NestJS', userId: 1 })).resolves.toBe(created);
    expect(repository.create).toHaveBeenCalledWith({ title: 'Learn NestJS', userId: 1 });
  });

  it('throws when a task does not exist', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow('Task 999 not found');
  });
});
