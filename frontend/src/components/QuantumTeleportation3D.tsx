import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  Html,
  Line,
  Float,
  Trail,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

type TeleportStep =
  | "initial"
  | "entangle"
  | "bell_measure"
  | "classical_send"
  | "apply_correction"
  | "complete";

interface StationProps {
  position: [number, number, number];
  name: string;
  color: string;
  particles: { id: string; state: string; visible: boolean }[];
  highlight?: boolean;
}

function Station({
  position,
  name,
  color,
  particles,
  highlight,
}: StationProps) {
  return (
    <group position={position}>
      {/* Platform */}
      <RoundedBox args={[2.5, 0.2, 2]} radius={0.05} position={[0, -0.5, 0]}>
        <meshStandardMaterial
          color={highlight ? color : "#1f2937"}
          emissive={highlight ? color : "#000000"}
          emissiveIntensity={highlight ? 0.3 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Station equipment */}
      <RoundedBox
        args={[0.8, 1.2, 0.5]}
        radius={0.05}
        position={[-0.7, 0.2, 0]}
      >
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.3} />
      </RoundedBox>

      {/* Display screen */}
      <mesh position={[-0.7, 0.4, 0.26]}>
        <planeGeometry args={[0.5, 0.4]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Particles */}
      {particles
        .filter((p) => p.visible)
        .map((particle, i) => (
          <Float key={particle.id} speed={3} floatIntensity={0.3}>
            <Sphere args={[0.2, 32, 32]} position={[0.5 + i * 0.5, 0.3, 0]}>
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.6}
              />
            </Sphere>
            <Html position={[0.5 + i * 0.5, 0.7, 0]} center>
              <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-mono">
                {particle.state}
              </div>
            </Html>
          </Float>
        ))}

      {/* Station label */}
      <Html position={[0, -1, 0]} center>
        <div
          className={`px-3 py-2 rounded-lg font-bold text-white shadow-lg`}
          style={{ backgroundColor: color }}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}

interface ClassicalChannelProps {
  active: boolean;
  bits: string;
}

function ClassicalChannel({ active, bits }: ClassicalChannelProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (active) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 0.02, 1));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [active]);

  return (
    <group>
      {/* Channel line */}
      <Line
        points={[
          [-4, -1.5, 0],
          [4, -1.5, 0],
        ]}
        color="#fbbf24"
        lineWidth={2}
        dashed
        dashSize={0.3}
        dashScale={1}
      />

      {/* Channel label */}
      <Html position={[0, -1.8, 0]} center>
        <div className="text-yellow-500 text-xs font-semibold">
          Classical Channel
        </div>
      </Html>

      {/* Traveling bits */}
      {active && (
        <group position={[THREE.MathUtils.lerp(-4, 4, progress), -1.5, 0]}>
          <Sphere args={[0.15, 16, 16]}>
            <meshBasicMaterial color="#fbbf24" />
          </Sphere>
          <Html position={[0, 0.4, 0]} center>
            <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-mono font-bold">
              {bits}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

function EntanglementBeam({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current && active) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
      ref.current.scale.y = scale;
    }
  });

  if (!active) return null;

  return (
    <>
      <mesh ref={ref} position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 7, 16]} />
        <meshBasicMaterial color="#d946ef" transparent opacity={0.6} />
      </mesh>

      {/* Entanglement particles along beam */}
      {Array.from({ length: 15 }).map((_, i) => (
        <EntanglementDot key={i} index={i} />
      ))}
    </>
  );
}

function EntanglementDot({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.x = -3.5 + index * 0.5;
      ref.current.position.y = 0.3 + Math.sin(t * 4 + index * 0.5) * 0.15;
      ref.current.position.z = Math.cos(t * 3 + index * 0.3) * 0.15;
    }
  });

  return (
    <Sphere ref={ref} args={[0.05, 8, 8]}>
      <meshBasicMaterial color="#d946ef" />
    </Sphere>
  );
}

function TeleportingState({
  active,
  progress,
}: {
  active: boolean;
  progress: number;
}) {
  if (!active || progress === 0) return null;

  return (
    <group position={[THREE.MathUtils.lerp(-4, 4, progress), 0.3, 0]}>
      <Trail width={0.5} length={6} color="#10b981" attenuation={(t) => t * t}>
        <Float speed={5} floatIntensity={0.5}>
          <Sphere args={[0.15, 32, 32]}>
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={1}
            />
          </Sphere>
        </Float>
      </Trail>
      <Html position={[0, 0.5, 0]} center>
        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-mono animate-pulse">
          |ψ⟩
        </div>
      </Html>
    </group>
  );
}

