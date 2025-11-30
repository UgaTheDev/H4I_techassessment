import { IconMathFunction, IconFlask, IconAlertTriangle } from '@tabler/icons-react';
import { MultipleChoiceQuiz } from '../components/MultipleChoiceQuiz';
import { ShortAnswerQuiz } from '../components/ShortAnswerQuiz';
import { CommentSection } from '../components/CommentSection';
import { BellTheoremVisualization } from '../components/BellTheoremVisualization';
import type { QuizQuestion } from '../types';

const multipleChoiceQuiz1: QuizQuestion = {
  id: 'bells-theorem-mc-1',
  type: 'multiple-choice',
  question: 'What does Bell\'s inequality violation prove?',
  options: [
    'Quantum mechanics is incorrect',
    'Local hidden variable theories cannot explain quantum mechanics',
    'Particles can communicate faster than light',
    'Einstein was correct about "spooky action"'
  ],
  correctAnswer: 'Local hidden variable theories cannot explain quantum mechanics',
  explanation: 'Bell\'s inequality sets a limit on correlations possible under local realism. Quantum mechanics predicts violations of this limit, and experiments confirm these violations, proving that no local hidden variable theory can explain quantum mechanics.'
};

const multipleChoiceQuiz2: QuizQuestion = {
  id: 'bells-theorem-mc-2',
  type: 'multiple-choice',
  question: 'What was the maximum correlation value that quantum mechanics predicts, violating Bell\'s inequality limit of 2?',
  options: [
    'Exactly 2.0',
    'Approximately 2.828 (2√2)',
    'Approximately 3.14 (π)',
    'It varies randomly'
  ],
  correctAnswer: 'Approximately 2.828 (2√2)',
  explanation: 'Quantum mechanics predicts a maximum correlation of 2√2 ≈ 2.828, clearly violating Bell\'s inequality limit of 2. This is known as the Tsirelson bound.'
};

const shortAnswerQuiz: QuizQuestion = {
  id: 'bells-theorem-sa',
  type: 'short-answer',
  question: 'Explain in your own words why Bell\'s inequality violation proves that quantum mechanics cannot be explained by local hidden variables.',
  rubric: 'Student should mention: 1) What local hidden variables are, 2) That Bell\'s inequality sets limits on correlations under local realism, 3) That quantum mechanics predicts violations of these limits, 4) That experiments confirm QM predictions exceed classical bounds',
  keyPoints: [
    'local hidden variables theory',
    'correlation limits under local realism',
    'quantum mechanics predictions exceed classical bounds',
    'experimental violation confirms quantum mechanics'
  ]
};

