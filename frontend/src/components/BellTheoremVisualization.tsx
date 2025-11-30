import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";

function Detector({
  position,
  angle,
  color,
  label,
}: {
  position: [number, number, number];
  angle: number;
  color: string;
  label: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = angle;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Detector body */}
      <mesh>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Measurement arrow */}
      <mesh position={[0, 0.7, 0]}>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Angle arc */}
      <mesh rotation={[0, 0, angle / 2]}>
        <torusGeometry args={[0.8, 0.02, 16, 32, Math.abs(angle)]} />
        <meshBasicMaterial color={color} />
      </mesh>

      <Html position={[0, -0.8, 0]} center>
        <div className="text-xs font-bold whitespace-nowrap" style={{ color }}>
          {label}: {Math.round((angle * 180) / Math.PI)}°
        </div>
      </Html>
    </group>
  );
}

function CorrelationLine({
  visible,
  correlation,
}: {
  visible: boolean;
  correlation: number;
}) {
  if (!visible) return null;

  const color = Math.abs(correlation) > 0.707 ? "#10b981" : "#ef4444";

  return (
    <>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 6, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      <Html position={[0, 0.8, 0]} center>
        <div
          className={`px-3 py-1 rounded-lg text-sm font-bold ${
            Math.abs(correlation) > 0.707 ? "bg-green-500" : "bg-red-500"
          } text-white shadow-xl`}
        >
          Correlation: {correlation.toFixed(3)}
        </div>
      </Html>
    </>
  );
}

export function BellTheoremVisualization() {
  const [angleA, setAngleA] = useState(0);
  const [angleB, setAngleB] = useState(Math.PI / 4);
  const [measuring, setMeasuring] = useState(false);
  const [correlation, setCorrelation] = useState(0);

  const calculateCorrelation = (a: number, b: number) => {
    // Quantum correlation: -cos(a - b)
    return -Math.cos(a - b);
  };

  const handleMeasure = () => {
    const corr = calculateCorrelation(angleA, angleB);
    setCorrelation(corr);
    setMeasuring(true);

    setTimeout(() => setMeasuring(false), 3000);
  };

  const bellLimit = 0.707; // 1/√2

  return (
    <div className="space-y-4">
      <div className="h-[400px] relative glass-card rounded-xl overflow-hidden border-2 border-gray-200">
        <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
          <color attach="background" args={["#f8fafc"]} />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Alice's detector */}
          <Detector
            position={[-3, 0, 0]}
            angle={angleA}
            color="#0ea5e9"
            label="Alice"
          />

          {/* Bob's detector */}
          <Detector
            position={[3, 0, 0]}
            angle={angleB}
            color="#d946ef"
            label="Bob"
          />

          {/* Entangled particle source in center */}
          <Sphere args={[0.3, 32, 32]}>
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={0.8}
            />
          </Sphere>

          <CorrelationLine visible={measuring} correlation={correlation} />

          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-quantum-700">
            Alice's Measurement Angle: {Math.round((angleA * 180) / Math.PI)}°
          </label>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.1"
            value={angleA}
            onChange={(e) => setAngleA(parseFloat(e.target.value))}
            className="w-full accent-quantum-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-entangled-700">
            Bob's Measurement Angle: {Math.round((angleB * 180) / Math.PI)}°
          </label>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.1"
            value={angleB}
            onChange={(e) => setAngleB(parseFloat(e.target.value))}
            className="w-full accent-entangled-500"
          />
        </div>
      </div>

      <button
        onClick={handleMeasure}
        className="w-full quantum-gradient text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        📊 Measure Correlation
      </button>

      {measuring && (
        <div
          className={`${
            Math.abs(correlation) > bellLimit
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          } border-2 rounded-lg p-4`}
        >
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Quantum Prediction:</strong>{" "}
              <span className="font-mono">{correlation.toFixed(3)}</span>
            </p>
            <p>
              <strong>Bell's Limit (1/√2):</strong>{" "}
              <span className="font-mono">±0.707</span>
            </p>
            <p>
              <strong>Angle Difference:</strong>{" "}
              {Math.round(((angleA - angleB) * 180) / Math.PI)}°
            </p>
            {Math.abs(correlation) > bellLimit ? (
              <p className="text-green-700 font-semibold pt-2 border-t border-green-300">
                ✓ Bell's inequality violated! Quantum mechanics wins! This
                correlation is impossible with local hidden variables.
              </p>
            ) : (
              <p className="text-orange-700 pt-2 border-t border-orange-300">
                Classical physics could explain this correlation. Try adjusting
                the angles to find violations!
              </p>
            )}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold text-blue-900 mb-2">💡 Tip:</p>
        <p>
          Try setting the angles 22.5° apart (like 0° and 22.5°, or 45° and
          67.5°). These produce maximum violations! Bell's limit of 0.707 can be
          exceeded up to about 0.854.
        </p>
      </div>
    </div>
  );
}
