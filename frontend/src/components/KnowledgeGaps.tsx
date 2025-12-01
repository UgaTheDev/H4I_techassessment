import { useState, useEffect } from "react";
import {
  IconAlertTriangle,
  IconTargetArrow,
  IconTrendingUp,
  IconRefresh,
  IconX,
  IconChartBar,
  IconArrowRight,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";

interface QuizAttempt {
  questionId: string;
  correct: boolean;
  timestamp: string;
  topic?: string;
}

interface TopicPerformance {
  topic: string;
  topicLabel: string;
  path: string;
  correct: number;
  total: number;
  accuracy: number;
  recentTrend: "improving" | "declining" | "stable";
  lastAttempt?: string;
}

const QUESTION_TOPIC_MAP: Record<
  string,
  { topic: string; label: string; path: string }
> = {
  "entanglement-basics-mc-1": {
    topic: "entanglement",
    label: "What is Entanglement?",
    path: "/what-is-entanglement",
  },
  "entanglement-basics-mc-2": {
    topic: "entanglement",
    label: "What is Entanglement?",
    path: "/what-is-entanglement",
  },
  "entanglement-basics-sa": {
    topic: "entanglement",
    label: "What is Entanglement?",
    path: "/what-is-entanglement",
  },
  "epr-paradox-mc-1": {
    topic: "epr",
    label: "EPR Paradox",
    path: "/epr-paradox",
  },
  "epr-paradox-mc-2": {
    topic: "epr",
    label: "EPR Paradox",
    path: "/epr-paradox",
  },
  "epr-paradox-mc-3": {
    topic: "epr",
    label: "EPR Paradox",
    path: "/epr-paradox",
  },
  "epr-paradox-sa": {
    topic: "epr",
    label: "EPR Paradox",
    path: "/epr-paradox",
  },
  "bells-theorem-mc-1": {
    topic: "bells",
    label: "Bell's Theorem",
    path: "/bells-theorem",
  },
  "bells-theorem-mc-2": {
    topic: "bells",
    label: "Bell's Theorem",
    path: "/bells-theorem",
  },
  "bells-theorem-mc-3": {
    topic: "bells",
    label: "Bell's Theorem",
    path: "/bells-theorem",
  },
  "bells-theorem-sa": {
    topic: "bells",
    label: "Bell's Theorem",
    path: "/bells-theorem",
  },
  "experiments-mc-1": {
    topic: "experiments",
    label: "Famous Experiments",
    path: "/famous-experiments",
  },
  "experiments-mc-2": {
    topic: "experiments",
    label: "Famous Experiments",
    path: "/famous-experiments",
  },
  "experiments-mc-3": {
    topic: "experiments",
    label: "Famous Experiments",
    path: "/famous-experiments",
  },
  "applications-qkd-mc": {
    topic: "applications",
    label: "Applications",
    path: "/applications",
  },
  "applications-teleport-mc": {
    topic: "applications",
    label: "Applications",
    path: "/applications",
  },
  "applications-computing-mc": {
    topic: "applications",
    label: "Applications",
    path: "/applications",
  },
  "applications-supremacy-mc": {
    topic: "applications",
    label: "Applications",
    path: "/applications",
  },
  "applications-future-sa": {
    topic: "applications",
    label: "Applications",
    path: "/applications",
  },
};

export function useKnowledgeGaps() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [performance, setPerformance] = useState<TopicPerformance[]>([]);

  useEffect(() => {
    const loadAttempts = () => {
      const saved = localStorage.getItem("quizAttempts");
      if (saved) {
        try {
          const parsed: QuizAttempt[] = JSON.parse(saved);
          const withTopics = parsed.map((a) => ({
            ...a,
            topic: QUESTION_TOPIC_MAP[a.questionId]?.topic || "other",
          }));
          setAttempts(withTopics);
        } catch (e) {}
      }
    };

    loadAttempts();

    window.addEventListener("storage", loadAttempts);
    return () => window.removeEventListener("storage", loadAttempts);
  }, []);

  useEffect(() => {
    const topics = new Map<
      string,
      { correct: number; total: number; attempts: QuizAttempt[] }
    >();

    Object.values(QUESTION_TOPIC_MAP).forEach(({ topic }) => {
      if (!topics.has(topic)) {
        topics.set(topic, { correct: 0, total: 0, attempts: [] });
      }
    });

    attempts.forEach((attempt) => {
      const topicInfo = QUESTION_TOPIC_MAP[attempt.questionId];
      if (topicInfo) {
        const current = topics.get(topicInfo.topic)!;
        current.total++;
        if (attempt.correct) current.correct++;
        current.attempts.push(attempt);
      }
    });

    const perf: TopicPerformance[] = [];
    topics.forEach((data, topic) => {
      const topicMeta = Object.values(QUESTION_TOPIC_MAP).find(
        (t) => t.topic === topic
      );
      if (!topicMeta || data.total === 0) return;

      const sortedAttempts = [...data.attempts].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      let trend: "improving" | "declining" | "stable" = "stable";
      if (sortedAttempts.length >= 4) {
        const recent = sortedAttempts.slice(
          0,
          Math.ceil(sortedAttempts.length / 2)
        );
        const older = sortedAttempts.slice(
          Math.ceil(sortedAttempts.length / 2)
        );

        const recentAccuracy =
          recent.filter((a) => a.correct).length / recent.length;
        const olderAccuracy =
          older.filter((a) => a.correct).length / older.length;

        if (recentAccuracy > olderAccuracy + 0.1) trend = "improving";
        else if (recentAccuracy < olderAccuracy - 0.1) trend = "declining";
      }

      perf.push({
        topic,
        topicLabel: topicMeta.label,
        path: topicMeta.path,
        correct: data.correct,
        total: data.total,
        accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
        recentTrend: trend,
        lastAttempt: sortedAttempts[0]?.timestamp,
      });
    });

    perf.sort((a, b) => a.accuracy - b.accuracy);
    setPerformance(perf);
  }, [attempts]);

  const weakAreas = performance.filter((p) => p.accuracy < 70 && p.total >= 2);
  const strongAreas = performance.filter(
    (p) => p.accuracy >= 80 && p.total >= 2
  );
  const overallAccuracy =
    attempts.length > 0
      ? (attempts.filter((a) => a.correct).length / attempts.length) * 100
      : 0;

  return {
    attempts,
    performance,
    weakAreas,
    strongAreas,
    overallAccuracy,
  };
}

