import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  Html,
  Line,
  RoundedBox,
  Float,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";

type ViewMode = "einstein" | "bohr" | "reality";

interface ParticleState {
  position: [number, number, number];
  spin: "up" | "down" | "superposition";
  measured: boolean;
}

function ThoughtBubble({
  position,
  text,
  color,
  visible,
}: {
  position: [number, number, number];
  text: string;
  color: string;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <Html position={position} center>
      <div
        className="px-4 py-2 rounded-xl text-sm max-w-[200px] text-center font-medium shadow-xl animate-fade-in"
        style={{
          backgroundColor: color,
          color: "white",
          border: "2px solid rgba(255,255,255,0.3)",
        }}
      >
        {text}
      </div>
    </Html>
  );
}

function Scientist({
  position,
  name,
  color,
  thinking,
  thought,
}: {
  position: [number, number, number];
  name: string;
  color: string;
  thinking: boolean;
  thought: string;
}) {
  return (
    <group position={position}>
      {/* Body */}
      <RoundedBox args={[0.6, 1, 0.4]} radius={0.1} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} />
      </RoundedBox>

      {/* Head */}
      <Sphere args={[0.25, 32, 32]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#fcd34d" />
      </Sphere>

      {/* Name */}
      <Html position={[0, -0.8, 0]} center>
        <div
          className="px-2 py-1 rounded text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {name}
        </div>
      </Html>

      {/* Thought bubble */}
      <ThoughtBubble
        position={[0, 1.6, 0]}
        text={thought}
        color={color}
        visible={thinking}
      />
    </group>
  );
}

