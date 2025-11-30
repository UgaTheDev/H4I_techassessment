import { useEffect } from "react";
import { IconFlask, IconTrophy } from "@tabler/icons-react";
import { MultipleChoiceQuiz } from "../components/MultipleChoiceQuiz";
import { CommentSection } from "../components/CommentSection";
import { AspectExperiment3D } from "../components/AspectExperiment3D";
import { Timeline, QUANTUM_TIMELINE } from "../components/Timeline";
import { ReadingProgressBar } from "../components/ReadingProgress";
import {
  ExplanationLevelToggle,
  ELI5Explanation,
} from "../components/ELI5Mode";
import type { QuizQuestion } from "../types";

const multipleChoiceQuiz1: QuizQuestion = {
  id: "experiments-mc-1",
  type: "multiple-choice",
  question: "What was the key innovation in Alain Aspect's 1982 experiment?",
  options: [
    "Using stronger magnets",
    "Fast-switching polarizers to close the locality loophole",
    "Using larger particles",
    "Running the experiment in space",
  ],
  correctAnswer: "Fast-switching polarizers to close the locality loophole",
  explanation:
    'Aspect used acoustic-optical switches that changed measurement settings faster than light could travel between detectors, ensuring no "hidden signal" could affect results.',
};

const multipleChoiceQuiz2: QuizQuestion = {
  id: "experiments-mc-2",
  type: "multiple-choice",
  question: 'What is the "detection loophole" in Bell tests?',
  options: [
    "Detectors are too large",
    "Not all particles are detected, potentially biasing results",
    "Particles move too fast",
    "Scientists make calculation errors",
  ],
  correctAnswer: "Not all particles are detected, potentially biasing results",
  explanation:
    "If detectors miss some particles, one could argue that detected particles are a biased sample. Loophole-free tests require detection efficiency above ~83%.",
};

const multipleChoiceQuiz3: QuizQuestion = {
  id: "experiments-mc-3",
  type: "multiple-choice",
  question: 'When was the first "loophole-free" Bell test performed?',
  options: ["1982", "1998", "2015", "2022"],
  correctAnswer: "2015",
  explanation:
    "The first loophole-free Bell tests were performed in 2015 by three independent groups, closing both the locality and detection loopholes simultaneously.",
};

export function FamousExperiments() {
  useEffect(() => {
    const progress = JSON.parse(
      localStorage.getItem("quantum-learning-progress") ||
        '{"pagesVisited":[],"quizzesCompleted":[],"quizScores":{}}'
    );
    if (!progress.pagesVisited.includes("famous-experiments")) {
      progress.pagesVisited.push("famous-experiments");
      localStorage.setItem(
        "quantum-learning-progress",
        JSON.stringify(progress)
      );
    }
  }, []);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
      <ReadingProgressBar pageId="famous-experiments" estimatedMinutes={12} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <IconFlask className="h-10 w-10 text-amber-600" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
              Famous Experiments
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            From theory to proof: the experiments that changed physics
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
          <ELI5Explanation topic="experiments" />
        </div>

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-amber-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4">
            Testing the Untestable
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              For decades, the EPR paradox seemed like a purely philosophical
              question. How could you ever experimentally test whether hidden
              variables exist? John Bell's theorem changed that in 1964, but it
              still took nearly two decades to perform a convincing experiment.
            </p>
            <p>
              The challenge: you need to measure entangled particles so quickly
              that no signal (even traveling at light speed) could pass between
              the detectors.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-orange-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <span className="text-2xl">🔬</span>
            <span>Interactive: Aspect's Experiment (1982)</span>
          </h2>
          <p className="text-gray-600 mb-6">
            Explore how Alain Aspect's groundbreaking experiment worked! See how
            the fast-switching polarizers ensured no signal could travel between
            detectors.
          </p>
          <AspectExperiment3D />
        </div>

        <MultipleChoiceQuiz question={multipleChoiceQuiz1} />

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-quantum-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4">
            The Loopholes
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Even after Aspect's experiment, skeptics pointed out potential
              "loopholes" — ways the results could be explained without
              abandoning local realism:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-br from-rose-50 to-red-50 p-5 rounded-xl border-2 border-rose-200">
                <h4 className="font-bold text-rose-800 mb-2">
                  🎯 Locality Loophole
                </h4>
                <p className="text-gray-600 text-sm">
                  What if a signal travels between detectors, telling them what
                  setting to use? Closed by Aspect's fast-switching.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">
                  📊 Detection Loophole
                </h4>
                <p className="text-gray-600 text-sm">
                  What if only some particles are detected, creating a biased
                  sample? Closed in 2015 with high-efficiency detectors.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl border-2 border-purple-200">
                <h4 className="font-bold text-purple-800 mb-2">
                  🌟 Freedom-of-Choice
                </h4>
                <p className="text-gray-600 text-sm">
                  What if measurement choices aren't truly random? Addressed
                  using cosmic randomness from distant quasars (2018)!
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200">
                <h4 className="font-bold text-green-800 mb-2">
                  ✅ 2015: All Closed
                </h4>
                <p className="text-gray-600 text-sm">
                  Three independent groups performed "loophole-free" Bell tests,
                  definitively ruling out local hidden variables.
                </p>
              </div>
            </div>
          </div>
        </div>

        <MultipleChoiceQuiz question={multipleChoiceQuiz2} />

        <Timeline
          events={QUANTUM_TIMELINE}
          title="Timeline of Bell Experiments"
        />

        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-8 mb-8 border-2 border-yellow-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2 text-amber-800">
            <IconTrophy className="h-7 w-7" />
            The 2022 Nobel Prize
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              The 2022 Nobel Prize in Physics was awarded to three pioneers of
              quantum entanglement experiments:
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-5 rounded-xl text-center shadow-sm">
                <div className="text-4xl mb-2">🇫🇷</div>
                <h4 className="font-bold text-gray-900">Alain Aspect</h4>
                <p className="text-gray-600 text-sm">
                  First convincing Bell tests with fast-switching (1982)
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl text-center shadow-sm">
                <div className="text-4xl mb-2">🇺🇸</div>
                <h4 className="font-bold text-gray-900">John Clauser</h4>
                <p className="text-gray-600 text-sm">
                  First experimental Bell test (1972)
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl text-center shadow-sm">
                <div className="text-4xl mb-2">🇦🇹</div>
                <h4 className="font-bold text-gray-900">Anton Zeilinger</h4>
                <p className="text-gray-600 text-sm">
                  Quantum teleportation and long-distance entanglement
                </p>
              </div>
            </div>
          </div>
        </div>

        <MultipleChoiceQuiz question={multipleChoiceQuiz3} />

        <div className="bg-white rounded-xl p-6 mb-8 border-2 border-quantum-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Continue Learning
              </h3>
              <p className="text-gray-600 text-sm">
                Next: Real Applications — How entanglement is changing
                technology
              </p>
            </div>
            <a
              href="/applications"
              className="px-4 py-2 bg-quantum-500 text-white rounded-lg font-medium hover:bg-quantum-600 transition-colors"
            >
              Next Topic →
            </a>
          </div>
        </div>

        <CommentSection pageId="famous-experiments" />
      </div>
    </div>
  );
}
