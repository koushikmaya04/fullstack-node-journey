import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskEntity } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './repositories/tasks.repository';
import { TypeOrmTasksRepository } from './repositories/typeorm-tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])],
  controllers: [TasksController],
  providers: [TasksService, JwtAuthGuard, { provide: TasksRepository, useClass: TypeOrmTasksRepository }],
})
export class TasksModule {}