function EPRParticle({
  state,
  label,
  color,
  onMeasure,
  viewMode,
}: {
  state: ParticleState;
  label: string;
  color: string;
  onMeasure: () => void;
  viewMode: ViewMode;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((clock) => {
    if (meshRef.current && state.spin === "superposition") {
      meshRef.current.rotation.y += 0.03;
      meshRef.current.rotation.x = Math.sin(clock.clock.elapsedTime * 2) * 0.3;
    }
    if (glowRef.current && state.spin === "superposition") {
      const scale = 1 + Math.sin(clock.clock.elapsedTime * 4) * 0.15;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  const getColor = () => {
    if (state.spin === "superposition") return "#d946ef";
    if (state.spin === "up") return "#3b82f6";
    return "#ef4444";
  };

  // Hidden variable visualization (Einstein's view)
  const showHiddenVariable =
    viewMode === "einstein" && state.spin === "superposition";

  return (
    <group position={state.position}>
      {/* Glow */}
      <Sphere ref={glowRef} args={[0.4, 32, 32]}>
        <meshBasicMaterial color={getColor()} transparent opacity={0.15} />
      </Sphere>

      {/* Particle */}
      <Float
        speed={state.spin === "superposition" ? 3 : 0}
        floatIntensity={0.3}
      >
        <Sphere ref={meshRef} args={[0.25, 32, 32]} onClick={onMeasure}>
          <meshStandardMaterial
            color={getColor()}
            emissive={getColor()}
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>

      {/* Spin arrow for measured particles */}
      {state.measured && (
        <mesh
          position={[0, state.spin === "up" ? 0.4 : -0.4, 0]}
          rotation={[0, 0, state.spin === "down" ? Math.PI : 0]}
        >
          <coneGeometry args={[0.1, 0.2, 16]} />
          <meshStandardMaterial
            color={getColor()}
            emissive={getColor()}
            emissiveIntensity={0.3}
          />
        </mesh>
      )}

      {/* Hidden variable indicator (Einstein's view) */}
      {showHiddenVariable && (
        <group>
          <Sphere args={[0.08, 16, 16]} position={[0.35, 0, 0]}>
            <meshBasicMaterial color="#fbbf24" />
          </Sphere>
          <Html position={[0.5, 0.2, 0]} center>
            <div className="text-yellow-400 text-xs font-bold bg-black/50 px-1 rounded">
              λ
            </div>
          </Html>
        </group>
      )}

      {/* Label */}
      <Html position={[0, -0.6, 0]} center>
        <div
          className={`px-2 py-1 rounded text-xs font-bold ${
            state.measured
              ? state.spin === "up"
                ? "bg-blue-500 text-white"
                : "bg-red-500 text-white"
              : "bg-purple-500 text-white"
          }`}
        >
          {label}: {state.measured ? (state.spin === "up" ? "↑" : "↓") : "?"}
        </div>
      </Html>
    </group>
  );
}

function EntanglementConnection({
  active,
  viewMode,
}: {
  active: boolean;
  viewMode: ViewMode;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current && active) {
      const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  if (!active) return null;

  const connectionColor = viewMode === "einstein" ? "#fbbf24" : "#d946ef";

  return (
    <>
      <mesh ref={ref} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 6, 16]} />
        <meshBasicMaterial color={connectionColor} transparent opacity={0.4} />
      </mesh>

      {/* Wave particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <WaveParticle key={i} index={i} color={connectionColor} />
      ))}

      {/* Spooky action indicator for Bohr's view */}
      {viewMode === "bohr" && (
        <Html position={[0, 0.5, 0]} center>
          <div className="text-purple-300 text-xs animate-pulse">
            ⚡ "Spooky Action" ⚡
          </div>
        </Html>
      )}
    </>
  );
}

function WaveParticle({ index, color }: { index: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.x = -3 + index * 0.5;
      ref.current.position.y = Math.sin(t * 4 + index * 0.5) * 0.2;
    }
  });

  return (
    <Sphere ref={ref} args={[0.04, 8, 8]}>
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </Sphere>
  );
}

function Scene({
  aliceState,
  bobState,
  viewMode,
  showThoughts,
  onMeasure,
}: {
  aliceState: ParticleState;
  bobState: ParticleState;
  viewMode: ViewMode;
  showThoughts: boolean;
  onMeasure: (who: "alice" | "bob") => void;
}) {
  const entangled =
    aliceState.spin === "superposition" && bobState.spin === "superposition";

  const einsteinThought =
    viewMode === "einstein"
      ? "The particles have definite values all along (hidden variables λ). Measurement just reveals them!"
      : "";

  const bohrThought =
    viewMode === "bohr"
      ? "The particles have no definite state until measured. Measurement creates reality!"
      : "";

  return (
    <>
      <color attach="background" args={["#0a0a1a"]} />
      <Stars radius={100} depth={50} count={1000} factor={4} fade />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#f97316" />

      {/* Scientists */}
      <Scientist
        position={[-4, 0, 1.5]}
        name="Einstein"
        color="#dc2626"
        thinking={showThoughts && viewMode === "einstein"}
        thought={einsteinThought}
      />

      <Scientist
        position={[4, 0, 1.5]}
        name="Bohr"
        color="#2563eb"
        thinking={showThoughts && viewMode === "bohr"}
        thought={bohrThought}
      />

      {/* Particles */}
      <EPRParticle
        state={aliceState}
        label="Alice"
        color="#06b6d4"
        onMeasure={() => onMeasure("alice")}
        viewMode={viewMode}
      />

      <EPRParticle
        state={bobState}
        label="Bob"
        color="#f97316"
        onMeasure={() => onMeasure("bob")}
        viewMode={viewMode}
      />

      {/* Entanglement connection */}
      <EntanglementConnection active={entangled} viewMode={viewMode} />

      {/* Distance label */}
      <Html position={[0, -1.2, 0]} center>
        <div className="text-gray-400 text-xs">Separated by light-years...</div>
      </Html>

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={6}
        maxDistance={15}
      />
    </>
  );
}

export function EPRParadox3D() {
  const [viewMode, setViewMode] = useState<ViewMode>("reality");
  const [showThoughts, setShowThoughts] = useState(true);
  const [aliceState, setAliceState] = useState<ParticleState>({
    position: [-3, 0, 0],
    spin: "superposition",
    measured: false,
  });
  const [bobState, setBobState] = useState<ParticleState>({
    position: [3, 0, 0],
    spin: "superposition",
    measured: false,
  });
  const [experimentCount, setExperimentCount] = useState(0);

  const handleMeasure = (who: "alice" | "bob") => {
    if (aliceState.measured && bobState.measured) return;

    // Random measurement result
    const result = Math.random() > 0.5 ? "up" : "down";
    const antiResult = result === "up" ? "down" : "up";

    if (who === "alice") {
      setAliceState((prev) => ({
        ...prev,
        spin: result as "up" | "down",
        measured: true,
      }));
      // Instant correlation (spooky action!)
      setBobState((prev) => ({
        ...prev,
        spin: antiResult as "up" | "down",
        measured: true,
      }));
    } else {
      setBobState((prev) => ({
        ...prev,
        spin: result as "up" | "down",
        measured: true,
      }));
      setAliceState((prev) => ({
        ...prev,
        spin: antiResult as "up" | "down",
        measured: true,
      }));
    }

    setExperimentCount((c) => c + 1);
  };

  const handleReset = () => {
    setAliceState({
      position: [-3, 0, 0],
      spin: "superposition",
      measured: false,
    });
    setBobState({
      position: [3, 0, 0],
      spin: "superposition",
      measured: false,
    });
  };

  const viewDescriptions: Record<
    ViewMode,
    { title: string; description: string }
  > = {
    einstein: {
      title: "Einstein's View (Local Realism)",
      description:
        "The particles carry hidden variables (λ) from the source. Their properties are predetermined — measurement simply reveals what was always there. No spooky action needed!",
    },
    bohr: {
      title: "Bohr's View (Copenhagen Interpretation)",
      description:
        "The particles exist in genuine superposition until measured. The measurement on one particle instantaneously affects the other — 'spooky action at a distance'!",
    },
    reality: {
      title: "What Experiments Show",
      description:
        "Bell test experiments prove Einstein wrong! The correlations are too strong to be explained by hidden variables. Quantum mechanics is correct.",
    },
  };

  return (
    <div className="space-y-4">
      <div className="h-[450px] relative glass-card rounded-xl overflow-hidden border-2 border-rose-200">
        <Canvas camera={{ position: [0, 3, 10], fov: 50 }}>
          <Scene
            aliceState={aliceState}
            bobState={bobState}
            viewMode={viewMode}
            showThoughts={showThoughts}
            onMeasure={handleMeasure}
          />
        </Canvas>

        {/* View mode indicator */}
        <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-rose-500/30 max-w-sm">
          <p className="text-rose-400 font-bold mb-1">
            {viewDescriptions[viewMode].title}
          </p>
          <p className="text-sm text-gray-200">
            {viewDescriptions[viewMode].description}
          </p>
        </div>

        {/* Instruction */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-gray-700">
          🔬 Click a particle to measure its spin!
        </div>
      </div>

      {/* View mode selector */}
      <div className="flex gap-2">
        {(["einstein", "bohr", "reality"] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              viewMode === mode
                ? mode === "einstein"
                  ? "bg-red-500 text-white"
                  : mode === "bohr"
                  ? "bg-blue-500 text-white"
                  : "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {mode === "einstein"
              ? "🎩 Einstein"
              : mode === "bohr"
              ? "🔬 Bohr"
              : "📊 Reality"}
          </button>
        ))}
      </div>

      {/* Results */}
      {aliceState.measured && bobState.measured && (
        <div className="bg-gradient-to-r from-cyan-900/30 to-orange-900/30 border border-purple-500/30 rounded-lg p-4">
          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="text-cyan-400 text-sm">Alice measured</div>
              <div
                className={`text-3xl font-bold ${
                  aliceState.spin === "up" ? "text-blue-400" : "text-red-400"
                }`}
              >
                {aliceState.spin === "up" ? "↑ Up" : "↓ Down"}
              </div>
            </div>
            <div className="text-purple-400 text-2xl">⟷</div>
            <div className="text-center">
              <div className="text-orange-400 text-sm">Bob measured</div>
              <div
                className={`text-3xl font-bold ${
                  bobState.spin === "up" ? "text-blue-400" : "text-red-400"
                }`}
              >
                {bobState.spin === "up" ? "↑ Up" : "↓ Down"}
              </div>
            </div>
          </div>
          <div className="text-center mt-2 text-gray-400 text-sm">
            Always anti-correlated! ({experimentCount} experiments)
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={handleReset}
          className="flex-1 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-all"
        >
          🔄 Reset & Entangle Again
        </button>
        <button
          onClick={() => setShowThoughts(!showThoughts)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            showThoughts
              ? "bg-gray-700 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          💭 {showThoughts ? "Hide" : "Show"} Thoughts
        </button>
      </div>

      {/* The paradox explained */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-950 border border-red-500/30 rounded-lg p-4">
          <div className="text-red-400 font-bold mb-2">
            🎩 Einstein's Argument (1935)
          </div>
          <div className="text-xs text-gray-300 space-y-2">
            <p>
              "If measuring Alice's particle instantly determines Bob's result
              (even light-years away), then either:
            </p>
            <ol className="list-decimal list-inside pl-2 space-y-1">
              <li>
                Information travels faster than light (violates relativity!)
              </li>
              <li>
                The particles had definite values all along (hidden variables)
              </li>
            </ol>
            <p>
              Since (1) is impossible, (2) must be true. Therefore, quantum
              mechanics is incomplete!"
            </p>
          </div>
        </div>

        <div className="bg-blue-950 border border-blue-500/30 rounded-lg p-4">
          <div className="text-blue-400 font-bold mb-2">🔬 Bohr's Response</div>
          <div className="text-xs text-gray-300 space-y-2">
            <p>
              "You can't separate the quantum system from the measurement
              apparatus. The particles form a single, non-local quantum state.
            </p>
            <p>
              The correlation doesn't transmit information — Alice sees random
              results, as does Bob. The correlation only appears when they
              compare notes (at light speed or slower).
            </p>
            <p>
              Quantum mechanics is complete — you just have to accept
              non-locality!"
            </p>
          </div>
        </div>
      </div>

      {/* Historical note */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-xs text-gray-400">
        <span className="text-white font-bold">📜 Historical Note:</span> The
        EPR paper (Einstein, Podolsky, Rosen, 1935) argued that quantum
        mechanics must be incomplete. It took until 1964 for John Bell to show
        how to test this experimentally, and until 1982 for Alain Aspect to
        perform a definitive test. The result?{" "}
        <span className="text-green-400 font-bold">Bohr was right.</span>{" "}
        Einstein's hidden variables cannot explain quantum correlations.
      </div>
    </div>
  );
}
