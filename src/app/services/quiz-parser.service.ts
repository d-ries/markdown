import { Injectable } from '@angular/core';

export interface QuizOption {
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizParserService {
  private quizCounter = 0;

  /**
   * Parses a quiz block in the format:
   * ~QUIZ
   * Q: Question text?
   * A) Option A
   * B) Option B
   * C) Option C (correct)
   * D) Option D
   * ANSWER: C
   * ~
   */
  parseQuiz(content: string): Quiz | null {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length < 4) return null; // Minimum: Q, 2 options, ANSWER

    let question = '';
    const options: QuizOption[] = [];
    let correctAnswer: string | null = null;

    for (const line of lines) {
      if (line.startsWith('Q:')) {
        question = line.substring(2).trim();
      } else if (/^[A-Z]\)/.test(line)) {
        // Parse option (A), (B), etc.
        const match = line.match(/^([A-Z])\)\s*(.+)$/);
        if (match) {
          const [, label, text] = match;
          options.push({
            label,
            text,
            isCorrect: false
          });
        }
      } else if (line.startsWith('ANSWER:')) {
        correctAnswer = line.substring(7).trim().toUpperCase();
      }
    }

    if (!question || options.length < 2 || !correctAnswer) {
      return null;
    }

    // Mark the correct answer
    const correctIndex = correctAnswer.charCodeAt(0) - 65; // A=0, B=1, etc.
    if (correctIndex >= 0 && correctIndex < options.length) {
      options[correctIndex].isCorrect = true;
    } else {
      return null; // Invalid answer reference
    }

    return {
      id: `quiz-${++this.quizCounter}`,
      question,
      options,
      correctAnswer
    };
  }

  /**
   * Validates if the given answer is correct
   */
  validateAnswer(quiz: Quiz, selectedLabel: string): boolean {
    return selectedLabel.toUpperCase() === quiz.correctAnswer.toUpperCase();
  }
}
