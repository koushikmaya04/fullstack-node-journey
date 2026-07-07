# Box Model

## Problem

The card overflowed because width does not include padding and border.

Total width:

500 + 80 + 20 = 600px

## Fix

Using

box-sizing:border-box

makes width include

- Content
- Padding
- Border

## Margin Collapse

Vertical margins collapse.

50px + 60px becomes 60px.

Fixes

- padding
- border
- overflow