export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  rubric?: string;
  keyPoints?: string[];
}

export interface QuizResults {
  counts: Record<string, number>;
  users: Record<string, string[]>;
  total: number;
}

export interface GradingResult {
  score: number;
  feedback: string;
  correct: boolean;
  missedPoints: string[];
  strengths: string;
}

export interface Comment {
  _id: string;
  pageId: string;
  userName: string;
  comment: string;
  timestamp: string;
}
