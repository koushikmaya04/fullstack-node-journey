# CSS Cascade and Specificity

## Cascade

If two selectors have the same specificity, the rule written later overrides the earlier rule.

Example:

p {
    color: red;
}

p {
    color: blue;
}

Output: Blue

## Specificity

Priority:

Inline Styles > ID > Class > Element

Specificity Table:

| Selector | Specificity |
|----------|-------------|
| p | 0-0-1 |
| div p | 0-0-2 |
| .text | 0-1-0 |
| .container p | 0-1-1 |
| .container .text | 0-2-0 |
| #para | 1-0-0 |
| .container #para | 1-1-0 |

Winner:
.container #para

Reason:
It has the highest specificity.