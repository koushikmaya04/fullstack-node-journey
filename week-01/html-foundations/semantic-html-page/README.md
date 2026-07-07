# Semantic HTML Page

## Overview

This project demonstrates how to build a fully semantic and accessible blog article page using only HTML5. The page follows semantic HTML best practices and includes accessibility features to improve usability for all users.

---

## Objective

Build a fully semantic, accessible blog article page using only HTML5 (no CSS) with:

- Semantic HTML5 elements
- Proper heading hierarchy
- Semantic landmarks
- Accessible contact form
- Accessibility audit using Lighthouse

---

## Features

- Semantic HTML5 structure
- Proper heading hierarchy (`h1` → `h2` → `h3`)
- Semantic landmarks:
  - `<header>`
  - `<nav>`
  - `<main>`
  - `<article>`
  - `<section>`
  - `<aside>`
  - `<footer>`
- Author information
- Publication date using the `<time>` element
- Figure and Figcaption
- Ordered and unordered lists
- Code example using `<pre>` and `<code>`
- Blockquote
- Related articles section
- Accessible contact form with labels
- Footer containing contact information

---

## Folder Structure

```
semantic-html-page/
│
├── index.html
├── README.md
├── assets/
│   └── images/
│       └── img.png
│
└── audit/
    ├── before.png
    └── after.png
```

---

## Accessibility Audit

### Tool Used

- Google Lighthouse (Chrome DevTools)

### Results

| Audit | Accessibility Score |
|--------|---------------------|
| Before | 94 |
| After | 96 |

### Improvements Made

- Added semantic HTML5 landmarks
- Improved heading hierarchy
- Added meaningful image alternative text
- Connected labels with form fields
- Added `datetime` attribute to the `<time>` element
- Improved navigation structure
- Used semantic elements such as `figure`, `figcaption`, and `blockquote`

### Remaining Observation

The remaining Lighthouse issue is:

- **Touch targets do not have sufficient size or spacing**

This issue requires visual spacing (padding or margins), which is typically implemented using CSS. Since this assignment was completed using **HTML5 only (no CSS)**, this issue was not addressed.

---

## Technologies Used

- HTML5
- Google Chrome
- Lighthouse Accessibility Audit

---

## Learning Outcomes

Through this project, I learned:

- How to build semantic HTML documents
- Importance of accessibility in web development
- Correct use of semantic landmarks
- Proper heading hierarchy
- Building accessible forms
- Using Lighthouse to identify and improve accessibility issues

---

## Author

**Koushik Maya**