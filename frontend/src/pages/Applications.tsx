import { useEffect } from "react";
import {
  IconRocket,
  IconLock,
  IconCpu,
  IconArrowsExchange,
} from "@tabler/icons-react";
import { MultipleChoiceQuiz } from "../components/MultipleChoiceQuiz";
import { ShortAnswerQuiz } from "../components/ShortAnswerQuiz";
import { CommentSection } from "../components/CommentSection";
import { QuantumComputer3D } from "../components/QuantumComputer3D";
import { QuantumTeleportation3D } from "../components/QuantumTeleportation3D";
import { ReadingProgressBar } from "../components/ReadingProgress";
import {
  ExplanationLevelToggle,
  ELI5Explanation,
} from "../components/ELI5Mode";
import type { QuizQuestion } from "../types";

const multipleChoiceQuiz1: QuizQuestion = {
  id: "applications-mc-1",
  type: "multiple-choice",
  question: 'Why is quantum cryptography considered "unhackable"?',
  options: [
    "It uses very long passwords",
    "The encryption is too complex to break",
    "Any eavesdropping attempt disturbs the quantum state, alerting users",
    "It's protected by military-grade firewalls",
  ],
  correctAnswer:
    "Any eavesdropping attempt disturbs the quantum state, alerting users",
  explanation:
    "Quantum key distribution exploits a fundamental property of quantum mechanics: measurement disturbs the system. Any attempt to intercept the key changes the quantum states, making eavesdropping detectable.",
};

const multipleChoiceQuiz2: QuizQuestion = {
  id: "applications-mc-2",
  type: "multiple-choice",
  question: 'What is actually teleported in "quantum teleportation"?',
  options: [
    "Physical matter",
    "Energy",
    "The quantum state (information) of a particle",
    "Nothing - it's just a name",
  ],
  correctAnswer: "The quantum state (information) of a particle",
  explanation:
    "Quantum teleportation transfers the quantum state of one particle to another distant particle. The original state is destroyed in the process (no cloning allowed!).",
};

const multipleChoiceQuiz3: QuizQuestion = {
  id: "applications-mc-3",
  type: "multiple-choice",
  question: "What gives quantum computers their potential power?",
  options: [
    "They use faster processors",
    "Superposition and entanglement allow parallel processing of many states",
    "They have more memory",
    "They use better algorithms",
  ],
  correctAnswer:
    "Superposition and entanglement allow parallel processing of many states",
  explanation:
    "Qubits can be in superposition of 0 and 1, and when entangled, they can represent exponentially more states than classical bits. This enables certain computations to be done exponentially faster.",
};

const shortAnswerQuiz: QuizQuestion = {
  id: "applications-sa",
  type: "short-answer",
  question:
    "Describe one potential application of quantum computing that interests you, and explain why quantum computers might be better at it than classical computers.",
  rubric:
    "Student should identify a valid application (drug discovery, cryptography, optimization, simulation) and explain how superposition/entanglement provides an advantage.",
  keyPoints: [
    "valid quantum computing application",
    "explanation of quantum advantage",
    "connection to superposition or entanglement",
  ],
};

