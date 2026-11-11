import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';

export abstract class TasksRepository {
  abstract findAll(): Promise<TaskEntity[]>;
  abstract findOne(id: number): Promise<TaskEntity | null>;
  abstract create(input: CreateTaskDto): Promise<TaskEntity>;
  abstract update(id: number, updates: UpdateTaskDto): Promise<TaskEntity | null>;
  abstract remove(id: number): Promise<boolean>;
}
