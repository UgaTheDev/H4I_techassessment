import { useState, useEffect } from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconRefresh,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";

interface FlashCard {
  id: string;
  front: string;
  back: string;
  category: string;
}

interface FlashCardsProps {
  cards: FlashCard[];
  title?: string;
}

export function FlashCards({ cards, title = "Review Cards" }: FlashCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Load known cards from localStorage
    const stored = localStorage.getItem("quantum-flashcards-known");
    if (stored) {
      setKnownCards(new Set(JSON.parse(stored)));
    }
  }, []);

  const currentCard = cards[currentIndex];
  const isKnown = knownCards.has(currentCard.id);
  const knownCount = cards.filter((c) => knownCards.has(c.id)).length;
  const progressPercent = (knownCount / cards.length) * 100;

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
      setIsAnimating(false);
    }, 200);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
      setIsAnimating(false);
    }, 200);
  };

  const toggleKnown = () => {
    const newKnown = new Set(knownCards);
    if (isKnown) {
      newKnown.delete(currentCard.id);
    } else {
      newKnown.add(currentCard.id);
    }
    setKnownCards(newKnown);
    localStorage.setItem(
      "quantum-flashcards-known",
      JSON.stringify([...newKnown])
    );
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const newIndex = shuffled.findIndex((c) => c.id === currentCard.id);
    setCurrentIndex(newIndex >= 0 ? newIndex : 0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setKnownCards(new Set());
    localStorage.removeItem("quantum-flashcards-known");
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="glass-card rounded-xl p-6 mb-8 border-2 border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-gray-900 flex items-center gap-2">
            📚 {title}
          </h3>
          <p className="text-sm text-gray-500">
            Click to flip, arrow keys to navigate
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-amber-600 font-medium">
            {knownCount}/{cards.length} mastered
          </div>
          <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card */}
      <div
        className="relative h-64 mb-4 cursor-pointer perspective-1000"
        onClick={handleFlip}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") handleFlip();
          if (e.key === "ArrowRight") handleNext();
          if (e.key === "ArrowLeft") handlePrev();
        }}
        tabIndex={0}
        role="button"
        aria-label="Flash card - click to flip"
      >
        <div
          className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 flex flex-col justify-center items-center text-white shadow-xl backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs uppercase tracking-wider opacity-75 mb-2">
              {currentCard.category}
            </span>
            <p className="text-xl font-semibold text-center leading-relaxed">
              {currentCard.front}
            </p>
            <span className="absolute bottom-4 text-xs opacity-75">
              Click to reveal answer
            </span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 p-6 flex flex-col justify-center items-center text-white shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-lg text-center leading-relaxed">
              {currentCard.back}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Previous card"
        >
          <IconArrowLeft className="h-5 w-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleKnown}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isKnown
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {isKnown ? (
              <IconStarFilled className="h-4 w-4" />
            ) : (
              <IconStar className="h-4 w-4" />
            )}
            {isKnown ? "Mastered!" : "Mark as Known"}
          </button>

          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Next card"
        >
          <IconArrowRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Quick actions */}
      <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleShuffle}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <IconRefresh className="h-4 w-4" />
          Shuffle
        </button>
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1"
        >
          Reset Progress
        </button>
      </div>

      {/* CSS for 3D flip */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}

// Pre-made card sets for each topic
export const ENTANGLEMENT_CARDS: FlashCard[] = [
  {
    id: "e1",
    front: "What is quantum entanglement?",
    back: "A phenomenon where two particles become connected so that measuring one instantly determines the state of the other, regardless of distance.",
    category: "Basics",
  },
  {
    id: "e2",
    front: "What did Einstein call entanglement?",
    back: '"Spooky action at a distance" — he found the instantaneous correlation philosophically unacceptable.',
    category: "History",
  },
  {
    id: "e3",
    front: "Can entanglement be used for faster-than-light communication?",
    back: "No! While correlations are instant, you can't send information because individual measurements appear random. You need classical communication to compare results.",
    category: "Common Misconceptions",
  },
  {
    id: "e4",
    front: "What is superposition?",
    back: "A quantum state where a particle exists in multiple states simultaneously until measured.",
    category: "Basics",
  },
  {
    id: "e5",
    front: "What is a Bell state?",
    back: "A maximally entangled quantum state of two qubits, like |Ψ⟩ = (|00⟩ + |11⟩)/√2",
    category: "Math",
  },
];

export const BELL_THEOREM_CARDS: FlashCard[] = [
  {
    id: "b1",
    front: "What is Bell's inequality?",
    back: "A mathematical limit on correlations possible under local realism. If violated, hidden variable theories are ruled out.",
    category: "Theory",
  },
  {
    id: "b2",
    front: "What is local realism?",
    back: "The belief that: (1) objects have definite properties regardless of measurement, and (2) nothing can influence something else faster than light.",
    category: "Philosophy",
  },
  {
    id: "b3",
    front: "What does Bell inequality violation prove?",
    back: "That local hidden variable theories cannot explain quantum mechanics. Either realism or locality must be false.",
    category: "Implications",
  },
  {
    id: "b4",
    front: "What is the classical bound in Bell's inequality?",
    back: "S ≤ 2. Quantum mechanics predicts S can reach 2√2 ≈ 2.83.",
    category: "Math",
  },
  {
    id: "b5",
    front: "Who won the 2022 Nobel Prize for Bell test experiments?",
    back: "Alain Aspect, John Clauser, and Anton Zeilinger.",
    category: "History",
  },
];

export const APPLICATIONS_CARDS: FlashCard[] = [
  {
    id: "a1",
    front: "What is quantum key distribution (QKD)?",
    back: "A method of secure communication using entangled photons. Any eavesdropping disturbs the quantum states and is detectable.",
    category: "Cryptography",
  },
  {
    id: "a2",
    front: "What is quantum teleportation?",
    back: "Transferring the quantum state of a particle to another particle using entanglement and classical communication.",
    category: "Communication",
  },
  {
    id: "a3",
    front:
      "Why can't quantum teleportation transmit information faster than light?",
    back: "Because classical communication (limited by light speed) is required to complete the protocol.",
    category: "Communication",
  },
  {
    id: "a4",
    front: "What gives quantum computers their power?",
    back: "Superposition and entanglement allow n qubits to represent 2^n states simultaneously.",
    category: "Computing",
  },
  {
    id: "a5",
    front: "What is quantum supremacy?",
    back: "When a quantum computer performs a calculation that would be impractical for any classical computer.",
    category: "Computing",
  },
];
