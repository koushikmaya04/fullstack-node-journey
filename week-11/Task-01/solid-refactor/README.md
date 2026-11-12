# Week 11 – SOLID Principles Deep Dive (S, O, L, I, D)

A guided TypeScript and NestJS exercise that starts with an overloaded service and refactors it step by step. The examples use small contracts and testable services to make each principle visible.

## Contents

- `src/before/god-user.service.ts` – deliberately overloaded starting point for SRP/OCP/LSP.
- `src/after/` – refactored registration workflow and welcome strategies.
- `src/isp-dip/before/` – deliberately fat repository contract.
- `src/isp-dip/after/` – a service depending only on a reader abstraction.
- `src/isp-dip/contracts/` – segregated reader, writer, and remover interfaces.
- `src/isp-dip/adapters/` – in-memory adapter implementing the small contracts.
- `src/isp-dip/tokens/` and `user.module.ts` – NestJS custom provider tokens and bindings.
- `test/` – unit, behavior-contract, ISP, and NestJS provider override tests.
- `docs/comparison.md` – SRP/OCP/LSP explanation.
- `docs/isp-dip.md` – ISP/DIP explanation with provider examples.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm test
npm run build
```

## What this exercise demonstrates

1. **SRP:** validation, orchestration, persistence, email delivery, and welcome-message policy have separate responsibilities.
2. **OCP:** welcome messages are selected through strategies instead of growing conditional logic.
3. **LSP:** contract tests check that each strategy honors the behavior expected by callers.
4. **ISP:** consumers depend on small repository contracts that expose only the operations they need.
5. **DIP:** a high-level service depends on a repository abstraction injected through a NestJS symbol token. The module binds a concrete adapter, and tests swap it with `overrideProvider()`.

The in-memory repository keeps the exercise independent of a database. In a real application, bind a TypeORM/PostgreSQL adapter to the same token.
