import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { QUIZ_QUESTIONS, POLL_QUESTIONS } from '../../constants';
import { type QuizReportRow, type PollReportRow } from '../../hooks/useReports';

type ChartSectionProps = {
  title: string;
  type: 'quiz' | 'poll';
  data: (QuizReportRow | PollReportRow)[];
};

export const ChartSection = ({ title, type, data }: ChartSectionProps) => {
  const charts = useMemo(() => {
    const questionsList = type === 'quiz' ? QUIZ_QUESTIONS : POLL_QUESTIONS;
    
    return questionsList.map((q, index) => {
      if (q.type === 'written') return null;

      const rowsForQ = data.filter(d => d.q_index === index && !d.is_written);
      const totalVotes = rowsForQ.reduce((sum, row) => sum + row.count, 0);

      const chartData = (q.options || []).map(opt => {
        const row = rowsForQ.find(r => r.answer === opt);
        const count = row ? row.count : 0;
        const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
        
        const isCorrectOption = type === 'quiz' && opt === (q as any).answer;

        return {
          name: opt,
          count,
          percentage,
          isCorrect: isCorrectOption
        };
      });

      return {
        question: q.question,
        totalVotes,
        chartData
      };
    }).filter(Boolean);
  }, [data, type]);

  return (
    <div className="w-full mb-16 relative z-10">
      <h2 className="text-3xl font-black tracking-tight mb-8 border-b border-white/10 pb-4">{title}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {charts.map((chart, idx) => (
          <div key={idx} className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-2">{chart?.question}</h3>
            <p className="text-white/40 text-sm font-semibold mb-6 uppercase tracking-wider">
              Total Responses: {chart?.totalVotes}
            </p>
            
            <div className="h-64 w-full text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart?.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff60" tick={{ fill: '#ffffff60' }} />
                  <YAxis stroke="#ffffff60" tick={{ fill: '#ffffff60' }} tickFormatter={(val) => `${val}%`} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff10' }}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                    formatter={(value: any, _name: any, props: any) => [
                      `${value}% (${props.payload?.count || 0} votes)`, 
                      'Chosen'
                    ]}
                  />
                  <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                    {chart?.chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isCorrect ? '#22c55e' : (type === 'poll' ? '#3b82f6' : '#ef4444')} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {type === 'quiz' && (
              <div className="mt-4 flex gap-4 text-xs font-semibold tracking-wider text-white/50 justify-center">
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /> Correct</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /> Incorrect</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};