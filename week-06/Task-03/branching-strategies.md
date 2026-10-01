# Branching Strategies

## Git Flow

Git Flow uses longer-lived branches such as:

- `main`
- `develop`
- feature branches
- release branches
- hotfix branches

It can be useful for projects with formal release cycles, but it introduces more branch management.

## GitHub Flow

GitHub Flow is simpler:

```text
main
  ↓
short-lived feature branch
  ↓
Pull Request
  ↓
review
  ↓
merge
```

It works well when changes are integrated frequently.

## Trunk-Based Development

Trunk-based development keeps `main` (the trunk) as the central integration point. Developers use short-lived branches or very small direct changes depending on the team's controls.

The important practice is frequent integration and keeping the main branch stable.

## Workflow Used in This Repository

This repository follows a short-lived feature-branch + Pull Request workflow:

```text
main
  ↓
week-06-<topic>
  ↓
commit
  ↓
Pull Request
  ↓
review
  ↓
squash merge
  ↓
main
```

This keeps `main` stable while giving each learning task an isolated development history.
