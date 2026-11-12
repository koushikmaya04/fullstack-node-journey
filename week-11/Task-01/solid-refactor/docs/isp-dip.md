# ISP and DIP: repository contracts and NestJS providers

This exercise continues the `solid-refactor` example from SRP, OCP, and LSP. It uses a small user repository so the design is easy to follow.

## 1. Interface Segregation Principle (ISP)

> Clients should not be forced to depend on methods they do not use.

The deliberately oversized `FatUserRepository` mixes several capabilities:

- `findById()` – read a user
- `save()` – create a user
- `remove()` – delete a user
- `findAll()` and `exportCsv()` – listing/reporting

A service that only looks up a user should not need a repository object that also promises save, delete, and export operations.

The refactor splits the contract into:

- `UserReaderRepository`
- `UserWriterRepository`
- `UserRemoverRepository`

`GetUserService` receives only `UserReaderRepository`. Its fake in the ISP test has only one method: `findById()`. It does not need placeholder implementations for unrelated methods.

One concrete adapter may implement all three small interfaces. ISP is about what each consumer depends on, not a rule that every interface must have a different class.

## 2. Dependency Inversion Principle (DIP)

> High-level policy should depend on abstractions, not directly on low-level details.

The high-level use case is `GetUserService`. The low-level detail is the storage adapter. The service imports a repository contract and receives it through the `USER_READER` token; it never constructs `InMemoryUserRepository` itself.

### Why a token?

TypeScript interfaces are erased at runtime. NestJS cannot use an interface as a runtime injection key. We therefore define a stable symbol:

```ts
export const USER_READER = Symbol("USER_READER");
```

The service declares its dependency:

```ts
constructor(
  @Inject(USER_READER)
  private readonly users: UserReaderRepository,
) {}
```

The module decides which concrete adapter to provide:

```ts
{
  provide: USER_READER,
  useExisting: InMemoryUserRepository,
}
```

`useExisting` aliases the token to an already registered provider, so the reader/writer/remover tokens share one adapter instance. In a real application, replace that adapter with a PostgreSQL repository without changing the service.

### Swap the implementation in a test

Nest's testing module can override the token:

```ts
.overrideProvider(USER_READER)
.useValue(alternateReader)
.compile();
```

The test supplies a read-only fake object. `GetUserService` still works because it relies on the contract, not the concrete class.

## 3. What the tests prove

- A read-only service can be tested with an object that has only `findById()` (ISP).
- Nest resolves the abstraction token to the configured adapter (DIP).
- A test can replace that provider with a different implementation without editing the service (DIP).

## 4. Run it

From this folder:

```bash
npm install
npm test
npm run build
```

The example uses an in-memory adapter so no database is required. The goal is dependency direction and provider wiring, not database setup.
