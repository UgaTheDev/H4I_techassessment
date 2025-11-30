import { useState, useEffect, useRef } from "react";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconClock,
  IconCheck,
} from "@tabler/icons-react";

interface ReadingProgressProps {
  pageId: string;
  estimatedMinutes?: number;
}

interface Bookmark {
  pageId: string;
  scrollPosition: number;
  timestamp: string;
  title: string;
}

export function ReadingProgressBar({
  pageId,
  estimatedMinutes = 10,
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(estimatedMinutes);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const startTime = useRef(Date.now());
  const lastScrollPosition = useRef(0);

  // Calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;

      if (documentHeight > 0) {
        const newProgress = Math.min((scrollTop / documentHeight) * 100, 100);
        setProgress(newProgress);
        lastScrollPosition.current = scrollTop;

        // Estimate time remaining based on progress and reading speed
        const remainingPercent = (100 - newProgress) / 100;
        const elapsed = (Date.now() - startTime.current) / 1000 / 60; // minutes

        if (newProgress > 5 && elapsed > 0.1) {
          const readingSpeed = newProgress / elapsed; // percent per minute
          const remaining = (remainingPercent * 100) / readingSpeed;
          setTimeRemaining(Math.max(0, Math.round(remaining)));
        } else {
          setTimeRemaining(Math.round(estimatedMinutes * remainingPercent));
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [estimatedMinutes]);

  // Check for existing bookmark
  useEffect(() => {
    const bookmarks: Bookmark[] = JSON.parse(
      localStorage.getItem("quantum-bookmarks") || "[]"
    );
    const existing = bookmarks.find((b) => b.pageId === pageId);
    setIsBookmarked(!!existing);

    // If there's a bookmark, offer to restore position
    if (existing && existing.scrollPosition > 100) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }
  }, [pageId]);

  const handleBookmark = () => {
    const bookmarks: Bookmark[] = JSON.parse(
      localStorage.getItem("quantum-bookmarks") || "[]"
    );

    if (isBookmarked) {
      // Remove bookmark
      const filtered = bookmarks.filter((b) => b.pageId !== pageId);
      localStorage.setItem("quantum-bookmarks", JSON.stringify(filtered));
      setIsBookmarked(false);
    } else {
      // Add bookmark
      const newBookmark: Bookmark = {
        pageId,
        scrollPosition: window.scrollY,
        timestamp: new Date().toISOString(),
        title: document.title,
      };
      const filtered = bookmarks.filter((b) => b.pageId !== pageId);
      localStorage.setItem(
        "quantum-bookmarks",
        JSON.stringify([...filtered, newBookmark])
      );
      setIsBookmarked(true);
    }
  };

  const handleRestorePosition = () => {
    const bookmarks: Bookmark[] = JSON.parse(
      localStorage.getItem("quantum-bookmarks") || "[]"
    );
    const bookmark = bookmarks.find((b) => b.pageId === pageId);
    if (bookmark) {
      window.scrollTo({ top: bookmark.scrollPosition, behavior: "smooth" });
    }
    setShowTooltip(false);
  };

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-quantum-500 to-entangled-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Side progress indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-4">
        {/* Vertical progress bar */}
        <div className="w-1 h-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="w-full bg-gradient-to-b from-quantum-500 to-entangled-500 transition-all duration-150 origin-top"
            style={{ height: `${progress}%` }}
          />
        </div>

        {/* Progress percentage */}
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {Math.round(progress)}%
        </div>

        {/* Time remaining */}
        {timeRemaining > 0 && progress < 95 && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <IconClock className="w-3 h-3" />
            <span>{timeRemaining}m</span>
          </div>
        )}

        {/* Completion indicator */}
        {progress >= 95 && (
          <div className="flex items-center gap-1 text-xs text-green-500">
            <IconCheck className="w-4 h-4" />
          </div>
        )}

        {/* Bookmark button */}
        <button
          onClick={handleBookmark}
          className={`p-2 rounded-lg transition-all ${
            isBookmarked
              ? "bg-quantum-100 dark:bg-quantum-900 text-quantum-600"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-quantum-600"
          }`}
          title={isBookmarked ? "Remove bookmark" : "Bookmark this position"}
        >
          {isBookmarked ? (
            <IconBookmarkFilled className="w-4 h-4" />
          ) : (
            <IconBookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Restore bookmark tooltip */}
      {showTooltip && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-xs">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              📖 You have a bookmark on this page. Continue where you left off?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleRestorePosition}
                className="flex-1 px-3 py-2 bg-quantum-500 text-white rounded-lg text-sm font-medium hover:bg-quantum-600 transition-colors"
              >
                Continue
              </button>
              <button
                onClick={() => setShowTooltip(false)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

// Mobile-friendly floating progress button
export function ReadingProgressFloating({ pageId }: { pageId: string }) {
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;

      if (documentHeight > 0) {
        setProgress(Math.min((scrollTop / documentHeight) * 100, 100));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const bookmarks = JSON.parse(
      localStorage.getItem("quantum-bookmarks") || "[]"
    );
    setIsBookmarked(bookmarks.some((b: Bookmark) => b.pageId === pageId));
  }, [pageId]);

  const handleBookmark = () => {
    const bookmarks: Bookmark[] = JSON.parse(
      localStorage.getItem("quantum-bookmarks") || "[]"
    );

    if (isBookmarked) {
      const filtered = bookmarks.filter((b) => b.pageId !== pageId);
      localStorage.setItem("quantum-bookmarks", JSON.stringify(filtered));
      setIsBookmarked(false);
    } else {
      const newBookmark: Bookmark = {
        pageId,
        scrollPosition: window.scrollY,
        timestamp: new Date().toISOString(),
        title: document.title,
      };
      const filtered = bookmarks.filter((b) => b.pageId !== pageId);
      localStorage.setItem(
        "quantum-bookmarks",
        JSON.stringify([...filtered, newBookmark])
      );
      setIsBookmarked(true);
    }
    setIsExpanded(false);
  };

  // Only show on mobile/tablet (xl:hidden)
  return (
    <div className="fixed bottom-20 right-6 z-40 xl:hidden">
      {isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[160px]">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {Math.round(progress)}% complete
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
            <div
              className="bg-gradient-to-r from-quantum-500 to-entangled-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            onClick={handleBookmark}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {isBookmarked ? (
              <>
                <IconBookmarkFilled className="w-4 h-4 text-quantum-500" />
                Bookmarked
              </>
            ) : (
              <>
                <IconBookmark className="w-4 h-4" />
                Bookmark
              </>
            )}
          </button>
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center"
      >
        {/* Circular progress */}
        <svg className="absolute inset-0 w-12 h-12 -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
            className="dark:stroke-gray-700"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeDasharray={`${progress * 1.26} 126`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
        </svg>

        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
          {Math.round(progress)}%
        </span>
      </button>
    </div>
  );
}

// Bookmarks list component
export function BookmarksList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const loadBookmarks = () => {
      const saved = localStorage.getItem("quantum-bookmarks");
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    };

    loadBookmarks();
    window.addEventListener("storage", loadBookmarks);
    return () => window.removeEventListener("storage", loadBookmarks);
  }, []);

  if (bookmarks.length === 0) return null;

  return (
    <div className="glass-card rounded-xl p-4 mb-6 border-2 border-quantum-200">
      <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
        <IconBookmarkFilled className="w-5 h-5 text-quantum-500" />
        Your Bookmarks
      </h4>
      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <a
            key={bookmark.pageId}
            href={`/${bookmark.pageId}`}
            className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <p className="font-medium text-sm text-gray-900 dark:text-white">
              {bookmark.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Saved {new Date(bookmark.timestamp).toLocaleDateString()}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default ReadingProgressBar;
