import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { TaskEntity } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './repositories/tasks.repository';
import { TypeOrmTasksRepository } from './repositories/typeorm-tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, UserEntity])],
  controllers: [TasksController],
  providers: [TasksService, { provide: TasksRepository, useClass: TypeOrmTasksRepository }],
  exports: [TasksService],
})
export class TasksModule {}
