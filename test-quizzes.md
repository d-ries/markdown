# Quiz Feature Test

Welcome to the Interactive Quiz System! This file demonstrates quizzes embedded directly in markdown.

## Getting Started

Below are several test quizzes you can use to verify the feature is working correctly. Try selecting answers and clicking "Check Answer" to see instant feedback.

---

## Quiz 1: Chemistry

Test your knowledge of chemical elements:

~QUIZ
Q: What is the chemical symbol for Gold?
A) Go
B) Gd
C) Au
D) Ag
ANSWER: C
~

---

## Quiz 2: Mathematics

A basic math question:

~QUIZ
Q: What is the square root of 144?
A) 10
B) 11
C) 12
D) 13
ANSWER: C
~

---

## Quiz 3: History

A history question:

~QUIZ
Q: In which year did World War II end in Europe?
A) 1943
B) 1944
C) 1945
D) 1946
ANSWER: C
~

---

## Quiz 4: Astronomy

Test your astronomy knowledge:

~QUIZ
Q: Which planet is known as the Red Planet?
A) Venus
B) Mars
C) Jupiter
D) Saturn
ANSWER: B
~

---

## Quiz 5: Biology

A biology question:

~QUIZ
Q: What is the powerhouse of the cell?
A) Nucleus
B) Ribosome
C) Mitochondria
D) Chloroplast
ANSWER: C
~

---

## Quiz 6: Geography

Test your geography skills:

~QUIZ
Q: What is the capital of Australia?
A) Sydney
B) Melbourne
C) Canberra
D) Brisbane
ANSWER: C
~

---

## How to Use These Quizzes

1. **Read** the question carefully
2. **Select** the option you think is correct
3. **Click** "Check Answer" to submit
4. **Review** the feedback - you'll see if you're correct or incorrect
5. **Click** "Try Again" to reset and retry the quiz

---

## About the Quiz Syntax

Teachers can add quizzes to their markdown using this syntax:

```markdown
~QUIZ
Q: Your question here?
A) First option
B) Second option
C) Third option
D) Fourth option
ANSWER: C
~
```

### Requirements:
- Quiz blocks must start with `~QUIZ` and end with `~` (each on their own line)
- Questions begin with `Q:`
- Options use `A)`, `B)`, `C)`, `D)`, etc.
- The `ANSWER:` field specifies the correct option using its letter
- All fields are required; minimum 2 options needed

---

## Feedback Features

✅ **Correct answers** show a success message with a checkmark
❌ **Incorrect answers** show which option was correct
🔄 **Try Again** allows unlimited attempts with no penalty

---

## Tips for Test Instructors

- **Keep questions focused** - Each quiz should test one concept
- **Use realistic options** - Distractors should be plausible
- **Provide context** - Add explanatory text before quizzes
- **Group by topic** - Organize quizzes by learning objective
- **Mix difficulty** - Combine easy and challenging questions

---

## Ready to Test?

Use one of the quizzes above to verify the feature is working. Open the browser developer console to see debug messages if anything isn't working as expected.
