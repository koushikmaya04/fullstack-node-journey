# Week 07 Task 03 — NPM Ecosystem & Environment Config

## Objective

Create a reusable Node.js project boilerplate with npm scripts, ESLint, Prettier, and environment-based configuration.

## Project Structure

```text
Task-03/
├── npm-node-boilerplate/
│   ├── src/
│   │   └── index.js
│   ├── test/
│   │   └── config.test.js
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── package.json
│   ├── prettier.config.json
│   └── README.md
```

## NPM Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Starts the app with Node watch mode |
| `npm run build` | Performs a Node syntax check |
| `npm test` | Runs Node's built-in test runner |
| `npm run lint` | Runs ESLint |
| `npm run format` | Formats files with Prettier |
| `npm run format:check` | Checks formatting without changing files |

## Environment Configuration

The application reads:

- `APP_NAME`
- `NODE_ENV`
- `PORT`

Sensitive or machine-specific values belong in `.env`, which is ignored by Git. The committed `.env.example` documents the expected variables without exposing local secrets.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux, use:

```bash
cp .env.example .env
```

## Validation

```bash
npm run build
npm test
npm run lint
npm run format:check
```

## Learning Outcome

This boilerplate demonstrates how npm manages a Node.js project's dependencies and scripts, how ESLint and Prettier enforce code quality, and how environment variables keep configuration outside source code.
