import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  Html,
  RoundedBox,
  Float,
} from "@react-three/drei";
import * as THREE from "three";

interface QubitProps {
  position: [number, number, number];
  index: number;
  state: "zero" | "one" | "superposition" | "entangled";
  partner?: number;
  highlightGate?: string;
}

function Qubit({ position, index, state, partner, highlightGate }: QubitProps) {
  const meshRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((clock) => {
    if (meshRef.current) {
      if (state === "superposition" || state === "entangled") {
        meshRef.current.rotation.y += 0.02;
        meshRef.current.rotation.x =
          Math.sin(clock.clock.elapsedTime * 2 + index) * 0.2;
      }
    }
    if (
      sphereRef.current &&
      (state === "superposition" || state === "entangled")
    ) {
      const scale =
        1 + Math.sin(clock.clock.elapsedTime * 3 + index * 0.5) * 0.1;
      sphereRef.current.scale.set(scale, scale, scale);
    }
  });

  const getColor = () => {
    switch (state) {
      case "zero":
        return "#3b82f6";
      case "one":
        return "#ef4444";
      case "superposition":
        return "#d946ef";
      case "entangled":
        return "#10b981";
    }
  };

  const getLabel = () => {
    switch (state) {
      case "zero":
        return "|0⟩";
      case "one":
        return "|1⟩";
      case "superposition":
        return "|ψ⟩";
      case "entangled":
        return `|Φ⟩`;
    }
  };

  return (
    <group position={position}>
      {/* Qubit housing */}
      <RoundedBox
        args={[0.8, 0.8, 0.8]}
        radius={0.1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? "#4b5563" : "#1f2937"}
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Qubit core */}
      <group ref={meshRef}>
        <Float
          speed={state === "superposition" || state === "entangled" ? 4 : 0}
          floatIntensity={0.3}
        >
          <Sphere ref={sphereRef} args={[0.25, 32, 32]}>
            <meshStandardMaterial
              color={getColor()}
              emissive={getColor()}
              emissiveIntensity={0.8}
              transparent
              opacity={0.9}
            />
          </Sphere>
        </Float>

        {/* State indicator arrow */}
        {(state === "zero" || state === "one") && (
          <mesh
            position={[0, state === "zero" ? 0.35 : -0.35, 0]}
            rotation={[0, 0, state === "one" ? Math.PI : 0]}
          >
            <coneGeometry args={[0.08, 0.15, 16]} />
            <meshStandardMaterial
              color={getColor()}
              emissive={getColor()}
              emissiveIntensity={0.5}
            />
          </mesh>
        )}
      </group>

      {/* Entanglement visualization */}
      {state === "entangled" && partner !== undefined && (
        <mesh>
          <torusGeometry args={[0.45, 0.02, 16, 32]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Label */}
      <Html position={[0, 0.7, 0]} center>
        <div
          className={`px-2 py-1 rounded text-xs font-mono font-bold ${
            hovered ? "bg-white text-gray-900" : "bg-gray-800 text-white"
          } transition-colors`}
        >
          q{index}: {getLabel()}
        </div>
      </Html>

      {/* Gate highlight */}
      {highlightGate && (
        <Html position={[0, -0.7, 0]} center>
          <div className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded text-xs font-bold animate-pulse">
            {highlightGate}
          </div>
        </Html>
      )}
    </group>
  );
}

interface QuantumGateProps {
  position: [number, number, number];
  type: "H" | "X" | "Y" | "Z" | "CNOT" | "SWAP";
  active?: boolean;
}

function QuantumGate({ position, type, active }: QuantumGateProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && active) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.1;
    }
  });

  const getGateColor = () => {
    switch (type) {
      case "H":
        return "#8b5cf6";
      case "X":
        return "#ef4444";
      case "Y":
        return "#22c55e";
      case "Z":
        return "#3b82f6";
      case "CNOT":
        return "#f97316";
      case "SWAP":
        return "#ec4899";
    }
  };

  const getGateDescription = () => {
    switch (type) {
      case "H":
        return "Hadamard";
      case "X":
        return "Pauli-X (NOT)";
      case "Y":
        return "Pauli-Y";
      case "Z":
        return "Pauli-Z";
      case "CNOT":
        return "Controlled-NOT";
      case "SWAP":
        return "Swap";
    }
  };

  return (
    <group position={position}>
      <RoundedBox ref={meshRef} args={[0.6, 0.6, 0.3]} radius={0.08}>
        <meshStandardMaterial
          color={getGateColor()}
          emissive={active ? getGateColor() : "#000000"}
          emissiveIntensity={active ? 0.5 : 0}
          metalness={0.5}
          roughness={0.3}
        />
      </RoundedBox>

      <Html position={[0, 0, 0.2]} center>
        <div className="text-white font-bold text-lg font-mono drop-shadow-lg">
          {type}
        </div>
      </Html>

      <Html position={[0, -0.5, 0]} center>
        <div className="text-xs text-gray-400 whitespace-nowrap">
          {getGateDescription()}
        </div>
      </Html>
    </group>
  );
}

