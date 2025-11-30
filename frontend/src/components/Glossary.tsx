import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  IconBook,
  IconX,
  IconPlus,
  IconSearch,
  IconVolume,
} from "@tabler/icons-react";

export interface GlossaryTerm {
  id: string;
  term: string;
  shortDefinition: string;
  fullDefinition: string;
  relatedTerms: string[];
  category: "basics" | "math" | "experiments" | "applications" | "history";
  pronunciation?: string;
  example?: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "entanglement",
    term: "Quantum Entanglement",
    shortDefinition:
      "A connection between particles where measuring one instantly affects the other",
    fullDefinition:
      "Quantum entanglement is a phenomenon where two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently. When you measure a property of one entangled particle, you instantly know the corresponding property of its partner, regardless of the distance between them.",
    relatedTerms: ["superposition", "bell-state", "non-locality"],
    category: "basics",
    example:
      'If two entangled electrons have opposite spins, measuring one as "spin up" instantly means the other is "spin down".',
  },
  {
    id: "superposition",
    term: "Superposition",
    shortDefinition:
      "A quantum state where a particle exists in multiple states simultaneously",
    fullDefinition:
      "Superposition is the ability of a quantum system to exist in multiple states at the same time until it is measured. A qubit in superposition is not in state 0 OR state 1, but rather in both states simultaneously with certain probabilities.",
    relatedTerms: ["entanglement", "measurement", "wavefunction"],
    category: "basics",
    pronunciation: "soo-per-puh-ZI-shun",
    example:
      "Schrödinger's cat is in a superposition of alive and dead until the box is opened.",
  },
  {
    id: "bell-state",
    term: "Bell State",
    shortDefinition: "A maximally entangled quantum state of two qubits",
    fullDefinition:
      "Bell states are specific quantum states of two qubits that represent maximal entanglement. There are four Bell states, often written as |Φ+⟩, |Φ-⟩, |Ψ+⟩, and |Ψ-⟩. They are the fundamental building blocks for quantum communication protocols.",
    relatedTerms: ["entanglement", "qubit", "bell-theorem"],
    category: "math",
    example:
      "|Φ+⟩ = (|00⟩ + |11⟩)/√2 means both qubits are always measured in the same state.",
  },
  {
    id: "qubit",
    term: "Qubit",
    shortDefinition: "Quantum bit - the basic unit of quantum information",
    fullDefinition:
      "A qubit (quantum bit) is the quantum analog of a classical bit. While a classical bit can only be 0 or 1, a qubit can exist in a superposition of both states. Multiple entangled qubits can represent exponentially more information than classical bits.",
    relatedTerms: ["superposition", "entanglement", "quantum-computing"],
    category: "basics",
    pronunciation: "KYOO-bit",
  },
  {
    id: "bell-theorem",
    term: "Bell's Theorem",
    shortDefinition:
      "Mathematical proof that quantum mechanics cannot be explained by local hidden variables",
    fullDefinition:
      'Bell\'s theorem, formulated by John Bell in 1964, shows that no theory based on local hidden variables can reproduce all the predictions of quantum mechanics. It provides a way to experimentally test whether quantum entanglement is "real" or could be explained by classical physics.',
    relatedTerms: ["bell-inequality", "hidden-variables", "locality"],
    category: "math",
  },
  {
    id: "bell-inequality",
    term: "Bell Inequality",
    shortDefinition:
      "A mathematical limit that hidden variable theories cannot exceed",
    fullDefinition:
      "Bell inequalities are constraints that any local hidden variable theory must satisfy. The most famous is the CHSH inequality: S ≤ 2. Quantum mechanics predicts violations up to 2√2 ≈ 2.83, and experiments consistently show these violations.",
    relatedTerms: ["bell-theorem", "chsh", "aspect-experiment"],
    category: "math",
  },
  {
    id: "hidden-variables",
    term: "Hidden Variables",
    shortDefinition:
      "Hypothetical properties that would predetermine quantum measurement outcomes",
    fullDefinition:
      "Hidden variable theories propose that quantum particles have definite properties we simply cannot see, and that quantum randomness is just a result of our ignorance. Einstein favored this view. Bell's theorem and experiments have ruled out local hidden variables.",
    relatedTerms: ["bell-theorem", "epr-paradox", "locality"],
    category: "history",
  },
  {
    id: "locality",
    term: "Locality",
    shortDefinition:
      "The principle that objects are only influenced by their immediate surroundings",
    fullDefinition:
      "Locality is the idea that an object can only be influenced by things in its immediate vicinity, and that any influence must travel at or below the speed of light. Quantum entanglement appears to violate locality, though it cannot be used for faster-than-light communication.",
    relatedTerms: ["non-locality", "epr-paradox", "hidden-variables"],
    category: "basics",
  },
  {
    id: "non-locality",
    term: "Non-locality",
    shortDefinition:
      "Correlations that occur instantaneously across any distance",
    fullDefinition:
      'Quantum non-locality refers to correlations between entangled particles that cannot be explained by any local mechanism. When Alice measures her particle, Bob\'s particle is instantly correlated, regardless of distance. This is "spooky action at a distance."',
    relatedTerms: ["locality", "entanglement", "epr-paradox"],
    category: "basics",
  },
  {
    id: "epr-paradox",
    term: "EPR Paradox",
    shortDefinition:
      "Einstein's thought experiment challenging quantum mechanics",
    fullDefinition:
      'The Einstein-Podolsky-Rosen paradox (1935) argued that quantum mechanics must be incomplete because it predicts "spooky action at a distance." EPR believed hidden variables must exist. Bell\'s theorem later showed how to test this, and experiments sided with quantum mechanics.',
    relatedTerms: ["hidden-variables", "bell-theorem", "entanglement"],
    category: "history",
  },
  {
    id: "aspect-experiment",
    term: "Aspect Experiment",
    shortDefinition:
      "The 1982 experiment that convincingly violated Bell's inequality",
    fullDefinition:
      "Alain Aspect's experiments in 1981-1982 used fast-switching polarizers to close the locality loophole. The polarizer settings were changed while photons were in flight, ensuring no signal could coordinate the results. Bell's inequality was violated, supporting quantum mechanics.",
    relatedTerms: ["bell-inequality", "bell-theorem", "loophole"],
    category: "experiments",
  },
  {
    id: "qkd",
    term: "Quantum Key Distribution",
    shortDefinition: "Unhackable communication using quantum mechanics",
    fullDefinition:
      "QKD uses entangled photons to create shared secret keys between two parties. Any eavesdropping attempt disturbs the quantum states and is detectable. Unlike classical encryption, QKD security is guaranteed by the laws of physics, not computational difficulty.",
    relatedTerms: ["entanglement", "cryptography", "bb84"],
    category: "applications",
  },
  {
    id: "quantum-teleportation",
    term: "Quantum Teleportation",
    shortDefinition: "Transferring quantum states using entanglement",
    fullDefinition:
      "Quantum teleportation transfers the exact quantum state of a particle to another particle at a different location. It requires pre-shared entanglement and classical communication. The original state is destroyed (no cloning), and no faster-than-light communication is possible.",
    relatedTerms: ["entanglement", "bell-state", "no-cloning"],
    category: "applications",
  },
  {
    id: "quantum-computing",
    term: "Quantum Computing",
    shortDefinition: "Computing using quantum mechanical phenomena",
    fullDefinition:
      "Quantum computers use qubits, superposition, and entanglement to perform calculations. For certain problems, they can be exponentially faster than classical computers. Applications include cryptography, drug discovery, optimization, and simulating quantum systems.",
    relatedTerms: ["qubit", "superposition", "entanglement"],
    category: "applications",
  },
  {
    id: "wavefunction",
    term: "Wavefunction",
    shortDefinition: "Mathematical description of a quantum system's state",
    fullDefinition:
      'The wavefunction (ψ) contains all information about a quantum system. Its square gives the probability of measurement outcomes. When measured, the wavefunction "collapses" to a definite state. The Schrödinger equation describes how wavefunctions evolve.',
    relatedTerms: ["superposition", "measurement", "schrodinger"],
    category: "math",
    pronunciation: "WAYV-funk-shun",
  },
  {
    id: "measurement",
    term: "Quantum Measurement",
    shortDefinition:
      'The act of observing a quantum system, causing it to "collapse"',
    fullDefinition:
      'In quantum mechanics, measurement is not passive observation. It causes the system to "collapse" from superposition into a definite state. The outcome is fundamentally random, governed by probabilities from the wavefunction. This is one of quantum mechanics\' most mysterious aspects.',
    relatedTerms: ["wavefunction", "superposition", "collapse"],
    category: "basics",
  },
];

