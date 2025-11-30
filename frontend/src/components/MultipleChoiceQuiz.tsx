import { useState, useEffect } from "react";
import {
  IconCheck,
  IconX,
  IconTrendingUp,
  IconFlame,
} from "@tabler/icons-react";
import { submitQuiz, getQuizResults } from "../utils/api";
import { ensureUserName } from "../utils/storage";
import type { QuizQuestion, QuizResults } from "../types";

interface Props {
  question: QuizQuestion;
}

export function MultipleChoiceQuiz({ question }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadResults();
    // Load streak from localStorage
    const storedStreak = localStorage.getItem("quiz-streak");
    if (storedStreak) {
      setStreak(parseInt(storedStreak));
    }
  }, [question.id]);

  const loadResults = async () => {
    try {
      const data = await getQuizResults(question.id);
      setResults(data);
    } catch (error) {
      console.error("Error loading results:", error);
    }
  };

  const saveQuizAttempt = (correct: boolean) => {
    const attempts = JSON.parse(localStorage.getItem("quizAttempts") || "[]");
    attempts.push({
      questionId: question.id,
      correct,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("quizAttempts", JSON.stringify(attempts));

    // Update streak
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    localStorage.setItem("quiz-streak", newStreak.toString());

    // Show confetti for correct answers
    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    // Dispatch event for ProgressTracker
    window.dispatchEvent(
      new CustomEvent("quizComplete", {
        detail: {
          quizId: question.id,
          score: correct ? 100 : 0,
          correct,
        },
      })
    );

    // Trigger storage event for QuizStats
    window.dispatchEvent(new Event("storage"));
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;

    const userName = ensureUserName();
    setLoading(true);

    try {
      const data = await submitQuiz(
        question.id,
        userName,
        selectedAnswer,
        question.correctAnswer!
      );

      setResults(data.results);
      setSubmitted(true);

      // Save to quiz statistics
      saveQuizAttempt(data.isCorrect);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAnswer = () => {
    setSubmitted(false);
    setSelectedAnswer(null);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="glass-card rounded-xl p-6 my-8 border-2 border-quantum-200 relative overflow-hidden">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10px",
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: [
                  "#06b6d4",
                  "#d946ef",
                  "#10b981",
                  "#f97316",
                  "#fbbf24",
                ][Math.floor(Math.random() * 5)],
                width: "8px",
                height: "8px",
                borderRadius: Math.random() > 0.5 ? "50%" : "0",
              }}
            />
          ))}
        </div>
      )}

      {/* Streak indicator */}
      {streak > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          <IconFlame className="h-4 w-4" />
          {streak} streak
        </div>
      )}

      <div className="flex items-start space-x-3 mb-4">
        <IconTrendingUp className="h-6 w-6 text-quantum-600 flex-shrink-0 mt-1" />
        <h3 className="text-xl font-display font-semibold text-gray-900">
          {question.question}
        </h3>
      </div>

      <div className="space-y-3 mb-6">
        {question.options?.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === question.correctAnswer;
          const showCorrect = submitted && isCorrectAnswer;
          const showIncorrect = submitted && isSelected && !isCorrectAnswer;

          return (
            <button
              key={index}
              onClick={() => !submitted && setSelectedAnswer(option)}
              disabled={submitted}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                showCorrect
                  ? "border-green-500 bg-green-50"
                  : showIncorrect
                  ? "border-red-500 bg-red-50"
                  : isSelected
                  ? "border-quantum-500 bg-quantum-50"
                  : "border-gray-200 hover:border-quantum-300 bg-white"
              } ${submitted ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                      showCorrect
                        ? "bg-green-500 text-white"
                        : showIncorrect
                        ? "bg-red-500 text-white"
                        : isSelected
                        ? "bg-quantum-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {showCorrect ? (
                      <IconCheck className="h-4 w-4" />
                    ) : showIncorrect ? (
                      <IconX className="h-4 w-4" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  <span className="font-medium">{option}</span>
                </div>
                {showCorrect && (
                  <IconCheck className="h-5 w-5 text-green-600" />
                )}
                {showIncorrect && <IconX className="h-5 w-5 text-red-600" />}
              </div>
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || loading}
          className="w-full quantum-gradient text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
        >
          {loading ? "Submitting..." : "Submit Answer"}
        </button>
      ) : (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg ${
              isCorrect
                ? "bg-green-50 border-2 border-green-200"
                : "bg-orange-50 border-2 border-orange-200"
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              {isCorrect ? (
                <>
                  <span className="text-xl">🎉</span>
                  <span className="font-bold text-green-900">Correct!</span>
                  {streak > 1 && (
                    <span className="text-green-600 text-sm">
                      ({streak} in a row!)
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-xl">💡</span>
                  <span className="font-bold text-orange-900">
                    Not quite right
                  </span>
                </>
              )}
            </div>
            {question.explanation && (
              <p className="text-sm text-gray-700">{question.explanation}</p>
            )}
          </div>

          {results && results.total > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold mb-3 text-gray-900">
                Live Results ({results.total}{" "}
                {results.total === 1 ? "response" : "responses"})
              </h4>
              <div className="space-y-3">
                {question.options?.map((option) => {
                  const count = results.counts[option] || 0;
                  const percentage =
                    results.total > 0 ? (count / results.total) * 100 : 0;
                  const users = results.users[option] || [];

                  return (
                    <div key={option}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">
                          {option}
                        </span>
                        <span className="text-gray-600">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="quantum-gradient h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {users.length > 0 && (
                        <div className="text-xs text-gray-500 ml-1">
                          {users.join(", ")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleChangeAnswer}
            className="w-full border-2 border-quantum-500 text-quantum-600 py-2 rounded-lg font-semibold hover:bg-quantum-50 transition-all"
          >
            Change Answer
          </button>
        </div>
      )}

      {/* CSS for confetti animation */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti-fall 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
