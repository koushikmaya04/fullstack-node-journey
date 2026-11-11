import { NotFoundException } from '@nestjs/common';
import { TasksRepository } from '../src/tasks/repositories/tasks.repository';
import { TasksService } from '../src/tasks/tasks.service';

describe('TasksService user scoping', () => {
  const repository = {
    findAllForUser: jest.fn(), findOneForUser: jest.fn(),
    createForUser: jest.fn(), updateForUser: jest.fn(), removeForUser: jest.fn(),
  } as unknown as TasksRepository;
  let service: TasksService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TasksService(repository);
  });

  it('lists tasks using the authenticated user id', async () => {
    (repository.findAllForUser as jest.Mock).mockResolvedValue([]);
    await service.findAll(12);
    expect(repository.findAllForUser).toHaveBeenCalledWith(12);
  });

  it('creates tasks for the authenticated user', async () => {
    const dto = { title: 'My task' };
    (repository.createForUser as jest.Mock).mockResolvedValue({ id: 1 });
    await service.create(dto, 12);
    expect(repository.createForUser).toHaveBeenCalledWith(dto, 12);
  });

  it('hides tasks that are not owned by the requester', async () => {
    (repository.findOneForUser as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(99, 12)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findOneForUser).toHaveBeenCalledWith(99, 12);
  });

  it('does not delete tasks outside the authenticated user scope', async () => {
    (repository.removeForUser as jest.Mock).mockResolvedValue(false);
    await expect(service.remove(99, 12)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.removeForUser).toHaveBeenCalledWith(99, 12);
  });
});
