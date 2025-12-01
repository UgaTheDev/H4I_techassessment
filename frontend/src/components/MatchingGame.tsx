import { useState, useEffect } from "react";
import { IconCheck, IconX, IconRefresh, IconTrophy } from "@tabler/icons-react";

interface MatchItem {
  id: string;
  term: string;
  definition: string;
}

interface MatchingGameProps {
  items: MatchItem[];
  title?: string;
  onComplete?: (score: number) => void;
}

export function MatchingGame({
  items,
  title = "Match the Terms",
  onComplete,
}: MatchingGameProps) {
  const [shuffledDefinitions, setShuffledDefinitions] = useState<MatchItem[]>(
    []
  );
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    shuffleDefinitions();
  }, [items]);

  const shuffleDefinitions = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setShuffledDefinitions(shuffled);
    setMatches({});
    setResults({});
    setSelectedTerm(null);
    setIsComplete(false);
    setAttempts(0);
  };

  const handleTermClick = (termId: string) => {
    if (results[termId] === true) return;
    setSelectedTerm(selectedTerm === termId ? null : termId);
  };

  const handleDefinitionClick = (defId: string) => {
    if (!selectedTerm) return;
    if (
      Object.values(matches).includes(defId) &&
      matches[selectedTerm] !== defId
    ) {
      return;
    }

    setAttempts((prev) => prev + 1);

    const newMatches = { ...matches, [selectedTerm]: defId };
    setMatches(newMatches);

    const isCorrect = selectedTerm === defId;
    setResults((prev) => ({ ...prev, [selectedTerm]: isCorrect }));
    setSelectedTerm(null);

    const allMatched = Object.keys(newMatches).length === items.length;
    if (allMatched) {
      const correctCount = Object.values({
        ...results,
        [selectedTerm!]: isCorrect,
      }).filter(Boolean).length;
      setIsComplete(true);

      window.dispatchEvent(
        new CustomEvent("quizComplete", {
          detail: {
            quizId: `matching-${title.toLowerCase().replace(/\s+/g, "-")}`,
            score: Math.round((correctCount / items.length) * 100),
            correct: correctCount === items.length,
          },
        })
      );

      onComplete?.(correctCount);
    }
  };

  const getTermStyle = (termId: string) => {
    if (results[termId] === true)
      return "bg-green-100 border-green-500 text-green-800";
    if (results[termId] === false)
      return "bg-red-100 border-red-500 text-red-800";
    if (selectedTerm === termId)
      return "bg-quantum-100 border-quantum-500 text-quantum-800 ring-2 ring-quantum-300";
    return "bg-white border-gray-200 hover:border-quantum-300 hover:bg-quantum-50 cursor-pointer";
  };

  const getDefStyle = (defId: string) => {
    const matchedTermId = Object.keys(matches).find(
      (k) => matches[k] === defId
    );
    if (matchedTermId && results[matchedTermId] === true)
      return "bg-green-100 border-green-500";
    if (matchedTermId && results[matchedTermId] === false)
      return "bg-red-100 border-red-500";
    if (Object.values(matches).includes(defId))
      return "bg-gray-100 border-gray-300 opacity-60";
    if (selectedTerm)
      return "bg-white border-gray-200 hover:border-entangled-300 hover:bg-entangled-50 cursor-pointer";
    return "bg-white border-gray-200";
  };

  const correctCount = Object.values(results).filter(Boolean).length;
  const score =
    items.length > 0 ? Math.round((correctCount / items.length) * 100) : 0;

  return (
    <div className="glass-card rounded-xl p-6 mb-8 border-2 border-entangled-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-gray-900 flex items-center gap-2">
            🎯 {title}
          </h3>
          <p className="text-sm text-gray-500">
            Click a term, then click its matching definition
          </p>
        </div>
        <button
          onClick={shuffleDefinitions}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          title="Restart"
        >
          <IconRefresh className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">
              {Object.keys(matches).length}/{items.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-entangled-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(Object.keys(matches).length / items.length) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="text-center px-3 border-l border-gray-200">
          <div className="text-lg font-bold text-green-600">{correctCount}</div>
          <div className="text-xs text-gray-500">Correct</div>
        </div>
      </div>

      {/* Game area */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Terms */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-quantum-500 text-white flex items-center justify-center text-xs">
              A
            </span>
            Terms
          </h4>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleTermClick(item.id)}
                className={`p-3 rounded-lg border-2 transition-all ${getTermStyle(
                  item.id
                )} ${results[item.id] !== undefined ? "" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.term}</span>
                  {results[item.id] === true && (
                    <IconCheck className="h-5 w-5 text-green-600" />
                  )}
                  {results[item.id] === false && (
                    <IconX className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-entangled-500 text-white flex items-center justify-center text-xs">
              B
            </span>
            Definitions
          </h4>
          <div className="space-y-2">
            {shuffledDefinitions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleDefinitionClick(item.id)}
                className={`p-3 rounded-lg border-2 transition-all ${getDefStyle(
                  item.id
                )}`}
              >
                <span className="text-sm text-gray-700">{item.definition}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Completion message */}
      {isComplete && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            score === 100
              ? "bg-green-50 border border-green-200"
              : "bg-amber-50 border border-amber-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {score === 100 ? (
              <IconTrophy className="h-8 w-8 text-yellow-500" />
            ) : (
              <span className="text-3xl">📊</span>
            )}
            <div>
              <h4 className="font-semibold text-gray-900">
                {score === 100 ? "Perfect Score!" : "Game Complete!"}
              </h4>
              <p className="text-sm text-gray-600">
                You got {correctCount} out of {items.length} correct ({score}%)
                in {attempts} attempts.
              </p>
            </div>
          </div>
          <button
            onClick={shuffleDefinitions}
            className="mt-3 px-4 py-2 bg-entangled-500 text-white rounded-lg hover:bg-entangled-600 transition-colors text-sm font-medium"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// Pre-made matching sets
export const ENTANGLEMENT_MATCHES: MatchItem[] = [
  {
    id: "superposition",
    term: "Superposition",
    definition:
      "A quantum state where a particle exists in multiple states simultaneously",
  },
  {
    id: "entanglement",
    term: "Entanglement",
    definition:
      "A connection where measuring one particle instantly determines the other's state",
  },
  {
    id: "bell-state",
    term: "Bell State",
    definition: "A maximally entangled state of two qubits",
  },
  {
    id: "locality",
    term: "Locality",
    definition:
      "The principle that objects are only affected by their immediate surroundings",
  },
  {
    id: "hidden-variables",
    term: "Hidden Variables",
    definition:
      "Hypothetical properties that would predetermine measurement outcomes",
  },
];

export const SCIENTIST_MATCHES: MatchItem[] = [
  {
    id: "einstein",
    term: "Albert Einstein",
    definition: 'Called entanglement "spooky action at a distance"',
  },
  {
    id: "bohr",
    term: "Niels Bohr",
    definition: "Defended the Copenhagen interpretation against EPR",
  },
  {
    id: "bell",
    term: "John Bell",
    definition: "Created theorem to experimentally test hidden variables",
  },
  {
    id: "aspect",
    term: "Alain Aspect",
    definition: "Closed the locality loophole with fast-switching polarizers",
  },
  {
    id: "schrodinger",
    term: "Erwin Schrödinger",
    definition: 'Coined the term "entanglement" (Verschränkung)',
  },
];

export const APPLICATIONS_MATCHES: MatchItem[] = [
  {
    id: "qkd",
    term: "Quantum Key Distribution",
    definition:
      "Secure communication where eavesdropping is physically detectable",
  },
  {
    id: "teleportation",
    term: "Quantum Teleportation",
    definition:
      "Transferring quantum state using entanglement and classical bits",
  },
  {
    id: "supremacy",
    term: "Quantum Supremacy",
    definition: "Performing a calculation impossible for classical computers",
  },
  {
    id: "qubit",
    term: "Qubit",
    definition: "Quantum bit that can be in superposition of 0 and 1",
  },
  {
    id: "hadamard",
    term: "Hadamard Gate",
    definition: "Quantum gate that creates superposition from a basis state",
  },
];
