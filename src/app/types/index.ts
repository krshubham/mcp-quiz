export interface Question {
  id: number;
  question: string;
  options: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface FullQuestion extends Question {
  correctAnswer: number;
  explanation: string;
}

export interface Answer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
}

export interface QuizState {
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  quizCompleted: boolean;
}
