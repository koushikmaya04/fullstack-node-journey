# NestJS Tasks API — PostgreSQL + TypeORM

Week 10, Task 1: move the in-memory Tasks API to PostgreSQL using TypeORM. The project is isolated in this folder; Week 8 remains unchanged.

## Stack and design

- NestJS 11, PostgreSQL, TypeORM 0.3 and TypeScript.
- `UserEntity` and `TaskEntity` model a one-to-many relationship: one user can own many tasks.
- `TasksService` depends on the abstract `TasksRepository`, not directly on TypeORM. `TypeOrmTasksRepository` is the persistence adapter.
- Database settings are loaded from environment variables through `ConfigModule`.
- TypeORM schema synchronization is disabled. Schema changes must go through reviewed migrations.
- Request DTOs are validated globally. Unknown properties are rejected instead of silently accepted.

## Setup

Create a PostgreSQL database named `tasks_db`, then run:

```bash
cd week-10/Task-01/nest-tasks-api
npm install
cp .env.example .env
```

Set your local PostgreSQL credentials in `.env`. Do not commit the real `.env` file.

## Database migrations

Apply the checked-in migration:

```bash
npm run migration:show
npm run migration:run
```

Undo the latest migration:

```bash
npm run migration:revert
```

After changing an entity, generate a migration and review its SQL before applying it:

```bash
npm run migration:generate
```

Keep `synchronize: false` in both the Nest application and CLI data source. The migration creates users and tasks, adds the unique email constraint, and links each task to its user with a foreign key. Its `down` method removes those objects in dependency order.

## Run and test

```bash
npm run start:dev
npm run build
npm test
```

The API listens on port `3002` by default.

## Routes

### Users

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/users` | Create a user with `name` and `email` |
| GET | `/users` | List users with their tasks |

Email addresses are stored in lowercase. A duplicate email returns `409 Conflict`.

### Tasks

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/tasks` | List tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:id` | Update task fields |
| DELETE | `/tasks/:id` | Delete a task |

Create a user first, then use its numeric `id` as `userId` when creating a task:

```json
{
  "title": "Finish the ORM task",
  "description": "Connect NestJS to PostgreSQL",
  "userId": 1
}
```

A task cannot reference a user that does not exist. Task responses include the related user. Required fields, lengths, email format, integer IDs, and boolean values are validated at the API boundary. Invalid input returns `400 Bad Request`; unknown task IDs return `404 Not Found`.

Authentication and per-user authorization are intentionally left for Week 10 Task 2.
