import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';

export abstract class TasksRepository {
  abstract findAllForUser(userId: number): Promise<TaskEntity[]>;
  abstract findOneForUser(id: number, userId: number): Promise<TaskEntity | null>;
  abstract createForUser(input: CreateTaskDto, userId: number): Promise<TaskEntity>;
  abstract updateForUser(id: number, userId: number, updates: UpdateTaskDto): Promise<TaskEntity | null>;
  abstract removeForUser(id: number, userId: number): Promise<boolean>;
}
