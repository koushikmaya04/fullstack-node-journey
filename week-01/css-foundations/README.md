# CSS Foundations

This module contains practical exercises completed as part of the Full Stack Trainee Learning Plan. The focus is on understanding the CSS Box Model, debugging layouts, CSS Cascade, and Specificity.

---

## Topics Covered

### 1. Box Model Debugging

**Objective**

Debug a deliberately broken layout caused by the CSS Box Model and fix it using `box-sizing: border-box`.

**Concepts Learned**

- CSS Box Model
- Content
- Padding
- Border
- Margin
- `box-sizing`
- Margin Collapse
- Chrome DevTools

**Tasks Completed**

- Created a deliberately broken layout.
- Demonstrated overflow caused by padding and border.
- Fixed the layout using:

```css
*{
    box-sizing: border-box;
}
```

- Demonstrated Margin Collapse.
- Fixed Margin Collapse using padding.
- Verified the layout using Chrome DevTools.

---

### 2. CSS Cascade & Specificity

**Objective**

Understand how CSS decides which style rule is applied when multiple selectors target the same element.

**Concepts Learned**

- Cascade
- Selector Priority
- Specificity
- DevTools Debugging

---

## Specificity Calculation

| Selector | Specificity |
|-----------|------------:|
| `p` | 0-0-1 |
| `div p` | 0-0-2 |
| `.text` | 0-1-0 |
| `.container p` | 0-1-1 |
| `.container .text` | 0-2-0 |
| `#para` | 1-0-0 |
| `.container #para` | **1-1-0** ✅ |

### Winning Rule

```css
.container #para{
    color: purple;
}
```

Reason:

- ID selectors have higher priority than class selectors.
- Class selectors have higher priority than element selectors.
- Therefore `.container #para` has the highest specificity.

---

## Project Structure

```
css-foundations/
│
├── 01-box-model/
│   ├── index.html
│   ├── style.css
│   ├── notes.md
│
├── 02-cascade-specificity/
│   ├── index.html
│   ├── style.css
│   ├── notes.md
│   ├── prediction-code.png
│   └── prediction-result.png
│
└── README.md
```

---

## Learning Outcomes

After completing this module, I can:

- Explain the CSS Box Model.
- Identify layout issues caused by padding and borders.
- Fix layouts using `box-sizing: border-box`.
- Explain and fix Margin Collapse.
- Understand how the CSS Cascade works.
- Manually calculate CSS Specificity.
- Predict which selector will win.
- Verify CSS rules using Chrome DevTools.

---

## Technologies Used

- HTML5
- CSS3
- Google Chrome DevTools
- Visual Studio Code
- Git & GitHub

---

## Author

**Koushik Maya**

Full Stack Trainee - SandLogic 