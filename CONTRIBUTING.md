# Contributing Guide

Thank you for contributing to this repository.

Please follow the guidelines below to maintain a clean and consistent workflow.

---

## Branching Strategy

- Never work directly on the `main` branch.
- Create a new feature branch for every practical or task.
- Branch naming format:
```
week-<week-number>-<topic-name>
```

### Examples

```
week-01-repository-setup
week-01-semantic-html
week-01-css-box-model
week-02-flexbox
week-03-javascript-basics
```

---

## Development Workflow

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Create a new branch

```bash
git checkout -b week-01-topic-name
```


### 3. Complete the assigned task

- Write clean code.
- Follow project structure.
- Test your changes before committing.

### 4. Stage your changes

```bash
git add .
```

### 5. Commit your changes

```bash
git commit -m "Add semantic HTML practical"
```

Use meaningful commit messages.

Examples:

```
Initial repository setup
Add HTML practical
Implement CSS Flexbox layout
Fix responsive navigation
```

### 6. Push your branch

```bash
git push origin <branch-name>
```

### 7. Create a Pull Request

Open a Pull Request from your feature branch to `main`.

Include:

- What was completed
- Any important notes
- Screenshots (if applicable)

### 8. Merge

Merge only after review or approval.

---

## Code Standards

- Use meaningful file and folder names.
- Keep code clean and properly indented.
- Remove unused code before committing.
- Update documentation when necessary.

---

## Repository Structure

```
fullstack-node-journey
│
├── week-01
├── week-02
├── week-03
├── README.md
├── CONTRIBUTING.md
└── .gitignore
```

---

## Commit Message Guidelines

Use short and meaningful commit messages.

Good examples:

```
Initial repository setup
Add HTML boilerplate
Complete CSS selectors practical
Implement Flexbox layout
Fix navigation styling
```

Avoid:

```
update
final
test
abc
changes
```

---

## General Rules

- One branch per task.
- One Pull Request per completed task.
- Keep the `main` branch stable.
- Write descriptive commit messages.
- Follow the defined folder structure.