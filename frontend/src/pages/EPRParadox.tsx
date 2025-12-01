import { useEffect } from "react";
import { IconBrain, IconQuestionMark } from "@tabler/icons-react";
import { MultipleChoiceQuiz } from "../components/MultipleChoiceQuiz";
import { ShortAnswerQuiz } from "../components/ShortAnswerQuiz";
import { CommentSection } from "../components/CommentSection";
import { EPRParadox3D } from "../components/EPRParadox3D";
import {
  ThoughtExperiment,
  EPR_SCENARIOS,
} from "../components/ThoughtExperiment";
import { ReadingProgressBar } from "../components/ReadingProgress";
import {
  ExplanationLevelToggle,
  ELI5Explanation,
} from "../components/ELI5Mode";
import type { QuizQuestion } from "../types";

const multipleChoiceQuiz1: QuizQuestion = {
  id: "epr-paradox-mc-1",
  type: "multiple-choice",
  question:
    "What was Einstein's main objection to quantum mechanics in the EPR paper?",
  options: [
    "Quantum mechanics makes incorrect predictions",
    'It implies "spooky action at a distance" which violates locality',
    "The mathematics is too complicated",
    "It contradicts special relativity",
  ],
  correctAnswer:
    'It implies "spooky action at a distance" which violates locality',
  explanation:
    "Einstein believed that no influence could travel faster than light. If entangled particles could instantly affect each other, it seemed to violate locality.",
};

const multipleChoiceQuiz2: QuizQuestion = {
  id: "epr-paradox-mc-2",
  type: "multiple-choice",
  question: "What did EPR propose as an alternative to quantum mechanics?",
  options: [
    "A completely new theory of physics",
    "Hidden variables that determine outcomes in advance",
    "That quantum mechanics only applies at small scales",
    "That entanglement doesn't exist",
  ],
  correctAnswer: "Hidden variables that determine outcomes in advance",
  explanation:
    'EPR suggested that quantum mechanics must be incomplete — there must be "hidden variables" that predetermine measurement outcomes.',
};

const multipleChoiceQuiz3: QuizQuestion = {
  id: "epr-paradox-mc-3",
  type: "multiple-choice",
  question: "Who ultimately turned out to be correct about entanglement?",
  options: [
    "Einstein was completely correct",
    "Bohr was essentially correct — quantum mechanics works as described",
    "Neither was correct",
    "The debate is still unresolved",
  ],
  correctAnswer:
    "Bohr was essentially correct — quantum mechanics works as described",
  explanation:
    "Experiments testing Bell's theorem consistently support quantum mechanics. Hidden variables of the type Einstein hoped for have been ruled out.",
};

const shortAnswerQuiz: QuizQuestion = {
  id: "epr-paradox-sa",
  type: "short-answer",
  question:
    "In your own words, explain the core conflict between Einstein's view and Bohr's view of entanglement.",
  rubric:
    "Student should contrast: Einstein believed particles have definite properties before measurement (realism) and nothing can influence things faster than light (locality). Bohr believed properties don't exist until measured and entanglement correlations are fundamental.",
  keyPoints: [
    "Einstein: realism - properties exist before measurement",
    "Einstein: locality - no faster than light influence",
    "Bohr: properties created by measurement",
    "Bohr: entanglement correlations are fundamental",
  ],
};

