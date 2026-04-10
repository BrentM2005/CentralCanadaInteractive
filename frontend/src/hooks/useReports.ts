import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export type QuizReportRow = {
  q_index: number;
  answer: string;
  is_correct: boolean | number;
  is_written: boolean | number;
  count: number;
};

export type PollReportRow = {
  q_index: number;
  answer: string;
  is_written: boolean | number;
  count: number;
};

export const useQuizReports = () => {
  return useQuery({
    queryKey: ['report-quiz'],
    queryFn: async () => {
      const { data } = await api.get<QuizReportRow[]>('/api/reports/quiz');
      return data;
    },
  });
};

export const usePollReports = () => {
  return useQuery({
    queryKey: ['report-poll'],
    queryFn: async () => {
      const { data } = await api.get<PollReportRow[]>('/api/reports/poll');
      return data;
    },
  });
};