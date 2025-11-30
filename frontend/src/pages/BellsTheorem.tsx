import { useEffect } from "react";
import { IconMathFunction, IconChartBar } from "@tabler/icons-react";
import { MultipleChoiceQuiz } from "../components/MultipleChoiceQuiz";
import { ShortAnswerQuiz } from "../components/ShortAnswerQuiz";
import { CommentSection } from "../components/CommentSection";
import { BellTestApparatus } from "../components/BellTestApparatus";
import { Timeline, QUANTUM_TIMELINE } from "../components/Timeline";
import { ReadingProgressBar } from "../components/ReadingProgress";
import {
  ExplanationLevelToggle,
  ELI5Explanation,
} from "../components/ELI5Mode";
import type { QuizQuestion } from "../types";

const multipleChoiceQuiz1: QuizQuestion = {
  id: "bells-theorem-mc-1",
  type: "multiple-choice",
  question: "What does Bell's theorem prove?",
  options: [
    "Quantum mechanics is wrong",
    "Hidden variables exist",
    "No local hidden variable theory can reproduce all quantum predictions",
    "Faster-than-light communication is possible",
  ],
  correctAnswer:
    "No local hidden variable theory can reproduce all quantum predictions",
  explanation:
    "Bell's theorem shows that ANY theory with local hidden variables must satisfy certain inequalities. Quantum mechanics violates these, and experiments confirm the violations.",
};

const multipleChoiceQuiz2: QuizQuestion = {
  id: "bells-theorem-mc-2",
  type: "multiple-choice",
  question: "What is the classical limit for the CHSH inequality?",
  options: ["S ≤ 1", "S ≤ 2", "S ≤ 2.83", "S ≤ 4"],
  correctAnswer: "S ≤ 2",
  explanation:
    "The CHSH form of Bell's inequality states S ≤ 2 for any local hidden variable theory. Quantum mechanics predicts S can reach 2√2 ≈ 2.83.",
};

const multipleChoiceQuiz3: QuizQuestion = {
  id: "bells-theorem-mc-3",
  type: "multiple-choice",
  question: "Why was Alain Aspect's 1982 experiment so important?",
  options: [
    "It was the first quantum experiment ever",
    "It used fast-switching to close the locality loophole",
    "It proved quantum computers are possible",
    "It discovered a new particle",
  ],
  correctAnswer: "It used fast-switching to close the locality loophole",
  explanation:
    'Aspect used acoustic-optical switches to change measurement settings faster than light could travel between detectors, closing the "locality loophole".',
};

const shortAnswerQuiz: QuizQuestion = {
  id: "bells-theorem-sa",
  type: "short-answer",
  question:
    "Explain in your own words why Bell's theorem was so revolutionary for physics.",
  rubric:
    "Student should explain: Bell found a way to experimentally test philosophical questions, it ruled out local hidden variables, confirmed quantum non-locality, led to practical applications like quantum cryptography.",
  keyPoints: [
    "turned philosophy into testable physics",
    "ruled out local hidden variables",
    "confirmed quantum non-locality",
    "enabled quantum technologies",
  ],
};

