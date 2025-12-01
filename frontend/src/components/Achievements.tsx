import { useState, useEffect } from "react";
import {
  IconTrophy,
  IconX,
  IconLock,
  IconCheck,
  IconFlame,
  IconBook,
  IconBrain,
  IconRocket,
  IconStar,
  IconBolt,
  IconEye,
  IconMessage,
  IconTargetArrow,
} from "@tabler/icons-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  requirement: string;
  category: "progress" | "quiz" | "engagement" | "mastery";
  checkUnlocked: (stats: UserStats) => boolean;
  unlockedAt?: string;
}

export interface UserStats {
  pagesVisited: string[];
  quizzesCompleted: string[];
  quizScores: Record<string, number>;
  correctStreak: number;
  maxStreak: number;
  totalCorrect: number;
  totalAttempts: number;
  flashcardsReviewed: number;
  commentsPosted: number;
  timeSpentSeconds: number;
  firstVisit: string;
  perfectQuizzes: number;
  shortAnswersCompleted: number;
}

const DEFAULT_STATS: UserStats = {
  pagesVisited: [],
  quizzesCompleted: [],
  quizScores: {},
  correctStreak: 0,
  maxStreak: 0,
  totalCorrect: 0,
  totalAttempts: 0,
  flashcardsReviewed: 0,
  commentsPosted: 0,
  timeSpentSeconds: 0,
  firstVisit: new Date().toISOString(),
  perfectQuizzes: 0,
  shortAnswersCompleted: 0,
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "quantum-curious",
    name: "Quantum Curious",
    description: "Begin your quantum journey",
    icon: <IconEye className="w-6 h-6" />,
    requirement: "Visit your first page",
    category: "progress",
    checkUnlocked: (stats) => stats.pagesVisited.length >= 1,
  },
  {
    id: "eager-learner",
    name: "Eager Learner",
    description: "Explore half the content",
    icon: <IconBook className="w-6 h-6" />,
    requirement: "Visit 3 topic pages",
    category: "progress",
    checkUnlocked: (stats) => stats.pagesVisited.length >= 3,
  },
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Complete all topic pages",
    icon: <IconStar className="w-6 h-6" />,
    requirement: "Visit all 5 topic pages",
    category: "progress",
    checkUnlocked: (stats) => stats.pagesVisited.length >= 5,
  },
  {
    id: "dedicated-student",
    name: "Dedicated Student",
    description: "Spend quality time learning",
    icon: <IconBrain className="w-6 h-6" />,
    requirement: "Spend 30 minutes on the site",
    category: "progress",
    checkUnlocked: (stats) => stats.timeSpentSeconds >= 1800,
  },

  {
    id: "first-answer",
    name: "First Steps",
    description: "Answer your first quiz question",
    icon: <IconTargetArrow className="w-6 h-6" />,
    requirement: "Complete 1 quiz",
    category: "quiz",
    checkUnlocked: (stats) => stats.quizzesCompleted.length >= 1,
  },
  {
    id: "quiz-enthusiast",
    name: "Quiz Enthusiast",
    description: "Test your knowledge regularly",
    icon: <IconCheck className="w-6 h-6" />,
    requirement: "Complete 10 quizzes",
    category: "quiz",
    checkUnlocked: (stats) => stats.quizzesCompleted.length >= 10,
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Achieve quiz excellence",
    icon: <IconTrophy className="w-6 h-6" />,
    requirement: "Get 100% on 5 quizzes",
    category: "quiz",
    checkUnlocked: (stats) => stats.perfectQuizzes >= 5,
  },
  {
    id: "on-fire",
    name: "On Fire!",
    description: "Unstoppable streak",
    icon: <IconFlame className="w-6 h-6" />,
    requirement: "10 correct answers in a row",
    category: "quiz",
    checkUnlocked: (stats) => stats.maxStreak >= 10,
  },
  {
    id: "accuracy-king",
    name: "Accuracy King",
    description: "Precision is your middle name",
    icon: <IconBolt className="w-6 h-6" />,
    requirement: "Maintain 90%+ quiz accuracy (min 10 attempts)",
    category: "quiz",
    checkUnlocked: (stats) =>
      stats.totalAttempts >= 10 &&
      stats.totalCorrect / stats.totalAttempts >= 0.9,
  },

  {
    id: "deep-thinker",
    name: "Deep Thinker",
    description: "Tackle open-ended questions",
    icon: <IconBrain className="w-6 h-6" />,
    requirement: "Complete 3 short-answer quizzes",
    category: "engagement",
    checkUnlocked: (stats) => stats.shortAnswersCompleted >= 3,
  },
  {
    id: "card-collector",
    name: "Card Collector",
    description: "Master the flashcards",
    icon: <IconBook className="w-6 h-6" />,
    requirement: "Review 25 flashcards",
    category: "engagement",
    checkUnlocked: (stats) => stats.flashcardsReviewed >= 25,
  },
  {
    id: "community-member",
    name: "Community Member",
    description: "Join the discussion",
    icon: <IconMessage className="w-6 h-6" />,
    requirement: "Post your first comment",
    category: "engagement",
    checkUnlocked: (stats) => stats.commentsPosted >= 1,
  },

  {
    id: "entanglement-expert",
    name: "Entanglement Expert",
    description: "True quantum mastery",
    icon: <IconRocket className="w-6 h-6" />,
    requirement: "100% site completion",
    category: "mastery",
    checkUnlocked: (stats) =>
      stats.pagesVisited.length >= 5 &&
      stats.quizzesCompleted.length >= 15 &&
      stats.perfectQuizzes >= 3,
  },
];

