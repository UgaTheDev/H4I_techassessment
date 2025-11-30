import { useEffect, useState } from 'react';
import { IconTrophy, IconTarget, IconBrain } from '@tabler/icons-react';

interface QuizAttempt {
  questionId: string;
  correct: boolean;
  timestamp: Date;
}

export function QuizStats() {
  const [stats, setStats] = useState({
    totalAttempts: 0,
    correctAnswers: 0,
    accuracy: 0,
    streak: 0,
  });
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const attempts: QuizAttempt[] = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
    
    const correct = attempts.filter(a => a.correct).length;
    const total = attempts.length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    
    // Calculate current streak
    let streak = 0;
    for (let i = attempts.length - 1; i >= 0; i--) {
      if (attempts[i].correct) {
        streak++;
      } else {
        break;
      }
    }

    setStats({
      totalAttempts: total,
      correctAnswers: correct,
      accuracy,
      streak,
    });
  }, []);

  if (!showStats) {
    return (
      <button
        onClick={() => setShowStats(true)}
        className="fixed bottom-6 left-6 z-50 quantum-gradient text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
        aria-label="Show quiz statistics"
      >
        <IconTrophy className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="glass-card rounded-xl p-6 shadow-2xl border-2 border-entangled-300 w-80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-800">Quiz Statistics</h3>
          <button
            onClick={() => setShowStats(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <IconTarget className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {stats.accuracy.toFixed(0)}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <IconBrain className="h-5 w-5 text-green-600" />
              <span className="text-xs font-semibold text-green-700">Streak</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.streak}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Questions:</span>
            <span className="font-semibold text-gray-800">{stats.totalAttempts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Correct Answers:</span>
            <span className="font-semibold text-green-600">{stats.correctAnswers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Incorrect Answers:</span>
            <span className="font-semibold text-red-600">
              {stats.totalAttempts - stats.correctAnswers}
            </span>
          </div>
        </div>

        {stats.accuracy >= 80 && stats.totalAttempts >= 5 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-center text-gradient">
              🏆 Quantum Master! You're doing great!
            </p>
          </div>
        )}

        {stats.streak >= 5 && (
          <div className="mt-2">
            <p className="text-xs font-semibold text-center text-orange-600">
              🔥 {stats.streak} question streak!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
