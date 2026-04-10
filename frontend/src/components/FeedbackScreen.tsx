import { useMemo } from 'react';
import { Button } from './ui/Button';
import { ChevronRight, CheckCircle, XCircle } from 'lucide-react';

// Random GIFs for Correct
const CORRECT_GIFS = [
  '/homer.gif', 
  '/bird.gif',  
  '/naruto.gif', 
  '/sakamoto.gif' 
];

// Random GIFs for incorrect
const INCORRECT_GIFS = [
  '/ramsey.gif', 
  '/homer2.gif', 
  '/brain.gif', 
  '/cartman.gif',
  '/takamura.gif'
];

interface FeedbackScreenProps {
  status: 'correct' | 'incorrect';
  correctAnswer?: string;
  onNext: () => void;
}

export const FeedbackScreen = ({ status, correctAnswer, onNext }: FeedbackScreenProps) => {
  const isCorrect = status === 'correct';

  const randomGif = useMemo(() => {
    const list = isCorrect ? CORRECT_GIFS : INCORRECT_GIFS;
    return list[Math.floor(Math.random() * list.length)];
  }, [isCorrect]);

  return (
    <div className="flex flex-col items-center text-center py-4 w-full">
      {isCorrect ? (
        <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
      ) : (
        <XCircle className="w-16 h-16 text-[#E4002B] mb-4" />
      )}
      
      <h2 className={`text-4xl font-black tracking-tight mb-6 ${isCorrect ? 'text-green-400' : 'text-[#E4002B]'}`}>
        {isCorrect ? 'CORRECT!' : 'INCORRECT!'}
      </h2>

      <img 
        src={randomGif} 
        alt={isCorrect ? 'Success!' : 'Incorrect'} 
        className="w-full max-w-sm h-48 object-cover rounded-2xl shadow-xl mb-6 border border-white/10"
      />

      {!isCorrect && correctAnswer && (
        <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20 w-full max-w-sm mb-6">
          <p className="text-white/50 text-xs uppercase tracking-widest font-bold mb-1">
            The Correct Answer Was
          </p>
          <p className="text-xl font-semibold text-white">{correctAnswer}</p>
        </div>
      )}

      <Button onClick={onNext} className="w-full max-w-sm py-4 mt-2">
        Next Question <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};