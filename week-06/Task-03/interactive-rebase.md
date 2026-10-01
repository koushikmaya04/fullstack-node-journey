# Interactive Rebase: Cleaning WIP History

## Goal

Turn several messy development commits into a small set of meaningful commits before opening a Pull Request.

## Example WIP History

Imagine the branch contains:

```text
a1b2c3 fix
b2c3d4 wip
c3d4e5 more changes
d4e5f6 test
e5f6g7 final fix
```

This history works, but it does not clearly communicate the completed work.

## Start Interactive Rebase

If the last five commits are the commits being cleaned:

```bash
git rebase -i HEAD~5
```

Git opens an editor containing something similar to:

```text
pick a1b2c3 fix
pick b2c3d4 wip
pick c3d4e5 more changes
pick d4e5f6 test
pick e5f6g7 final fix
```

## Squashing

Keep the first commit and squash the related WIP commits:

```text
pick a1b2c3 Implement Git workflow exercise
squash b2c3d4 Add documentation
squash c3d4e5 Refine conflict example
squash d4e5f6 Add tests or verification
squash e5f6g7 Fix documentation
```

The final history becomes a clean, meaningful commit instead of several WIP commits.

## Reordering

Commits can also be reordered when their logical sequence is clearer:

```text
pick 111111 Add implementation
pick 222222 Add tests
pick 333333 Update documentation
```

The goal is to make the history tell a useful story.

## Editing a Commit

Use `edit` when a commit needs to be changed:

```text
pick 111111 Add implementation
edit 222222 Fix incorrect example
pick 333333 Add documentation
```

After Git stops:

```bash
# make the correction
git add .
git commit --amend
git rebase --continue
```

## Verify the Result

```bash
git log --oneline --graph --decorate -10
git status
```

Before pushing a rewritten branch that already exists on the remote, use:

```bash
git push --force-with-lease origin <branch-name>
```

`--force-with-lease` is safer than plain `--force` because it checks that the remote branch has not unexpectedly advanced.

## Key Lesson

Interactive rebase is primarily a history-cleaning tool. It should be used before integration so reviewers see meaningful commits rather than temporary implementation steps.
