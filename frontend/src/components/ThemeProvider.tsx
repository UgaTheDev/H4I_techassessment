import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("quantum-theme") as Theme | null;
    if (saved) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      let resolved: "light" | "dark";

      if (theme === "system") {
        resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      } else {
        resolved = theme;
      }

      setResolvedTheme(resolved);

      if (resolved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme();
    };
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("quantum-theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
    >
      {resolvedTheme === "light" ? (
        <IconMoon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      ) : (
        <IconSun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
}

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const options: { value: Theme; label: string; icon: ReactNode }[] = [
    { value: "light", label: "Light", icon: <IconSun className="w-4 h-4" /> },
    { value: "dark", label: "Dark", icon: <IconMoon className="w-4 h-4" /> },
    {
      value: "system",
      label: "System",
      icon: <IconDeviceDesktop className="w-4 h-4" />,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
      >
        {options.find((o) => o.value === theme)?.icon}
        <span className="text-gray-700 dark:text-gray-300">
          {options.find((o) => o.value === theme)?.label}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  theme === option.value
                    ? "bg-quantum-100 dark:bg-quantum-900 text-quantum-700 dark:text-quantum-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export const darkModeStyles = `
  /* Base dark mode styles */
  .dark {
    --color-background: #0a0a1a;
    --color-surface: #111827;
    --color-surface-elevated: #1f2937;
    --color-text-primary: #f9fafb;
    --color-text-secondary: #9ca3af;
    --color-border: #374151;
  }

  /* Apply to common elements */
  .dark body {
    background-color: var(--color-background);
    color: var(--color-text-primary);
  }

  .dark .glass-card {
    background: rgba(17, 24, 39, 0.8);
    border-color: var(--color-border);
  }

  /* Override specific component styles */
  .dark .bg-white {
    background-color: var(--color-surface);
  }

  .dark .bg-gray-50 {
    background-color: var(--color-surface);
  }

  .dark .text-gray-900 {
    color: var(--color-text-primary);
  }

  .dark .text-gray-700 {
    color: var(--color-text-secondary);
  }

  .dark .text-gray-600 {
    color: #9ca3af;
  }

  .dark .border-gray-200 {
    border-color: var(--color-border);
  }

  /* Stars background for dark mode */
  .dark .min-h-screen {
    background: 
      radial-gradient(ellipse at top, #1a1a3e 0%, transparent 50%),
      radial-gradient(ellipse at bottom, #0a0a1a 0%, #0a0a1a 100%);
  }

  /* Quantum gradient adjustments for dark mode */
  .dark .quantum-gradient {
    background: linear-gradient(135deg, #0891b2 0%, #a855f7 100%);
  }

  .dark .text-gradient {
    background: linear-gradient(135deg, #22d3ee 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Form inputs in dark mode */
  .dark input,
  .dark textarea,
  .dark select {
    background-color: var(--color-surface);
    border-color: var(--color-border);
    color: var(--color-text-primary);
  }

  .dark input:focus,
  .dark textarea:focus {
    border-color: #06b6d4;
  }

  /* Code blocks */
  .dark pre,
  .dark code {
    background-color: #1e1e2e;
  }

  /* Scrollbar */
  .dark ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .dark ::-webkit-scrollbar-track {
    background: var(--color-surface);
  }

  .dark ::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 4px;
  }

  .dark ::-webkit-scrollbar-thumb:hover {
    background: #4b5563;
  }

  /* Smooth transition when switching themes */
  html {
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  html.dark {
    color-scheme: dark;
  }
`;
