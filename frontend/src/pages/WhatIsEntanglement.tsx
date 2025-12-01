import { useEffect } from "react";
import { IconAtom2, IconLink, IconSparkles } from "@tabler/icons-react";
import { MultipleChoiceQuiz } from "../components/MultipleChoiceQuiz";
import { ShortAnswerQuiz } from "../components/ShortAnswerQuiz";
import { CommentSection } from "../components/CommentSection";
import { EntangledParticles3D } from "../components/EntangledParticles3D";
import { FlashCards, ENTANGLEMENT_CARDS } from "../components/FlashCards";
import { MatchingGame, ENTANGLEMENT_MATCHES } from "../components/MatchingGame";
import {
  ThoughtExperiment,
  EPR_SCENARIOS,
} from "../components/ThoughtExperiment";
import { ReadingProgressBar } from "../components/ReadingProgress";
import {
  ExplanationLevelToggle,
  ELI5Explanation,
} from "../components/ELI5Mode";
import { ReviewSuggestion } from "../components/KnowledgeGaps";
import type { QuizQuestion } from "../types";

const multipleChoiceQuiz1: QuizQuestion = {
  id: "entanglement-basics-mc-1",
  type: "multiple-choice",
  question:
    "When two particles are entangled and you measure one of them, what happens to the other particle?",
  options: [
    "Nothing happens to the other particle",
    "The other particle's state instantly correlates with the measurement",
    "The other particle gets destroyed",
    "The other particle moves closer to the first one",
  ],
  correctAnswer:
    "The other particle's state instantly correlates with the measurement",
  explanation:
    'When you measure one entangled particle, the other particle\'s state becomes instantly correlated, regardless of the distance between them. This is the "spooky" part that bothered Einstein!',
};

const multipleChoiceQuiz2: QuizQuestion = {
  id: "entanglement-basics-mc-2",
  type: "multiple-choice",
  question: "Before measurement, what state are entangled particles in?",
  options: [
    "A definite state that we just don't know",
    "A superposition of multiple states simultaneously",
    "A random state that changes constantly",
    "The same state as each other",
  ],
  correctAnswer: "A superposition of multiple states simultaneously",
  explanation:
    "Before measurement, entangled particles exist in a superposition — they don't have definite properties. The measurement doesn't reveal a pre-existing property; it actually creates it!",
};

const shortAnswerQuiz: QuizQuestion = {
  id: "entanglement-basics-sa",
  type: "short-answer",
  question:
    "A common misconception is that entanglement allows faster-than-light communication. Explain why this is impossible.",
  rubric:
    "Student should explain: 1) Individual measurements appear random, 2) Correlations only visible when comparing results, 3) No information transmitted by measurement itself, 4) Still obeys special relativity",
  keyPoints: [
    "measurements appear random",
    "correlations require classical communication to compare",
    "no information transfer by measurement alone",
    "respects relativity and speed of light",
  ],
};

