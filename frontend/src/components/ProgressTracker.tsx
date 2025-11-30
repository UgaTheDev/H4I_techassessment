import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IconCheck, IconCircle } from "@tabler/icons-react";

interface PageProgress {
  path: string;
  title: string;
  visited: boolean;
  lastVisited?: Date;
}

export function ProgressTracker() {
  const location = useLocation();
  const [progress, setProgress] = useState<PageProgress[]>([
    { path: "/", title: "Home", visited: false },
    {
      path: "/what-is-entanglement",
      title: "What is Entanglement?",
      visited: false,
    },
    { path: "/epr-paradox", title: "EPR Paradox", visited: false },
    { path: "/bells-theorem", title: "Bell's Theorem", visited: false },
    {
      path: "/famous-experiments",
      title: "Famous Experiments",
      visited: false,
    },
    { path: "/applications", title: "Applications", visited: false },
  ]);

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem("pageProgress");
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    // Mark current page as visited
    const updatedProgress = progress.map((page) => {
      if (page.path === location.pathname) {
        return { ...page, visited: true, lastVisited: new Date() };
      }
      return page;
    });

    setProgress(updatedProgress);
    localStorage.setItem("pageProgress", JSON.stringify(updatedProgress));
  }, [location.pathname]);

  const visitedCount = progress.filter((p) => p.visited).length;
  const totalPages = progress.length;
  const progressPercentage = (visitedCount / totalPages) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="glass-card rounded-xl p-4 shadow-2xl border-2 border-quantum-300 w-64">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-gray-800">Your Progress</h3>
          <span className="text-xs font-semibold text-quantum-600">
            {visitedCount}/{totalPages}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="quantum-gradient h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {progress.map((page) => (
            <div
              key={page.path}
              className="flex items-center space-x-2 text-xs"
            >
              {page.visited ? (
                <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <IconCircle className="h-4 w-4 text-gray-300 flex-shrink-0" />
              )}
              <span
                className={page.visited ? "text-gray-700" : "text-gray-400"}
              >
                {page.title}
              </span>
            </div>
          ))}
        </div>

        {visitedCount === totalPages && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-semibold text-green-600 text-center">
              🎉 All pages completed!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
