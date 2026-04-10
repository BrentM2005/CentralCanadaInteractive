import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSpring, useTransition, animated, config } from '@react-spring/web';
import { Toaster, toast } from 'sonner';
import { CheckCircle2, ChevronRight, PenLine, Send } from 'lucide-react';

import { POLL_QUESTIONS } from '../constants';
import { useSubmitPoll } from '../hooks/useSubmissions';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';

const pollSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  answers: z.array(z.string()).length(POLL_QUESTIONS.length)
});

type PollFormValues = z.infer<typeof pollSchema>;

export const Poll = () => {
  const navigate = useNavigate();
  const submitMutation = useSubmitPoll();
  const [currentQ, setCurrentQ] = useState(0);

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<PollFormValues>({
    resolver: zodResolver(pollSchema),
    defaultValues: { name: '', answers: [] }
  });

  const isFinished = currentQ >= POLL_QUESTIONS.length;
  const progress = isFinished ? 100 : Math.round((currentQ / POLL_QUESTIONS.length) * 100);

  const transitions = useTransition(isFinished ? -1 : currentQ, {
    key: isFinished ? 'finished' : currentQ,
    from: { opacity: 0, transform: 'translate3d(30px, 0, 0)' },
    enter: { opacity: 1, transform: 'translate3d(0px, 0, 0)' },
    leave: { opacity: 0, transform: 'translate3d(-30px, 0, 0)', position: 'absolute', width: '100%' },
    config: config.stiff,
  });

  const { width } = useSpring({
    width: `${progress}%`,
    config: config.default,
  });

  const handleSelectAnswer = (option: string) => {
    setValue(`answers.${currentQ}`, option);
    setCurrentQ((prev) => prev + 1);
  };

  const handleWrittenNext = () => {
    const currentAnswer = getValues(`answers.${currentQ}`);
    if (currentAnswer?.trim()) {
      setCurrentQ((prev) => prev + 1);
    } else {
      toast.error('Please share your thoughts before continuing.', {
        icon: <PenLine className="w-4 h-4 text-[#E4002B]" />,
      });
    }
  };

  const onSubmit = (data: PollFormValues) => {
    const formattedAnswers = data.answers.map((ans, index) => ({
      q_index: index,
      answer: ans,
      is_written: POLL_QUESTIONS[index].type === 'written'
    }));

    submitMutation.mutate(
      { name: data.name, answers: formattedAnswers },
      {
        onSuccess: () => {
          toast.success('Poll submitted successfully!');
          setTimeout(() => navigate('/'), 1200);
        },
        onError: () => toast.error('Something went wrong. Please try again.')
      }
    );
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden flex flex-col items-center justify-center p-4">
      {/* Sonner Toaster */}
      <Toaster theme="dark" position="top-center" richColors />

      {/* Abstract Background Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#E4002B]/20 via-[#0A0A0A] to-[#0A0A0A]" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">Central Canada Poll</h1>
          <p className="text-white/50 text-sm tracking-wide">Share your voice on Ontario & Québec</p>
        </div>

        {/* Card Container */}
        <div className="bg-[#111]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative min-h-[400px]">
          
          {/* Progress Bar Header */}
          <div className="mb-8">
            <div className="flex justify-between text-xs font-semibold text-white/50 mb-3 px-1 uppercase tracking-wider">
              <span>{!isFinished ? `Question ${currentQ + 1} of ${POLL_QUESTIONS.length}` : 'Final Step'}</span>
              <animated.span>{width.to(w => `${Math.round(parseFloat(w))}%`)}</animated.span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <animated.div 
                className="h-full bg-gradient-to-r from-[#E4002B] to-red-400 rounded-full" 
                style={{ width }} 
              />
            </div>
          </div>

          {/* Flow Container */}
          <div className="relative w-full">
            {transitions((style, item) => (
              <animated.div style={style}>
                {item !== -1 ? (
                  <div className="w-full">
                    <h2 className="text-2xl md:text-3xl font-semibold leading-snug mb-8">
                      {POLL_QUESTIONS[item].question}
                    </h2>
                    
                    <div className="space-y-4">
                      {POLL_QUESTIONS[item].type === 'written' ? (
                        <>
                          <TextArea
                            {...register(`answers.${item}`)}
                            placeholder="Share your perspective..."
                            rows={4}
                          />
                          <Button type="button" onClick={handleWrittenNext} className="mt-4">
                            Continue <ChevronRight className="w-5 h-5" />
                          </Button>
                        </>
                      ) : (
                        POLL_QUESTIONS[item].options?.map((opt) => (
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
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="w-full text-center py-4">
                    <CheckCircle2 className="w-20 h-20 text-[#E4002B] mx-auto mb-6" />
                    <h2 className="text-3xl font-black mb-3">Almost done!</h2>
                    <p className="text-white/60 mb-8">Who should we attribute these insights to?</p>

                    <div className="text-left max-w-sm mx-auto space-y-6">
                      <div>
                        <Input
                          placeholder="Your Name"
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-red-400 text-sm mt-2 font-medium">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        variant="success"
                        disabled={submitMutation.isPending}
                        className="w-full py-5"
                      >
                        {submitMutation.isPending ? 'Submitting...' : 'Send Responses'}
                        {!submitMutation.isPending && <Send className="w-5 h-5" />}
                      </Button>
                    </div>
                  </form>
                )}
              </animated.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};