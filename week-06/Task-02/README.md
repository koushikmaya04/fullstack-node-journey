# Week 06 - Task 02: TypeScript Basics, Testing & Git Workflow

## Objective

Convert selected JavaScript exercises from earlier weeks into TypeScript and add Jest unit tests.

This task follows the original Week 06 learning path:

- TypeScript basic types
- Interfaces
- Generics
- Jest fundamentals (`describe`, `it`, `expect`, mocks)
- Feature branches and Pull Requests
- Code review etiquette

## Practical Exercise

The following earlier implementations are converted into TypeScript:

1. **Custom Promise** from Week 05 - Task 01
2. **Mini EventEmitter** from Week 06 - Task 01
3. **Notification Factory** from Week 06 - Task 01

The TypeScript versions introduce explicit types, interfaces, generics, discriminated unions, and typed event maps.

Jest tests cover the Custom Promise and EventEmitter behaviour. The Jest configuration enforces a minimum of 80% global coverage across branches, functions, lines, and statements.

## Files

- `custom-promise.ts` - typed version of the Week 05 CustomPromise implementation
- `mini-event-emitter.ts` - generic, typed EventEmitter implementation
- `notification-factory.ts` - typed notification interface and factory
- `custom-promise.test.ts` - Jest tests for CustomPromise
- `mini-event-emitter.test.ts` - Jest tests for MiniEventEmitter
- `tsconfig.json` - strict TypeScript configuration
- `jest.config.cjs` - Jest + coverage configuration
- `package.json` - test and type-check scripts

## Run

```bash
npm install
npm run typecheck
npm test
```

The test command is configured to fail if global branch, function, line, or statement coverage falls below 80%.

## Git Workflow

The intended branch for this task is:

```text
week-06-js-typescript-basics-testing-git-workflow
```

Workflow:

```text
main
  ↓
feature branch
  ↓
commits
  ↓
Pull Request
  ↓
mentor/code review
  ↓
requested fixes
  ↓
squash merge
  ↓
main
```

## Learning Outcome

The goal is to connect TypeScript type safety with automated testing and a professional Git workflow. The task demonstrates that a feature should be typed, tested, reviewable, and safely integrated.
