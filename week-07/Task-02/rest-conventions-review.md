# Week 07 Task 02 — HTTP Fundamentals & REST Conventions

## Objective

Build a raw Node.js HTTP API that follows common HTTP and REST conventions without using Express or another framework.

## REST Resource

The API exposes a `users` resource.

| Method | Endpoint | Success Status | Purpose |
|---|---|---:|---|
| GET | `/users` | 200 | List users |
| GET | `/users/:id` | 200 | Get one user |
| POST | `/users` | 201 | Create a user |
| PUT | `/users/:id` | 200 | Replace a user |
| DELETE | `/users/:id` | 204 | Delete a user |

## Status Codes

- **200 OK** — successful GET or PUT.
- **201 Created** — resource created by POST.
- **204 No Content** — successful DELETE with no response body.
- **400 Bad Request** — invalid JSON or invalid request data.
- **404 Not Found** — unknown route or missing user.
- **405 Method Not Allowed** — HTTP method is not supported.

## Headers

The server demonstrates:

- `Content-Type: application/json; charset=utf-8`
- `Cache-Control: no-store`
- `Content-Length`
- `Location` on a successful resource creation
- `Allow` on a 405 response

## REST Principles Applied

1. URLs represent resources using nouns.
2. HTTP methods describe the operation.
3. Resource IDs are represented as `/users/:id`.
4. POST is used for creation.
5. PUT is used to replace an existing resource.
6. DELETE removes a resource.
7. HTTP status codes communicate the result.
8. JSON is used for request and response bodies.
9. Invalid client input is rejected with 400.

## Run

```bash
node server.js
```

The server runs on port 3001 by default.

## Test

```bash
node --test server.test.js
```

## Example

```bash
curl http://localhost:3001/users

curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Meera"}'

curl -X PUT http://localhost:3001/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha Updated"}'

curl -X DELETE http://localhost:3001/users/1
```
