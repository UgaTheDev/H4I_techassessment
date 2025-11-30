import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html, Trail, Float } from "@react-three/drei";
import * as THREE from "three";

interface ParticleProps {
  position: [number, number, number];
  color: string;
  label: string;
  spinDirection: number;
  measured: boolean;
  measurementResult: "up" | "down" | null;
  onMeasure: () => void;
}

function Particle({
  position,
  color,
  label,
  spinDirection,
  measured,
  measurementResult,
  onMeasure,
}: ParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && !measured) {
      // Spinning animation when in superposition
      meshRef.current.rotation.y += 0.03 * spinDirection;
      meshRef.current.rotation.x += 0.02;

      // Pulsing glow effect
      if (glowRef.current) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        glowRef.current.scale.set(scale, scale, scale);
      }
    }

    // Trail particle orbits around main particle
    if (trailRef.current && !measured) {
      const t = state.clock.elapsedTime * 2;
      trailRef.current.position.x = position[0] + Math.cos(t) * 0.5;
      trailRef.current.position.y = position[1] + Math.sin(t) * 0.3;
      trailRef.current.position.z = position[2] + Math.sin(t * 0.7) * 0.4;
    }
  });

  const resultColor =
    measurementResult === "up"
      ? "#3b82f6"
      : measurementResult === "down"
      ? "#ef4444"
      : color;

  return (
    <group position={position}>
      {/* Glow effect */}
      <Sphere ref={glowRef} args={[0.45, 32, 32]}>
        <meshBasicMaterial
          color={resultColor}
          transparent
          opacity={measured ? 0.3 : 0.15}
        />
      </Sphere>

      {/* Main particle */}
      <Float
        speed={measured ? 0 : 2}
        rotationIntensity={measured ? 0 : 0.5}
        floatIntensity={measured ? 0 : 0.5}
      >
        <Sphere ref={meshRef} args={[0.3, 32, 32]} onClick={onMeasure}>
          <meshStandardMaterial
            color={resultColor}
            emissive={resultColor}
            emissiveIntensity={measured ? 0.8 : 0.4}
            metalness={0.3}
            roughness={0.4}
          />
        </Sphere>
      </Float>

      {/* Orbiting trail particle (only when not measured) */}
      {!measured && (
        <Trail width={0.2} length={8} color={color} attenuation={(t) => t * t}>
          <Sphere ref={trailRef} args={[0.08, 16, 16]}>
            <meshBasicMaterial color={color} />
          </Sphere>
        </Trail>
      )}

      {/* Spin arrow indicator when measured */}
      {measured && measurementResult && (
        <group>
          <mesh position={[0, measurementResult === "up" ? 0.5 : -0.5, 0]}>
            <coneGeometry args={[0.1, 0.25, 16]} />
            <meshStandardMaterial
              color={resultColor}
              emissive={resultColor}
              emissiveIntensity={0.5}
            />
          </mesh>
          {measurementResult === "down" && (
            <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.5, 0]}>
              <coneGeometry args={[0.1, 0.25, 16]} />
              <meshStandardMaterial
                color={resultColor}
                emissive={resultColor}
                emissiveIntensity={0.5}
              />
            </mesh>
          )}
        </group>
      )}

      {/* Label */}
      <Html position={[0, -0.7, 0]} center>
        <div
          className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg backdrop-blur-sm ${
            measured
              ? measurementResult === "up"
                ? "bg-blue-500/90 text-white"
                : "bg-red-500/90 text-white"
              : "bg-white/90 text-gray-800"
          }`}
        >
          {label}
          {measured && measurementResult && (
            <span className="ml-1">
              {measurementResult === "up" ? "↑" : "↓"}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

function EntanglementBeam({ measured }: { measured: boolean }) {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beamRef.current && !measured) {
      // Pulsing beam effect
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity =
        pulse * 0.3;
    }
  });

  return (
    <>
      {/* Central beam connecting particles */}
      <mesh ref={beamRef} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 4, 16]} />
        <meshBasicMaterial
          color={measured ? "#6b7280" : "#d946ef"}
          transparent
          opacity={measured ? 0.2 : 0.5}
        />
      </mesh>

      {/* Wavy entanglement visualization */}
      {!measured &&
        Array.from({ length: 20 }).map((_, i) => {
          const x = -2 + i * 0.2;
          return <WaveParticle key={i} xPos={x} index={i} />;
        })}
    </>
  );
}

function WaveParticle({ xPos, index }: { xPos: number; index: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = Math.sin(t * 3 + index * 0.5) * 0.3;
      ref.current.position.z = Math.cos(t * 2 + index * 0.3) * 0.2;
    }
  });

  return (
    <Sphere ref={ref} args={[0.04, 8, 8]} position={[xPos, 0, 0]}>
      <meshBasicMaterial color="#d946ef" transparent opacity={0.6} />
    </Sphere>
  );
}

function Scene({
  measured,
  measurementResults,
  onMeasure,
}: {
  measured: boolean;
  measurementResults: {
    alice: "up" | "down" | null;
    bob: "up" | "down" | null;
  };
  onMeasure: (particle: "alice" | "bob") => void;
}) {
  return (
    <>
      <color attach="background" args={["#0a0a1a"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d946ef" />

      {/* Stars background */}
      {Array.from({ length: 100 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.02, 8, 8]}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20 - 5,
          ]}
        >
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
      ))}

      <EntanglementBeam measured={measured} />

      <Particle
        position={[-2, 0, 0]}
        color="#06b6d4"
        label="Alice's Particle"
        spinDirection={1}
        measured={measurementResults.alice !== null}
        measurementResult={measurementResults.alice}
        onMeasure={() => onMeasure("alice")}
      />

      <Particle
        position={[2, 0, 0]}
        color="#f97316"
        label="Bob's Particle"
        spinDirection={-1}
        measured={measurementResults.bob !== null}
        measurementResult={measurementResults.bob}
        onMeasure={() => onMeasure("bob")}
      />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={12}
      />
    </>
  );
}

export function EntangledParticles3D() {
  const [measurementResults, setMeasurementResults] = useState<{
    alice: "up" | "down" | null;
    bob: "up" | "down" | null;
  }>({ alice: null, bob: null });

  const [measurementCount, setMeasurementCount] = useState({
    sameCount: 0,
    totalCount: 0,
  });

  const measured =
    measurementResults.alice !== null || measurementResults.bob !== null;

  const handleMeasure = (particle: "alice" | "bob") => {
    if (measured) return;

    // Random measurement for the clicked particle
    const firstResult = Math.random() > 0.5 ? "up" : "down";
    // Entangled particle gets opposite result (anti-correlated)
    const secondResult = firstResult === "up" ? "down" : "up";

    if (particle === "alice") {
      setMeasurementResults({ alice: firstResult, bob: secondResult });
    } else {
      setMeasurementResults({ alice: secondResult, bob: firstResult });
    }

    // Update statistics
    setMeasurementCount((prev) => ({
      sameCount: prev.sameCount + (firstResult !== secondResult ? 1 : 0),
      totalCount: prev.totalCount + 1,
    }));
  };

  const handleReset = () => {
    setMeasurementResults({ alice: null, bob: null });
  };

  const correlationPercent =
    measurementCount.totalCount > 0
      ? (
          (measurementCount.sameCount / measurementCount.totalCount) *
          100
        ).toFixed(0)
      : "—";

  return (
    <div className="space-y-4">
      <div className="h-[450px] relative glass-card rounded-xl overflow-hidden border-2 border-purple-200">
        <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
          <Scene
            measured={measured}
            measurementResults={measurementResults}
            onMeasure={handleMeasure}
          />
        </Canvas>

        {/* Instructions overlay */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-200 max-w-xs">
          <p className="text-xs text-gray-600 mb-1">
            🔬 Click a particle to measure!
          </p>
          <p className="text-sm text-gray-700">
            {!measured
              ? "Both particles are in superposition — neither has a definite spin yet."
              : "Measurement collapsed the wavefunction! Notice how the results are anti-correlated."}
          </p>
        </div>

        {/* Results display */}
        {measured && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg text-white">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-cyan-400 font-semibold">Alice: </span>
                <span
                  className={
                    measurementResults.alice === "up"
                      ? "text-blue-400"
                      : "text-red-400"
                  }
                >
                  Spin {measurementResults.alice === "up" ? "↑ Up" : "↓ Down"}
                </span>
              </div>
              <div className="text-purple-400 text-xl">⟷</div>
              <div>
                <span className="text-orange-400 font-semibold">Bob: </span>
                <span
                  className={
                    measurementResults.bob === "up"
                      ? "text-blue-400"
                      : "text-red-400"
                  }
                >
                  Spin {measurementResults.bob === "up" ? "↑ Up" : "↓ Down"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls and stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-lg border-2 border-purple-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-purple-700">
              Anti-correlation Rate
            </span>
            <span className="text-lg font-bold text-purple-900">
              {correlationPercent}%
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Measurements: {measurementCount.totalCount} | Anti-correlated:{" "}
            {measurementCount.sameCount}
          </p>
        </div>

        <div className="glass-card p-4 rounded-lg border-2 border-gray-200 flex items-center justify-center">
          <button
            onClick={handleReset}
            disabled={!measured}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              measured
                ? "bg-purple-500 text-white hover:bg-purple-600 shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            🔄 Reset & Entangle Again
          </button>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-gradient-to-r from-cyan-50 to-orange-50 border-2 border-purple-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold text-purple-900 mb-2">
          🎯 What's Happening:
        </p>
        <ul className="space-y-1 text-xs">
          <li>
            <strong>Before measurement:</strong> Both particles spin in
            superposition — they don't have definite spin values
          </li>
          <li>
            <strong>The purple beam:</strong> Represents the entanglement
            connection (not a physical link!)
          </li>
          <li>
            <strong>Click to measure:</strong> Collapses both particles
            instantly, even though they're separated
          </li>
          <li>
            <strong>Anti-correlation:</strong> If Alice gets "up", Bob always
            gets "down" (and vice versa)
          </li>
          <li>
            <strong>Try many times:</strong> The correlation is 100% — this is
            what experiments confirm!
          </li>
        </ul>
      </div>
    </div>
  );
}

export default EntangledParticles3D;
