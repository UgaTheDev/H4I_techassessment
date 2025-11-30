import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IconSearch, IconX } from "@tabler/icons-react";

interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
  section: string;
}

const searchableContent: SearchResult[] = [
  {
    title: "What is Quantum Entanglement?",
    path: "/what-is-entanglement",
    excerpt:
      "When two particles become entangled, measuring a property of one particle instantly determines the corresponding property of the other particle",
    section: "Basics",
  },
  {
    title: "Einstein-Bohr Debate",
    path: "/what-is-entanglement",
    excerpt:
      'Einstein called it "spooky action at a distance" and believed there must be hidden variables',
    section: "History",
  },
  {
    title: "Bell's Theorem",
    path: "/bells-theorem",
    excerpt:
      "Bell showed that if hidden variables exist, correlations must satisfy an inequality. Quantum mechanics violates this",
    section: "Theory",
  },
  {
    title: "Bell Inequality Violation",
    path: "/bells-theorem",
    excerpt:
      "Maximum quantum correlation of 2√2 exceeds the classical limit of 2",
    section: "Mathematics",
  },
  {
    title: "Quantum Cryptography",
    path: "/applications",
    excerpt:
      "QKD provides theoretically unbreakable security - any eavesdropping disturbs the quantum states",
    section: "Applications",
  },
  {
    title: "Quantum Computing",
    path: "/applications",
    excerpt:
      "Entangled qubits can represent 2^n states simultaneously, enabling exponential speedup",
    section: "Applications",
  },
  {
    title: "Quantum Teleportation",
    path: "/applications",
    excerpt:
      "Transfer quantum state information without the particle traveling through space",
    section: "Applications",
  },
  {
    title: "Superposition",
    path: "/what-is-entanglement",
    excerpt: "Particles exist in multiple states simultaneously until measured",
    section: "Concepts",
  },
];

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = searchableContent.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.excerpt.toLowerCase().includes(searchQuery) ||
        item.section.toLowerCase().includes(searchQuery)
    );

    setResults(filtered);
  }, [query]);

  const handleResultClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-quantum-100 transition-colors"
        aria-label="Search"
      >
        <IconSearch className="h-5 w-5 text-gray-700" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 glass-card rounded-xl shadow-2xl border-2 border-quantum-200 p-4 z-50">
          <div className="flex items-center space-x-2 mb-3">
            <IconSearch className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search quantum concepts..."
              className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400"
              autoFocus
            />
            <button
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <IconX className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {query.trim().length >= 2 && (
            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleResultClick(result.path)}
                      className="w-full text-left p-3 rounded-lg hover:bg-quantum-50 transition-colors border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-800">
                          {result.title}
                        </span>
                        <span className="text-xs text-quantum-600 font-medium">
                          {result.section}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {result.excerpt}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No results found for "{query}"
                </p>
              )}
            </div>
          )}

          {query.trim().length < 2 && (
            <p className="text-xs text-gray-500 text-center py-2">
              Type at least 2 characters to search
            </p>
          )}
        </div>
      )}
    </div>
  );
}
