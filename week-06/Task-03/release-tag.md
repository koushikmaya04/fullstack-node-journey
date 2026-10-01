# Release Tag: v1.0-month1

## Purpose

A Git tag gives a stable name to a specific commit.

For the Week 06 milestone, the learning path specifies:

```text
v1.0-month1
```

## Create the Tag

After all Week 6 Pull Requests have been merged and `main` is in the expected state:

```bash
git switch main
git pull origin main
git tag -a v1.0-month1 -m "Month 1 milestone"
git push origin v1.0-month1
```

## Verify

```bash
git tag
git show v1.0-month1
```

The tag should point to the intended stable `main` commit.

## Why Tags Matter

Branches move as development continues. A tag identifies a specific historical commit, making it useful for milestones, releases, and reproducible references.
