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

export const ELI5_EXPLANATIONS: Record<
  string,
  { eli5: string; normal: string; advanced: string }
> = {
  entanglement: {
    eli5: `Imagine you have two magic coins. You flip one coin, and it lands on heads. At that EXACT moment, no matter how far away the other coin is, it will land on tails. Every. Single. Time.

That's quantum entanglement! Two tiny particles get "connected" in a special way. When you look at one particle, you instantly know what the other one is doing.

It's like having a best friend who always picks the opposite ice cream flavor as you, even if they're in another country and don't know what you picked!`,

    normal: `Quantum entanglement occurs when two particles become correlated in such a way that measuring one particle instantly determines properties of the other particle, regardless of the distance between them.

Before measurement, both particles exist in a superposition of states. When you measure one particle, the quantum state "collapses" to definite, correlated states simultaneously.

Important: This cannot be used for faster-than-light communication because the measurement outcomes appear random to each observer. The correlation is only visible when comparing results using conventional light-speed signals (no-communication theorem).`,

    advanced: `Quantum entanglement describes a state where the composite system cannot be factored into individual particle states: |ψ⟩ ≠ |ψ₁⟩ ⊗ |ψ₂⟩

For a maximally entangled Bell state: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2

This exhibits non-local correlations that violate Bell inequalities (CHSH: S ≤ 2), with quantum mechanics predicting S_max = 2√2 ≈ 2.83 (Tsirelson bound).

The reduced density matrix for each subsystem is maximally mixed (ρ = I/2), yet measurements show perfect anti-correlation in any basis. Decoherence via environmental interaction causes apparent localization.`,
  },

  superposition: {
    eli5: `You know how in video games, sometimes a character can be in two places at once? That's kind of like superposition!

Imagine a spinning coin. While it's spinning, it's not heads AND it's not tails — it's kind of BOTH at the same time. Only when it lands (when you "look" at it) does it become definitely one or the other.

Tiny quantum particles can do this for real! They can be in two states at once, until someone checks what state they're in.`,

    normal: `Superposition is a fundamental principle of quantum mechanics where a particle can exist in multiple states simultaneously until measured.

Unlike classical physics where a coin is either heads OR tails, a quantum system can be in a combination of both states. The particle doesn't have a definite value until observation collapses it to one state.

This is described by the wavefunction, which gives the probability of measuring each possible outcome. Superposition arises from the linearity of the Schrödinger equation and the vector space structure of Hilbert space.`,

    advanced: `A quantum superposition is a linear combination of eigenstates:
|ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1

The Born rule gives measurement probabilities: P(0) = |α|², P(1) = |β|²

Superposition is a consequence of the linearity of the Schrödinger equation. Decoherence through environmental interaction causes the apparent transition from quantum superposition to classical definite states (pointer basis).`,
  },

  bellTheorem: {
    eli5: `Remember those magic coins? Some people thought maybe they weren't really magic — maybe there was just a secret note inside each coin telling it what to do.

A very clever scientist named John Bell figured out a test in 1964. He said: "If there ARE secret notes, the coins can only match up a certain amount of the time. But if it's REAL magic, they'll match up MORE often than that."

Scientists did the test many times, and guess what? The coins matched up MORE than secret notes could explain. The magic is real!`,

    normal: `Bell's Theorem (1964) proves that no "local hidden variable" theory can reproduce all predictions of quantum mechanics.

Einstein believed particles must have predetermined properties (hidden variables) that we simply don't know. Bell showed mathematically that if hidden variables existed AND locality holds, measurements would be correlated in specific, limited ways (Bell inequalities).

Quantum mechanics predicts stronger correlations than any hidden variable theory allows. Experiments consistently confirm quantum predictions, ruling out local hidden variables. The first convincing Bell test was Aspect et al. (1982).`,

    advanced: `Bell's Theorem establishes that local hidden variable theories must satisfy Bell inequalities, such as CHSH: S = |⟨AB⟩ - ⟨AB'⟩ + ⟨A'B⟩ + ⟨A'B'⟩| ≤ 2

Quantum mechanics predicts maximum violation (Tsirelson bound): S_QM = 2√2 ≈ 2.83

The theorem relies on:
1. Locality: no FTL influences between spacelike separated events
2. Realism: definite properties exist independently of measurement
3. Measurement independence: free choice of measurement settings

Loophole-free Bell tests (2015): Hensen et al. achieved S = 2.42 ± 0.20 with 1.3 km separation, yielding p = 0.039. Giustina et al. and Shalm et al. obtained p ≪ 10⁻⁶.`,
  },

  epr: {
    eli5: `Einstein was a super smart scientist, but he didn't like quantum physics. He thought it was too weird!

He said: "If measuring one particle instantly affects another far away, that's like magic! There must be a simpler explanation."

Einstein created a puzzle (called EPR) in 1935 to prove quantum physics was wrong. But other scientists eventually showed that Einstein was actually wrong this time — quantum physics really IS that weird!`,

    normal: `The EPR Paradox (Einstein, Podolsky, Rosen, 1935) argues against quantum mechanics. If quantum mechanics is complete, measuring one particle appears to instantly determine the other's state. Since nothing travels faster than light, Einstein concluded the particles must have had predetermined values all along, making quantum mechanics incomplete.

Niels Bohr disagreed, arguing that quantum systems can't be separated from the measurement process. Bell later provided a way to test this: if hidden variables exist, certain correlations are mathematically limited (Bell inequalities). Experiments consistently violate Bell inequalities, confirming Bohr.`,

    advanced: `The EPR argument assumes:
1. Locality: No faster-than-light influences
2. Realism: Physical properties exist independent of observation
3. Completeness: A complete theory predicts all measurable properties

EPR's logical structure: If QM is complete, measuring observable A at location 1 determines observable B at location 2 at spacelike separation → violates locality. Therefore, QM must be incomplete (hidden variables).

Bell's response: These assumptions lead to testable inequalities. Experiments violating Bell inequalities force abandonment of either locality OR realism (or both). Modern consensus: reject local realism; quantum mechanics is locally nonreal.`,
  },

  experiments: {
    eli5: `Scientists wanted to prove whether the "quantum magic" was real, so they built special machines to test it.

The first big test was by Alain Aspect in 1982. He set up a way to quickly change what he was measuring, faster than light could travel between the particles. The particles still matched up perfectly!

Since then, scientists have done the test thousands of times with better and better machines. In 2015, they even closed ALL the remaining loopholes. The magic always works!`,

    normal: `Key Bell test experiments:

1. Aspect et al. (1982): First convincing Bell test with fast-switching polarizers at 50 MHz, achieving S = 2.697 ± 0.015, violating CHSH ≤ 2.

2. Weihs et al. (1998): Geneva experiment using entangled photons with nanosecond-timescale switching, enabling locality loophole closure over 10+ km.

3. Loophole-free tests (2015): Hensen et al. used NV centers in diamonds 1.3 km apart (S = 2.42 ± 0.20, p = 0.039). Giustina et al. and Shalm et al. used photonic systems (p ≪ 10⁻⁶).

These experiments simultaneously close the detection loophole (>82.8% efficiency), locality loophole (spacelike separation), and memory loophole.`,

    advanced: `Milestones in loophole closure:

Detection loophole: Requires η > 82.8% for CHSH inequality. Closed by:
- Christensen et al. (2013): Trapped ions, η = 94%
- Hensen et al. (2015): NV centers, η > 99%

Locality loophole: Requires spacelike separation of measurement events with fast random basis selection.
- Aspect (1982): Deterministic switching during photon flight
- Weihs (1998): Random quantum RNG at nanosecond timescale
- Hensen (2015): 1.3 km separation, 210+ hour integration

Freedom-of-choice loophole: Cosmic Bell test (Rauch et al., 2018) used photons from high-redshift quasars (light emitted 7.8-12.2 billion years ago) as random number generators. Violation: S = violated at 9.3σ (p ≲ 7.4×10⁻²¹).`,
  },

  applications: {
    eli5: `So what can we DO with quantum magic? Lots of cool things!

🔐 Secret Messages: Quantum physics lets us send messages that NO ONE can spy on. If anyone tries to peek, we'll know instantly!

💻 Super Computers: Quantum computers can solve puzzles that regular computers would take millions of years to figure out.

📡 Quantum Teleportation: We can "teleport" quantum information from one place to another using entangled particles. (No people yet!)`,

    normal: `Quantum entanglement enables revolutionary technologies:

Quantum Key Distribution (QKD): Provably secure communication using BB84 or E91 protocols. Any eavesdropping disturbs the quantum state, alerting users. Already deployed in banking and government networks. Importantly, quantum teleportation requires classical bits to accompany quantum information, so it cannot be used to violate the no-communication theorem.

Quantum Computing: Entangled qubits enable quantum gates (CNOT) and parallel processing for optimization, cryptography, and simulation tasks. Error correction requires multi-qubit entanglement.

Quantum Teleportation: Transfer quantum states using entanglement plus classical communication. Essential for quantum networks; limited by classical signal speed.`,

    advanced: `Key quantum information applications:

QKD Protocols:
• BB84 (Bennett-Brassard 1984): Non-entanglement based, security from no-cloning theorem
• E91 (Ekert 1991): Entanglement-based, security proven by Bell inequality violation
• Device-independent QKD: Security without trusting device internals

Quantum Computing:
• CNOT gate: Creates entanglement from separable states
• Error correction: Shor code uses 9-qubit entanglement for single-qubit error correction
• Quantum advantage: Google's Sycamore (2019) demonstrated quantum supremacy

Quantum Networks & Teleportation:
• Quantum repeaters: Extend entanglement distribution via entanglement swapping
• No-communication theorem: Quantum teleportation requires classical bits (speed ≤ c)
• Quantum Internet Alliance: Multi-node quantum networks under development`,
  },
};

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