export function BellsTheorem() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <IconMathFunction className="h-10 w-10 text-quantum-600" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
              Bell's Theorem
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            The proof that changed physics forever
          </p>
        </div>

        {/* Introduction */}
        <div className="glass-card rounded-xl p-8 mb-8 border-2 border-quantum-200">
          <h2 className="font-display text-2xl font-semibold mb-4">
            The Question That Needed Answering
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              After the Einstein-Podolsky-Rosen (EPR) paper in 1935, physics had a fundamental question: 
              Are quantum particles truly random and entangled, or do they have hidden properties we just 
              can't see yet?
            </p>
            <p>
              Einstein believed in "local realism" — the idea that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Reality:</strong> Physical properties exist whether or not we observe them</li>
              <li><strong>Locality:</strong> Objects can only be influenced by their immediate surroundings</li>
            </ul>
            <p>
              For nearly 30 years, this remained a philosophical debate. Then in 1964, Irish physicist 
              John Stewart Bell asked a brilliant question: <em>"What if we could test this experimentally?"</em>
            </p>
          </div>
        </div>

        {/* Bell's Insight */}
        <div className="glass-card rounded-xl p-8 mb-8 border-2 border-entangled-200">
          <h2 className="font-display text-2xl font-semibold mb-4">
            Bell's Brilliant Insight
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Bell realized that if Einstein was right — if particles had definite hidden properties all along — 
              then there would be mathematical limits on how correlated measurements could be. He derived an 
              inequality that any local hidden variable theory must obey.
            </p>

            <div className="bg-quantum-50 border-l-4 border-quantum-500 p-6 rounded">
              <h3 className="font-semibold text-quantum-900 mb-3">The Setup:</h3>
              <p className="mb-3">
                Imagine Alice and Bob each receive one particle from an entangled pair. They can measure their 
                particle's spin along different angles (let's call them a, a', b, and b'). Bell showed that if 
                hidden variables exist, the correlation between their measurements must satisfy:
              </p>
              <div className="bg-white p-4 rounded border-2 border-quantum-300 text-center font-mono text-lg">
                |E(a,b) - E(a,b')| + |E(a',b) + E(a',b')| ≤ 2
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Where E(x,y) represents the correlation between measurements at angles x and y
              </p>
            </div>

            <p>
              This is Bell's inequality. Any theory based on local hidden variables must respect this limit. 
              But quantum mechanics predicts violations of this inequality — correlations that exceed 2!
            </p>

            <p>
              The maximum quantum correlation can reach approximately 2.828 (2√2), clearly violating the 
              inequality. This meant one thing: <strong>we could test who was right through experiment</strong>.
            </p>
          </div>
        </div>

        {/* Quiz 1 */}
        <MultipleChoiceQuiz question={multipleChoiceQuiz2} />

        {/* Interactive Visualization */}
        <div className="glass-card rounded-xl p-8 mb-8 border-2 border-purple-200">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <span className="text-3xl">🎮</span>
            <span>Interactive: Test Bell's Inequality Yourself!</span>
          </h2>
          <p className="text-gray-700 mb-6">
            Adjust Alice and Bob's measurement angles below and click "Measure Correlation" to see 
            if quantum mechanics violates Bell's inequality. Watch for correlations above 0.707!
          </p>
          <BellTheoremVisualization />
        </div>

        {/* The Experiments */}
        <div className="glass-card rounded-xl p-8 mb-8 border-2 border-green-200">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <IconFlask className="h-6 w-6 text-green-600" />
            <span>The Experiments: Testing Reality</span>
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Starting in the 1970s, physicists began testing Bell's inequality in laboratories. The most 
              famous early experiments were conducted by Alain Aspect and his team in Paris in the early 1980s.
            </p>

            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
              <h3 className="font-semibold text-green-900 mb-3">Experimental Design:</h3>
              <ol className="space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">1.</span>
                  <span>Create pairs of entangled photons</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">2.</span>
                  <span>Send them to two detectors far apart (to ensure no signal could travel between them)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">3.</span>
                  <span>Randomly choose measurement angles at the last possible moment</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">4.</span>
                  <span>Measure correlations and compare to Bell's inequality</span>
                </li>
              </ol>
            </div>

            <p>
              <strong>The results were clear and consistent across all experiments:</strong> Bell's inequality 
              was violated. The correlations matched quantum mechanics' predictions, not local hidden variable 
              theories.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
              <p className="font-semibold text-blue-900 mb-2">
                🏆 2022 Nobel Prize in Physics
              </p>
              <p className="text-gray-700">
                Alain Aspect, John Clauser, and Anton Zeilinger were awarded the Nobel Prize for their 
                groundbreaking experiments proving Bell's theorem and establishing quantum entanglement as 
                real beyond doubt.
              </p>
            </div>
          </div>
        </div>

        {/* Quiz 2 */}
        <MultipleChoiceQuiz question={multipleChoiceQuiz1} />

        {/* What It Means */}
        <div className="glass-card rounded-xl p-8 mb-8 border-2 border-orange-200">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center space-x-2">
            <IconAlertTriangle className="h-6 w-6 text-orange-600" />
            <span>What Does This Mean?</span>
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Bell's theorem and its experimental confirmation force us to give up at least one deeply held 
              intuition about reality:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">Give up Realism?</h3>
                <p className="text-gray-700">
                  Accept that physical properties don't exist until measured. The moon isn't there when nobody's 
                  looking (as Einstein sarcastically put it).
                </p>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 p-6 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Give up Locality?</h3>
                <p className="text-gray-700">
                  Accept that measurements here can instantly affect measurements arbitrarily far away, seemingly 
                  violating the spirit (though not the letter) of relativity.
                </p>
              </div>
            </div>

            <p>
              Most physicists accept the standard quantum mechanics interpretation: we give up realism. 
              Particles don't have definite properties until measured, and measurements create correlations 
              that appear non-local but can't transmit information faster than light.
            </p>

            <div className="bg-quantum-50 border-l-4 border-quantum-500 p-6 rounded">
              <p className="font-semibold text-quantum-900 mb-2">The Bottom Line:</p>
              <p className="text-gray-700">
                Bell's theorem proves that if quantum mechanics is correct (and all experimental evidence says 
                it is), then the universe is far stranger than Einstein wanted to believe. Entanglement is real, 
                and there are no hidden variables waiting to restore classical common sense.
              </p>
            </div>
          </div>
        </div>

        {/* Short Answer Quiz */}
        <ShortAnswerQuiz question={shortAnswerQuiz} />

        {/* Closing Loopholes */}
        <div className="glass-card rounded-xl p-8 mb-8 border-2 border-gray-200">
          <h2 className="font-display text-2xl font-semibold mb-4">
            Closing the Loopholes
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Skeptics pointed out potential loopholes in early experiments. Could the detectors be communicating? 
              Could we be selecting only certain detection events? Modern experiments have systematically closed 
              these loopholes:
            </p>

            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <span className="text-quantum-600 font-bold">•</span>
                <div>
                  <strong>Locality loophole:</strong> Experiments with detectors far enough apart that light 
                  couldn't travel between them during measurement
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-quantum-600 font-bold">•</span>
                <div>
                  <strong>Detection loophole:</strong> High-efficiency detectors that capture nearly all particles
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-quantum-600 font-bold">•</span>
                <div>
                  <strong>Freedom-of-choice loophole:</strong> Using cosmic photons from distant quasars to 
                  choose measurement settings, ensuring the choices couldn't have been predetermined
                </div>
              </li>
            </ul>

            <p>
              Every loophole has been closed. The verdict is in: quantum mechanics is correct, entanglement 
              is real, and local hidden variables are ruled out.
            </p>
          </div>
        </div>

        {/* Comments */}
        <CommentSection pageId="bells-theorem" />
      </div>
    </div>
  );
}
