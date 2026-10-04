import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../src/tasks/tasks.service';
import { TaskStatus } from '../src/tasks/task-status';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('creates a task with the default pending status', () => {
    const task = service.create({ title: 'Learn validation' });

    expect(task.status).toBe(TaskStatus.PENDING);
  });

  it('updates a task status', () => {
    const task = service.create({ title: 'Learn pipes' });

    expect(service.update(task.id, { status: TaskStatus.COMPLETED }).status).toBe(
      TaskStatus.COMPLETED,
    );
  });
});