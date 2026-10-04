import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../src/tasks/tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('creates and retrieves a task', () => {
    const created = service.create({ title: 'Learn NestJS' });

    expect(created).toEqual({
      id: 1,
      title: 'Learn NestJS',
      description: undefined,
      completed: false,
    });
    expect(service.findAll()).toHaveLength(1);
  });

  it('throws when a task does not exist', () => {
    expect(() => service.findOne(999)).toThrow('Task 999 not found');
  });
});