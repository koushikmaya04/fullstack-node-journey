# Week 06 - Task 03: Deep Git Workflows

## Objective

Practice the Git workflows required by the original Week 06 learning path:

- merge vs rebase
- interactive rebase
- resolving merge conflicts
- git stash
- cherry-pick
- revert vs reset
- release tagging
- Git Flow vs GitHub Flow vs trunk-based development

## Practical Exercise

This task documents and demonstrates the workflow used to:

1. Deliberately create a merge conflict by editing the same file on two branches.
2. Resolve the conflict manually and create a resolved commit.
3. Create messy WIP commits and consolidate them into clean commits using interactive rebase concepts.
4. Review stash, cherry-pick, revert, and reset workflows.
5. Tag the stable `main` branch as `v1.0-month1` after the Week 6 work is merged.

## Files

- `conflict-resolution.md` - deliberate conflict scenario and manual resolution
- `interactive-rebase.md` - WIP commit cleanup and interactive rebase workflow
- `git-recovery-and-transfer.md` - stash, cherry-pick, revert, and reset
- `branching-strategies.md` - Git Flow, GitHub Flow, and trunk-based development
- `release-tag.md` - release tagging procedure

## Core Workflow

```text
main
  |
  +-- feature branch
  |      |
  |      +-- WIP commits
  |      |
  |      +-- interactive rebase
  |      |
  |      +-- clean commits
  |      |
  |      +-- Pull Request
  |             |
  |             +-- conflict resolution if needed
  |
  +-- reviewed and merged
         |
         +-- v1.0-month1
```

## Expected Outcome

The completed exercise should leave a clean, understandable Git history and demonstrate that conflicts and messy development history can be handled deliberately rather than avoided.
