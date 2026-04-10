import { motion, type Variants } from 'framer-motion';
import { MessageSquareQuote } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../constants';
import { type QuizReportRow } from '../../hooks/useReports';
import { ParticlesBackground } from '../ParticlesBackground';

type WrittenAnswersProps = {
  data: QuizReportRow[];
};

export const WrittenAnswers = ({ data }: WrittenAnswersProps) => {
  const writtenData = data.filter(d => Boolean(d.is_written) && d.answer.trim() !== "");

  const groupedByQuestion = writtenData.reduce((acc, row) => {
    const qText = QUIZ_QUESTIONS[row.q_index]?.question || 'Written Response';
    if (!acc[qText]) acc[qText] = [];
    acc[qText].push(row);
    return acc;
  }, {} as Record<string, QuizReportRow[]>);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  return (
    <div className="relative w-full rounded-[3rem] bg-gradient-to-br from-[#E4002B]/20 to-[#0A0A0A] p-8 md:p-12 overflow-hidden border border-[#E4002B]/30 shadow-[0_0_80px_-20px_rgba(228,0,43,0.3)] mt-16">
      <ParticlesBackground />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-[#E4002B] p-3 rounded-2xl shadow-lg">
            <MessageSquareQuote className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black tracking-tight">Community Voices</h2>
        </div>

        {Object.keys(groupedByQuestion).length === 0 ? (
          <p className="text-white/50 italic">No written responses recorded yet.</p>
        ) : (
          Object.entries(groupedByQuestion).map(([questionText, answers], idx) => (
            <div key={idx} className="mb-12 last:mb-0">
              <h3 className="text-xl font-medium text-white/70 mb-6">{questionText}</h3>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {answers.map((row, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="group bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 rounded-3xl p-6 transition-all shadow-xl hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <p className="text-lg font-serif italic text-white/90 leading-relaxed relative z-10">
                      "{row.answer}"
                    </p>
                    
                    {row.count > 1 && (
                      <div className="mt-4 flex justify-end">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-white/50">
                          {row.count} People Said This
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};