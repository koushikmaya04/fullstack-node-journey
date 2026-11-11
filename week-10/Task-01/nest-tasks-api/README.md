# NestJS Tasks API — PostgreSQL + TypeORM

Week 10, Task 1: move the Week 8 in-memory Tasks API to PostgreSQL. This implementation is isolated in this folder; Week 8 remains unchanged.

## Stack and design

- NestJS 11, PostgreSQL, TypeORM 0.3 and TypeScript.
- TaskEntity and UserEntity implement a one-to-many relationship (one user has many tasks).
- TasksService depends on the abstract TasksRepository. TypeOrmTasksRepository provides the PostgreSQL implementation.
- Database settings are loaded from environment variables using ConfigModule.
- synchronize is explicitly false. Use the checked-in migration for schema changes.

## Setup

Create a PostgreSQL database named tasks_db, then run:

~~~bash
cd week-10/Task-01/nest-tasks-api
npm install
cp .env.example .env
~~~

Set your local PostgreSQL credentials in .env.

## Migrations

~~~bash
npm run migration:run
npm run migration:show
~~~

Undo the last migration with npm run migration:revert. Generate a new migration after entity changes with npm run migration:generate, then review it before committing. Do not enable synchronize.

## Run and test

~~~bash
npm run start:dev
npm run build
npm test
~~~

The API listens on port 3002 by default.

## Routes

Users:
- POST /users — create a user (body: name, email)
- GET /users — list users with their tasks

Tasks:
- GET /tasks
- GET /tasks/:id
- POST /tasks — body: title, optional description, userId
- PATCH /tasks/:id — update title, description, or completed
- DELETE /tasks/:id

Create a user first, then pass its id as userId when creating a task. The task response includes its related user. A task cannot reference a missing user.

Authentication and per-user authorization are intentionally left for Week 10 Task 2.
