import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ProgressTracker } from "./components/ProgressTracker";
import { QuizStats } from "./components/QuizStats";
import { ShareButton } from "./components/ShareButton";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";

// New feature imports
import { ThemeProvider } from "./components/ThemeProvider";
import { GlossaryProvider, GlossaryPanel } from "./components/Glossary";
import { ELI5Provider } from "./components/ELI5Mode";
import {
  useAchievements,
  AchievementNotification,
  AchievementsPanel,
  ACHIEVEMENTS,
} from "./components/Achievements";
import { KnowledgeGapPanel } from "./components/KnowledgeGaps";
import { IconTrophy, IconBook, IconChartBar } from "@tabler/icons-react";

// Lazy load pages
const Home = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.Home }))
);
const WhatIsEntanglement = lazy(() =>
  import("./pages/WhatIsEntanglement").then((m) => ({
    default: m.WhatIsEntanglement,
  }))
);
const EPRParadox = lazy(() =>
  import("./pages/EPRParadox").then((m) => ({ default: m.EPRParadox }))
);
const BellsTheorem = lazy(() =>
  import("./pages/BellsTheorem").then((m) => ({ default: m.BellsTheorem }))
);
const FamousExperiments = lazy(() =>
  import("./pages/FamousExperiments").then((m) => ({
    default: m.FamousExperiments,
  }))
);
const Applications = lazy(() =>
  import("./pages/Applications").then((m) => ({ default: m.Applications }))
);
// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-quantum-500 border-t-transparent animate-spin" />
          <div
            className="absolute inset-2 rounded-full border-4 border-entangled-500 border-b-transparent animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
          />
        </div>
        <p className="text-gray-600 font-medium">Loading quantum content...</p>
      </div>
    </div>
  );
}

// Consolidated floating toolbar - BOTTOM LEFT (next to QuizStats)
function LeftToolbar({
  onOpenAchievements,
  onOpenGlossary,
  onOpenKnowledgeGaps,
  achievementCount,
  totalAchievements,
}: {
  onOpenAchievements: () => void;
  onOpenGlossary: () => void;
  onOpenKnowledgeGaps: () => void;
  achievementCount: number;
  totalAchievements: number;
}) {
  return (
    <div className="fixed bottom-6 left-20 z-40 flex items-center gap-2">
      {/* Achievements */}
      <button
        onClick={onOpenAchievements}
        className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
        title="View Achievements"
      >
        <IconTrophy className="w-5 h-5" />
        <span className="font-bold text-sm">
          {achievementCount}/{totalAchievements}
        </span>
      </button>

      {/* Glossary */}
      <button
        onClick={onOpenGlossary}
        className="bg-white border-2 border-quantum-500 text-quantum-600 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        title="Open Glossary"
      >
        <IconBook className="w-5 h-5" />
      </button>

      {/* Knowledge Gaps */}
      <button
        onClick={onOpenKnowledgeGaps}
        className="bg-white border-2 border-indigo-500 text-indigo-600 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        title="Knowledge Analysis"
      >
        <IconChartBar className="w-5 h-5" />
      </button>
    </div>
  );
}

// Main app content
function AppContent() {
  const {
    stats,
    unlockedAchievements,
    newlyUnlocked,
    dismissNewAchievement,
    updateStats,
  } = useAchievements();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showKnowledgeGaps, setShowKnowledgeGaps] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  // Listen for quiz events to update achievements
  useEffect(() => {
    const handleQuizComplete = (e: CustomEvent) => {
      const { correct, quizId } = e.detail;
      updateStats({
        quizzesCompleted: [...stats.quizzesCompleted, quizId],
        totalAttempts: stats.totalAttempts + 1,
        totalCorrect: stats.totalCorrect + (correct ? 1 : 0),
        correctStreak: correct ? stats.correctStreak + 1 : 0,
        maxStreak: correct
          ? Math.max(stats.maxStreak, stats.correctStreak + 1)
          : stats.maxStreak,
        perfectQuizzes: correct
          ? stats.perfectQuizzes + 1
          : stats.perfectQuizzes,
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
  }, [stats, updateStats]);

  // Track page visits for achievements
  useEffect(() => {
    const handlePageVisit = () => {
      const progress = JSON.parse(
        localStorage.getItem("quantum-learning-progress") ||
          '{"pagesVisited":[]}'
      );
      if (progress.pagesVisited.length > stats.pagesVisited.length) {
        updateStats({ pagesVisited: progress.pagesVisited });
      }
    };

    handlePageVisit();
    window.addEventListener("storage", handlePageVisit);
    return () => window.removeEventListener("storage", handlePageVisit);
  }, [stats.pagesVisited.length, updateStats]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/what-is-entanglement"
              element={<WhatIsEntanglement />}
            />
            <Route path="/epr-paradox" element={<EPRParadox />} />
            <Route path="/bells-theorem" element={<BellsTheorem />} />
            <Route path="/famous-experiments" element={<FamousExperiments />} />
            <Route path="/applications" element={<Applications />} />
            {/* REMOVED: Escape Room route */}
          </Routes>
        </Suspense>

        {/* EXISTING components - keep in their original structure */}
        <ProgressTracker />
        <QuizStats />
        <ShareButton />
        <KeyboardShortcuts />

        {/* NEW features - BOTTOM LEFT (next to QuizStats) */}
        <LeftToolbar
          onOpenAchievements={() => setShowAchievements(true)}
          onOpenGlossary={() => setShowGlossary(true)}
          onOpenKnowledgeGaps={() => setShowKnowledgeGaps(true)}
          achievementCount={unlockedAchievements.size}
          totalAchievements={ACHIEVEMENTS.length}
        />

        {/* Modals */}
        <GlossaryPanel
          isOpen={showGlossary}
          onClose={() => setShowGlossary(false)}
        />

        <AchievementsPanel
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
          unlockedAchievements={unlockedAchievements}
          stats={stats}
        />

        <KnowledgeGapPanel
          isOpen={showKnowledgeGaps}
          onClose={() => setShowKnowledgeGaps(false)}
        />

        {/* Achievement popup */}
        {newlyUnlocked && (
          <AchievementNotification
            achievement={newlyUnlocked}
            onDismiss={dismissNewAchievement}
          />
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 mb-4">
                <span className="text-2xl">⚛️</span>
                <h3 className="text-xl font-display font-semibold">
                  Spooky Action at a Distance: Quantum Entanglement
                </h3>
              </div>

              <p className="text-lg mb-2">
                Created for Hack4Impact IdeaCon Spring 2026
              </p>
              <p className="text-gray-400 mb-6">
                Exploring the fascinating world of quantum entanglement
              </p>

              <div className="flex justify-center gap-8 mb-6 text-sm">
                <div>
                  <div className="text-2xl font-bold text-quantum-400">6</div>
                  <div className="text-gray-500">3D Demos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-entangled-400">
                    15+
                  </div>
                  <div className="text-gray-500">Quizzes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">13</div>
                  <div className="text-gray-500">Achievements</div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <p className="text-xs text-gray-500">
                  Press{" "}
                  <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300 font-mono">
                    ?
                  </kbd>{" "}
                  for shortcuts
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// App with all providers
function App() {
  return (
    <ThemeProvider>
      <GlossaryProvider>
        <ELI5Provider>
          <AppContent />
        </ELI5Provider>
      </GlossaryProvider>
    </ThemeProvider>
  );
}

export default App;
