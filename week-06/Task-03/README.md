# Week 06 - Task 03: Command Pattern

## Objective

Practice the Command design pattern by building a small text editor with undo support.

## Command Pattern

The Command pattern turns an action into an object.

Instead of directly calling editor methods, the application creates command objects such as:

- `AppendCommand`
- `DeleteCommand`

Each command knows how to:

- `execute()` the action
- `undo()` the action

The `EditorInvoker` is responsible for executing commands and keeping a history so the latest command can be undone.

## Flow

```text
User action
    ↓
Command object
    ↓
Invoker
    ↓
TextEditor
    ↓
History
    ↓
Undo
```

## Files

- `text-editor.js` - Command pattern implementation
- `test.js` - tests using Node.js built-in assertions

## Run

From the repository root:

```bash
node week-06/Task-03/test.js
```

Expected output:

```text
Week 06 Task 03: all tests passed.
```
