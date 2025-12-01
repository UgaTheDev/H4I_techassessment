import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  Html,
  Line,
  RoundedBox,
  Cylinder,
} from "@react-three/drei";
import * as THREE from "three";

function PhotonPair({
  active,
  onArrive,
}: {
  active: boolean;
  onArrive: (side: "left" | "right") => void;
}) {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const [leftProgress, setLeftProgress] = useState(0);
  const [rightProgress, setRightProgress] = useState(0);

  useEffect(() => {
    if (active) {
      setLeftProgress(0);
      setRightProgress(0);
    }
  }, [active]);

  useFrame((_, delta) => {
    if (!active) return;

    if (leftProgress < 1) {
      const newProgress = Math.min(leftProgress + delta * 0.8, 1);
      setLeftProgress(newProgress);
      if (leftRef.current) {
        leftRef.current.position.x = THREE.MathUtils.lerp(0, -4, newProgress);
      }
      if (newProgress >= 1) onArrive("left");
    }

    if (rightProgress < 1) {
      const newProgress = Math.min(rightProgress + delta * 0.8, 1);
      setRightProgress(newProgress);
      if (rightRef.current) {
        rightRef.current.position.x = THREE.MathUtils.lerp(0, 4, newProgress);
      }
      if (newProgress >= 1) onArrive("right");
    }
  });

  if (!active) return null;

  return (
    <>
      <Sphere ref={leftRef} args={[0.08, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={2}
          transparent
          opacity={1 - leftProgress * 0.5}
        />
      </Sphere>
      <Sphere ref={rightRef} args={[0.08, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={2}
          transparent
          opacity={1 - rightProgress * 0.5}
        />
      </Sphere>
    </>
  );
}

interface PolarizingSwitchProps {
  position: [number, number, number];
  angle: number;
  switching: boolean;
  side: "left" | "right";
}

function PolarizingSwitch({
  position,
  angle,
  switching,
  side,
}: PolarizingSwitchProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rotatingRef = useRef<THREE.Group>(null);
  const [currentAngle, setCurrentAngle] = useState(angle);

  useFrame(() => {
    // Smooth angle transition
    setCurrentAngle((prev) => THREE.MathUtils.lerp(prev, angle, 0.1));

    if (rotatingRef.current) {
      // Rotate the entire polarizer assembly around Z axis
      rotatingRef.current.rotation.z = (currentAngle * Math.PI) / 180;
    }
  });

  const baseColor = side === "left" ? "#06b6d4" : "#f97316";

  return (
    <group ref={groupRef} position={position}>
      {/* Static mounting frame */}
      <RoundedBox args={[0.15, 1.6, 1.6]} radius={0.03}>
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Rotating polarizer assembly */}
      <group ref={rotatingRef}>
        {/* Main polarizer plate */}
        <RoundedBox args={[0.12, 1.3, 1.3]} radius={0.02}>
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.6}
            roughness={0.4}
          />
        </RoundedBox>

        {/* Polarization slits (black lines) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0.07, -0.55 + i * 0.16, 0]}>
            <boxGeometry args={[0.02, 0.02, 1.2]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
        ))}

        {/* Angle indicator arrow */}
        <mesh position={[0, 0.8, 0]}>
          <coneGeometry args={[0.08, 0.2, 8]} />
          <meshStandardMaterial
            color={baseColor}
            emissive={baseColor}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Switching indicator */}
      {switching && (
        <Sphere args={[0.12, 16, 16]} position={[0, -1, 0]}>
          <meshBasicMaterial color="#22c55e" />
        </Sphere>
      )}

      {/* Label */}
      <Html position={[0, 1.2, 0]} center>
        <div
          className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
            switching
              ? "bg-green-500 text-white animate-pulse"
              : "bg-gray-800 text-white"
          }`}
        >
          {currentAngle.toFixed(0)}°
        </div>
      </Html>
    </group>
  );
}

function Detector({
  position,
  detections,
  flash,
  side,
}: {
  position: [number, number, number];
  detections: number;
  flash: boolean;
  side: "left" | "right";
}) {
  const color = side === "left" ? "#06b6d4" : "#f97316";

  return (
    <group position={position}>
      <RoundedBox args={[0.6, 1, 1]} radius={0.08}>
        <meshStandardMaterial
          color={flash ? color : "#1f2937"}
          emissive={flash ? color : "#000000"}
          emissiveIntensity={flash ? 1 : 0}
          metalness={0.6}
          roughness={0.3}
        />
      </RoundedBox>

      <Cylinder
        args={[0.2, 0.2, 0.1, 32]}
        position={[side === "left" ? 0.25 : -0.25, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#0f172a" />
      </Cylinder>

      <Html position={[0, -0.8, 0]} center>
        <div className="text-center">
          <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-mono">
            {detections}
          </div>
        </div>
      </Html>
    </group>
  );
}

function PhotonSource({ emitting }: { emitting: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
      if (emitting) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.15;
        ref.current.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color="#d946ef"
          emissive="#d946ef"
          emissiveIntensity={emitting ? 1 : 0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      <Cylinder
        args={[0.08, 0.08, 0.6, 16]}
        position={[0, 0, -0.5]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#4b5563" metalness={0.8} />
      </Cylinder>

      <mesh position={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
      </mesh>

      <Html position={[0, 0.6, 0]} center>
        <div className="bg-purple-500/90 text-white px-2 py-1 rounded text-xs font-bold">
          BBO Crystal
        </div>
      </Html>
    </group>
  );
}

function Scene({
  leftAngle,
  rightAngle,
  switching,
  leftDetections,
  rightDetections,
  photonActive,
  leftFlash,
  rightFlash,
  onPhotonArrive,
}: {
  leftAngle: number;
  rightAngle: number;
  switching: boolean;
  leftDetections: number;
  rightDetections: number;
  photonActive: boolean;
  leftFlash: boolean;
  rightFlash: boolean;
  onPhotonArrive: (side: "left" | "right") => void;
}) {
  return (
    <>
      <color attach="background" args={["#0f172a"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={1} />
      <pointLight position={[-5, 0, 3]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[5, 0, 3]} intensity={0.5} color="#f97316" />

      <Line
        points={[
          [0, 0, 0],
          [-4.5, 0, 0],
        ]}
        color="#06b6d4"
        lineWidth={1}
        transparent
        opacity={0.2}
      />
      <Line
        points={[
          [0, 0, 0],
          [4.5, 0, 0],
        ]}
        color="#f97316"
        lineWidth={1}
        transparent
        opacity={0.2}
      />

      <PhotonSource emitting={photonActive} />

      <PolarizingSwitch
        position={[-2, 0, 0]}
        angle={leftAngle}
        switching={switching}
        side="left"
      />

      <PolarizingSwitch
        position={[2, 0, 0]}
        angle={rightAngle}
        switching={switching}
        side="right"
      />

      <Detector
        position={[-4, 0, 0]}
        detections={leftDetections}
        flash={leftFlash}
        side="left"
      />

      <Detector
        position={[4, 0, 0]}
        detections={rightDetections}
        flash={rightFlash}
        side="right"
      />

      <PhotonPair active={photonActive} onArrive={onPhotonArrive} />

      <Html position={[0, -1.5, 0]} center>
        <div className="text-gray-500 text-xs">12 meters apart</div>
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

export function AspectExperiment3D() {
  const [isRunning, setIsRunning] = useState(false);
  const [leftAngle, setLeftAngle] = useState(0);
  const [rightAngle, setRightAngle] = useState(22.5);
  const [autoSwitch, setAutoSwitch] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [leftDetections, setLeftDetections] = useState(0);
  const [rightDetections, setRightDetections] = useState(0);
  const [coincidences, setCoincidences] = useState(0);
  const [photonActive, setPhotonActive] = useState(false);
  const [leftFlash, setLeftFlash] = useState(false);
  const [rightFlash, setRightFlash] = useState(false);
  const [arrivedSides, setArrivedSides] = useState<Set<string>>(new Set());

  const angleConfigs = [
    { left: 0, right: 22.5 },
    { left: 0, right: 67.5 },
    { left: 45, right: 22.5 },
    { left: 45, right: 67.5 },
  ];
  const [configIndex, setConfigIndex] = useState(0);

  const angleDiff = (Math.abs(leftAngle - rightAngle) * Math.PI) / 180;
  const quantumPrediction = Math.cos(2 * angleDiff) ** 2;

  useEffect(() => {
    if (!isRunning) return;

    const emitInterval = setInterval(() => {
      setPhotonActive(true);
      setArrivedSides(new Set());

      if (autoSwitch && Math.random() > 0.6) {
        setSwitching(true);
        const newIndex = (configIndex + 1) % angleConfigs.length;
        setConfigIndex(newIndex);
        setLeftAngle(angleConfigs[newIndex].left);
        setRightAngle(angleConfigs[newIndex].right);
        setTimeout(() => setSwitching(false), 300);
      }
    }, 1500);

    return () => clearInterval(emitInterval);
  }, [isRunning, autoSwitch, configIndex, angleConfigs]);

  const handlePhotonArrive = (side: "left" | "right") => {
    setArrivedSides((prev) => {
      const newSet = new Set(prev);
      newSet.add(side);

      if (newSet.size === 2) {
        setPhotonActive(false);

        // ALWAYS flash detectors when photons arrive
        setLeftFlash(true);
        setRightFlash(true);
        setLeftDetections((d) => d + 1);
        setRightDetections((d) => d + 1);

        // Calculate if it's a coincidence
        const detected = Math.random() < quantumPrediction;
        if (detected) {
          setCoincidences((c) => c + 1);
        }

        // Turn off flash after 200ms
        setTimeout(() => {
          setLeftFlash(false);
          setRightFlash(false);
        }, 200);
      }

      return newSet;
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setLeftDetections(0);
    setRightDetections(0);
    setCoincidences(0);
    setPhotonActive(false);
    setConfigIndex(0);
  };

  const coincidenceRate =
    leftDetections > 0
      ? ((coincidences / leftDetections) * 100).toFixed(1)
      : "—";

  return (
    <div className="space-y-4">
      <div className="h-[450px] relative glass-card rounded-xl overflow-hidden border-2 border-amber-200">
        <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
          <Scene
            leftAngle={leftAngle}
            rightAngle={rightAngle}
            switching={switching}
            leftDetections={leftDetections}
            rightDetections={rightDetections}
            photonActive={photonActive}
            leftFlash={leftFlash}
            rightFlash={rightFlash}
            onPhotonArrive={handlePhotonArrive}
          />
        </Canvas>

        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border-2 border-amber-300 max-w-xs">
          <p className="text-amber-800 font-bold mb-1">
            🏆 Aspect's 1982 Experiment
          </p>
          <p className="text-sm text-gray-700">
            The polarizer angles switch randomly while photons are in flight —
            ruling out any "local hidden variable" explanations.
          </p>
        </div>

        {switching && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-bold animate-pulse">
            ⚡ SWITCHING!
          </div>
        )}
      </div>

      {/* Angle Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border-2 border-cyan-200 p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-semibold mb-2 text-cyan-700">
            Left Polarizer: {leftAngle.toFixed(1)}°
          </label>
          <input
            type="range"
            min="0"
            max="90"
            step="0.1"
            value={leftAngle}
            onChange={(e) => setLeftAngle(parseFloat(e.target.value))}
            disabled={autoSwitch}
            className="w-full accent-cyan-500 disabled:opacity-50"
          />
          <div className="text-xs text-gray-500 mt-1">
            Detections: {leftDetections}
          </div>
        </div>

        <div className="bg-white border-2 border-orange-200 p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-semibold mb-2 text-orange-700">
            Right Polarizer: {rightAngle.toFixed(1)}°
          </label>
          <input
            type="range"
            min="0"
            max="90"
            step="0.1"
            value={rightAngle}
            onChange={(e) => setRightAngle(parseFloat(e.target.value))}
            disabled={autoSwitch}
            className="w-full accent-orange-500 disabled:opacity-50"
          />
          <div className="text-xs text-gray-500 mt-1">
            Detections: {rightDetections}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border-2 border-purple-200 p-4 rounded-lg shadow-sm">
          <div className="text-xs text-purple-600 mb-1">Angle Difference</div>
          <div className="text-2xl font-bold text-purple-900">
            {Math.abs(leftAngle - rightAngle).toFixed(1)}°
          </div>
        </div>

        <div className="bg-white border-2 border-blue-200 p-4 rounded-lg shadow-sm">
          <div className="text-xs text-blue-600 mb-1">Quantum Prediction</div>
          <div className="text-2xl font-bold text-blue-900">
            {(quantumPrediction * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-white border-2 border-green-200 p-4 rounded-lg shadow-sm">
          <div className="text-xs text-green-600 mb-1">
            Measured Coincidences
          </div>
          <div className="text-2xl font-bold text-green-900">
            {coincidenceRate}%
          </div>
        </div>
      </div>

      {/* Bell violation indicator */}
      <div className="bg-gradient-to-r from-red-50 to-purple-50 border-2 border-red-300 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-gray-900">
              Bell Inequality Violation
            </div>
            <div className="text-sm text-gray-700">
              Classical limit: S ≤ 2 | Quantum: S = 2√2 ≈ 2.83
            </div>
          </div>
          <div className="text-4xl font-bold text-red-600">S = 2.83</div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          Aspect's experiment measured S ≈ 2.70 ± 0.05, violating Bell's
          inequality by over 40 standard deviations!
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            isRunning
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-amber-500 text-white hover:bg-amber-600"
          }`}
        >
          {isRunning ? "⏸️ Pause" : "▶️ Run Experiment"}
        </button>
        <button
          onClick={() => setAutoSwitch(!autoSwitch)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            autoSwitch ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {autoSwitch ? "🔀 Auto Switch ON" : "🔀 Auto Switch OFF"}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
        >
          🔄 Reset
        </button>
      </div>

      {/* Historical context */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg p-4 text-sm">
        <p className="font-bold text-amber-900 mb-2">
          📚 Historical Significance:
        </p>
        <p className="text-gray-800 text-xs leading-relaxed">
          Alain Aspect's 1982 experiment at the University of Paris was the
          first to use fast-switching polarizers. The switches changed the
          measurement settings while the photons were still in flight (within
          ~10 nanoseconds), eliminating the possibility that the photons could
          "communicate" their measurement settings to each other. This
          definitively ruled out local hidden variable theories and earned
          Aspect the 2022 Nobel Prize in Physics.
        </p>
      </div>
    </div>
  );
}