export function KnowledgeGapPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { performance, weakAreas, strongAreas, overallAccuracy, attempts } =
    useKnowledgeGaps();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconChartBar className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Knowledge Analysis</h2>
                <p className="text-indigo-100">
                  {attempts.length} quiz attempts analyzed
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg"
            >
              <IconX className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4 bg-white/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span>Overall Accuracy</span>
              <span className="text-2xl font-bold">
                {Math.round(overallAccuracy)}%
              </span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  overallAccuracy >= 80
                    ? "bg-green-400"
                    : overallAccuracy >= 60
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
                style={{ width: `${overallAccuracy}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {attempts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <IconTargetArrow className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Complete some quizzes to see your knowledge analysis!</p>
            </div>
          ) : (
            <>
              {weakAreas.length > 0 && (
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 text-amber-700 font-semibold mb-3">
                    <IconAlertTriangle className="w-5 h-5" />
                    Areas to Review ({weakAreas.length})
                  </h3>
                  <div className="space-y-2">
                    {weakAreas.map((area) => (
                      <Link
                        key={area.topic}
                        to={area.path}
                        onClick={onClose}
                        className="block p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {area.topicLabel}
                            </p>
                            <p className="text-sm text-gray-600">
                              {area.correct}/{area.total} correct (
                              {Math.round(area.accuracy)}%)
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full">
                              Needs Review
                            </span>
                            {area.recentTrend === "improving" && (
                              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <IconTrendingUp className="w-3 h-3" /> Improving
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  All Topics
                </h3>
                <div className="space-y-3">
                  {performance.map((topic) => (
                    <div key={topic.topic} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {topic.topicLabel}
                          </span>
                          <span className="text-sm text-gray-500">
                            {topic.correct}/{topic.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              topic.accuracy >= 80
                                ? "bg-green-500"
                                : topic.accuracy >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${topic.accuracy}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold w-12 text-right ${
                          topic.accuracy >= 80
                            ? "text-green-600"
                            : topic.accuracy >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.round(topic.accuracy)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {strongAreas.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                    <IconTargetArrow className="w-5 h-5" />
                    Your Strengths
                  </h3>
                  <p className="text-sm text-gray-600">
                    Great job on:{" "}
                    {strongAreas.map((a) => a.topicLabel).join(", ")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {attempts.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                if (confirm("Reset all quiz history? This cannot be undone.")) {
                  localStorage.removeItem("quizAttempts");
                  localStorage.removeItem("quantum-user-stats");
                  localStorage.removeItem("quantum-learning-progress");
                  window.dispatchEvent(new Event("storage"));
                  window.location.reload();
                }
              }}
              className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <IconRefresh className="w-4 h-4" />
              Reset Quiz History
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ReviewSuggestion() {
  const { weakAreas } = useKnowledgeGaps();
  const location = useLocation();

  if (weakAreas.length === 0) return null;

  const currentWeakArea = weakAreas.find(
    (area) => area.path === location.pathname
  );

  if (currentWeakArea) {
    return (
      <div className="glass-card rounded-xl p-4 mb-6 border-2 border-blue-300 bg-blue-50">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <IconTrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900">Keep Practicing</h4>
            <p className="text-sm text-blue-800">
              You scored {Math.round(currentWeakArea.accuracy)}% on{" "}
              <strong>{currentWeakArea.topicLabel}</strong>. Practice the
              quizzes below to strengthen your understanding and improve your
              score!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const weakest = weakAreas[0];

  return (
    <div className="glass-card rounded-xl p-4 mb-6 border-2 border-amber-300 bg-amber-50">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500 rounded-lg">
          <IconAlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-amber-900">Suggested Review</h4>
          <p className="text-sm text-amber-800 mb-3">
            You scored {Math.round(weakest.accuracy)}% on{" "}
            <strong>{weakest.topicLabel}</strong>. Consider reviewing this topic
            to strengthen your understanding.
          </p>
          <Link
            to={weakest.path}
            className="inline-flex items-center gap-1.5 text-sm text-amber-700 font-medium hover:underline transition-colors"
          >
            Review {weakest.topicLabel}
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
