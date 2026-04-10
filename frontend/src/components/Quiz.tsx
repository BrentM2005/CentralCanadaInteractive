import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSpring, useTransition, animated, config } from '@react-spring/web';
import { Toaster, toast } from 'sonner';
import { Trophy, Award, ChevronRight, Check } from 'lucide-react';

import { QUIZ_QUESTIONS } from '../constants';
import { useSubmitQuiz } from '../hooks/useSubmissions';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { FeedbackScreen } from './FeedbackScreen';

const quizSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  answers: z.array(z.string()).length(QUIZ_QUESTIONS.length)
});

type QuizFormValues = z.infer<typeof quizSchema>;

export const Quiz = () => {
  const navigate = useNavigate();
  const submitMutation = useSubmitQuiz();
  
  const [currentQ, setCurrentQ] = useState(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [writtenText, setWrittenText] = useState(""); 

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: { name: '', answers: [] }
  });

  const isFinished = currentQ >= QUIZ_QUESTIONS.length;
  const progress = isFinished ? 100 : Math.round((currentQ / QUIZ_QUESTIONS.length) * 100);

  const viewKey = isFinished 
    ? 'finished' 
    : feedbackStatus !== 'none' 
      ? `feedback-${currentQ}` 
      : `q-${currentQ}`;

  const transitions = useTransition(viewKey, {
    key: viewKey,
    from: { opacity: 0, transform: 'translate3d(30px, 0, 0)' },
    enter: { opacity: 1, transform: 'translate3d(0px, 0, 0)' },
    leave: { opacity: 0, transform: 'translate3d(-30px, 0, 0)', position: 'absolute', width: '100%' },
    config: config.stiff,
  });

  const { width } = useSpring({
    width: `${progress}%`,
    config: config.default,
  });

  const calculateScore = (answers: string[]) => {
    let score = 0;
    let totalScorable = 0;
    answers.forEach((ans, index) => {
      const q = QUIZ_QUESTIONS[index];
      if (q && q.type !== 'written') {
        totalScorable++;
        if (ans === q.answer) score++;
      }
    });
    return { score, total: totalScorable };
  };

  const handleSelectAnswer = (option: string) => {
    setValue(`answers.${currentQ}`, option);
    const isCorrect = option === QUIZ_QUESTIONS[currentQ].answer;
    setFeedbackStatus(isCorrect ? 'correct' : 'incorrect');
  };

  const handleNextWritten = () => {
    setValue(`answers.${currentQ}`, writtenText);
    setWrittenText(""); 
    setCurrentQ((prev) => prev + 1);
  };

  const handleNextAfterFeedback = () => {
    setFeedbackStatus('none');
    setCurrentQ((prev) => prev + 1);
  };

  const onSubmit = (data: QuizFormValues) => {
    const answersForScoring = data.answers || [];
    const { score, total } = calculateScore(answersForScoring);

    const formattedAnswers = data.answers.map((ans, index) => {
      const q = QUIZ_QUESTIONS[index];
      const isWritten = q?.type === 'written';
      return { 
        q_index: index, 
        answer: ans, 
        is_correct: !isWritten && ans === q?.answer, 
        is_written: isWritten
      };
    });

    submitMutation.mutate(
      { name: data.name, score, total, answers: formattedAnswers },
      {
        onSuccess: () => {
          toast.success(`Score Saved: ${score}/${total} 🍁`, {
            icon: <Award className="text-[#E4002B]" />
          });
          setTimeout(() => navigate('/'), 1500);
        },
        onError: () => toast.error('Error saving your score. Try again.')
      }
    );
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden flex flex-col items-center justify-center p-4">
      <Toaster theme="dark" position="top-center" richColors />

      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#E4002B]/15 via-[#0A0A0A] to-[#0A0A0A]" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-10 flex flex-col items-center">
          <Trophy className="w-12 h-12 text-[#E4002B] mb-3 opacity-80" />
          <h1 className="text-4xl font-black tracking-tight mb-2">Central Canada Quiz</h1>
          <p className="text-white/50 text-sm tracking-wide">Test your knowledge of Central Canada</p>
        </div>

        <div className="bg-[#111]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative min-h-[400px]">
          
          <div className="mb-8">
            <div className="flex justify-between text-xs font-semibold text-white/50 mb-3 px-1 uppercase tracking-wider">
              <span>{!isFinished ? `Question ${currentQ + 1} of ${QUIZ_QUESTIONS.length}` : 'Quiz Complete'}</span>
              <animated.span>{width.to(w => `${Math.round(parseFloat(w))}%`)}</animated.span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <animated.div 
                className="h-full bg-gradient-to-r from-[#E4002B] to-white rounded-full" 
                style={{ width }} 
              />
            </div>
          </div>

          <div className="relative w-full">
            {transitions((style, key) => {
              const renderIndex = key === 'finished' ? 0 : parseInt(key.split('-')[1] || '0', 10);
              const question = QUIZ_QUESTIONS[renderIndex];

              return (
                <animated.div style={style}>
                  {key === 'finished' ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full text-center py-4">
                      <div className="mb-8">
                        <p className="text-white/50 uppercase tracking-widest text-sm font-bold mb-4">Your Score</p>
                        {(() => {
                          const { score, total } = calculateScore(getValues('answers') || []);
                          return (
                            <div className="flex items-baseline justify-center gap-x-2">
                              <span className="text-7xl font-black text-[#E4002B]">{score}</span>
                              <span className="text-4xl text-white/30 font-light">/</span>
                              <span className="text-5xl font-bold">{total}</span>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="text-left max-w-sm mx-auto space-y-6">
                        <div>
                          <Input placeholder="Player Name" {...register('name')} />
                          {errors.name && (
                            <p className="text-red-400 text-sm mt-2 font-medium">{errors.name.message}</p>
                          )}
                        </div>

                        <Button type="submit" variant="success" disabled={submitMutation.isPending} className="w-full py-5">
                          {submitMutation.isPending ? 'Saving...' : 'Save Results'}
                          {!submitMutation.isPending && <Check className="w-5 h-5" />}
                        </Button>
                      </div>
                    </form>
                  ) : key.startsWith('feedback-') ? (
                    <FeedbackScreen 
                      status={feedbackStatus as 'correct' | 'incorrect'}
                      correctAnswer={question?.answer}
                      onNext={handleNextAfterFeedback}
                    />
                  ) : (
                    <div className="w-full">
                      <h2 className="text-2xl md:text-3xl font-semibold leading-snug mb-8">
                        {question?.question}
                      </h2>

                      <div className="space-y-4">
                        {question?.type === 'written' ? (
                          <>
                            <TextArea
                              value={writtenText}
                              onChange={(e) => setWrittenText(e.target.value)}
                              placeholder="Type your answer here..."
                              rows={4}
                            />
                            <Button type="button" onClick={handleNextWritten} className="mt-4">
                              {writtenText.trim() === "" ? "Skip" : "Next"} <ChevronRight className="w-5 h-5" />
                            </Button>
                          </>
                        ) : (
                          question?.options?.map((opt) => (
                            <Button
                              key={opt}
                              type="button"
                              variant="outline"
                              onClick={() => handleSelectAnswer(opt)}
                            >
                              {opt}
                            </Button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </animated.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};