function QuantumWire({
  start,
  end,
  color = "#4b5563",
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([...start, ...end])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  );
}

function QuantumCircuit({
  qubits,
  step,
}: {
  qubits: QubitProps[];
  step: number;
}) {
  return (
    <>
      {/* Quantum wires */}
      {qubits.map((q, i) => (
        <QuantumWire
          key={`wire-${i}`}
          start={[q.position[0] - 2, q.position[1], q.position[2]]}
          end={[q.position[0] + 3, q.position[1], q.position[2]]}
          color="#374151"
        />
      ))}

      {/* Gates */}
      <QuantumGate position={[-0.5, 1.5, 0]} type="H" active={step === 0} />
      <QuantumGate position={[1, 1, 0]} type="CNOT" active={step === 1} />
      <QuantumGate position={[-0.5, -1.5, 0]} type="H" active={step === 0} />
      <QuantumGate position={[1, -1, 0]} type="CNOT" active={step === 1} />

      {/* CNOT control lines */}
      <QuantumWire start={[1, 1.5, 0]} end={[1, 0.5, 0]} color="#f97316" />
      <QuantumWire start={[1, -0.5, 0]} end={[1, -1.5, 0]} color="#f97316" />

      {/* Control dots */}
      <Sphere args={[0.1, 16, 16]} position={[1, 1.5, 0]}>
        <meshStandardMaterial color="#f97316" />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[1, -1.5, 0]}>
        <meshStandardMaterial color="#f97316" />
      </Sphere>
    </>
  );
}

