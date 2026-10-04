import { BadRequestException } from '@nestjs/common';
import { ParseTaskStatusPipe } from '../src/tasks/pipes/parse-task-status.pipe';
import { TaskStatus } from '../src/tasks/task-status';

describe('Task DTO validation and status pipe', () => {
  it('accepts a supported task status', () => {
    const pipe = new ParseTaskStatusPipe();

    expect(pipe.transform('in_progress')).toBe(TaskStatus.IN_PROGRESS);
  });

  it('rejects an unsupported task status', () => {
    const pipe = new ParseTaskStatusPipe();

    expect(() => pipe.transform('blocked')).toThrow(BadRequestException);
  });
});