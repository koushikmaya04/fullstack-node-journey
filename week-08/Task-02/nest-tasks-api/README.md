# NestJS Tasks API — DTOs, Validation & Pipes

Week 08 Task 02: DTOs, Validation & Pipes.

## Objective

Build the validated version of the Task API without changing the existing Week 08 Task 01 implementation. This standalone copy demonstrates DTO validation with `class-validator` and `class-transformer`, global NestJS `ValidationPipe`, and a custom `ParseTaskStatusPipe`.

## Concepts

- DTO pattern
- `class-validator` decorators such as `@IsString`, `@IsEnum`, `@MinLength`, and `@MaxLength`
- `class-transformer`
- Global `ValidationPipe`
- `whitelist`, `transform`, and `forbidNonWhitelisted`
- Custom pipes
- Boundary validation

## Task status

Allowed statuses are:

- `pending`
- `in_progress`
- `completed`

The custom `ParseTaskStatusPipe` rejects unsupported values with a `400 Bad Request`.

## DTOs

### CreateTaskDto

- `title` — required string, 1–100 characters
- `description` — optional string, maximum 500 characters
- `status` — optional enum value

### UpdateTaskDto

All fields are optional, with the same validation rules as the create DTO.

## Global validation

The application enables:

```ts
new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
})
```

This validates request bodies before they reach the service layer.

## Custom pipe

`ParseTaskStatusPipe` explicitly validates the status field against the supported enum values.

## Run

```bash
cd week-08/Task-02/nest-tasks-api
npm install
npm run start:dev
```

The API listens on port `3003`.

## Test

```bash
npm test
npm run build
```

Existing Week 08 Task 01 files are not modified by this task.
