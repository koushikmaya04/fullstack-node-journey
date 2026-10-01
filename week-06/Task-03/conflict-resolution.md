# Deliberate Merge Conflict and Resolution

## Goal

Practice resolving a real Git merge conflict manually.

## Setup

Start from an up-to-date `main` branch:

```bash
git switch main
git pull origin main
git switch -c git-conflict-demo
```

Edit a shared file, for example:

```text
week-06/Task-03/conflict-demo.txt
```

Commit the first version:

```bash
git add week-06/Task-03/conflict-demo.txt
git commit -m "Add initial conflict demo"
```

Create a second branch from the same base and change the same line:

```bash
git switch -c git-conflict-version-b
```

Make a different edit to the same line and commit it:

```bash
git add week-06/Task-03/conflict-demo.txt
git commit -m "Change conflict demo wording"
```

Switch back to the first branch and make a conflicting change:

```bash
git switch git-conflict-demo
git add week-06/Task-03/conflict-demo.txt
git commit -m "Update conflict demo wording"
```

Merge the second branch:

```bash
git merge git-conflict-version-b
```

Git should report a conflict because both branches changed the same part of the file.

## What Conflict Markers Mean

Git may produce:

```text
<<<<<<< HEAD
content from the current branch
=======
content from the branch being merged
>>>>>>> git-conflict-version-b
```

The correct response is to inspect both versions, decide what the final file should contain, and remove all conflict markers.

## Resolution

After editing the file into the desired final state:

```bash
git add week-06/Task-03/conflict-demo.txt
git commit -m "Resolve merge conflict in conflict demo"
```

Verify that the working tree is clean:

```bash
git status
git log --oneline --graph --decorate -10
```

## Key Lesson

A merge conflict is not automatically a code error. It is Git reporting that it cannot safely choose between two competing changes. The developer must understand both changes and explicitly create the desired final version.