export function Applications() {
  useEffect(() => {
    const progress = JSON.parse(
      localStorage.getItem("quantum-learning-progress") ||
        '{"pagesVisited":[],"quizzesCompleted":[],"quizScores":{}}'
    );
    if (!progress.pagesVisited.includes("applications")) {
      progress.pagesVisited.push("applications");
      localStorage.setItem(
        "quantum-learning-progress",
        JSON.stringify(progress)
      );
    }
  }, []);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
      <ReadingProgressBar pageId="applications" estimatedMinutes={10} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <IconRocket className="h-10 w-10 text-emerald-600" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
              Real Applications
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            From sci-fi to reality: quantum entanglement is changing our world
          </p>
          <div className="flex items-center gap-4 mt-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Beginner
            </span>
            <span className="text-gray-500 text-sm">~10 min read</span>
          </div>
        </div>

        <ExplanationLevelToggle />

        <div className="mb-8">
          <ELI5Explanation topic="applications" />
        </div>

        {/* QKD Section */}
        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-emerald-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <IconLock className="h-7 w-7 text-emerald-600" />
            <span>Quantum Cryptography (QKD)</span>
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Quantum Key Distribution is already in use today! Banks,
              governments, and research institutions use QKD to share encryption
              keys with <strong>provable security</strong>.
            </p>
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border-2 border-emerald-200">
              <h4 className="font-semibold text-emerald-800 mb-3">
                How It Works:
              </h4>
              <ol className="space-y-2 text-gray-700">
                <li>
                  <strong>1.</strong> Alice sends Bob qubits encoded with random
                  bits
                </li>
                <li>
                  <strong>2.</strong> Bob measures them in random bases
                </li>
                <li>
                  <strong>3.</strong> They compare bases publicly (not results!)
                </li>
                <li>
                  <strong>4.</strong> Matching bases become the secret key
                </li>
                <li>
                  <strong>5.</strong> Any eavesdropping creates errors they can
                  detect!
                </li>
              </ol>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200 mt-4">
              <p className="text-gray-700">
                <strong>🌍 Real World:</strong> China's 2,000km quantum network
                and the Micius satellite are already performing secure quantum
                communications!
              </p>
            </div>
          </div>
        </div>

        <MultipleChoiceQuiz question={multipleChoiceQuiz1} />

        {/* Quantum Computing Section */}
        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-purple-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <IconCpu className="h-7 w-7 text-purple-600" />
            <span>Quantum Computing</span>
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Quantum computers harness entanglement and superposition to
              perform certain calculations exponentially faster than any
              classical computer.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl border-2 border-purple-200">
                <h4 className="font-bold text-purple-800 mb-2">
                  💊 Drug Discovery
                </h4>
                <p className="text-gray-600 text-sm">
                  Simulate molecular interactions to find new medicines faster
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">
                  🔐 Cryptography
                </h4>
                <p className="text-gray-600 text-sm">
                  Break current encryption (Shor's algorithm) — but also create
                  new, stronger encryption
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-xl border-2 border-emerald-200">
                <h4 className="font-bold text-emerald-800 mb-2">
                  📈 Optimization
                </h4>
                <p className="text-gray-600 text-sm">
                  Solve complex logistics, finance, and scheduling problems
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-xl border-2 border-amber-200">
                <h4 className="font-bold text-amber-800 mb-2">
                  🧪 Materials Science
                </h4>
                <p className="text-gray-600 text-sm">
                  Design new materials, batteries, and superconductors
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-indigo-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4">
            Interactive: Quantum Computer Simulation
          </h2>
          <p className="text-gray-600 mb-6">
            Explore how qubits work! See superposition and entanglement in
            action, and run simple quantum algorithms.
          </p>
          <QuantumComputer3D />
        </div>

        <MultipleChoiceQuiz question={multipleChoiceQuiz3} />

        {/* Teleportation Section */}
        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-cyan-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <IconArrowsExchange className="h-7 w-7 text-cyan-600" />
            <span>Quantum Teleportation</span>
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              No, we can't teleport people yet! But we can teleport{" "}
              <strong>quantum states</strong> — the complete quantum information
              of a particle — from one location to another.
            </p>
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border-2 border-cyan-200">
              <h4 className="font-semibold text-cyan-800 mb-3">
                The Teleportation Protocol:
              </h4>
              <ol className="space-y-2 text-gray-700">
                <li>
                  <strong>1.</strong> Alice and Bob share an entangled pair
                </li>
                <li>
                  <strong>2.</strong> Alice has a particle whose state she wants
                  to send
                </li>
                <li>
                  <strong>3.</strong> Alice performs a joint measurement on her
                  particles
                </li>
                <li>
                  <strong>4.</strong> She tells Bob her measurement result
                  (classical info)
                </li>
                <li>
                  <strong>5.</strong> Bob applies corrections based on this info
                </li>
                <li>
                  <strong>6.</strong> Bob's particle now has Alice's original
                  state!
                </li>
              </ol>
            </div>
            <div className="bg-gradient-to-r from-rose-50 to-red-50 p-5 rounded-xl border border-rose-200 mt-4">
              <p className="text-gray-700">
                <strong>⚠️ Important:</strong> This doesn't allow FTL
                communication! The classical information (step 4) must travel at
                normal speeds.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 mb-8 border-2 border-quantum-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4">
            Interactive: Quantum Teleportation
          </h2>
          <p className="text-gray-600 mb-6">
            Watch the teleportation protocol in action! See how the state is
            transferred using entanglement plus classical communication.
          </p>
          <QuantumTeleportation3D />
        </div>

        <MultipleChoiceQuiz question={multipleChoiceQuiz2} />
        <ShortAnswerQuiz question={shortAnswerQuiz} />

        <div className="bg-gradient-to-r from-quantum-50 to-entangled-50 rounded-xl p-8 mb-8 border-2 border-quantum-200 shadow-sm">
          <h2 className="font-display text-2xl font-semibold mb-4">
            🚀 The Future
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              We're still in the early days of quantum technology. Current
              quantum computers have hundreds of qubits, but we'll need millions
              for the most powerful applications.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">🔜 Coming Soon</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Quantum internet for secure global communication</li>
                  <li>• Drug discovery with quantum simulations</li>
                  <li>• Financial optimization at unprecedented scale</li>
                </ul>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">🔮 Far Future</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Fault-tolerant, million-qubit computers</li>
                  <li>• Room-temperature quantum computing</li>
                  <li>• Quantum sensing and imaging</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* REMOVED: Escape Room CTA section */}

        <CommentSection pageId="applications" />
      </div>
    </div>
  );
}
