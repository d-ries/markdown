# Markdown Test Document

This document contains all common markdown elements for testing purposes.

## Headings

### Level 3 Heading
#### Level 4 Heading
##### Level 5 Heading
###### Level 6 Heading

## Text Formatting

This is **bold text** and this is *italic text*. You can also use __bold__ and _italic_.

Combined: **_bold and italic_** or ***bold and italic***.

~~Strikethrough text~~ is also supported.

## Lists

### Unordered List

- First item
- Second item
- Third item
  - Nested item 1
  - Nested item 2
    - Deep nested item
- Fourth item

### Ordered List

1. First step
2. Second step
3. Third step
   1. Sub-step A
   2. Sub-step B
4. Fourth step

### Task List

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
- [ ] Another incomplete task

## Links

[Link to Google](https://www.google.com)

[Link with title](https://www.github.com "GitHub Homepage")

Auto-link: https://www.example.com

## Images

![Placeholder Image](https://via.placeholder.com/600x400 "Image Title")

![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)

## Code

### Inline Code

Use `console.log()` to print to the console in JavaScript.

The variable `x` is assigned the value `42`.

### Code Blocks

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
```

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
```

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
```

## Tables

| Name | Age | City | Occupation |
|------|-----|------|------------|
| Alice | 28 | New York | Engineer |
| Bob | 35 | London | Designer |
| Charlie | 42 | Tokyo | Manager |
| Diana | 31 | Paris | Developer |

### Table with Alignment

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Text | Text | Text |
| More text | More text | More text |
| Even more | Even more | Even more |

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

> **Nested quotes:**
> 
> > This is a nested blockquote.
> > It provides additional context.
>
> Back to the first level.

> ### Quote with heading
> 
> You can include other markdown elements:
> - List item 1
> - List item 2
> 
> And even `code` or **bold text**.

## Horizontal Rule

Use horizontal rules to separate sections:

---

Or use alternative syntax:

***

## Escape Characters

You can escape special characters: \* \_ \# \[ \]

## Mixed Content Example

Here's a **complex section** with _multiple_ elements:

1. First, read the [documentation](https://www.markdownguide.org)
2. Install the required packages:
   ```bash
   npm install marked
   ```
3. Create a test file with:
   - Headers
   - Lists
   - Code blocks
4. Verify it works! ✓

> **Note:** Always test your markdown before deploying!

## Emoji Support (if enabled)

:smile: :rocket: :heart: :+1: :tada:

## Definition Lists (extended syntax)

Term 1
: Definition 1

Term 2
: Definition 2a
: Definition 2b

## Footnotes (extended syntax)

Here's a sentence with a footnote[^1].

Here's another one[^2].

[^1]: This is the first footnote.
[^2]: This is the second footnote with more detailed information.

## Math (if supported)

Inline math: $E = mc^2$

Block math:

$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

---

**End of Test Document**

This document covers most markdown features. Test rendering to ensure all elements display correctly.
