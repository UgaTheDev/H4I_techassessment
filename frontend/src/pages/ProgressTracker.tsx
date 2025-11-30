import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  IconCheck,
  IconCircle,
  IconTrophy,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react";

interface LearningProgress {
  pagesVisited: string[];
  quizzesCompleted: string[];
  quizScores: Record<string, number>;
}

interface PageInfo {
  id: string;
  path: string;
  title: string;
  shortTitle: string;
}

const PAGES: PageInfo[] = [
  { id: "home", path: "/", title: "Home", shortTitle: "Home" },
  {
    id: "what-is-entanglement",
    path: "/what-is-entanglement",
    title: "What is Entanglement?",
    shortTitle: "Basics",
  },
  {
    id: "epr-paradox",
    path: "/epr-paradox",
    title: "EPR Paradox",
    shortTitle: "EPR",
  },
  {
    id: "bells-theorem",
    path: "/bells-theorem",
    title: "Bell's Theorem",
    shortTitle: "Bell's",
  },
  {
    id: "famous-experiments",
    path: "/famous-experiments",
    title: "Famous Experiments",
    shortTitle: "Experiments",
  },
  {
    id: "applications",
    path: "/applications",
    title: "Applications",
    shortTitle: "Applications",
  },
];

export function ProgressTracker() {
  const location = useLocation();
  const [progress, setProgress] = useState<LearningProgress>({
    pagesVisited: [],
    quizzesCompleted: [],
    quizScores: {},
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("quantum-learning-progress");
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        // Reset if corrupted
        localStorage.setItem(
          "quantum-learning-progress",
          JSON.stringify({
            pagesVisited: [],
            quizzesCompleted: [],
            quizScores: {},
          })
        );
      }
    }
  }, []);

  // Mark current page as visited when location changes
  useEffect(() => {
    const currentPage = PAGES.find((p) => p.path === location.pathname);
    if (!currentPage) return;

    setProgress((prev) => {
      // Skip if already visited
      if (prev.pagesVisited.includes(currentPage.id)) {
        return prev;
      }

      const updated = {
        ...prev,
        pagesVisited: [...prev.pagesVisited, currentPage.id],
      };

      localStorage.setItem(
        "quantum-learning-progress",
        JSON.stringify(updated)
      );

      // Check if just completed all pages
      if (
        updated.pagesVisited.length === PAGES.length &&
        prev.pagesVisited.length < PAGES.length
      ) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      return updated;
    });
  }, [location.pathname]);

  // Listen for quiz completion events (dispatched from quiz components)
  useEffect(() => {
    const handleQuizComplete = (event: CustomEvent) => {
      const { quizId, score } = event.detail;
      setProgress((prev) => {
        const updated = {
          ...prev,
          quizzesCompleted: prev.quizzesCompleted.includes(quizId)
            ? prev.quizzesCompleted
            : [...prev.quizzesCompleted, quizId],
          quizScores: {
            ...prev.quizScores,
            [quizId]: score,
          },
        };
        localStorage.setItem(
          "quantum-learning-progress",
          JSON.stringify(updated)
        );
        return updated;
      });
    };

    window.addEventListener(
      "quizComplete",
      handleQuizComplete as EventListener
    );
    return () =>
      window.removeEventListener(
        "quizComplete",
        handleQuizComplete as EventListener
      );
  }, []);

  const visitedCount = progress.pagesVisited.length;
  const totalPages = PAGES.length;
  const progressPercentage = (visitedCount / totalPages) * 100;
  const quizCount = progress.quizzesCompleted.length;

  const isPageVisited = (pageId: string) =>
    progress.pagesVisited.includes(pageId);
  const isCurrentPage = (path: string) => location.pathname === path;

  const handleReset = () => {
    if (confirm("Reset all progress? This cannot be undone.")) {
      const reset = { pagesVisited: [], quizzesCompleted: [], quizScores: {} };
      setProgress(reset);
      localStorage.setItem("quantum-learning-progress", JSON.stringify(reset));
    }
  };

  return (
    <>
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-r from-quantum-500 to-entangled-500 text-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce">
            <div className="flex items-center gap-3">
              <IconTrophy className="h-10 w-10 text-yellow-300" />
              <div>
                <p className="text-2xl font-bold">Congratulations!</p>
                <p className="text-sm opacity-90">
                  You've explored all topics!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress tracker widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <div
          className={`glass-card rounded-xl shadow-2xl border-2 border-quantum-300 transition-all duration-300 ${
            isMinimized ? "w-auto" : "w-72"
          }`}
        >
          {/* Header - always visible */}
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 rounded-t-xl transition-colors"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div className="flex items-center gap-2">
              <IconTrophy
                className={`h-5 w-5 ${
                  visitedCount === totalPages
                    ? "text-yellow-500"
                    : "text-quantum-600"
                }`}
              />
              <h3 className="font-bold text-sm text-gray-800">
                {isMinimized
                  ? `${visitedCount}/${totalPages}`
                  : "Your Progress"}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {!isMinimized && (
                <span className="text-xs font-semibold text-quantum-600 bg-quantum-100 px-2 py-1 rounded-full">
                  {Math.round(progressPercentage)}%
                </span>
              )}
              {isMinimized ? (
                <IconChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <IconChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>
          </div>

          {/* Expanded content */}
          {!isMinimized && (
            <div className="px-4 pb-4">
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-gradient-to-r from-quantum-500 to-entangled-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Page list */}
              <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
                {PAGES.map((page) => {
                  const visited = isPageVisited(page.id);
                  const current = isCurrentPage(page.path);

                  return (
                    <Link
                      key={page.path}
                      to={page.path}
                      className={`flex items-center space-x-2 text-xs p-2 rounded-lg transition-colors ${
                        current
                          ? "bg-quantum-100 border border-quantum-300"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {visited ? (
                        <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <IconCircle className="h-4 w-4 text-gray-300 flex-shrink-0" />
                      )}
                      <span
                        className={`${
                          visited ? "text-gray-700" : "text-gray-400"
                        } ${current ? "font-semibold" : ""}`}
                      >
                        {page.title}
                      </span>
                      {current && (
                        <span className="ml-auto text-quantum-600 text-[10px] font-medium">
                          HERE
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Quiz stats */}
              {quizCount > 0 && (
                <div className="text-xs text-gray-500 mb-3 p-2 bg-gray-50 rounded-lg">
                  <span className="font-medium">Quizzes completed:</span>{" "}
                  {quizCount}
                </div>
              )}

              {/* Completion message */}
              {visitedCount === totalPages ? (
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-green-600 flex items-center gap-1">
                      <span>🎉</span> All pages explored!
                    </p>
                    <button
                      onClick={handleReset}
                      className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {totalPages - visitedCount} page
                    {totalPages - visitedCount !== 1 ? "s" : ""} remaining
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