export function BellsTheorem() {
  useEffect(() => {
    const progress = JSON.parse(
      localStorage.getItem("quantum-learning-progress") ||
        '{"pagesVisited":[],"quizzesCompleted":[],"quizScores":{}}'
    );
    if (!progress.pagesVisited.includes("bells-theorem")) {
      progress.pagesVisited.push("bells-theorem");
      localStorage.setItem(
        "quantum-learning-progress",
        JSON.stringify(progress)
      );
    }
  }, []);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
      <ReadingProgressBar pageId="bells-theorem" estimatedMinutes={15} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <IconMathFunction className="h-10 w-10 text-purple-600" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
              Bell's Theorem
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            The mathematical proof that settled the Einstein-Bohr debate
          </p>
          <div className="flex items-center gap-4 mt-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              Advanced
            </span>
            <span className="text-gray-500 text-sm">~15 min read</span>
          </div>
        </div>

        <ExplanationLevelToggle />

        <div className="mb-8">
          <ELI5Explanation topic="bellTheorem" />
        </div>

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-purple-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4">
            The Breakthrough
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              For nearly 30 years after EPR, the debate between Einstein and
              Bohr seemed purely philosophical — there was no way to
              experimentally determine who was right. Then, in 1964, physicist
              <strong> John Stewart Bell</strong> changed everything.
            </p>
            <p>
              Bell discovered something remarkable: if hidden variables exist
              (as Einstein believed), then measurements on entangled particles
              must satisfy certain mathematical constraints — now called{" "}
              <strong>Bell inequalities</strong>.
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border-2 border-purple-200">
              <p className="font-semibold text-purple-800 mb-2">
                Bell's Key Insight:
              </p>
              <p className="text-gray-700">
                Quantum mechanics predicts correlations that <em>violate</em>{" "}
                these inequalities. So if experiments show violations,
                Einstein's hidden variables are impossible!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-indigo-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <IconChartBar className="h-6 w-6 text-indigo-600" />
            <span>Interactive: Bell Test Apparatus</span>
          </h2>
          <p className="text-gray-600 mb-6">
            Explore how a Bell test works! Adjust the detector angles and run
            measurements to see how correlations change. Can you find settings
            that violate the classical bound?
          </p>
          <BellTestApparatus />
        </div>

        <MultipleChoiceQuiz question={multipleChoiceQuiz1} />

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-quantum-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4">
            The CHSH Inequality
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              The most common form of Bell's inequality used in experiments is
              the CHSH inequality:
            </p>
            <div className="bg-gray-900 text-white p-6 rounded-xl font-mono text-center text-xl">
              S = |E(a,b) - E(a,b') + E(a',b) + E(a',b')| ≤ 2
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-xl border-2 border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2">
                  Classical Limit
                </h4>
                <p className="text-3xl font-bold text-amber-600 mb-2">S ≤ 2</p>
                <p className="text-gray-600 text-sm">
                  Any theory with local hidden variables
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl border-2 border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">
                  Quantum Maximum
                </h4>
                <p className="text-3xl font-bold text-purple-600 mb-2">
                  S = 2√2 ≈ 2.83
                </p>
                <p className="text-gray-600 text-sm">
                  Quantum mechanics prediction
                </p>
              </div>
            </div>
          </div>
        </div>

        <MultipleChoiceQuiz question={multipleChoiceQuiz2} />

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-green-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4">
            What Does It Mean?
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Bell's theorem forces us to give up at least one of these deeply
              held beliefs:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-rose-50 to-red-50 p-5 rounded-xl border-2 border-rose-200 text-center">
                <h4 className="font-bold text-rose-800 mb-2">Locality</h4>
                <p className="text-gray-600 text-sm">
                  Things can only be influenced by their immediate surroundings
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-200 text-center">
                <h4 className="font-bold text-blue-800 mb-2">Realism</h4>
                <p className="text-gray-600 text-sm">
                  Particles have definite properties before measurement
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200 text-center">
                <h4 className="font-bold text-green-800 mb-2">Free Will</h4>
                <p className="text-gray-600 text-sm">
                  Experimenters can freely choose what to measure
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-5 rounded-xl border border-gray-200 mt-4">
              <p className="text-gray-700">
                <strong>
                  Most physicists choose to abandon "local realism"
                </strong>{" "}
                — accepting that quantum mechanics is fundamentally non-local
                and that particles don't have definite properties until
                measured. This is strange, but experiments consistently confirm
                it!
              </p>
            </div>
          </div>
        </div>

        <Timeline events={QUANTUM_TIMELINE} title="History of Bell Tests" />

        <MultipleChoiceQuiz question={multipleChoiceQuiz3} />
        <ShortAnswerQuiz question={shortAnswerQuiz} />

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 mb-8 border-2 border-green-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4 text-green-800">
            🏆 The 2022 Nobel Prize
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            In 2022, the Nobel Prize in Physics was awarded to{" "}
            <strong>Alain Aspect</strong>,<strong> John Clauser</strong>, and{" "}
            <strong>Anton Zeilinger</strong> for their experiments with
            entangled photons, establishing the violation of Bell inequalities
            and pioneering quantum information science.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 mb-8 border-2 border-quantum-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Continue Learning
              </h3>
              <p className="text-gray-600 text-sm">
                Next: Famous Experiments — See how Bell tests were actually
                performed
              </p>
            </div>
            <a
              href="/famous-experiments"
              className="px-4 py-2 bg-quantum-500 text-white rounded-lg font-medium hover:bg-quantum-600 transition-colors"
            >
              Next Topic →
            </a>
          </div>
        </div>

        <CommentSection pageId="bells-theorem" />
      </div>
    </div>
  );
}
