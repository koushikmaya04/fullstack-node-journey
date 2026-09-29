class TextEditor {
  constructor() {
    this.content = "";
  }

  append(text) {
    this.content += text;
  }

  deleteLast(count) {
    const deleted = this.content.slice(-count);
    this.content = this.content.slice(0, -count);
    return deleted;
  }

  getContent() {
    return this.content;
  }
}

class AppendCommand {
  constructor(editor, text) {
    this.editor = editor;
    this.text = text;
  }

  execute() {
    this.editor.append(this.text);
  }

  undo() {
    this.editor.deleteLast(this.text.length);
  }
}

class DeleteCommand {
  constructor(editor, count) {
    this.editor = editor;
    this.count = count;
    this.deletedText = "";
  }

  execute() {
    this.deletedText = this.editor.deleteLast(this.count);
  }

  undo() {
    this.editor.append(this.deletedText);
  }
}

class EditorInvoker {
  constructor() {
    this.history = [];
  }

  execute(command) {
    command.execute();
    this.history.push(command);
  }

  undo() {
    const command = this.history.pop();

    if (!command) {
      return false;
    }

    command.undo();
    return true;
  }
}

module.exports = {
  TextEditor,
  AppendCommand,
  DeleteCommand,
  EditorInvoker,
};