function Scene({
  step,
  classicalBits,
}: {
  step: TeleportStep;
  classicalBits: string;
}) {
  const [teleportProgress, setTeleportProgress] = useState(0);

  useEffect(() => {
    if (step === "apply_correction") {
      setTeleportProgress(0);
      const interval = setInterval(() => {
        setTeleportProgress((p) => {
          if (p >= 1) {
            clearInterval(interval);
            return 1;
          }
          return p + 0.015;
        });
      }, 30);
      return () => clearInterval(interval);
    } else {
      setTeleportProgress(0);
    }
  }, [step]);

  // Alice's particles
  const aliceParticles = [
    {
      id: "psi",
      state: "|ψ⟩",
      visible:
        step === "initial" || step === "entangle" || step === "bell_measure",
    },
    {
      id: "a",
      state: "|A⟩",
      visible: step !== "initial" && step !== "complete",
    },
  ];

  // Bob's particles
  const bobParticles = [
    {
      id: "b",
      state: step === "complete" ? "|ψ⟩" : "|B⟩",
      visible: step !== "initial",
    },
  ];

  return (
    <>
      <color attach="background" args={["#0a0a1a"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#f97316" />

      {/* Stations */}
      <Station
        position={[-4, 0, 0]}
        name="Alice"
        color="#06b6d4"
        particles={aliceParticles}
        highlight={step === "initial" || step === "bell_measure"}
      />

      <Station
        position={[4, 0, 0]}
        name="Bob"
        color="#f97316"
        particles={bobParticles}
        highlight={step === "apply_correction" || step === "complete"}
      />

      {/* Entanglement beam */}
      <EntanglementBeam
        active={step === "entangle" || step === "bell_measure"}
      />

      {/* Classical channel */}
      <ClassicalChannel
        active={step === "classical_send"}
        bits={classicalBits}
      />

      {/* Teleporting state visualization */}
      <TeleportingState
        active={step === "apply_correction"}
        progress={teleportProgress}
      />

      {/* Success indicator */}
      {step === "complete" && (
        <Html position={[0, 2, 0]} center>
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-lg animate-bounce shadow-lg">
            ✓ Teleportation Complete!
          </div>
        </Html>
      )}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={8}
        maxDistance={18}
      />
    </>
  );
}

export function QuantumTeleportation3D() {
  const [step, setStep] = useState<TeleportStep>("initial");
  const [isRunning, setIsRunning] = useState(false);
  const [classicalBits, setClassicalBits] = useState("00");

  const steps: TeleportStep[] = [
    "initial",
    "entangle",
    "bell_measure",
    "classical_send",
    "apply_correction",
    "complete",
  ];

  const stepDescriptions: Record<
    TeleportStep,
    { title: string; description: string }
  > = {
    initial: {
      title: "1. Initial State",
      description:
        "Alice has a quantum state |ψ⟩ she wants to send to Bob. This state is unknown — she cannot simply measure and send it.",
    },
    entangle: {
      title: "2. Create Entanglement",
      description:
        "A source creates an entangled pair of particles (Bell pair). Alice gets particle A, Bob gets particle B.",
    },
    bell_measure: {
      title: "3. Bell Measurement",
      description:
        "Alice performs a joint measurement on her original state |ψ⟩ and her entangled particle A. This destroys both particles but produces 2 classical bits.",
    },
    classical_send: {
      title: "4. Classical Communication",
      description: `Alice sends the measurement result (${classicalBits}) to Bob through a classical channel. This is limited by the speed of light.`,
    },
    apply_correction: {
      title: "5. Apply Correction",
      description:
        'Bob applies a quantum gate based on Alice\'s bits. The gate "corrects" his particle B to match the original state |ψ⟩.',
    },
    complete: {
      title: "6. Teleportation Complete!",
      description:
        "Bob's particle is now in the exact state |ψ⟩ that Alice started with. The original was destroyed — no cloning occurred!",
    },
  };

  useEffect(() => {
    if (!isRunning) return;

    const currentIndex = steps.indexOf(step);
    if (currentIndex >= steps.length - 1) {
      setIsRunning(false);
      return;
    }

    const delay =
      step === "classical_send"
        ? 3000
        : step === "apply_correction"
        ? 3500
        : 2500;

    const timer = setTimeout(() => {
      const nextStep = steps[currentIndex + 1];

      // Generate random classical bits when measuring
      if (step === "bell_measure") {
        const bits = ["00", "01", "10", "11"][Math.floor(Math.random() * 4)];
        setClassicalBits(bits);
      }

      setStep(nextStep);
    }, delay);

    return () => clearTimeout(timer);
  }, [step, isRunning]);

  const handleReset = () => {
    setStep("initial");
    setIsRunning(false);
    setClassicalBits("00");
  };

  const handleStepForward = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      if (step === "bell_measure") {
        const bits = ["00", "01", "10", "11"][Math.floor(Math.random() * 4)];
        setClassicalBits(bits);
      }
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleStepBack = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const currentStepInfo = stepDescriptions[step];

  return (
    <div className="space-y-4">
      <div className="h-[450px] relative glass-card rounded-xl overflow-hidden border-2 border-emerald-200">
        <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
          <Scene step={step} classicalBits={classicalBits} />
        </Canvas>

        {/* Step info overlay */}
        <div className="absolute top-4 left-4 right-4 md:right-auto md:max-w-md bg-black/85 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-emerald-500/30">
          <p className="text-emerald-400 font-bold mb-1">
            {currentStepInfo.title}
          </p>
          <p className="text-sm text-gray-200">{currentStepInfo.description}</p>
        </div>
      </div>

      {/* Step progress */}
      <div className="flex justify-center gap-1">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => {
              setIsRunning(false);
              setStep(s);
            }}
            className={`w-12 h-2 rounded-full transition-all ${
              step === s
                ? "bg-emerald-500"
                : steps.indexOf(step) > i
                ? "bg-emerald-500/50"
                : "bg-gray-700"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleStepBack}
          disabled={step === "initial"}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          ← Back
        </button>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
            isRunning
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-emerald-500 text-white hover:bg-emerald-600"
          }`}
        >
          {isRunning ? "⏸️ Pause" : "▶️ Auto Play"}
        </button>

        <button
          onClick={handleStepForward}
          disabled={step === "complete"}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next →
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
        >
          🔄
        </button>
      </div>

      {/* Key points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-cyan-950 border border-cyan-500/30 rounded-lg p-3">
          <div className="text-cyan-400 font-bold text-sm mb-1">
            ⚡ Not FTL Communication
          </div>
          <div className="text-xs text-gray-400">
            Classical bits must be sent at light speed or slower. No information
            travels faster than light.
          </div>
        </div>

        <div className="bg-purple-950 border border-purple-500/30 rounded-lg p-3">
          <div className="text-purple-400 font-bold text-sm mb-1">
            🔒 No Cloning
          </div>
          <div className="text-xs text-gray-400">
            The original state is destroyed during Bell measurement. You can't
            copy quantum states!
          </div>
        </div>

        <div className="bg-orange-950 border border-orange-500/30 rounded-lg p-3">
          <div className="text-orange-400 font-bold text-sm mb-1">
            🔗 Requires Entanglement
          </div>
          <div className="text-xs text-gray-400">
            Pre-shared entanglement is consumed in the process. One Bell pair
            per teleportation.
          </div>
        </div>
      </div>

      {/* Protocol diagram */}
      <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-x-auto">
        <div className="text-gray-500 mb-2">
          // Quantum Teleportation Protocol
        </div>
        <div className="space-y-1">
          <div
            className={
              step === "initial" ? "text-emerald-400" : "text-gray-500"
            }
          >
            Alice: |ψ⟩ = α|0⟩ + β|1⟩ // Unknown quantum state
          </div>
          <div
            className={
              step === "entangle" ? "text-emerald-400" : "text-gray-500"
            }
          >
            Entangle: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 // Bell pair shared
          </div>
          <div
            className={
              step === "bell_measure" ? "text-emerald-400" : "text-gray-500"
            }
          >
            Measure: |ψ⟩⊗|A⟩ → {classicalBits} // 2 classical bits
          </div>
          <div
            className={
              step === "classical_send" ? "text-emerald-400" : "text-gray-500"
            }
          >
            Send: Alice --({classicalBits})--→ Bob // Classical channel
          </div>
          <div
            className={
              step === "apply_correction" ? "text-emerald-400" : "text-gray-500"
            }
          >
            Correct: Bob applies{" "}
            {classicalBits === "00"
              ? "I"
              : classicalBits === "01"
              ? "X"
              : classicalBits === "10"
              ? "Z"
              : "ZX"}{" "}
            // Based on bits
          </div>
          <div
            className={
              step === "complete" ? "text-emerald-400" : "text-gray-500"
            }
          >
            Result: |B⟩ = |ψ⟩ // Perfect copy!
          </div>
        </div>
      </div>
    </div>
  );
}
