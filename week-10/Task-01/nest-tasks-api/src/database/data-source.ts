import 'dotenv/config';
import { DataSource } from 'typeorm';
import { TaskEntity } from '../tasks/entities/task.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateUsersAndTasks1700000000000 } from './migrations/1700000000000-CreateUsersAndTasks';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [UserEntity, TaskEntity],
  migrations: [CreateUsersAndTasks1700000000000],
  synchronize: false,
  migrationsRun: false,
});
