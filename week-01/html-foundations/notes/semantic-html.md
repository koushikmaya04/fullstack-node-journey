# Semantic HTML Notes

## What is Semantic HTML?

Semantic HTML uses meaningful HTML elements that describe the purpose of the content rather than just its appearance.

Instead of using generic elements like `<div>` everywhere, semantic HTML uses tags such as `<header>`, `<nav>`, `<main>`, and `<footer>`.

---

# Why Use Semantic HTML?

- Improves website accessibility.
- Helps search engines understand the page structure (SEO).
- Makes code easier to read and maintain.
- Improves collaboration among developers.
- Helps screen readers identify different sections of a webpage.

---

# Common Semantic Elements

| Element | Purpose |
|---------|---------|
| `<header>` | Introductory content of a page or section |
| `<nav>` | Navigation links |
| `<main>` | Main content of the webpage |
| `<article>` | Independent content such as a blog post or news article |
| `<section>` | Groups related content |
| `<aside>` | Sidebar or additional information |
| `<footer>` | Footer of a page or section |
| `<figure>` | Groups images, diagrams, or illustrations |
| `<figcaption>` | Caption for a figure |
| `<time>` | Represents a date or time |
| `<address>` | Contact information |

---

# Basic Semantic Layout

```html
<header>
    <nav></nav>
</header>

<main>

    <article>

        <section>

        </section>

        <section>

        </section>

    </article>

    <aside>

    </aside>

</main>

<footer>

</footer>
```

---

# Heading Hierarchy

Use headings in the correct order.

```
h1
 ├── h2
 │     ├── h3
 │     └── h3
 └── h2
```

Example

```html
<h1>Understanding Semantic HTML</h1>

<h2>Introduction</h2>

<h2>Benefits</h2>

<h3>Accessibility</h3>

<h3>SEO</h3>

<h2>Conclusion</h2>
```

Do **not** skip heading levels.

❌ Incorrect

```html
<h1>Title</h1>

<h3>Introduction</h3>
```

---

# Semantic Landmarks

Semantic landmarks divide a webpage into meaningful regions.

```
Header

Navigation

Main Content

Article

Aside

Footer
```

These landmarks help assistive technologies navigate webpages efficiently.

---

# Accessibility Best Practices

✔ Use `lang` attribute on `<html>`

```html
<html lang="en">
```

---

✔ Add a meaningful page title.

```html
<title>Semantic HTML Blog</title>
```

---

✔ Add image alternative text.

```html
<img
src="image.png"
alt="Semantic HTML layout diagram">
```

---

✔ Associate labels with form controls.

```html
<label for="email">Email</label>

<input
id="email"
type="email">
```

---

✔ Use semantic landmarks.

```
header

nav

main

article

section

aside

footer
```

---

✔ Use descriptive link text.

✅ Good

```html
<a href="#">Accessibility Guide</a>
```

❌ Bad

```html
<a href="#">Click Here</a>
```

---

# Semantic Elements Used in the Assignment

- Header
- Navigation
- Main
- Article
- Section
- Aside
- Footer
- Figure
- Figcaption
- Time
- Address
- Blockquote

---

# Contact Form Accessibility

Every input should have:

- Label
- id
- name
- required (if mandatory)

Example

```html
<label for="name">Full Name</label>

<input
type="text"
id="name"
name="name"
required>
```

---

# Figure and Figcaption

```html
<figure>

<img src="image.png"
alt="Semantic HTML Structure">

<figcaption>

Semantic HTML Layout

</figcaption>

</figure>
```

---

# Blockquote

Used to display quoted text.

```html
<blockquote>

Semantic HTML improves accessibility and code readability.

</blockquote>
```

---

# Time Element

Represents dates and times.

```html
<time datetime="2026-07-07">

July 7, 2026

</time>
```

---

# Benefits of Semantic HTML

- Better Accessibility
- Better SEO
- Cleaner Code
- Easier Maintenance
- Better Screen Reader Support
- Improves Team Collaboration

---

# Accessibility Audit

Tool Used

- Google Lighthouse

Result

Before: **94**

After: **96**

Remaining Issue

Touch targets do not have sufficient size or spacing.

Reason

The assignment required **HTML5 only**.

Touch target spacing requires CSS (padding/margins), so the remaining Lighthouse warning cannot be resolved using HTML alone.

---

# Key Learnings

- HTML5 semantic elements improve accessibility.
- Proper heading hierarchy is important.
- Labels improve form accessibility.
- Images should always include meaningful `alt` text.
- Lighthouse helps identify accessibility improvements.
- Semantic HTML creates cleaner, more maintainable webpages.

---

# Conclusion

Semantic HTML is a best practice for modern web development. It improves accessibility, search engine optimization (SEO), maintainability, and provides a better experience for both users and assistive technologies.