export function WhatIsEntanglement() {
  useEffect(() => {
    const progress = JSON.parse(
      localStorage.getItem("quantum-learning-progress") ||
        '{"pagesVisited":[],"quizzesCompleted":[],"quizScores":{}}'
    );
    if (!progress.pagesVisited.includes("what-is-entanglement")) {
      progress.pagesVisited.push("what-is-entanglement");
      localStorage.setItem(
        "quantum-learning-progress",
        JSON.stringify(progress)
      );
    }
  }, []);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
      {/* Reading Progress */}
      <ReadingProgressBar pageId="what-is-entanglement" estimatedMinutes={10} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <IconAtom2 className="h-10 w-10 text-quantum-600" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
              What is Quantum Entanglement?
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            The phenomenon that Einstein couldn't accept
          </p>
          <div className="flex items-center gap-4 mt-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Beginner
            </span>
            <span className="text-gray-500 text-sm">~10 min read</span>
          </div>
        </div>

        {/* Review Suggestion if they have weak areas */}
        <ReviewSuggestion />

        {/* ELI5 Mode Toggle */}
        <ExplanationLevelToggle />

        {/* ELI5 Adaptive Explanation */}
        <div className="mb-8">
          <ELI5Explanation topic="entanglement" />
        </div>

        <div className="glass-card rounded-xl p-8 mb-8 border-2 border-quantum-200">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <IconSparkles className="h-6 w-6 text-quantum-600" />
            <span>The Basics</span>
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Imagine you have a pair of magical dice. You give one dice to your
              friend Alice and keep the other yourself. Alice travels to Mars
              while you stay on Earth. When you roll your dice and get a 6,
              Alice's dice, at that exact same instant, shows a 1. Every single
              time. No matter how far apart you are.
            </p>
            <p>
              That's essentially what quantum entanglement is, except with
              subatomic particles instead of dice. When two particles become
              entangled, measuring a property of one particle (like its spin)
              instantly determines the corresponding property of the other
              particle, regardless of the distance between them.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-8 mb-8 border-2 border-purple-200">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <span className="text-2xl">🔬</span>
            <span>Interactive Demo: Entangled Particles</span>
          </h2>
          <p className="text-gray-600 mb-6">
            Click on either particle to "measure" it. Watch how the other
            particle's state instantly correlates — no matter the distance! Try
            multiple measurements to see the 100% anti-correlation in action.
          </p>
          <EntangledParticles3D />
        </div>

        <MultipleChoiceQuiz question={multipleChoiceQuiz1} />

        <div className="glass-card rounded-xl p-8 mb-8 border-2 border-entangled-200">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <IconLink className="h-6 w-6 text-entangled-600" />
            <span>How Does It Work?</span>
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Entanglement begins when two particles interact in a special way.
              For example, when a single photon is split into two lower-energy
              photons, those photons become entangled. Their quantum states are
              now fundamentally linked.
            </p>
            <div className="bg-quantum-50 border-l-4 border-quantum-500 p-6 rounded">
              <h3 className="font-semibold text-quantum-900 mb-2">
                Key Properties:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-quantum-600 font-bold">•</span>
                  <span>
                    <strong>Superposition:</strong> Before measurement, each
                    particle exists in multiple states simultaneously
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-quantum-600 font-bold">•</span>
                  <span>
                    <strong>Correlation:</strong> Measuring one particle
                    instantly affects the measurement outcome of the other
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-quantum-600 font-bold">•</span>
                  <span>
                    <strong>Non-locality:</strong> This correlation happens
                    regardless of distance.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <MatchingGame
          items={ENTANGLEMENT_MATCHES}
          title="Match the Quantum Terms"
        />

        <MultipleChoiceQuiz question={multipleChoiceQuiz2} />

        <div className="glass-card rounded-xl p-8 mb-8 border-2 border-gray-200">
          <h2 className="font-display text-2xl font-semibold mb-4">
            The Einstein-Bohr Debate
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              In 1935, Albert Einstein, Boris Podolsky, and Nathan Rosen
              published a paper arguing that quantum mechanics must be
              incomplete. They reasoned that if quantum mechanics were correct
              about entanglement, it would require "spooky action at a distance"
              — something Einstein found philosophically unacceptable.
            </p>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">
                  🎩 Einstein's View:
                </h3>
                <p className="text-gray-700">
                  "There must be hidden variables we don't know about yet."
                </p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  🔬 Bohr's View:
                </h3>
                <p className="text-gray-700">
                  "Reality is fundamentally probabilistic. Entanglement is
                  real."
                </p>
              </div>
            </div>
          </div>
        </div>

        <ThoughtExperiment
          scenarios={EPR_SCENARIOS}
          title="The EPR Thought Experiment"
          description="Test your intuition about quantum entanglement"
        />

        <div className="glass-card rounded-xl p-8 mb-8 border-2 border-orange-200">
          <h2 className="font-display text-2xl font-semibold mb-4 text-orange-900">
            ⚠️ Common Misconceptions
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Misconception #1: Entanglement allows faster-than-light
                communication
              </h3>
              <p>
                <strong>Reality:</strong> While the correlation is
                instantaneous, you can't use it to send information. Alice gets
                a random result, and Bob can't know what she got without
                classical communication.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Misconception #2: Measuring one particle "sends a signal" to the
                other
              </h3>
              <p>
                <strong>Reality:</strong> Nothing travels between the particles.
                They share a single quantum state.
              </p>
            </div>
          </div>
        </div>

        <ShortAnswerQuiz question={shortAnswerQuiz} />

        <FlashCards cards={ENTANGLEMENT_CARDS} title="Review: Key Concepts" />

        <div className="glass-card rounded-xl p-6 mb-8 border-2 border-quantum-200 bg-gradient-to-r from-quantum-50 to-entangled-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Continue Learning
              </h3>
              <p className="text-gray-600 text-sm">
                Next: The EPR Paradox — Einstein's famous challenge
              </p>
            </div>
            <a
              href="/epr-paradox"
              className="px-4 py-2 bg-quantum-500 text-white rounded-lg font-medium hover:bg-quantum-600 transition-colors"
            >
              Next Topic →
            </a>
          </div>
        </div>

        <CommentSection pageId="what-is-entanglement" />
      </div>
    </div>
  );
}
