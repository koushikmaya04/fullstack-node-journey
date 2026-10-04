import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status';

@Injectable()
export class ParseTaskStatusPipe implements PipeTransform<string | undefined, TaskStatus | undefined> {
  transform(value: string | undefined): TaskStatus | undefined {
    if (value === undefined) {
      return undefined;
    }

    const allowedStatuses = Object.values(TaskStatus);

    if (!allowedStatuses.includes(value as TaskStatus)) {
      throw new BadRequestException(
        `Invalid task status. Expected one of: ${allowedStatuses.join(', ')}`,
      );
    }

    return value as TaskStatus;
  }
}