# Stash, Cherry-Pick, Revert and Reset

## Git Stash

Use stash when work is unfinished but the working tree needs to be temporarily cleaned.

```bash
git stash push -m "WIP before switching branches"
git stash list
git stash pop
```

## Cherry-Pick

Cherry-pick copies one specific commit onto the current branch:

```bash
git cherry-pick <commit-sha>
```

This is useful when a single fix is needed without merging an entire branch.

## Revert

`git revert` creates a new commit that reverses an earlier commit:

```bash
git revert <commit-sha>
```

This is usually appropriate for changes that have already been shared on a remote branch because the existing history remains intact.

## Reset

Reset moves the current branch reference and can change the working/index state depending on the mode.

### Soft

```bash
git reset --soft HEAD~1
```

Moves the branch back one commit while keeping changes staged.

### Mixed

```bash
git reset HEAD~1
```

Moves the branch back and leaves the changes in the working tree unstaged.

### Hard

```bash
git reset --hard HEAD~1
```

Moves the branch back and discards the changes represented by the removed commit.

Because hard reset can destroy uncommitted work, it should be used deliberately.

## Quick Comparison

| Command | Main purpose |
|---|---|
| stash | Temporarily store unfinished working changes |
| cherry-pick | Copy a specific commit |
| revert | Safely undo a shared commit with a new commit |
| reset --soft | Move history while keeping changes staged |
| reset mixed | Move history while keeping changes unstaged |
| reset --hard | Move history and discard working changes |
