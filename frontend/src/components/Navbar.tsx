import { Link, useLocation } from "react-router-dom";
import { IconAtom, IconMenu2, IconX, IconCheck } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { SearchBar } from "./SearchBar";

interface LearningProgress {
  pagesVisited: string[];
  quizzesCompleted: string[];
  quizScores: Record<string, number>;
}

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [progress, setProgress] = useState<LearningProgress>({
    pagesVisited: [],
    quizzesCompleted: [],
    quizScores: {},
  });
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { to: "/", label: "Home", id: "home", shortLabel: "Home" },
    {
      to: "/what-is-entanglement",
      label: "What is Entanglement?",
      id: "what-is-entanglement",
      shortLabel: "Basics",
    },
    {
      to: "/epr-paradox",
      label: "EPR Paradox",
      id: "epr-paradox",
      shortLabel: "EPR",
    },
    {
      to: "/bells-theorem",
      label: "Bell's Theorem",
      id: "bells-theorem",
      shortLabel: "Bell's",
    },
    {
      to: "/famous-experiments",
      label: "Famous Experiments",
      id: "famous-experiments",
      shortLabel: "Experiments",
    },
    {
      to: "/applications",
      label: "Applications",
      id: "applications",
      shortLabel: "Apps",
    },
  ];

  // Load progress from localStorage
  useEffect(() => {
    const loadProgress = () => {
      const saved = localStorage.getItem("quantum-learning-progress");
      if (saved) {
        try {
          setProgress(JSON.parse(saved));
        } catch (e) {
          // Ignore parse errors
        }
      }
    };

    loadProgress();

    // Listen for storage changes (when other components update progress)
    window.addEventListener("storage", loadProgress);

    // Also listen for custom progress events
    const handleProgressUpdate = () => loadProgress();
    window.addEventListener("progressUpdate", handleProgressUpdate);

    return () => {
      window.removeEventListener("storage", loadProgress);
      window.removeEventListener("progressUpdate", handleProgressUpdate);
    };
  }, []);

  // Track scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  const isVisited = (id: string) => progress.pagesVisited.includes(id);

  const visitedCount = links.filter((l) => isVisited(l.id)).length;
  const progressPercent = Math.round((visitedCount / links.length) * 100);

  return (
    <nav
      className={`glass-card sticky top-0 z-50 border-b transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <IconAtom className="h-8 w-8 text-quantum-600 group-hover:rotate-180 transition-transform duration-500" />
              {/* Progress ring around logo */}
              {progressPercent > 0 && progressPercent < 100 && (
                <svg className="absolute -inset-1 w-10 h-10 -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeDasharray={`${progressPercent * 1.13} 113`}
                    className="transition-all duration-500"
                  />
                </svg>
              )}
              {/* Checkmark when complete */}
              {progressPercent === 100 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <IconCheck className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <span className="font-display font-bold text-xl text-gradient hidden sm:inline">
              Spooky Action at a Distance
            </span>
            <span className="font-display font-bold text-xl text-gradient sm:hidden">
              SAaaD
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 rounded-lg font-medium transition-all text-sm group ${
                  isActive(link.to)
                    ? "bg-gradient-to-r from-quantum-500 to-entangled-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-quantum-100"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {link.label}
                  {/* Visited indicator */}
                  {isVisited(link.id) && !isActive(link.to) && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-green-500"
                      title="Visited"
                    />
                  )}
                </span>

                {/* Hover tooltip showing progress */}
                {!isActive(link.to) && (
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {isVisited(link.id) ? "✓ Completed" : "Not visited"}
                  </span>
                )}
              </Link>
            ))}
            <div className="ml-2 pl-2 border-l border-gray-200">
              <SearchBar />
            </div>
          </div>

          {/* Mobile: Progress + Menu */}
          <div className="flex items-center space-x-3 lg:hidden">
            {/* Mini progress indicator */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="font-medium text-quantum-600">
                {visitedCount}/{links.length}
              </span>
            </div>

            <SearchBar />

            <button
              className="p-2 rounded-lg hover:bg-quantum-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <IconX className="h-6 w-6" />
              ) : (
                <IconMenu2 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          }`}
        >
          {/* Progress bar */}
          <div className="mb-3 pt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Learning Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-quantum-500 to-entangled-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Navigation links */}
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(link.to)
                    ? "bg-gradient-to-r from-quantum-500 to-entangled-500 text-white"
                    : "text-gray-700 hover:bg-quantum-100"
                }`}
              >
                <span>{link.label}</span>
                {isVisited(link.id) && !isActive(link.to) && (
                  <IconCheck className="w-4 h-4 text-green-500" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
