# Markdown Ultra

Convert GitHub markdown files into clean, embeddable HTML for Blackboard Ultra and other platforms.

**Live App:** [https://d-ries.github.io/markdown/](https://d-ries.github.io/markdown/)

## Features

- Parse GitHub markdown files to styled HTML
- Blackboard Ultra compatible styling
- Generate embeddable iframe code
- One-click copy to clipboard
- Live preview
- No backend required - runs entirely in browser

## How to Use

1. **Get your GitHub markdown URL**
   - Navigate to your markdown file on GitHub
   - Copy the full URL (e.g., `https://github.com/user/repo/blob/main/file.md`)

2. **Generate embed code**
   - Visit [https://d-ries.github.io/markdown/](https://d-ries.github.io/markdown/)
   - Paste your GitHub URL
   - Click "Generate iframe code"

3. **Embed in Blackboard Ultra**
   - Copy the generated iframe code
   - In Blackboard, add a "Content" item
   - Switch to HTML editor mode
   - Paste the iframe code
   - Save and publish

## Example

```html
<iframe src="https://d-ries.github.io/markdown/embed/aHR0cHM6Ly..." width="100%" height="600" frameborder="0"></iframe>
```

## Benefits

- **Version Control**: Keep markdown in GitHub with full version history
- **Collaboration**: Multiple contributors can edit via pull requests
- **Reusability**: Same content across multiple courses
- **Consistency**: Uniform styling across all embedded content
- **Accessibility**: WCAG compliant HTML output

## For Developers

### Development server

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200/`

### Build

```bash
ng build
```

### Deploy to GitHub Pages

Push to `main` branch - GitHub Actions automatically deploys.

## Tech Stack

- Angular 20.3
- TypeScript
- Tailwind CSS
- Marked.js (Markdown parser)
- GitHub API