function ChipHousing() {
  return (
    <group position={[0, 0, -1]}>
      {/* Main chip body */}
      <RoundedBox args={[8, 6, 0.5]} radius={0.2} position={[0, 0, 0]}>
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
      </RoundedBox>

      {/* Gold traces */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[-3.5 + i * 0.6, 0, 0.26]}>
          <boxGeometry args={[0.1, 5, 0.02]} />
          <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.3} />
        </mesh>
      ))}

      {/* Corner connectors */}
      {[
        [-3.5, -2.5],
        [-3.5, 2.5],
        [3.5, -2.5],
        [3.5, 2.5],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ qubits, step }: { qubits: QubitProps[]; step: number }) {
  return (
    <>
      <color attach="background" args={["#030712"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#8b5cf6" />
      <spotLight
        position={[0, 10, 5]}
        intensity={1}
        angle={0.5}
        penumbra={0.5}
      />

      <ChipHousing />

      {qubits.map((q, i) => (
        <Qubit key={i} {...q} />
      ))}

      <QuantumCircuit qubits={qubits} step={step} />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

export function QuantumComputer3D() {
  const [step, setStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [qubits, setQubits] = useState<QubitProps[]>([
    { position: [-2, 1.5, 0], index: 0, state: "zero" },
    { position: [-2, 0.5, 0], index: 1, state: "zero" },
    { position: [-2, -0.5, 0], index: 2, state: "zero" },
    { position: [-2, -1.5, 0], index: 3, state: "zero" },
  ]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setStep((s) => {
        const newStep = (s + 1) % 4;

        // Update qubit states based on circuit step
        setQubits((prev) => {
          const updated = [...prev];
          if (newStep === 0) {
            // Reset
            return prev.map((q) => ({ ...q, state: "zero" as const }));
          } else if (newStep === 1) {
            // After Hadamard gates
            updated[0] = { ...updated[0], state: "superposition" };
            updated[2] = { ...updated[2], state: "superposition" };
          } else if (newStep === 2) {
            // After CNOT gates - entangled!
            updated[0] = { ...updated[0], state: "entangled", partner: 1 };
            updated[1] = { ...updated[1], state: "entangled", partner: 0 };
            updated[2] = { ...updated[2], state: "entangled", partner: 3 };
            updated[3] = { ...updated[3], state: "entangled", partner: 2 };
          }
          return updated;
        });

        return newStep;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleReset = () => {
    setStep(-1);
    setIsRunning(false);
    setQubits((prev) =>
      prev.map((q) => ({ ...q, state: "zero" as const, partner: undefined }))
    );
  };

  const getStepDescription = () => {
    switch (step) {
      case -1:
      case 0:
        return "All qubits initialized to |0⟩";
      case 1:
        return "Hadamard gates create superposition on q0 and q2";
      case 2:
        return "CNOT gates entangle qubit pairs (q0-q1 and q2-q3)";
      case 3:
        return "Two Bell pairs created! Perfect for quantum teleportation";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-[500px] relative glass-card rounded-xl overflow-hidden border-2 border-violet-200">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Scene qubits={qubits} step={step} />
        </Canvas>

        {/* Info overlay */}
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-violet-500/30 max-w-sm">
          <p className="text-xs text-violet-400 mb-1">
            🖥️ Quantum Processor Simulation
          </p>
          <p className="text-sm text-white">{getStepDescription()}</p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-gray-700">
          <div className="text-xs text-gray-400 mb-2 font-semibold">
            Qubit States:
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-300">|0⟩ Ground</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-300">|1⟩ Excited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-gray-300">|ψ⟩ Superposition</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-300">|Φ⟩ Entangled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex justify-center gap-2">
        {["Init", "Hadamard", "CNOT", "Bell Pairs"].map((label, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              step === i
                ? "bg-violet-500 text-white shadow-lg"
                : step > i
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            isRunning
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-violet-500 text-white hover:bg-violet-600"
          }`}
        >
          {isRunning ? "⏸️ Pause" : "▶️ Run Circuit"}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
        >
          🔄 Reset
        </button>
      </div>

      {/* Gate Reference */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3">
          <div className="text-violet-400 font-bold font-mono text-lg">H</div>
          <div className="text-xs text-gray-400">
            Hadamard: Creates superposition
          </div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
          <div className="text-orange-400 font-bold font-mono text-lg">
            CNOT
          </div>
          <div className="text-xs text-gray-400">
            Controlled-NOT: Creates entanglement
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <div className="text-red-400 font-bold font-mono text-lg">X</div>
          <div className="text-xs text-gray-400">
            Pauli-X: Bit flip (NOT gate)
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <div className="text-blue-400 font-bold font-mono text-lg">Z</div>
          <div className="text-xs text-gray-400">Pauli-Z: Phase flip</div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-gradient-to-r from-violet-950 to-indigo-950 border border-violet-500/30 rounded-lg p-4 text-sm">
        <p className="font-semibold text-violet-300 mb-2">
          🔬 How Entanglement is Created:
        </p>
        <ol className="space-y-1 text-xs text-gray-300 list-decimal list-inside">
          <li>Start with qubits in the ground state |0⟩</li>
          <li>
            Apply Hadamard (H) gate to put qubit in superposition: |0⟩ → (|0⟩ +
            |1⟩)/√2
          </li>
          <li>Apply CNOT gate with superposed qubit as control</li>
          <li>Result: |00⟩ → (|00⟩ + |11⟩)/√2 — a Bell state!</li>
        </ol>
        <p className="mt-2 text-violet-400 text-xs">
          This circuit creates two Bell pairs — the building blocks of quantum
          communication!
        </p>
      </div>
    </div>
  );
}
