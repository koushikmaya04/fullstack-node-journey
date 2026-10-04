import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../src/tasks/tasks.controller';
import { TasksService } from '../src/tasks/tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    findAll: jest.fn().mockReturnValue([{ id: 1, title: 'Mock task', completed: false }]),
    findOne: jest.fn(),
    create: jest.fn().mockReturnValue({
      id: 1,
      title: 'Mock task',
      completed: false,
    }),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('uses the injected service to list tasks', () => {
    expect(controller.findAll()).toEqual([
      { id: 1, title: 'Mock task', completed: false },
    ]);
    expect(mockTasksService.findAll).toHaveBeenCalled();
  });

  it('uses the mock provider when creating a task', () => {
    const dto = { title: 'Mock task' };

    expect(controller.create(dto)).toEqual({
      id: 1,
      title: 'Mock task',
      completed: false,
    });
    expect(mockTasksService.create).toHaveBeenCalledWith(dto);
  });
});