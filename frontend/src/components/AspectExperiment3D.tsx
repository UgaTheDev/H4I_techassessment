import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html, Line } from "@react-three/drei";
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

function Detector({
  position,
  angle,
  color,
  detections,
  flash,
  side,
}: {
  position: [number, number, number];
  angle: number;
  color: string;
  detections: number;
  flash: boolean;
  side: "left" | "right";
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = angle;
    }
  });

  return (
    <>
      <group ref={groupRef} position={position}>
        {/* Detector body - thin plane */}
        <mesh>
          <boxGeometry args={[0.05, 1.2, 1.2]} />
          <meshStandardMaterial
            color={flash ? color : "#1f2937"}
            metalness={0.8}
            roughness={0.2}
            emissive={flash ? color : "#000000"}
            emissiveIntensity={flash ? 1 : 0}
          />
        </mesh>
      </group>

      {/* Static label above detector */}
      <Html position={[position[0], position[1] + 1.3, position[2]]} center>
        <div
          className="px-3 py-1 rounded text-sm font-bold whitespace-nowrap shadow-lg"
          style={{ backgroundColor: color, color: "white" }}
        >
          {side === "left" ? "Alice's Filter:" : "Bob's Filter:"}{" "}
          {Math.round(angle * (180 / Math.PI))}°
        </div>
      </Html>

      {/* Static detection count below detector */}
      <Html position={[position[0], position[1] - 1.3, position[2]]} center>
        <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-mono font-bold">
          {detections}
        </div>
      </Html>
    </>
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
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#d946ef"
          emissive="#d946ef"
          emissiveIntensity={emitting ? 1 : 0.3}
          transparent
          opacity={0.8}
        />
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
  leftDetections,
  rightDetections,
  photonActive,
  leftFlash,
  rightFlash,
  onPhotonArrive,
}: {
  leftAngle: number;
  rightAngle: number;
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

      <Detector
        position={[-4, 0, 0]}
        angle={leftAngle}
        color="#06b6d4"
        detections={leftDetections}
        flash={leftFlash}
        side="left"
      />

      <Detector
        position={[4, 0, 0]}
        angle={rightAngle}
        color="#f97316"
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
  const [rightAngle, setRightAngle] = useState(Math.PI / 4);
  const [leftDetections, setLeftDetections] = useState(0);
  const [rightDetections, setRightDetections] = useState(0);
  const [coincidences, setCoincidences] = useState(0);
  const [photonActive, setPhotonActive] = useState(false);
  const [leftFlash, setLeftFlash] = useState(false);
  const [rightFlash, setRightFlash] = useState(false);
  const [_arrivedSides, setArrivedSides] = useState<Set<string>>(new Set());

  const angleDiff = Math.abs(leftAngle - rightAngle);
  const quantumPrediction = Math.cos(2 * angleDiff) ** 2;

  useEffect(() => {
    if (!isRunning) return;

    const emitInterval = setInterval(() => {
      setPhotonActive(true);
      setArrivedSides(new Set());

      // Randomly switch angles
      const newLeftAngle = Math.random() * Math.PI * 2;
      const newRightAngle = Math.random() * Math.PI * 2;
      setLeftAngle(newLeftAngle);
      setRightAngle(newRightAngle);
    }, 1500);

    return () => clearInterval(emitInterval);
  }, [isRunning]);

  const handlePhotonArrive = (side: "left" | "right") => {
    setArrivedSides((prev) => {
      const newSet = new Set(prev);
      newSet.add(side);

      if (newSet.size === 2) {
        setPhotonActive(false);

        setLeftFlash(true);
        setRightFlash(true);
        setLeftDetections((d) => d + 1);
        setRightDetections((d) => d + 1);

        const detected = Math.random() < quantumPrediction;
        if (detected) {
          setCoincidences((c) => c + 1);
        }

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
    setLeftAngle(0);
    setRightAngle(Math.PI / 4);
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
      </div>

      {/* Angle Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border-2 border-cyan-200 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-cyan-700">
              Left Detector
            </span>
            <span className="text-2xl font-bold text-cyan-900">
              {Math.round((leftAngle * 180) / Math.PI)}°
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Detections: {leftDetections}
          </div>
        </div>

        <div className="bg-white border-2 border-orange-200 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-orange-700">
              Right Detector
            </span>
            <span className="text-2xl font-bold text-orange-900">
              {Math.round((rightAngle * 180) / Math.PI)}°
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Detections: {rightDetections}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border-2 border-purple-200 p-4 rounded-lg shadow-sm">
          <div className="text-xs text-purple-600 mb-1">Angle Difference</div>
          <div className="text-2xl font-bold text-purple-900">
            {Math.round((angleDiff * 180) / Math.PI)}°
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
          onClick={handleReset}
          className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-all"
        >
          🔄 Reset
        </button>
      </div>

      {/* Historical context */}
      <div className="bg-white border-2 border-amber-200 rounded-lg p-4 text-sm shadow-sm">
        <p className="font-bold text-amber-800 mb-2">
          📚 Historical Significance:
        </p>
        <p className="text-gray-700 text-xs leading-relaxed">
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
