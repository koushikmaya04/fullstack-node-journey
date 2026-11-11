import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../src/tasks/tasks.controller';
import { TasksService } from '../src/tasks/tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  const service = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, title: 'Mock task', completed: false }]),
    findOne: jest.fn(),
    create: jest.fn().mockResolvedValue({ id: 1, title: 'Mock task', completed: false }),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: service }],
    }).compile();
    controller = module.get<TasksController>(TasksController);
  });

  it('delegates listing to the service', async () => {
    await expect(controller.findAll()).resolves.toEqual([{ id: 1, title: 'Mock task', completed: false }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('delegates task creation to the service', async () => {
    const dto = { title: 'Mock task', userId: 1 };
    await expect(controller.create(dto)).resolves.toEqual({ id: 1, title: 'Mock task', completed: false });
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
