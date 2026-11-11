# NestJS Tasks API — JWT Authentication & Guards

Week 10, Task 2 is a separate runnable project based on Task 1. Task 1 remains unchanged.

## Features
- Register and login endpoints.
- Password hashing with bcrypt (12 salt rounds); hashes are never returned.
- JWT access tokens signed with a secret loaded from environment variables.
- Passport JWT strategy verifies bearer tokens and expiry.
- JwtAuthGuard protects every Tasks route.
- Every task query is scoped by the authenticated user's ID. Clients cannot supply or override userId.
- PostgreSQL + TypeORM migrations; synchronize is disabled.
- DTO validation via class-validator and global ValidationPipe.

## Setup
Create a separate PostgreSQL database named `tasks_auth_db` (do not reuse Task 1's `tasks_db`), then run:
```bash
npm install
cp .env.example .env
npm run migration:run
npm run start:dev
```
Set DB credentials and a long random JWT_SECRET in .env. Never commit .env.
The API listens on port 3003. Use `npm run build` and `npm test` to verify.

## Auth
`POST /auth/register` body: `{"name":"Asha","email":"asha@example.com","password":"strong-password"}`
`POST /auth/login` body: `{"email":"asha@example.com","password":"strong-password"}`
Both return a safe user object and `accessToken`. Duplicate emails return 409; invalid credentials return 401.

## Protected tasks
Send `Authorization: Bearer <accessToken>`:
- GET /tasks — list your tasks.
- GET /tasks/:id — read one of your tasks.
- POST /tasks — create a task (title, optional description).
- PATCH /tasks/:id — update your task.
- DELETE /tasks/:id — delete your task.

A task owned by another user is returned as 404. Missing/invalid/expired tokens return 401. The task owner always comes from the verified JWT, never from request data.

## Example
Register/login, copy accessToken, then POST /tasks with the bearer token and `{"title":"Learn JWT"}`. Register a second user and confirm that user cannot view or modify the first user's task.

This learning project does not include refresh tokens, password reset, email verification, or rate limiting.
