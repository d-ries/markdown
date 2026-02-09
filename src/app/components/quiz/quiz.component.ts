import { Component, Input, signal, ChangeDetectorRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizParserService, Quiz } from '../../services/quiz-parser.service';

type QuizState = 'idle' | 'answered' | 'correct' | 'incorrect';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  @Input() quizData!: Quiz;

  private quizParser = new QuizParserService();
  private cdr: ChangeDetectorRef;
  
  selectedAnswer = signal<string | null>(null);
  state = signal<QuizState>('idle');
  feedback = signal<string>('');

  // Computed signals that react to state changes
  isAnswered = computed(() => this.state() === 'answered');
  isCorrect = computed(() => 
    this.state() === 'answered' && 
    this.quizParser.validateAnswer(this.quizData, this.selectedAnswer() || '')
  );

  constructor(cdr: ChangeDetectorRef) {
    this.cdr = cdr;
  }

  onSubmit(): void {
    console.log('onSubmit() called');
    const selected = this.selectedAnswer();
    console.log('Selected answer:', selected);
    
    if (!selected) {
      console.log('No answer selected, showing error message');
      this.feedback.set('Please select an answer before submitting.');
      console.log('After feedback.set():', this.feedback());
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      return;
    }

    const isCorrect = this.quizParser.validateAnswer(this.quizData, selected);
    console.log('Answer is correct:', isCorrect);
    
    if (isCorrect) {
      console.log('Setting state to correct');
      this.state.set('correct');
      this.feedback.set('🎉 Correct! Well done!');
    } else {
      console.log('Setting state to incorrect');
      this.state.set('incorrect');
      const correctLabel = this.quizData.correctAnswer;
      const correctOption = this.quizData.options.find(opt => opt.label === correctLabel);
      this.feedback.set(`❌ Incorrect. The correct answer is ${correctLabel}) ${correctOption?.text}`);
    }
    
    console.log('Setting state to answered');
    this.state.set('answered');
    
    console.log('After state updates:');
    console.log('  state():', this.state());
    console.log('  feedback():', this.feedback());
    console.log('  isAnswered():', this.isAnswered());
    console.log('  isCorrect():', this.isCorrect());
    
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  reset(): void {
    console.log('reset() called');
    this.selectedAnswer.set(null);
    this.state.set('idle');
    this.feedback.set('');
    console.log('After reset:');
    console.log('  state():', this.state());
    console.log('  feedback():', this.feedback());
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
}
