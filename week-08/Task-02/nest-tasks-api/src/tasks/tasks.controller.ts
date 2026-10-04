import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ParseTaskStatusPipe } from './pipes/parse-task-status.pipe';
import { TaskStatus } from './task-status';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(
    @Body() dto: CreateTaskDto,
    @Body('status', new ParseTaskStatusPipe()) status?: TaskStatus,
  ) {
    return this.tasksService.create({
      ...dto,
      status,
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Body('status', new ParseTaskStatusPipe()) status?: TaskStatus,
  ) {
    return this.tasksService.update(id, {
      ...dto,
      ...(status ? { status } : {}),
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.tasksService.remove(id);
  }
}