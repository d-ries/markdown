import { QuizParserService, Quiz } from './quiz-parser.service';

const quizParser = new QuizParserService();
const quizDataMap = new Map<string, Quiz>();
let quizCounter = 0;

/**
 * Process markdown and replace quiz blocks with markers
 * This runs before marked parsing
 */
export function preprocessMarkdownForQuizzes(markdown: string): string {
  let processed = markdown;
  
  // Handle both Unix (\n) and Windows (\r\n) line endings
  const quizRegex = /~QUIZ\r?\n([\s\S]*?)\r?\n~/g;
  
  let matchCount = 0;
  processed = processed.replace(quizRegex, (match, content) => {
    matchCount++;
    console.log(`Found quiz block #${matchCount}, content length: ${content.length}`);
    console.log('Raw content:', JSON.stringify(content));
    
    const quiz = quizParser.parseQuiz(content);
    
    if (quiz) {
      const quizId = `quiz-${quizCounter++}`;
      quizDataMap.set(quizId, quiz);
      console.log(`✓ Stored quiz with ID: ${quizId}`, quiz);
      
      // Return a placeholder that marked won't touch
      return `\n\n<div class="quiz-marker" data-quiz-id="${quizId}"></div>\n\n`;
    } else {
      console.warn('✗ Failed to parse quiz:', content);
      return match; // Return original if parsing fails
    }
  });
  
  console.log(`Total quizzes found and processed: ${matchCount}`);
  
  return processed;
}

export function getQuizData(quizId: string): Quiz | undefined {
  return quizDataMap.get(quizId);
}

export function clearQuizData(): void {
  quizDataMap.clear();
  quizCounter = 0;
}
