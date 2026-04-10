export type QuizAnswerPayload = { q_index: number; answer: string; is_correct: boolean; is_written: boolean };
export type PollAnswerPayload = { q_index: number; answer: string; is_written: boolean };

export type QuizPayload = {
  name: string;
  score: number;
  total: number;
  answers: QuizAnswerPayload[];
};

export type PollPayload = {
  name: string;
  answers: PollAnswerPayload[];
};

export type Question = {
  type: 'multiple-choice' | 'written';
  question: string;
  options?: string[];
  answer?: string; 
};