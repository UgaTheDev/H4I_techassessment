import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IconBabyCarriage, IconSchool, IconBrain } from "@tabler/icons-react";

type ExplanationLevel = "eli5" | "normal" | "advanced";

interface ELI5ContextType {
  level: ExplanationLevel;
  setLevel: (level: ExplanationLevel) => void;
  isELI5: boolean;
  isAdvanced: boolean;
}

const ELI5Context = createContext<ELI5ContextType | undefined>(undefined);

export function ELI5Provider({ children }: { children: ReactNode }) {
  const [level, setLevelState] = useState<ExplanationLevel>("normal");

  useEffect(() => {
    const saved = localStorage.getItem(
      "quantum-explanation-level"
    ) as ExplanationLevel | null;
    if (saved) {
      setLevelState(saved);
    }
  }, []);

  const setLevel = (newLevel: ExplanationLevel) => {
    setLevelState(newLevel);
    localStorage.setItem("quantum-explanation-level", newLevel);
  };

  return (
    <ELI5Context.Provider
      value={{
        level,
        setLevel,
        isELI5: level === "eli5",
        isAdvanced: level === "advanced",
      }}
    >
      {children}
    </ELI5Context.Provider>
  );
}

export function useELI5() {
  const context = useContext(ELI5Context);
  if (!context) {
    throw new Error("useELI5 must be used within ELI5Provider");
  }
  return context;
}

// Content component that shows different explanations based on level
interface AdaptiveContentProps {
  eli5: ReactNode;
  normal: ReactNode;
  advanced?: ReactNode;
}

export function AdaptiveContent({
  eli5,
  normal,
  advanced,
}: AdaptiveContentProps) {
  const { level } = useELI5();

  if (level === "eli5") return <>{eli5}</>;
  if (level === "advanced" && advanced) return <>{advanced}</>;
  return <>{normal}</>;
}

