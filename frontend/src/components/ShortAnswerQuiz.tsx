import { useState } from 'react';
import { IconPencil, IconSparkles } from '@tabler/icons-react';
import { gradeAnswer } from '../utils/api';
import { ensureUserName } from '../utils/storage';
import type { QuizQuestion, GradingResult } from '../types';

interface Props {
  question: QuizQuestion;
}

export function ShortAnswerQuiz({ question }: Props) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<GradingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (answer.trim().length < 20) {
      alert('Please write a more detailed answer (at least 20 characters)');
      return;
    }

    const userName = ensureUserName();
    setLoading(true);

    try {
      const gradingResult = await gradeAnswer(
        question.id,
        userName,
        question.question,
        answer,
        question.rubric!,
        question.keyPoints || []
      );

      setResult(gradingResult);
      setSubmitted(true);
    } catch (error) {
      console.error('Error grading answer:', error);
      alert('Failed to grade answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setSubmitted(false);
    setResult(null);
    setAnswer('');
  };

  return (
    <div className="glass-card rounded-xl p-6 my-8 border-2 border-entangled-200">
      <div className="flex items-start space-x-3 mb-4">
        <IconPencil className="h-6 w-6 text-entangled-600 flex-shrink-0 mt-1" />
        <h3 className="text-xl font-display font-semibold text-gray-900">
          {question.question}
        </h3>
      </div>

      {!submitted ? (
        <>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer here... (aim for 2-4 sentences)"
            rows={5}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-entangled-500 focus:ring-2 focus:ring-entangled-200 outline-none transition-all resize-none"
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">
              {answer.length} characters (minimum 20)
            </span>
            <button
              onClick={handleSubmit}
              disabled={answer.trim().length < 20 || loading}
              className="flex items-center space-x-2 bg-gradient-to-r from-entangled-500 to-quantum-500 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              <IconSparkles className="h-5 w-5" />
              <span>{loading ? 'Grading with AI...' : 'Submit Answer'}</span>
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="font-semibold mb-2 text-gray-700">Your answer:</p>
            <p className="text-gray-800 italic">{answer}</p>
          </div>

          {result && (
            <div className={`p-5 rounded-lg border-2 ${result.correct ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-gray-900">
                  Score: {result.score}/100
                </span>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  result.correct ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                }`}>
                  {result.correct ? '✓ Great Work!' : '⚠ Keep Learning'}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    result.correct ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-sm text-gray-600 mb-1">💡 Feedback:</p>
                  <p className="text-gray-800">{result.feedback}</p>
                </div>

                {result.strengths && (
                  <div>
                    <p className="font-semibold text-sm text-green-600 mb-1">✓ What you did well:</p>
                    <p className="text-gray-800">{result.strengths}</p>
                  </div>
                )}

                {result.missedPoints && result.missedPoints.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm text-orange-600 mb-1">⚠ Points to consider:</p>
                    <ul className="list-disc list-inside text-gray-800 space-y-1">
                      {result.missedPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleTryAgain}
            className="w-full border-2 border-entangled-500 text-entangled-600 py-2 rounded-lg font-semibold hover:bg-entangled-50 transition-all"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