export function EPRParadox() {
  useEffect(() => {
    const progress = JSON.parse(
      localStorage.getItem("quantum-learning-progress") ||
        '{"pagesVisited":[],"quizzesCompleted":[],"quizScores":{}}'
    );
    if (!progress.pagesVisited.includes("epr-paradox")) {
      progress.pagesVisited.push("epr-paradox");
      localStorage.setItem(
        "quantum-learning-progress",
        JSON.stringify(progress)
      );
    }
  }, []);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
      <ReadingProgressBar pageId="epr-paradox" estimatedMinutes={12} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <IconBrain className="h-10 w-10 text-rose-600" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
              The EPR Paradox
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Einstein's famous thought experiment that challenged quantum
            mechanics
          </p>
          <div className="flex items-center gap-4 mt-4">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
              Intermediate
            </span>
            <span className="text-gray-500 text-sm">~12 min read</span>
          </div>
        </div>

        <ExplanationLevelToggle />

        <div className="mb-8">
          <ELI5Explanation topic="epr" />
        </div>

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-quantum-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4">
            "God Does Not Play Dice"
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              In 1935, Albert Einstein, Boris Podolsky, and Nathan Rosen
              published one of the most famous papers in physics history. Their
              goal? To prove that quantum mechanics must be incomplete.
            </p>
            <p>
              The paper presented a thought experiment designed to show that
              quantum mechanics leads to absurd conclusions. If quantum
              mechanics is correct, they argued, then measuring one particle
              would instantly affect another particle arbitrarily far away. This
              is what Einstein dismissively called{" "}
              <strong>"spooky action at a distance."</strong>
            </p>
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 p-6 rounded-r-xl">
              <p className="font-semibold text-red-800 mb-2">
                Einstein's Position:
              </p>
              <p className="text-gray-700 italic">
                "I cannot seriously believe in [quantum theory] because it
                cannot be reconciled with the idea that physics should represent
                a reality in time and space, free from spooky actions at a
                distance."
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-rose-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <span className="text-2xl">⚛️</span>
            <span>Interactive: The EPR Thought Experiment</span>
          </h2>
          <p className="text-gray-600 mb-6">
            Explore the debate between Einstein and Bohr! Switch between their
            viewpoints to see how each interpreted entanglement. Click particles
            to measure them and see the correlations.
          </p>
          <EPRParadox3D />
        </div>

        <MultipleChoiceQuiz question={multipleChoiceQuiz1} />

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-entangled-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <IconQuestionMark className="h-6 w-6 text-entangled-600" />
            <span>The Original Thought Experiment</span>
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>The EPR thought experiment goes like this:</p>
            <div className="bg-gradient-to-r from-entangled-50 to-purple-50 p-6 rounded-xl border-2 border-entangled-200">
              <ol className="space-y-3">
                <li>
                  <strong>1.</strong> Create two entangled particles
                </li>
                <li>
                  <strong>2.</strong> Let them fly apart to opposite ends of the
                  galaxy
                </li>
                <li>
                  <strong>3.</strong> Measure particle A's position with perfect
                  precision
                </li>
                <li>
                  <strong>4.</strong> Due to entanglement, you now know particle
                  B's position instantly
                </li>
                <li>
                  <strong>5.</strong> But you haven't disturbed particle B at
                  all!
                </li>
              </ol>
            </div>
            <p>
              EPR argued: if particle B had a definite position all along (which
              it must have, since we didn't disturb it), then quantum mechanics
              is incomplete.
            </p>
          </div>
        </div>

        <ThoughtExperiment
          scenarios={EPR_SCENARIOS}
          title="Test Your Intuition"
          description="Walk through the EPR paradox step by step"
        />

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-gray-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-6 text-gray-900">
            The Great Debate
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Einstein's side - light rose/red theme */}
            <div className="bg-gradient-to-br from-rose-50 to-red-50 p-6 rounded-xl border-2 border-rose-200">
              <h3 className="font-bold text-rose-800 text-lg mb-3 flex items-center gap-2">
                🎩 Einstein's Argument (1935)
              </h3>
              <p className="text-gray-800 mb-3">
                "If measuring Alice's particle instantly determines Bob's result
                (even light-years away), then either:
              </p>
              <ol className="text-gray-800 space-y-1 ml-4 list-decimal">
                <li>
                  Information travels faster than light (violates relativity!)
                </li>
                <li>
                  The particles had definite values all along (hidden variables)
                </li>
              </ol>
              <p className="text-gray-800 mt-3">
                Since (1) is impossible, (2) must be true. Therefore, quantum
                mechanics is incomplete!"
              </p>
            </div>

            {/* Bohr's side - light blue theme */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 text-lg mb-3 flex items-center gap-2">
                🔬 Bohr's Response
              </h3>
              <p className="text-gray-800 mb-3">
                "You can't separate the quantum system from the measurement
                apparatus. The particles form a single, non-local quantum state.
              </p>
              <p className="text-gray-800">
                The correlation doesn't transmit information — Alice sees random
                results, as does Bob. The correlation only appears when they
                compare notes (at light speed or slower).
              </p>
              <p className="text-gray-800 mt-3 font-medium">
                Quantum mechanics is complete — you just have to accept
                non-locality!"
              </p>
            </div>
          </div>

          {/* Historical note - light amber/yellow theme */}
          <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border-2 border-amber-200">
            <p className="text-gray-800">
              <span className="font-semibold text-amber-900">
                📚 Historical Note:
              </span>{" "}
              The EPR paper (Einstein, Podolsky, Rosen, 1935) argued that
              quantum mechanics must be incomplete. It took until 1964 for John
              Bell to show how to test this experimentally, and until 1982 for
              Alain Aspect to perform a definitive test. The result?{" "}
              <span className="text-green-700 font-semibold">
                Bohr was right.
              </span>{" "}
              Einstein's hidden variables cannot explain quantum correlations.
            </p>
          </div>
        </div>

        <MultipleChoiceQuiz question={multipleChoiceQuiz2} />
        <MultipleChoiceQuiz question={multipleChoiceQuiz3} />
        <ShortAnswerQuiz question={shortAnswerQuiz} />

        <div className="bg-white rounded-xl p-6 mb-8 border-2 border-quantum-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Continue Learning
              </h3>
              <p className="text-gray-600 text-sm">
                Next: Bell's Theorem — The experiment that settled the debate
              </p>
            </div>
            <a
              href="/bells-theorem"
              className="px-4 py-2 bg-quantum-500 text-white rounded-lg font-medium hover:bg-quantum-600 transition-colors"
            >
              Next Topic →
            </a>
          </div>
        </div>

        <CommentSection pageId="epr-paradox" />
      </div>
    </div>
  );
}
