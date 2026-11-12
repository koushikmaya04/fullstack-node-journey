# Week 11 – SOLID Principles Deep Dive (S, O, L)

A guided TypeScript exercise that starts with a deliberately overloaded NestJS-style service and refactors it step by step. The code uses plain TypeScript classes and interfaces so the principles are easy to see; these classes can be registered as NestJS providers in an application.

## Contents

- \`src/before/god-user.service.ts\` – intentionally bad starting point.
- \`src/after/\` – refactored design.
- \`test/\` – unit and behavioral contract tests.
- \`docs/comparison.md\` – the before/after explanation.

## Run locally

Requires Node.js 18+.

\`\`\`bash
npm install
npm test
npm run build
\`\`\`

## Work through the refactor

1. **SRP:** validation, orchestration, persistence, email delivery, and welcome-message policy have separate responsibilities.
2. **OCP:** welcome messages are selected through a strategy map. Add a new implementation and register it; the registration workflow stays the same.
3. **LSP:** every strategy must honor the same behavioral contract. Shared contract tests check all implementations with the same expectations.

The repository and mailer are interfaces. Tests use lightweight in-memory/fake implementations rather than a real database or email provider. In a real NestJS app, bind concrete adapters with provider tokens and keep infrastructure in its own module.
