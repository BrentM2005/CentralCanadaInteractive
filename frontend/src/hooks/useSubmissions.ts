import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { type QuizPayload, type PollPayload } from '../types';

export const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: (data: QuizPayload) => api.post('/api/submit-quiz', data),
  });
};

export const useSubmitPoll = () => {
  return useMutation({
    mutationFn: (data: PollPayload) => api.post('/api/submit-poll', data),
  });
};