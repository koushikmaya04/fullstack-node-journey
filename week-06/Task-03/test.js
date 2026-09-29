const assert = require("node:assert/strict");

const {
  TextEditor,
  AppendCommand,
  DeleteCommand,
  EditorInvoker,
} = require("./text-editor");

const editor = new TextEditor();
const invoker = new EditorInvoker();

invoker.execute(new AppendCommand(editor, "Hello"));
invoker.execute(new AppendCommand(editor, " World"));

assert.equal(editor.getContent(), "Hello World");

invoker.execute(new DeleteCommand(editor, 6));
assert.equal(editor.getContent(), "Hello");

assert.equal(invoker.undo(), true);
assert.equal(editor.getContent(), "Hello World");

assert.equal(invoker.undo(), true);
assert.equal(editor.getContent(), "Hello");

assert.equal(invoker.undo(), true);
assert.equal(editor.getContent(), "");

assert.equal(invoker.undo(), false);
assert.equal(editor.getContent(), "");

console.log("Week 06 Task 03: all tests passed.");
