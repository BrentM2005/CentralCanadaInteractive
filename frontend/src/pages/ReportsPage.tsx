import { BarChart3, Loader2 } from 'lucide-react';
import { useQuizReports, usePollReports } from '../hooks/useReports';
import { ChartSection } from '../components/reports/ChartSection';
import { WrittenAnswers } from '../components/reports/WrittenAnswers';
import { Link } from 'react-router';

export const ReportsPage = () => {
  const { data: quizData, isLoading: quizLoading } = useQuizReports();
  const { data: pollData, isLoading: pollLoading } = usePollReports();

  if (quizLoading || pollLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#E4002B] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden selection:bg-[#E4002B]/30">
      
      {/* Navbar/Header */}
      <div className="w-full border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-tighter hover:text-white/80 transition-colors">
            Central<span className="text-[#E4002B]"> Canada</span>
          </Link>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 text-sm font-semibold">
            <BarChart3 className="w-4 h-4 text-[#E4002B]" /> Live Reports
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 drop-shadow-2xl">
            Responses
          </h1>
        </div>

        {/* Charts Container */}
        <div className="space-y-12">
          {quizData && quizData.length > 0 && (
            <ChartSection title="Quiz Accuracy Breakdown" type="quiz" data={quizData} />
          )}

          {pollData && pollData.length > 0 && (
            <ChartSection title="Poll Preferences" type="poll" data={pollData} />
          )}
        </div>

        {/* Fancy Animated Written Answers */}
        {quizData && <WrittenAnswers data={quizData} />}
        
      </div>
    </div>
  );
};