const CATEGORY_COLORS = {
  progress: {
    bg: "bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  quiz: {
    bg: "bg-green-500",
    light: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
  },
  engagement: {
    bg: "bg-purple-500",
    light: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-300",
  },
  mastery: {
    bg: "bg-amber-500",
    light: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
  },
};

export function useAchievements() {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(
    new Set()
  );
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("quantum-user-stats");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStats({ ...DEFAULT_STATS, ...parsed });
      } catch (e) {}
    }

    const savedUnlocked = localStorage.getItem("quantum-achievements-unlocked");
    if (savedUnlocked) {
      try {
        setUnlockedAchievements(new Set(JSON.parse(savedUnlocked)));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const newUnlocked = new Set(unlockedAchievements);
    let justUnlocked: Achievement | null = null;

    for (const achievement of ACHIEVEMENTS) {
      if (
        !newUnlocked.has(achievement.id) &&
        achievement.checkUnlocked(stats)
      ) {
        newUnlocked.add(achievement.id);
        justUnlocked = achievement;
      }
    }

    if (newUnlocked.size > unlockedAchievements.size) {
      setUnlockedAchievements(newUnlocked);
      localStorage.setItem(
        "quantum-achievements-unlocked",
        JSON.stringify([...newUnlocked])
      );

      if (justUnlocked) {
        setNewlyUnlocked(justUnlocked);
      }
    }
  }, [stats]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const updated = {
          ...prev,
          timeSpentSeconds: prev.timeSpentSeconds + 1,
        };
        localStorage.setItem("quantum-user-stats", JSON.stringify(updated));
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateStats = (updates: Partial<UserStats>) => {
    setStats((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("quantum-user-stats", JSON.stringify(updated));
      return updated;
    });
  };

  const dismissNewAchievement = () => setNewlyUnlocked(null);

  return {
    stats,
    updateStats,
    unlockedAchievements,
    newlyUnlocked,
    dismissNewAchievement,
  };
}

export function AchievementNotification({
  achievement,
  onDismiss,
}: {
  achievement: Achievement;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const colors = CATEGORY_COLORS[achievement.category];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-slide-down">
      <div
        className={`${colors.light} border-2 ${colors.border} rounded-xl p-4 shadow-2xl flex items-center gap-4 min-w-[320px]`}
      >
        <div className={`${colors.bg} text-white p-3 rounded-xl`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Achievement Unlocked!
          </p>
          <p className={`font-bold ${colors.text}`}>{achievement.name}</p>
          <p className="text-sm text-gray-600">{achievement.description}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <IconX className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        @keyframes slide-down {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export function AchievementBadge({
  achievement,
  unlocked,
  size = "md",
}: {
  achievement: Achievement;
  unlocked: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const colors = CATEGORY_COLORS[achievement.category];
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  return (
    <div className={`relative group ${sizeClasses[size]}`}>
      <div
        className={`w-full h-full rounded-xl flex items-center justify-center transition-all ${
          unlocked
            ? `${colors.bg} text-white shadow-lg`
            : "bg-gray-200 text-gray-400"
        }`}
      >
        {unlocked ? achievement.icon : <IconLock className="w-6 h-6" />}
      </div>

      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap">
          <p className="font-bold">{achievement.name}</p>
          <p className="text-gray-300">
            {unlocked ? achievement.description : achievement.requirement}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AchievementsPanel({
  isOpen,
  onClose,
  unlockedAchievements,
  stats,
}: {
  isOpen: boolean;
  onClose: () => void;
  unlockedAchievements: Set<string>;
  stats: UserStats;
}) {
  if (!isOpen) return null;

  const categories = ["progress", "quiz", "engagement", "mastery"] as const;
  const unlockedCount = unlockedAchievements.size;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconTrophy className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Achievements</h2>
                <p className="text-amber-100">
                  {unlockedCount} of {totalCount} unlocked
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <IconX className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4">
            <div className="w-full bg-white/30 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {categories.map((category) => {
            const categoryAchievements = ACHIEVEMENTS.filter(
              (a) => a.category === category
            );
            const colors = CATEGORY_COLORS[category];

            return (
              <div key={category} className="mb-6">
                <h3
                  className={`text-sm font-bold uppercase tracking-wide ${colors.text} mb-3`}
                >
                  {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categoryAchievements.map((achievement) => {
                    const unlocked = unlockedAchievements.has(achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          unlocked
                            ? `${colors.light} ${colors.border}`
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              unlocked
                                ? `${colors.bg} text-white`
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {unlocked ? (
                              achievement.icon
                            ) : (
                              <IconLock className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-semibold text-sm truncate ${
                                unlocked ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {achievement.name}
                            </p>
                            <p
                              className={`text-xs truncate ${
                                unlocked ? "text-gray-600" : "text-gray-400"
                              }`}
                            >
                              {unlocked
                                ? achievement.description
                                : achievement.requirement}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats footer */}
        <div className="border-t bg-gray-50 p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-quantum-600">
                {stats.pagesVisited.length}
              </div>
              <div className="text-xs text-gray-500">Pages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {stats.quizzesCompleted.length}
              </div>
              <div className="text-xs text-gray-500">Quizzes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.maxStreak}
              </div>
              <div className="text-xs text-gray-500">Best Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalAttempts > 0
                  ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100)
                  : 0}
                %
              </div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
