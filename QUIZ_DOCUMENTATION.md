# Quiz Feature Documentation

## Overview

Markdown Ultra now supports interactive multiple-choice quizzes embedded directly in your markdown files. Teachers can add quizzes to their course content in Blackboard Ultra with validation for correct/incorrect answers.

## Features

✅ **Custom Markdown Syntax** - Simple, intuitive syntax that's easy for teachers to use
✅ **Real-time Validation** - Instant feedback on whether answers are correct
✅ **Interactive UI** - Beautiful, responsive quiz components that work on all devices
✅ **Support for Multiple Quizzes** - Add as many quizzes as you need to a single markdown file
✅ **No Backend Required** - Validation happens entirely in the browser
✅ **Blackboard Compatible** - Works seamlessly when embedded as iframes

## Syntax

### Basic Quiz Format

```
~QUIZ
Q: Your question here?
A) First option
B) Second option
C) Third option
D) Fourth option
ANSWER: C
~
```

### Components

| Component | Description | Example |
|-----------|-------------|---------|
| `~QUIZ` ... `~` | Quiz block delimiters | - |
| `Q:` | Question text | `Q: What is 2 + 2?` |
| `A)`, `B)`, `C)`, `D)` | Answer options (A-Z supported) | `A) 3` |
| `ANSWER:` | Correct answer identifier | `ANSWER: B` |

## Examples

### Example 1: Basic Math Question

```markdown
~QUIZ
Q: What is the capital of France?
A) London
B) Berlin
C) Paris
D) Madrid
ANSWER: C
~
```

### Example 2: Science Question

```markdown
~QUIZ
Q: Which element has the atomic number 8?
A) Nitrogen
B) Carbon
C) Oxygen
D) Hydrogen
ANSWER: C
~
```

### Example 3: Multiple Options

You can have as few as 2 options or as many as you need:

```markdown
~QUIZ
Q: What is the largest planet in our solar system?
A) Mars
B) Saturn
C) Jupiter
D) Neptune
E) Earth
ANSWER: C
~
```

## How It Works for Teachers

### Step 1: Write Your Markdown

Create or edit your markdown file in GitHub:

```markdown
# Chapter 1: Introduction

Some content here...

~QUIZ
Q: What have we learned?
A) A
B) B
C) C
ANSWER: A
~

Continue with more content...
```

### Step 2: Commit and Push

Save your changes to GitHub. The quiz syntax is preserved as plain text - no special tools needed.

### Step 3: Generate and Embed

Use the Markdown Ultra app to convert your URL to an embed code. The quizzes will automatically render with the markdown.

### Step 4: Students Use the Quizzes

When students view the embedded content:
1. They see the quiz rendered below the markdown
2. They select an answer choice
3. They click "Check Answer"
4. They get instant feedback (correct/incorrect)
5. They can click "Try Again" to reset and retry

## Validation Features

- **Required selection**: Students must select an option before submitting
- **Instant feedback**: Success message with emoji for correct answers
- **Detailed feedback**: Incorrect answers show the correct option
- **Try again**: Students can reset and attempt the quiz multiple times

## Styling

Quizzes automatically style to match Blackboard Ultra's design:
- Clean, professional appearance
- Accessible color contrast
- Responsive layout for mobile and desktop
- Hover effects for better UX

## Limitations

- **Multiple correct answers**: Currently supports one correct answer per quiz
- **Complex formatting**: Option text is plain text (no markdown/HTML formatting)
- **Scoring/Tracking**: Responses aren't saved or tracked by default (can be added as future feature)
- **Randomized options**: Questions always display options in the same order
- **Custom answer types**: Only multiple choice supported (no short answer, matching, etc.)

## Future Enhancements

Potential improvements for future versions:
- [ ] Randomize answer options
- [ ] Support for multiple correct answers
- [ ] Score tracking and export
- [ ] Quiz analytics/reporting
- [ ] Custom styling options
- [ ] Question banks/quiz shuffling
- [ ] Image support in questions
- [ ] Markdown formatting in options

## Troubleshooting

### Quiz Not Appearing

1. Check syntax matches exactly:
   ```
   ~QUIZ
   Q: ...
   A) ...
   ANSWER: A
   ~
   ```

2. Verify the ANSWER reference is valid (A-Z)

3. Ensure at least 2 options are provided

### Quiz Parsing Fails Silently

Check browser console for error messages that may indicate:
- Invalid JSON in quiz data
- Missing required fields
- Malformed syntax

## Tips for Teachers

🎯 **Keep questions clear and concise** - Students should understand the question in seconds

🎯 **Use realistic options** - Avoid obviously wrong answers; make all options plausible

🎯 **Test your quizzes** - Use the test/preview feature before sharing with students

🎯 **Provide context** - Add text before a quiz to explain what's being tested

🎯 **Use multiple quizzes** - Break up content with several small quizzes rather than one long one

🎯 **Give feedback** - Explain why the correct answer is right when possible

## Examples in Action

### Full Chapter with Quizzes

```markdown
# Photosynthesis Basics

Photosynthesis is the process by which plants convert sunlight into chemical energy.

Here's the overall equation:

```math
6CO2 + 6H2O + light energy → C6H12O6 + 6O2
```

## Check Your Understanding

~QUIZ
Q: What is the primary input for photosynthesis?
A) Oxygen and glucose
B) Carbon dioxide and water
C) Calcium and nitrogen
D) Sulfur and iron
ANSWER: B
~

## The Light-Dependent Reactions

The light-dependent reactions occur in the thylakoid membranes...

~QUIZ
Q: Where do the light-dependent reactions take place?
A) The stroma
B) The cytoplasm
C) The thylakoid membranes
D) The mitochondria
ANSWER: C
~

## Summary

Review key concepts above by trying the quizzes!
```

## Integration with Markdown Ultra

The quiz feature integrates seamlessly:

1. **Parser**: Custom `marked` extension parses `~QUIZ` blocks
2. **Service**: `QuizParserService` validates quiz syntax and answers
3. **Component**: `QuizComponent` renders interactive UI
4. **Embed**: Automatically creates components during markdown rendering

All validation happens client-side, making it fast and reliable.
