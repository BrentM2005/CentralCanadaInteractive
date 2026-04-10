import { Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { PollPage } from './pages/PollPage';
import { ReportsPage } from './pages/ReportsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/poll" element={<PollPage />} />
      <Route path="/reports" element={<ReportsPage />} />
    </Routes>
  );
}