// Level selector toggle - LIGHT MODE ONLY
export function ExplanationLevelToggle() {
  const { level, setLevel } = useELI5();

  const levels: {
    value: ExplanationLevel;
    label: string;
    icon: ReactNode;
    description: string;
  }[] = [
    {
      value: "eli5",
      label: "Simple",
      icon: <IconBabyCarriage className="w-4 h-4" />,
      description: "Everyday analogies, no jargon",
    },
    {
      value: "normal",
      label: "Standard",
      icon: <IconSchool className="w-4 h-4" />,
      description: "Balanced explanations",
    },
    {
      value: "advanced",
      label: "Advanced",
      icon: <IconBrain className="w-4 h-4" />,
      description: "Technical details, math",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 mb-6 border-2 border-quantum-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">
            Explanation Level
          </h4>
          <p className="text-xs text-gray-500">
            {levels.find((l) => l.value === level)?.description}
          </p>
        </div>
      </div>

      <div className="flex rounded-lg bg-gray-100 p-1">
        {levels.map((l) => (
          <button
            key={l.value}
            onClick={() => setLevel(l.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              level === l.value
                ? l.value === "eli5"
                  ? "bg-amber-500 text-white shadow-sm"
                  : l.value === "advanced"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-quantum-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            {l.icon}
            <span className="hidden sm:inline">{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Pre-built explanations for key concepts
export const ELI5_EXPLANATIONS: Record<
  string,
  { eli5: string; normal: string; advanced: string }
> = {
  entanglement: {
    eli5: `Imagine you have two magic coins. You flip one coin, and it lands on heads. At that EXACT moment, no matter how far away the other coin is — even on the moon! — it will land on tails. Every. Single. Time.

That's quantum entanglement! Two tiny particles get "connected" in a special way. When you look at one particle, you instantly know what the other one is doing.

It's like having a best friend who always picks the opposite ice cream flavor as you, even if they're in another country and don't know what you picked!`,

    normal: `Quantum entanglement occurs when two particles become correlated in such a way that measuring one particle instantly determines properties of the other particle, regardless of the distance between them.

Before measurement, both particles exist in a superposition of states. When you measure one particle, both particles "collapse" to definite, correlated states simultaneously.

Importantly, this cannot be used for faster-than-light communication because the measurement outcomes appear random — the correlation is only visible when you compare results.`,

    advanced: `Quantum entanglement describes a state where the composite system cannot be factored into individual particle states: |ψ⟩ ≠ |ψ₁⟩ ⊗ |ψ₂⟩

For a maximally entangled Bell state: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2

This exhibits non-local correlations that violate Bell inequalities (CHSH: S ≤ 2), with quantum mechanics predicting S_max = 2√2 ≈ 2.83.

The reduced density matrix for each subsystem is maximally mixed (ρ = I/2), yet measurements show perfect anti-correlation in any basis.`,
  },

  superposition: {
    eli5: `You know how in video games, sometimes a character can be in two places at once? That's kind of like superposition!

Imagine a spinning coin. While it's spinning, it's not heads AND it's not tails — it's kind of BOTH at the same time. Only when it lands (when you "look" at it) does it become definitely one or the other.

Tiny quantum particles can do this for real! They can be in two states at once, until someone checks what state they're in.`,

    normal: `Superposition is a fundamental principle of quantum mechanics where a particle can exist in multiple states simultaneously until measured.

Unlike classical physics where a coin is either heads OR tails, a quantum system can be in a combination of both states. The particle doesn't have a definite value until observation "collapses" it to one state.

This is described by the wavefunction, which gives the probability of measuring each possible outcome.`,

    advanced: `A quantum superposition is a linear combination of eigenstates:
|ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1

The Born rule gives measurement probabilities: P(0) = |α|², P(1) = |β|²

Superposition is a consequence of the linearity of the Schrödinger equation and the vector space structure of Hilbert space. Decoherence through environmental interaction causes apparent collapse to classical behavior.`,
  },

  bellTheorem: {
    eli5: `Remember those magic coins? Some people thought maybe they weren't really magic — maybe there was just a secret note inside each coin telling it what to do.

A very clever scientist named John Bell figured out a test. He said: "If there ARE secret notes, the coins can only match up a certain amount of the time. But if it's REAL magic, they'll match up MORE often than that."

Scientists did the test many times, and guess what? The coins matched up MORE than secret notes could explain. The magic is real!`,

    normal: `Bell's Theorem proves that no "local hidden variable" theory can reproduce all predictions of quantum mechanics.

Einstein believed particles must have predetermined properties (hidden variables) that we simply don't know. Bell showed that if hidden variables existed, measurements would be correlated in specific, limited ways.

Quantum mechanics predicts stronger correlations than any hidden variable theory allows. Experiments consistently confirm quantum predictions, ruling out local hidden variables.`,

    advanced: `Bell's Theorem establishes that local hidden variable theories must satisfy Bell inequalities, such as CHSH: |S| ≤ 2, where S = ⟨AB⟩ - ⟨AB'⟩ + ⟨A'B⟩ + ⟨A'B'⟩

Quantum mechanics predicts maximum violation: S_QM = 2√2 ≈ 2.83

The theorem relies on locality (no FTL influences), realism (definite properties exist), and measurement independence (free choice of measurement settings).

Loophole-free Bell tests (2015) closed detection and locality loopholes, definitively ruling out local realism.`,
  },

  epr: {
    eli5: `Einstein was a super smart scientist, but he didn't like quantum physics. He thought it was too weird!

He said: "If measuring one particle instantly affects another far away, that's like magic! There must be a simpler explanation."

Einstein created a puzzle (called EPR) to prove quantum physics was wrong. But other scientists eventually solved the puzzle and showed that Einstein was actually wrong this time — quantum physics really IS that weird!`,

    normal: `The EPR Paradox was Einstein's famous argument against quantum mechanics. Einstein, Podolsky, and Rosen argued in 1935 that if quantum mechanics is complete, it must allow "spooky action at a distance."

They reasoned: measuring one particle instantly determines the other's state. Since nothing can travel faster than light, the particles must have had predetermined values all along.

Bohr disagreed, arguing that quantum systems can't be separated from the measurement process. Bell later provided a way to test this, and experiments confirmed Bohr's view.`,

    advanced: `The EPR argument assumes:
1. Locality: No faster-than-light influences
2. Realism: Physical properties exist independent of observation  
3. Completeness: A complete theory predicts all measurable properties

EPR: If QM is complete, measuring A determines B's state at spacelike separation → violates locality. Therefore, QM must be incomplete (hidden variables exist).

Bell showed these assumptions lead to testable inequalities. Experiments violating Bell inequalities force us to abandon either locality or realism (or both).`,
  },

  experiments: {
    eli5: `Scientists wanted to prove whether the "quantum magic" was real, so they built special machines to test it.

The first big test was by Alain Aspect in 1982. He set up a way to quickly change what he was measuring, faster than light could travel between the particles. The particles still matched up perfectly!

Since then, scientists have done the test thousands of times with better and better machines. The magic always works!`,

    normal: `Experimental tests of Bell inequalities began with Aspect's 1982 experiment, which included fast-switching polarizers to close the locality loophole.

Key experiments include:
• Aspect (1982): First convincing Bell test with switching
• Zeilinger et al. (1998): Long-distance entanglement
• Loophole-free tests (2015): Simultaneously closed all major loopholes

These experiments consistently show violations of Bell inequalities matching quantum predictions, confirming non-local correlations.`,

    advanced: `Critical experimental milestones:

Aspect (1982): Acoustic-optical switches at 50 MHz, S = 2.697 ± 0.015

Hensen et al. (2015): First loophole-free test using NV centers, 1.3 km separation, p = 0.039

Key loopholes addressed:
• Detection loophole: η > 82.8% for CHSH
• Locality loophole: Spacelike separation of measurement events  
• Freedom-of-choice: Cosmic Bell test using quasar photons (2018)

Statistical significance: >5σ rejection of local realism`,
  },

  applications: {
    eli5: `So what can we DO with quantum magic? Lots of cool things!

🔐 Secret Messages: Quantum physics lets us send messages that NO ONE can spy on. If anyone tries to peek, we'll know instantly!

💻 Super Computers: Quantum computers can solve puzzles that regular computers would take millions of years to figure out.

📡 Teleportation: We can "teleport" information (not people yet!) from one place to another using entangled particles.`,

    normal: `Quantum entanglement enables revolutionary technologies:

Quantum Key Distribution (QKD): Provably secure communication. Any eavesdropping disturbs the quantum state, alerting users. Already deployed in banking and government networks.

Quantum Computing: Entangled qubits enable parallel processing for optimization, cryptography, and simulation tasks impossible for classical computers.

Quantum Teleportation: Transfer quantum states using entanglement plus classical communication. Essential for quantum networks and distributed computing.`,

    advanced: `Key applications leveraging entanglement:

QKD Protocols:
• BB84: Non-entanglement based, security from no-cloning
• E91: Entanglement-based, security from Bell violation
• Device-independent QKD: Security without trusting devices

Quantum Computing:
• CNOT gates create entanglement: CNOT|+⟩|0⟩ = |Φ⁺⟩
• Error correction requires multi-qubit entanglement
• Quantum advantage demonstrated (Google, 2019)

Quantum Networks:
• Quantum repeaters for long-distance entanglement distribution
• Quantum internet: Entanglement as a resource`,
  },
};

// Component to render ELI5 explanations for a topic - LIGHT MODE ONLY
interface ELI5ExplanationProps {
  topic: keyof typeof ELI5_EXPLANATIONS;
}

export function ELI5Explanation({ topic }: ELI5ExplanationProps) {
  const { level } = useELI5();
  const explanations = ELI5_EXPLANATIONS[topic];

  if (!explanations) return null;

  const content =
    level === "eli5"
      ? explanations.eli5
      : level === "advanced"
      ? explanations.advanced
      : explanations.normal;

  const styles = {
    eli5: {
      bg: "bg-gradient-to-br from-amber-50 to-orange-50",
      border: "border-2 border-amber-300",
      icon: <IconBabyCarriage className="w-5 h-5" />,
      iconColor: "text-amber-600",
      label: "Simple Explanation",
    },
    normal: {
      bg: "bg-gradient-to-br from-gray-50 to-slate-50",
      border: "border border-gray-200",
      icon: <IconSchool className="w-5 h-5" />,
      iconColor: "text-gray-600",
      label: "Standard Explanation",
    },
    advanced: {
      bg: "bg-gradient-to-br from-purple-50 to-indigo-50",
      border: "border-2 border-purple-300",
      icon: <IconBrain className="w-5 h-5" />,
      iconColor: "text-purple-600",
      label: "Advanced Details",
    },
  };

  const style = styles[level];

  return (
    <div className={`rounded-xl p-6 ${style.bg} ${style.border} shadow-sm`}>
      <div className={`flex items-center gap-2 mb-4 ${style.iconColor}`}>
        {style.icon}
        <span className="text-sm font-semibold">{style.label}</span>
      </div>
      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
        {content}
      </div>
    </div>
  );
}