// Context for glossary state
interface GlossaryContextType {
  isOpen: boolean;
  openGlossary: () => void;
  closeGlossary: () => void;
  selectedTerm: GlossaryTerm | null;
  setSelectedTerm: (term: GlossaryTerm | null) => void;
  savedTerms: Set<string>;
  toggleSavedTerm: (termId: string) => void;
}

const GlossaryContext = createContext<GlossaryContextType | undefined>(
  undefined
);

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [savedTerms, setSavedTerms] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem("quantum-saved-terms");
    if (saved) {
      setSavedTerms(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleSavedTerm = (termId: string) => {
    setSavedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(termId)) {
        next.delete(termId);
      } else {
        next.add(termId);
      }
      localStorage.setItem("quantum-saved-terms", JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <GlossaryContext.Provider
      value={{
        isOpen,
        openGlossary: () => setIsOpen(true),
        closeGlossary: () => setIsOpen(false),
        selectedTerm,
        setSelectedTerm,
        savedTerms,
        toggleSavedTerm,
      }}
    >
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  const context = useContext(GlossaryContext);
  if (!context) {
    throw new Error("useGlossary must be used within GlossaryProvider");
  }
  return context;
}

// Inline term with hover tooltip
export function GlossaryTerm({
  termId,
  children,
}: {
  termId: string;
  children?: ReactNode;
}) {
  const { setSelectedTerm, openGlossary } = useGlossary();
  const [showTooltip, setShowTooltip] = useState(false);

  const term = GLOSSARY_TERMS.find((t) => t.id === termId);
  if (!term) return <>{children}</>;

  const handleClick = () => {
    setSelectedTerm(term);
    openGlossary();
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={handleClick}
        className="text-quantum-600 dark:text-quantum-400 border-b border-dashed border-quantum-400 hover:border-solid cursor-help transition-all"
      >
        {children || term.term}
      </button>

      {/* Hover tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg p-3 shadow-xl max-w-xs">
            <p className="font-semibold mb-1">{term.term}</p>
            <p className="text-gray-300 text-xs">{term.shortDefinition}</p>
            <p className="text-quantum-400 text-xs mt-2">Click for more →</p>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900 dark:border-t-gray-800" />
        </div>
      )}
    </span>
  );
}

// Full glossary panel
export function GlossaryPanel({
  isOpen: controlledOpen,
  onClose,
}: { isOpen?: boolean; onClose?: () => void } = {}) {
  const glossaryContext = useGlossary();
  const { selectedTerm, setSelectedTerm, savedTerms, toggleSavedTerm } =
    glossaryContext;
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Use controlled state if provided, otherwise use context
  const isOpen =
    controlledOpen !== undefined ? controlledOpen : glossaryContext.isOpen;
  const closeGlossary = onClose || glossaryContext.closeGlossary;

  if (!isOpen) return null;

  const filteredTerms = GLOSSARY_TERMS.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || term.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "basics",
    "math",
    "experiments",
    "applications",
    "history",
  ];
  const categoryLabels: Record<string, string> = {
    basics: "📚 Basics",
    math: "📐 Math",
    experiments: "🔬 Experiments",
    applications: "💡 Applications",
    history: "📜 History",
  };

  return (
    <div className="fixed inset-0 z-[80] flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={closeGlossary} />

      {/* Panel - light theme consistent */}
      <div className="relative ml-auto w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-200">
        {/* Header - gradient like other panels */}
        <div className="bg-gradient-to-r from-quantum-500 to-cyan-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <IconBook className="w-7 h-7" />
              <h2 className="text-2xl font-bold">Glossary</h2>
            </div>
            <button
              onClick={closeGlossary}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                !categoryFilter
                  ? "bg-quantum-500 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:border-quantum-300"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setCategoryFilter(cat === categoryFilter ? null : cat)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? "bg-quantum-500 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:border-quantum-300"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Term list or detail view */}
        <div className="flex-1 overflow-y-auto bg-white">
          {selectedTerm ? (
            /* Detail view */
            <div className="p-4">
              <button
                onClick={() => setSelectedTerm(null)}
                className="text-quantum-600 text-sm mb-4 hover:underline"
              >
                ← Back to list
              </button>

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedTerm.term}
                  </h3>
                  {selectedTerm.pronunciation && (
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <IconVolume className="w-4 h-4" />
                      {selectedTerm.pronunciation}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleSavedTerm(selectedTerm.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    savedTerms.has(selectedTerm.id)
                      ? "bg-quantum-100 text-quantum-600"
                      : "bg-gray-100 text-gray-400 hover:text-quantum-600"
                  }`}
                  title={
                    savedTerms.has(selectedTerm.id)
                      ? "Remove from vocabulary"
                      : "Add to vocabulary"
                  }
                >
                  <IconPlus
                    className={`w-5 h-5 ${
                      savedTerms.has(selectedTerm.id) ? "rotate-45" : ""
                    } transition-transform`}
                  />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Definition
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedTerm.fullDefinition}
                  </p>
                </div>

                {selectedTerm.example && (
                  <div className="bg-quantum-50 p-4 rounded-lg border border-quantum-200">
                    <h4 className="text-sm font-semibold text-quantum-700 mb-1">
                      Example
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {selectedTerm.example}
                    </p>
                  </div>
                )}

                {selectedTerm.relatedTerms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Related Terms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.relatedTerms.map((relatedId) => {
                        const related = GLOSSARY_TERMS.find(
                          (t) => t.id === relatedId
                        );
                        if (!related) return null;
                        return (
                          <button
                            key={relatedId}
                            onClick={() => setSelectedTerm(related)}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-quantum-100 transition-colors"
                          >
                            {related.term}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* List view */
            <div className="divide-y divide-gray-100">
              {filteredTerms.map((term) => (
                <button
                  key={term.id}
                  onClick={() => setSelectedTerm(term)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {term.term}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {term.shortDefinition}
                      </p>
                    </div>
                    {savedTerms.has(term.id) && (
                      <span className="text-quantum-500 text-xs">★ Saved</span>
                    )}
                  </div>
                </button>
              ))}

              {filteredTerms.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No terms found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with saved terms count */}
        {savedTerms.size > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-quantum-600">
                {savedTerms.size}
              </span>{" "}
              terms in your vocabulary
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Floating glossary button
export function GlossaryButton() {
  const { openGlossary } = useGlossary();

  return (
    <button
      onClick={openGlossary}
      className="fixed bottom-6 left-24 z-50 bg-white dark:bg-gray-800 border-2 border-quantum-500 text-quantum-600 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
      title="Open Glossary"
    >
      <IconBook className="w-6 h-6" />
    </button>
  );
}
