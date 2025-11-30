import { useState, useEffect } from "react";
import {
  IconLock,
  IconLockOpen,
  IconBulb,
  IconRefresh,
  IconTrophy,
  IconArrowRight,
  IconX,
  IconClock,
  IconStar,
} from "@tabler/icons-react";

interface Puzzle {
  id: string;
  title: string;
  scenario: string;
  question: string;
  hint: string;
  type: "multiple-choice" | "input";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

interface Room {
  id: string;
  name: string;
  description: string;
  puzzles: Puzzle[];
  unlockMessage: string;
  color: string;
}

const ESCAPE_ROOMS: Room[] = [
  {
    id: "entanglement-lab",
    name: "The Entanglement Lab",
    description:
      "You're trapped in a quantum physics lab. Solve puzzles about entanglement to escape!",
    color: "from-quantum-500 to-cyan-600",
    unlockMessage:
      "The lab door clicks open! Your understanding of entanglement has set you free.",
    puzzles: [
      {
        id: "p1",
        title: "The Particle Pair",
        scenario:
          'You find two entangled particles in a containment field. The display reads: "To unlock, you must understand what happens when one particle is measured..."',
        question:
          "When you measure one entangled particle, what happens to its partner?",
        hint: "Entangled particles share a special connection that affects both simultaneously.",
        type: "multiple-choice",
        options: [
          "Nothing happens - they are completely independent",
          "It always shows the exact same measurement result",
          "Its state becomes correlated (opposite or same depending on entanglement type)",
          "The partner particle is destroyed",
        ],
        correctAnswer:
          "Its state becomes correlated (opposite or same depending on entanglement type)",
        explanation:
          "Entangled particles have correlated states. Measuring one instantly determines the state of the other - they may be the same or opposite depending on how they were entangled.",
        difficulty: 1,
      },
      {
        id: "p2",
        title: "The Bell State Lock",
        scenario:
          'A quantum safe displays four mathematical expressions. "Select the correct Bell state |Φ⁺⟩ to proceed," the safe demands.',
        question: "Which expression represents the Bell state |Φ⁺⟩?",
        hint: "In |Φ⁺⟩, both qubits are always measured in the SAME state (both 0 or both 1).",
        type: "multiple-choice",
        options: [
          "(|00⟩ + |01⟩)/√2",
          "(|00⟩ + |11⟩)/√2",
          "(|01⟩ + |10⟩)/√2",
          "(|00⟩ - |11⟩)/√2",
        ],
        correctAnswer: "(|00⟩ + |11⟩)/√2",
        explanation:
          "|Φ⁺⟩ = (|00⟩ + |11⟩)/√2 — this means both qubits are always measured in the same state: either both 0 or both 1.",
        difficulty: 2,
      },
      {
        id: "p3",
        title: "Einstein's Quote",
        scenario:
          'A hologram of Einstein appears: "I never liked this quantum nonsense. Complete my famous description of entanglement to proceed!"',
        question: 'Complete Einstein\'s phrase: "Spooky action at a _______"',
        hint: "Einstein was troubled by how entanglement seemed to work across space.",
        type: "input",
        correctAnswer: "distance",
        explanation:
          'Einstein called entanglement "spooky action at a distance" because he found it philosophically troubling that measuring one particle could instantly affect another far away.',
        difficulty: 1,
      },
      {
        id: "p4",
        title: "The Communication Paradox",
        scenario:
          'The final door has a logic puzzle: "If entanglement allows instant correlation across any distance, why can\'t we use it for faster-than-light communication?"',
        question:
          "Why can't entanglement be used for faster-than-light communication?",
        hint: "Think about what each person sees when they measure their particle individually.",
        type: "multiple-choice",
        options: [
          "Entanglement is too slow to be useful",
          "Each person sees random results - correlations only appear when comparing data classically",
          "The particles are too small to carry information",
          "Governments have banned it",
        ],
        correctAnswer:
          "Each person sees random results - correlations only appear when comparing data classically",
        explanation:
          "Each person sees completely random measurement results. The correlations only become visible when Alice and Bob meet up or communicate classically to compare their results.",
        difficulty: 2,
      },
    ],
  },
  {
    id: "bells-chamber",
    name: "Bell's Chamber",
    description:
      "A secret chamber dedicated to Bell's theorem. Prove your understanding to escape!",
    color: "from-purple-600 to-indigo-600",
    unlockMessage:
      "The chamber recognizes your quantum knowledge. Bell would be proud!",
    puzzles: [
      {
        id: "b1",
        title: "The Inequality Gate",
        scenario:
          'Ancient symbols on the gate translate to: "What limit does classical physics place on correlations? Enter the CHSH bound."',
        question:
          "What is the classical (local hidden variable) bound for the CHSH inequality?",
        hint: "Quantum mechanics can exceed this value, up to 2√2.",
        type: "multiple-choice",
        options: ["S ≤ 1", "S ≤ 2", "S ≤ 2√2", "S ≤ 4"],
        correctAnswer: "S ≤ 2",
        explanation:
          "Bell's inequality states S ≤ 2 for any local hidden variable theory. Quantum mechanics predicts violations up to 2√2 ≈ 2.83, which experiments confirm.",
        difficulty: 2,
      },
      {
        id: "b2",
        title: "The Aspect Archive",
        scenario:
          'A display shows photos from famous experiments. "Who performed the first convincing Bell test, and what was their key innovation?"',
        question:
          "What was special about Alain Aspect's 1982 Bell test experiment?",
        hint: 'He needed to prevent the particles from "knowing" in advance what would be measured.',
        type: "multiple-choice",
        options: [
          "He used the largest particles ever entangled",
          "He used fast-switching polarizers to close the locality loophole",
          "He proved entanglement doesn't exist",
          "He sent particles to the moon",
        ],
        correctAnswer:
          "He used fast-switching polarizers to close the locality loophole",
        explanation:
          'Aspect used acoustic-optical switches that changed measurement settings faster than light could travel between detectors, preventing any "hidden signal" from affecting the results.',
        difficulty: 2,
      },
      {
        id: "b3",
        title: "The Hidden Variable Vault",
        scenario:
          'The vault asks: "Bell proved something profound. What must we give up if quantum mechanics is correct?"',
        question:
          "According to Bell's theorem, what must we abandon if quantum mechanics is correct?",
        hint: 'We can\'t have both "local" and "realistic" in the Einstein sense.',
        type: "multiple-choice",
        options: [
          "The speed of light limit",
          "Local realism - particles having predetermined properties with only local influences",
          "The existence of electrons",
          "Mathematics",
        ],
        correctAnswer:
          "Local realism - particles having predetermined properties with only local influences",
        explanation:
          'Bell\'s theorem proves we must abandon "local realism" - the idea that particles have predetermined properties (realism) that are only affected by nearby things (locality).',
        difficulty: 3,
      },
    ],
  },
];

export function QuantumEscapeRoom() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [completedRooms, setCompletedRooms] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("quantum-escape-rooms-completed");
    if (saved) {
      setCompletedRooms(JSON.parse(saved));
    }
  }, []);

  // Timer
  useEffect(() => {
    if (selectedRoom && !showVictory) {
      const interval = setInterval(() => {
        // Force re-render for timer
        setStartTime((t) => t);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedRoom, showVictory]);

  const currentPuzzle = selectedRoom?.puzzles[currentPuzzleIndex];
  const roomProgress = solvedPuzzles.size;

  const handleStartRoom = (room: Room) => {
    setSelectedRoom(room);
    setCurrentPuzzleIndex(0);
    setSolvedPuzzles(new Set());
    setSelectedAnswer(null);
    setInputAnswer("");
    setShowResult(false);
    setShowHint(false);
    setHintsUsed(0);
    setStartTime(Date.now());
    setShowVictory(false);
  };

  const handleSubmit = () => {
    if (!currentPuzzle) return;

    let answer =
      currentPuzzle.type === "input"
        ? inputAnswer.toLowerCase().trim()
        : selectedAnswer;
    let correct =
      currentPuzzle.correctAnswer.toLowerCase() === answer?.toLowerCase();

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setSolvedPuzzles((prev) => new Set([...prev, currentPuzzle.id]));
    }
  };

  const handleNext = () => {
    if (!selectedRoom) return;

    if (isCorrect) {
      if (currentPuzzleIndex < selectedRoom.puzzles.length - 1) {
        setCurrentPuzzleIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setInputAnswer("");
        setShowResult(false);
        setShowHint(false);
      } else {
        setShowVictory(true);
        if (!completedRooms.includes(selectedRoom.id)) {
          const newCompleted = [...completedRooms, selectedRoom.id];
          setCompletedRooms(newCompleted);
          localStorage.setItem(
            "quantum-escape-rooms-completed",
            JSON.stringify(newCompleted)
          );
        }
      }
    } else {
      setShowResult(false);
      setSelectedAnswer(null);
      setInputAnswer("");
    }
  };

  const getElapsedTime = () => {
    if (!startTime) return "0:00";
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getStarRating = () => {
    if (!selectedRoom) return 0;
    const totalPuzzles = selectedRoom.puzzles.length;
    const hintsPercentage = hintsUsed / totalPuzzles;
    if (hintsPercentage === 0) return 3;
    if (hintsPercentage <= 0.5) return 2;
    return 1;
  };

  // Room selection screen
  if (!selectedRoom) {
    return (
      <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🔐 Choose Your Challenge
          </h2>
          <p className="text-gray-600">
            Use your quantum knowledge to solve puzzles and escape!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {ESCAPE_ROOMS.map((room) => {
            const isCompleted = completedRooms.includes(room.id);
            return (
              <button
                key={room.id}
                className={`relative rounded-xl overflow-hidden text-left transform transition-all hover:scale-105 hover:shadow-xl ${
                  isCompleted ? "ring-2 ring-green-500" : ""
                }`}
                onClick={() => handleStartRoom(room)}
              >
                <div
                  className={`bg-gradient-to-br ${room.color} p-6 text-white h-full min-h-[180px]`}
                >
                  {isCompleted && (
                    <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1.5">
                      <IconTrophy className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    {isCompleted ? (
                      <IconLockOpen className="w-6 h-6" />
                    ) : (
                      <IconLock className="w-6 h-6" />
                    )}
                    <h3 className="text-xl font-bold">{room.name}</h3>
                  </div>
                  <p className="text-white/90 text-sm mb-4">
                    {room.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {room.puzzles.length} puzzles
                    </span>
                    <IconArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Victory screen
  if (showVictory) {
    const stars = getStarRating();
    return (
      <div className="bg-white rounded-2xl overflow-hidden border-2 border-green-300 shadow-lg">
        <div
          className={`bg-gradient-to-br ${selectedRoom.color} p-8 text-white text-center`}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2">Room Escaped!</h2>
          <p className="text-white/90">{selectedRoom.unlockMessage}</p>

          <div className="flex justify-center gap-1 my-6">
            {[1, 2, 3].map((i) => (
              <IconStar
                key={i}
                className={`w-10 h-10 ${
                  i <= stars
                    ? "text-yellow-300 fill-yellow-300"
                    : "text-white/30"
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 max-w-md mx-auto">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-2xl font-bold">{getElapsedTime()}</div>
              <div className="text-xs text-white/70">Time</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-2xl font-bold">
                {selectedRoom.puzzles.length}
              </div>
              <div className="text-xs text-white/70">Puzzles Solved</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-2xl font-bold">{hintsUsed}</div>
              <div className="text-xs text-white/70">Hints Used</div>
            </div>
          </div>

          <button
            onClick={() => setSelectedRoom(null)}
            className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Back to Room Selection
          </button>
        </div>
      </div>
    );
  }

  // Puzzle screen
  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-purple-200 shadow-lg">
      {/* Header */}
      <div className={`bg-gradient-to-r ${selectedRoom.color} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedRoom(null)}
              className="p-1 hover:bg-white/20 rounded"
            >
              <IconX className="w-5 h-5" />
            </button>
            <h3 className="font-bold">{selectedRoom.name}</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <IconClock className="w-4 h-4" />
              {getElapsedTime()}
            </div>
            <div className="text-sm font-medium">
              {currentPuzzleIndex + 1}/{selectedRoom.puzzles.length}
            </div>
          </div>
        </div>

        <div className="mt-3 w-full bg-white/30 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(roomProgress / selectedRoom.puzzles.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Puzzle content */}
      {currentPuzzle && (
        <div className="p-6">
          {/* Puzzle header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Puzzle {currentPuzzleIndex + 1}
              </span>
              <span className="text-sm text-gray-500">
                {"⭐".repeat(currentPuzzle.difficulty)}
              </span>
            </div>
            <h4 className="text-xl font-bold text-gray-900">
              {currentPuzzle.title}
            </h4>
          </div>

          {/* Scenario */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 mb-6 border-l-4 border-purple-500">
            <p className="text-gray-700 italic leading-relaxed">
              {currentPuzzle.scenario}
            </p>
          </div>

          {/* Question */}
          <div className="mb-6">
            <p className="font-semibold text-gray-900 mb-4 text-lg">
              {currentPuzzle.question}
            </p>

            {/* Multiple choice */}
            {currentPuzzle.type === "multiple-choice" &&
              currentPuzzle.options && (
                <div className="space-y-3">
                  {currentPuzzle.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => !showResult && setSelectedAnswer(option)}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        showResult
                          ? option === currentPuzzle.correctAnswer
                            ? "border-green-500 bg-green-50 text-green-800"
                            : selectedAnswer === option
                            ? "border-red-400 bg-red-50 text-red-800"
                            : "border-gray-200 opacity-50"
                          : selectedAnswer === option
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

            {/* Input type */}
            {currentPuzzle.type === "input" && (
              <input
                type="text"
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                disabled={showResult}
                placeholder="Type your answer..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                onKeyDown={(e) =>
                  e.key === "Enter" && !showResult && handleSubmit()
                }
              />
            )}
          </div>

          {/* Hint */}
          {showHint && !showResult && (
            <div className="mb-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-amber-800">
                <strong>💡 Hint:</strong> {currentPuzzle.hint}
              </p>
            </div>
          )}

          {/* Result */}
          {showResult && (
            <div
              className={`mb-4 p-5 rounded-xl ${
                isCorrect
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`font-bold mb-2 text-lg ${
                  isCorrect ? "text-green-700" : "text-red-700"
                }`}
              >
                {isCorrect ? "✓ Correct!" : "✗ Not quite right"}
              </p>
              <p className="text-gray-700">{currentPuzzle.explanation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!showResult ? (
              <>
                <button
                  onClick={() => {
                    setShowHint(true);
                    setHintsUsed((h) => h + 1);
                  }}
                  disabled={showHint}
                  className={`px-4 py-3 rounded-xl flex items-center gap-2 font-medium transition-colors ${
                    showHint
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  }`}
                >
                  <IconBulb className="w-5 h-5" />
                  Get Hint
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer && !inputAnswer}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    selectedAnswer || inputAnswer
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit Answer
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isCorrect ? (
                  currentPuzzleIndex < selectedRoom.puzzles.length - 1 ? (
                    <>
                      Next Puzzle <IconArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Complete Room <IconTrophy className="w-5 h-5" />
                    </>
                  )
                ) : (
                  <>
                    Try Again <IconRefresh className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
