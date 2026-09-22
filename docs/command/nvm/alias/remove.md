---
title: remove
sidebar_position: 3
---

# nvm alias remove

Remove one or more version aliases.

**Alias:** `rm`

## Usage

```powershell
nvm alias remove <alias> [<alias> ...]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<alias> ...` | Yes | One or more alias names to remove. |

## Examples

```powershell
nvm alias remove legacy
nvm alias remove legacy stable
```

## Sample output

```powershell
1 alias removed successfully.
```
