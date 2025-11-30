import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Line,
  Cylinder,
  Box,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

interface PhotonProps {
  startPos: [number, number, number];
  endPos: [number, number, number];
  color: string;
  delay: number;
  onComplete?: () => void;
}

function Photon({ startPos, endPos, color, delay, onComplete }: PhotonProps) {
  const ref = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame((_, delta) => {
    if (!active || progress >= 1) return;

    const newProgress = Math.min(progress + delta * 1.5, 1);
    setProgress(newProgress);

    if (ref.current) {
      ref.current.position.x = THREE.MathUtils.lerp(
        startPos[0],
        endPos[0],
        newProgress
      );
      ref.current.position.y = THREE.MathUtils.lerp(
        startPos[1],
        endPos[1],
        newProgress
      );
      ref.current.position.z = THREE.MathUtils.lerp(
        startPos[2],
        endPos[2],
        newProgress
      );
    }

    if (newProgress >= 1 && onComplete) {
      onComplete();
    }
  });

  if (!active) return null;

  return (
    <mesh ref={ref} position={startPos}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={1 - progress * 0.3}
      />
    </mesh>
  );
}

interface PolarizingFilterProps {
  position: [number, number, number];
  angle: number;
  label: string;
  side: "left" | "right";
}

function PolarizingFilter({
  position,
  angle,
  label,
  side,
}: PolarizingFilterProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Create slits pattern
  const slitCount = 8;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, 0, (angle * Math.PI) / 180]}
    >
      {/* Filter frame */}
      <RoundedBox args={[0.1, 1.2, 1.2]} radius={0.02}>
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Filter glass with slits */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.05, 1, 1]} />
        <meshStandardMaterial
          color={side === "left" ? "#06b6d4" : "#f97316"}
          transparent
          opacity={0.3}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Polarization lines */}
      {Array.from({ length: slitCount }).map((_, i) => (
        <mesh key={i} position={[0.03, -0.4 + i * 0.1, 0]}>
          <boxGeometry args={[0.02, 0.02, 0.9]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}

      {/* Angle indicator arc */}
      <Html position={[0, 0.9, 0]} center>
        <div
          className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-lg ${
            side === "left"
              ? "bg-cyan-500 text-white"
              : "bg-orange-500 text-white"
          }`}
        >
          {label}: {angle}°
        </div>
      </Html>
    </group>
  );
}

function Detector({
  position,
  label,
  detections,
  side,
}: {
  position: [number, number, number];
  label: string;
  detections: number;
  side: "left" | "right";
}) {
  const [flash, setFlash] = useState(false);
  const prevDetections = useRef(detections);

  useEffect(() => {
    if (detections > prevDetections.current) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 200);
      prevDetections.current = detections;
      return () => clearTimeout(timer);
    }
  }, [detections]);

  return (
    <group position={position}>
      {/* Detector body */}
      <RoundedBox args={[0.5, 0.8, 0.8]} radius={0.05}>
        <meshStandardMaterial
          color={flash ? (side === "left" ? "#06b6d4" : "#f97316") : "#1f2937"}
          metalness={0.6}
          roughness={0.3}
          emissive={
            flash ? (side === "left" ? "#06b6d4" : "#f97316") : "#000000"
          }
          emissiveIntensity={flash ? 1 : 0}
        />
      </RoundedBox>

      {/* Detection window */}
      <mesh
        position={[side === "left" ? 0.2 : -0.2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {/* Label and count */}
      <Html position={[0, -0.6, 0]} center>
        <div className="text-center">
          <div
            className={`px-2 py-1 rounded text-xs font-bold ${
              side === "left"
                ? "bg-cyan-600 text-white"
                : "bg-orange-600 text-white"
            }`}
          >
            {label}
          </div>
          <div className="mt-1 bg-black/80 px-2 py-1 rounded text-white text-sm font-mono">
            {detections}
          </div>
        </div>
      </Html>
    </group>
  );
}

function PhotonSource() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Crystal */}
      <mesh ref={ref}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#d946ef"
          emissive="#d946ef"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#d946ef" transparent opacity={0.1} />
      </mesh>

      <Html position={[0, 0.8, 0]} center>
        <div className="bg-purple-500/90 text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
          Entangled Photon Source
        </div>
      </Html>
    </group>
  );
}

function Scene({
  aliceAngle,
  bobAngle,
  detections,
  photonKey,
  onPhotonComplete,
}: {
  aliceAngle: number;
  bobAngle: number;
  detections: { alice: number; bob: number; coincidences: number };
  photonKey: number;
  onPhotonComplete: (side: "alice" | "bob") => void;
}) {
  return (
    <>
      <color attach="background" args={["#0f172a"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={1} />
      <pointLight position={[0, -5, -5]} intensity={0.5} color="#d946ef" />

      {/* Beam paths */}
      <Line
        points={[
          [-4.5, 0, 0],
          [-0.5, 0, 0],
        ]}
        color="#06b6d4"
        lineWidth={1}
        transparent
        opacity={0.3}
      />
      <Line
        points={[
          [0.5, 0, 0],
          [4.5, 0, 0],
        ]}
        color="#f97316"
        lineWidth={1}
        transparent
        opacity={0.3}
      />

      <PhotonSource />

      <PolarizingFilter
        position={[-2, 0, 0]}
        angle={aliceAngle}
        label="Alice's Filter"
        side="left"
      />

      <PolarizingFilter
        position={[2, 0, 0]}
        angle={bobAngle}
        label="Bob's Filter"
        side="right"
      />

      <Detector
        position={[-4, 0, 0]}
        label="Alice's Detector"
        detections={detections.alice}
        side="left"
      />

      <Detector
        position={[4, 0, 0]}
        label="Bob's Detector"
        detections={detections.bob}
        side="right"
      />

      {/* Photons */}
      <Photon
        key={`alice-${photonKey}`}
        startPos={[0, 0, 0]}
        endPos={[-4, 0, 0]}
        color="#06b6d4"
        delay={0}
        onComplete={() => onPhotonComplete("alice")}
      />
      <Photon
        key={`bob-${photonKey}`}
        startPos={[0, 0, 0]}
        endPos={[4, 0, 0]}
        color="#f97316"
        delay={0}
        onComplete={() => onPhotonComplete("bob")}
      />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={6}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2 + 0.5}
      />
    </>
  );
}

export function BellTestApparatus() {
  const [aliceAngle, setAliceAngle] = useState(0);
  const [bobAngle, setBobAngle] = useState(45);
  const [detections, setDetections] = useState({
    alice: 0,
    bob: 0,
    coincidences: 0,
  });
  const [photonKey, setPhotonKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pendingDetections, setPendingDetections] = useState({
    alice: false,
    bob: false,
  });

  // Bell inequality calculation
  const angleDiff = (Math.abs(aliceAngle - bobAngle) * Math.PI) / 180;
  const quantumPrediction = Math.cos(angleDiff) ** 2;
  const classicalBound = 0.75; // Bell inequality classical limit

  // Simulate photon emission
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPhotonKey((k) => k + 1);
      setPendingDetections({ alice: false, bob: false });
    }, 1500);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handlePhotonComplete = (side: "alice" | "bob") => {
    setPendingDetections((prev) => {
      const newPending = { ...prev, [side]: true };

      // When both photons arrive, calculate detection
      if (newPending.alice && newPending.bob) {
        // Quantum mechanical probability
        const detected = Math.random() < quantumPrediction;

        setDetections((d) => ({
          alice: d.alice + 1,
          bob: d.bob + 1,
          coincidences: d.coincidences + (detected ? 1 : 0),
        }));
      }

      return newPending;
    });
  };

  const coincidenceRate =
    detections.alice > 0
      ? ((detections.coincidences / detections.alice) * 100).toFixed(1)
      : "—";

  const handleReset = () => {
    setDetections({ alice: 0, bob: 0, coincidences: 0 });
    setPhotonKey(0);
    setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      <div className="h-[450px] relative glass-card rounded-xl overflow-hidden border-2 border-indigo-200">
        <Canvas camera={{ position: [0, 4, 8], fov: 50 }}>
          <Scene
            aliceAngle={aliceAngle}
            bobAngle={bobAngle}
            detections={detections}
            photonKey={photonKey}
            onPhotonComplete={handlePhotonComplete}
          />
        </Canvas>

        {/* Info overlay */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-200 max-w-xs">
          <p className="text-xs text-gray-600 mb-1">🔬 Bell Test Experiment</p>
          <p className="text-sm text-gray-700">
            Adjust polarizer angles to see how correlations change. Quantum
            mechanics predicts different results than classical physics!
          </p>
        </div>
      </div>

      {/* Angle Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-lg border-2 border-cyan-200">
          <label className="block text-sm font-semibold mb-2 text-cyan-700">
            Alice's Polarizer: {aliceAngle}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={aliceAngle}
            onChange={(e) => setAliceAngle(parseInt(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>

        <div className="glass-card p-4 rounded-lg border-2 border-orange-200">
          <label className="block text-sm font-semibold mb-2 text-orange-700">
            Bob's Polarizer: {bobAngle}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={bobAngle}
            onChange={(e) => setBobAngle(parseInt(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>
      </div>

      {/* Predictions and Results */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-lg border-2 border-purple-200">
          <div className="text-xs text-purple-600 mb-1">Angle Difference</div>
          <div className="text-2xl font-bold text-purple-900">
            {Math.abs(aliceAngle - bobAngle)}°
          </div>
        </div>

        <div className="glass-card p-4 rounded-lg border-2 border-blue-200">
          <div className="text-xs text-blue-600 mb-1">Quantum Prediction</div>
          <div className="text-2xl font-bold text-blue-900">
            {(quantumPrediction * 100).toFixed(1)}%
          </div>
        </div>

        <div className="glass-card p-4 rounded-lg border-2 border-green-200">
          <div className="text-xs text-green-600 mb-1">
            Measured Coincidences
          </div>
          <div className="text-2xl font-bold text-green-900">
            {coincidenceRate}%
          </div>
          <div className="text-xs text-gray-500">
            ({detections.coincidences}/{detections.alice})
          </div>
        </div>
      </div>

      {/* Bell Inequality Indicator */}
      <div
        className={`p-4 rounded-lg border-2 ${
          quantumPrediction > classicalBound
            ? "bg-red-50 border-red-300"
            : "bg-green-50 border-green-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900">
              Bell Inequality Test
            </div>
            <div className="text-sm text-gray-600">
              Classical limit: 75% | Current:{" "}
              {(quantumPrediction * 100).toFixed(1)}%
            </div>
          </div>
          <div
            className={`px-4 py-2 rounded-lg font-bold ${
              quantumPrediction > classicalBound
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {quantumPrediction > classicalBound
              ? "❌ VIOLATED"
              : "✓ Within Bounds"}
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          At 0°, 45°, or 90° differences, quantum predictions exceed what's
          possible classically — proving entanglement is real!
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            isRunning
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          {isRunning ? "⏸️ Pause Experiment" : "▶️ Run Experiment"}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
        >
          🔄 Reset
        </button>
      </div>

      {/* Quick Angle Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 py-2">Quick presets:</span>
        <button
          onClick={() => {
            setAliceAngle(0);
            setBobAngle(0);
          }}
          className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
        >
          Same (0°, 0°)
        </button>
        <button
          onClick={() => {
            setAliceAngle(0);
            setBobAngle(45);
          }}
          className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
        >
          45° diff
        </button>
        <button
          onClick={() => {
            setAliceAngle(0);
            setBobAngle(90);
          }}
          className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
        >
          Perpendicular (90°)
        </button>
        <button
          onClick={() => {
            setAliceAngle(0);
            setBobAngle(22);
          }}
          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
        >
          22.5° (Bell violation)
        </button>
      </div>
    </div>
  );
}
