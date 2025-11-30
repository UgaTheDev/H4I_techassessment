import { useState } from "react";
import {
  IconBrain,
  IconArrowRight,
  IconRefresh,
  IconCheck,
} from "@tabler/icons-react";

interface Choice {
  id: string;
  text: string;
  feedback: string;
  isCorrect?: boolean;
  leadsTo?: string;
}

interface Scenario {
  id: string;
  title: string;
  narrative: string;
  choices: Choice[];
  image?: string;
}

interface ThoughtExperimentProps {
  scenarios: Scenario[];
  title?: string;
  description?: string;
}

export function ThoughtExperiment({
  scenarios,
  title,
  description,
}: ThoughtExperimentProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<Set<number>>(
    new Set()
  );
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentScenario = scenarios[currentScenarioIndex];
  const selectedChoiceData = currentScenario.choices.find(
    (c) => c.id === selectedChoice
  );
  const isComplete = completedScenarios.size === scenarios.length;

  const handleChoiceSelect = (choiceId: string) => {
    if (showFeedback) return;
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;
    setShowFeedback(true);

    const choice = currentScenario.choices.find((c) => c.id === selectedChoice);
    if (choice?.isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setCompletedScenarios((prev) => new Set([...prev, currentScenarioIndex]));
  };

  const handleNext = () => {
    const choice = currentScenario.choices.find((c) => c.id === selectedChoice);

    if (choice?.leadsTo) {
      const nextIndex = scenarios.findIndex((s) => s.id === choice.leadsTo);
      if (nextIndex >= 0) {
        setCurrentScenarioIndex(nextIndex);
        setSelectedChoice(null);
        setShowFeedback(false);
        return;
      }
    }

    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    }
  };

  const handleRestart = () => {
    setCurrentScenarioIndex(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCompletedScenarios(new Set());
    setCorrectAnswers(0);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden mb-8 border-2 border-purple-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <IconBrain className="h-6 w-6" />
          <div>
            <h3 className="font-display text-lg font-semibold">
              {title || "Thought Experiment"}
            </h3>
            {description && (
              <p className="text-sm text-purple-100">{description}</p>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mt-3">
          {scenarios.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all ${
                completedScenarios.has(index)
                  ? "bg-green-400"
                  : index === currentScenarioIndex
                  ? "bg-white"
                  : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scenario content */}
      <div className="p-6">
        {!isComplete ? (
          <>
            {/* Scenario header */}
            <div className="mb-4">
              <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                Scenario {currentScenarioIndex + 1} of {scenarios.length}
              </span>
              <h4 className="text-xl font-semibold text-gray-900 mt-1">
                {currentScenario.title}
              </h4>
            </div>

            {/* Narrative */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {currentScenario.narrative}
              </p>
            </div>

            {/* Choices */}
            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-gray-700">
                What do you think happens?
              </p>
              {currentScenario.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice.id)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showFeedback
                      ? choice.isCorrect
                        ? "border-green-500 bg-green-50"
                        : selectedChoice === choice.id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-gray-50 opacity-60"
                      : selectedChoice === choice.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        showFeedback && choice.isCorrect
                          ? "bg-green-500 text-white"
                          : showFeedback && selectedChoice === choice.id
                          ? "bg-red-500 text-white"
                          : selectedChoice === choice.id
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {showFeedback && choice.isCorrect ? (
                        <IconCheck className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">
                          {String.fromCharCode(
                            65 + currentScenario.choices.indexOf(choice)
                          )}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-800">{choice.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && selectedChoiceData && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  selectedChoiceData.isCorrect
                    ? "bg-green-50 border border-green-200"
                    : "bg-amber-50 border border-amber-200"
                }`}
              >
                <p className="font-medium text-gray-900 mb-1">
                  {selectedChoiceData.isCorrect
                    ? "✓ Correct!"
                    : "💡 Not quite..."}
                </p>
                <p className="text-sm text-gray-700">
                  {selectedChoiceData.feedback}
                </p>
              </div>
            )}

            {/* Action button */}
            {!showFeedback ? (
              <button
                onClick={handleConfirm}
                disabled={!selectedChoice}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  selectedChoice
                    ? "bg-purple-500 text-white hover:bg-purple-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-lg font-semibold bg-purple-500 text-white hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
              >
                {currentScenarioIndex < scenarios.length - 1 ? (
                  <>
                    Next Scenario <IconArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  "See Results"
                )}
              </button>
            )}
          </>
        ) : (
          /* Completion screen */
          <div className="text-center py-8">
            <div className="text-6xl mb-4">
              {correctAnswers === scenarios.length
                ? "🏆"
                : correctAnswers > scenarios.length / 2
                ? "👏"
                : "🤔"}
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">
              Thought Experiment Complete!
            </h4>
            <p className="text-gray-600 mb-6">
              You got {correctAnswers} out of {scenarios.length} scenarios
              correct.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium mb-6">
              Score: {Math.round((correctAnswers / scenarios.length) * 100)}%
            </div>

            <div>
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-all flex items-center gap-2 mx-auto"
              >
                <IconRefresh className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Pre-made thought experiment scenarios
export const EPR_SCENARIOS: Scenario[] = [
  {
    id: "setup",
    title: "The EPR Setup",
    narrative: `You're conducting the EPR thought experiment. You create two entangled particles and send one to Alice on Earth and one to Bob on Mars (about 20 light-minutes away).

Both particles are in a superposition of spin-up and spin-down. Neither has a definite spin until measured.

Alice measures her particle and gets "spin-up."

What happens to Bob's particle at the exact moment Alice measures hers?`,
    choices: [
      {
        id: "instant",
        text: 'Bob\'s particle instantly becomes "spin-down"',
        feedback:
          "Correct! According to quantum mechanics, the measurement instantly correlates both particles. Bob's particle is now definitely \"spin-down\" — but Bob doesn't know this yet!",
        isCorrect: true,
      },
      {
        id: "delayed",
        text: 'Bob\'s particle becomes "spin-down" after 20 minutes (light travel time)',
        feedback:
          "This is what Einstein expected, but experiments show the correlation is instantaneous. However, Bob can't learn Alice's result faster than light, so no information travels faster than light.",
        isCorrect: false,
      },
      {
        id: "independent",
        text: "Nothing happens — the particles are independent",
        feedback:
          "If this were true, there would be no entanglement! Experiments confirm the particles remain correlated regardless of distance.",
        isCorrect: false,
      },
    ],
  },
  {
    id: "communication",
    title: "Can Alice Signal Bob?",
    narrative: `Alice realizes she can "choose" Bob's measurement outcome by measuring her particle first.

She thinks: "If I measure spin-up, Bob gets spin-down. If I measure spin-down, Bob gets spin-up. I'll send him a message using this!"

Can Alice send information to Bob faster than light using entanglement?`,
    choices: [
      {
        id: "yes",
        text: "Yes — she can encode messages in her measurement choices",
        feedback:
          "This seems logical, but there's a catch! Alice can't choose what result she gets — it's random. She can't control whether she measures up or down, so she can't encode any information.",
        isCorrect: false,
      },
      {
        id: "no-random",
        text: "No — Alice's measurement results are random, she can't control them",
        feedback:
          "Exactly! Alice gets random results, and Bob gets random results. The correlation only becomes visible when they compare notes later (at light speed or slower). No FTL communication is possible!",
        isCorrect: true,
      },
      {
        id: "maybe",
        text: "Maybe — if she measures many particles quickly",
        feedback:
          "Even with many particles, each individual result is random. There's no pattern Alice can create that Bob could detect without classical communication.",
        isCorrect: false,
      },
    ],
  },
  {
    id: "hidden",
    title: "Einstein's Hidden Variables",
    narrative: `Einstein proposed that particles must have "hidden variables" — predetermined properties we just can\'t see.

Like a pair of gloves shipped in separate boxes: one is left-handed, one is right-handed. When you open one box and find a left glove, you instantly "know" the other is right — but nothing magical happened.

Does this explain entanglement?`,
    choices: [
      {
        id: "yes-explains",
        text: "Yes — entanglement is just like the glove analogy",
        feedback:
          "This was Einstein's intuition, but Bell's theorem showed that hidden variable theories make different predictions than quantum mechanics — and experiments sided with quantum mechanics!",
        isCorrect: false,
      },
      {
        id: "no-bell",
        text: "No — Bell's theorem proves hidden variables can't explain the correlations",
        feedback:
          "Correct! Bell showed that hidden variable theories predict weaker correlations than quantum mechanics. Experiments show the stronger quantum correlations are real, ruling out Einstein's explanation.",
        isCorrect: true,
      },
      {
        id: "partially",
        text: "Partially — some correlations are explained, but not all",
        feedback:
          "Close, but Bell's theorem is more definitive. The correlations predicted by quantum mechanics exceed what ANY local hidden variable theory can produce.",
        isCorrect: false,
      },
    ],
  },
];
