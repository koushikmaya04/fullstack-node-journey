# NestJS Tasks API

Week 08 Task 01: NestJS Architecture & Dependency Injection.

## Objective

Build a basic NestJS CRUD API for a `Task` resource using an in-memory array. The project demonstrates NestJS modules, controllers, providers/services, decorators, dependency injection, and a mocked provider for testing.

## Structure

- `src/app.module.ts` — root module
- `src/main.ts` — application bootstrap
- `src/tasks/tasks.module.ts` — feature module
- `src/tasks/tasks.controller.ts` — HTTP routes
- `src/tasks/tasks.service.ts` — business logic and in-memory storage
- `src/tasks/task.ts` — Task model
- `src/tasks/dto/create-task.dto.ts` — create request shape
- `test/tasks.service.spec.ts` — service tests
- `test/tasks.controller.spec.ts` — controller test with a mock provider

## API

| Method | Route | Purpose |
|---|---|---|
| GET | /tasks | List tasks |
| GET | /tasks/:id | Get one task |
| POST | /tasks | Create a task |
| PATCH | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |

The API listens on port `3002`.

## Dependency Injection

`TasksController` does not instantiate `TasksService` with `new`. Instead, Nest injects the service through the constructor:

```ts
constructor(private readonly tasksService: TasksService) {}
```

`TasksService` is registered as a provider in `TasksModule`. Nest's IoC container creates and supplies the dependency.

The controller test replaces the real service with:

```ts
{
  provide: TasksService,
  useValue: mockTasksService,
}
```

This demonstrates dependency inversion and makes the controller test independent from the real in-memory service.

## Run

```bash
cd week-08/Task-01/nest-tasks-api
npm install
npm run start:dev
```

## Test

```bash
npm test
```

No database is used in this task.
