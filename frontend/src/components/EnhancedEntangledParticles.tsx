import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  Html,
  MeshDistortMaterial,
  Stars,
} from "@react-three/drei";
import { IconX } from "@tabler/icons-react";
import * as THREE from "three";

function Particle({
  position,
  color,
  rotation,
  measured,
  isSpinUp,
}: {
  position: [number, number, number];
  color: string;
  rotation: number;
  measured: boolean;
  isSpinUp: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const arrowRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Spin direction changes based on measurement
      if (measured) {
        meshRef.current.rotation.y =
          rotation + state.clock.elapsedTime * (isSpinUp ? 2 : -2);
      } else {
        // Random wobble when unmeasured (superposition)
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.5;
        meshRef.current.rotation.x =
          Math.cos(state.clock.elapsedTime * 0.7) * 0.3;
      }

      // Pulsing effect when measured
      if (measured) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
        meshRef.current.scale.setScalar(scale);
      }
    }

    // Rotate arrow to show spin direction
    if (arrowRef.current && measured) {
      arrowRef.current.rotation.y =
        state.clock.elapsedTime * (isSpinUp ? 3 : -3);
    }

    if (glowRef.current) {
      if (measured) {
        const glowScale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
        glowRef.current.scale.setScalar(glowScale);
      } else {
        // Chaotic glow when unmeasured
        const chaos =
          Math.sin(state.clock.elapsedTime * 2) * 0.2 +
          Math.cos(state.clock.elapsedTime * 3) * 0.15;
        glowRef.current.scale.setScalar(1 + chaos);
      }
    }
  });

  return (
    <group position={position}>
      {/* Main particle with distortion */}
      <Sphere ref={meshRef} args={[0.6, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={measured ? 1 : 0.5}
          metalness={0.9}
          roughness={0.1}
          distort={measured ? 0.2 : 0.4}
          speed={measured ? 1 : 3}
        />
      </Sphere>

      {/* Spin direction arrow - points up or down and rotates */}
      {measured && (
        <group
          ref={arrowRef}
          position={[0, isSpinUp ? 1.2 : -1.2, 0]}
          rotation={isSpinUp ? [0, 0, 0] : [Math.PI, 0, 0]}
        >
          <mesh>
            <coneGeometry args={[0.2, 0.6, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1}
            />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.7}
            />
          </mesh>
        </group>
      )}

      {/* Orbital rings - rotate based on spin */}
      <RotatingRing
        color={color}
        radius={1}
        measured={measured}
        isSpinUp={isSpinUp}
        axis="horizontal"
      />
      <RotatingRing
        color={color}
        radius={1}
        measured={measured}
        isSpinUp={isSpinUp}
        axis="vertical"
      />

      {/* Glow sphere */}
      <Sphere ref={glowRef} args={[0.9, 32, 32]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={measured ? 0.3 : 0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Energy particles orbiting - behavior depends on spin */}
      {[...Array(8)].map((_, i) => (
        <OrbitingParticle
          key={i}
          radius={1.2}
          speed={(measured ? (isSpinUp ? 2 : -2) : 1) + i * 0.1}
          color={color}
          offset={i * (Math.PI / 4)}
          measured={measured}
        />
      ))}
    </group>
  );
}

function RotatingRing({
  color,
  radius,
  measured,
  isSpinUp,
  axis,
}: {
  color: string;
  radius: number;
  measured: boolean;
  isSpinUp: boolean;
  axis: "horizontal" | "vertical";
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      if (measured) {
        // Spin in direction based on measurement
        const speed = isSpinUp ? 2 : -2;
        if (axis === "horizontal") {
          ringRef.current.rotation.x = state.clock.elapsedTime * speed;
        } else {
          ringRef.current.rotation.y = state.clock.elapsedTime * speed;
        }
      } else {
        // Random wobble when unmeasured
        if (axis === "horizontal") {
          ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.5;
        } else {
          ringRef.current.rotation.y =
            Math.cos(state.clock.elapsedTime * 0.8) * 0.5;
        }
      }
    }
  });

  return (
    <mesh
      ref={ringRef}
      rotation={
        axis === "horizontal" ? [Math.PI / 2, 0, 0] : [0, Math.PI / 2, 0]
      }
    >
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={measured ? 0.6 : 0.3}
      />
    </mesh>
  );
}

function OrbitingParticle({
  radius,
  speed,
  color,
  offset,
  measured,
}: {
  radius: number;
  speed: number;
  color: string;
  offset: number;
  measured: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      if (measured) {
        // Organized orbital motion when measured
        const t = state.clock.elapsedTime * speed + offset;
        ref.current.position.x = Math.cos(t) * radius;
        ref.current.position.z = Math.sin(t) * radius;
        ref.current.position.y = Math.sin(t * 2) * 0.3; // Add vertical component
      } else {
        // Chaotic motion when unmeasured (superposition)
        const t = state.clock.elapsedTime;
        ref.current.position.x =
          Math.cos(t * speed + offset) * radius * (1 + Math.sin(t * 2) * 0.3);
        ref.current.position.z =
          Math.sin(t * speed + offset) * radius * (1 + Math.cos(t * 1.5) * 0.3);
        ref.current.position.y = Math.sin(t * 3 + offset) * 0.5;
      }
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[measured ? 0.08 : 0.06, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={measured ? 1 : 0.6}
      />
    </mesh>
  );
}

function ConnectionBeam({ measured }: { measured: boolean }) {
  const lineRef = useRef<THREE.Line>(null);

  useFrame((state) => {
    if (lineRef.current && lineRef.current.material) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      if (measured) {
        material.opacity = 0.8;
      } else {
        // Flickering when unmeasured (uncertain connection)
        material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
      }
    }
  });

  const points = [
    new THREE.Vector3(-2.5, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(2.5, 0, 0),
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  const curvePoints = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

  return (
    <>
      <primitive
        object={
          new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
              color: measured ? "#10b981" : "#38bdf8",
              transparent: true,
              opacity: 0.6,
            })
          )
        }
        ref={lineRef}
      />

      {/* Energy pulses - faster when measured */}
      {[...Array(measured ? 5 : 3)].map((_, i) => (
        <EnergyPulse
          key={i}
          delay={i * (measured ? 0.2 : 0.3)}
          measured={measured}
        />
      ))}
    </>
  );
}

function EnergyPulse({
  delay,
  measured,
}: {
  delay: number;
  measured: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const speed = measured ? 1.5 : 2;
      const t = (state.clock.elapsedTime * speed + delay) % 2;
      meshRef.current.position.x = -2.5 + t * 2.5;
      const scale = Math.sin(t * Math.PI) * 0.3 + 0.2;
      meshRef.current.scale.setScalar(scale);

      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.sin(t * Math.PI);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshBasicMaterial color={measured ? "#10b981" : "#38bdf8"} transparent />
    </mesh>
  );
}

export function EnhancedEntangledParticles() {
  const [particle1Spin, setParticle1Spin] = useState(0);
  const [particle2Spin, setParticle2Spin] = useState(0);
  const [measured, setMeasured] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowInfo(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleMeasure = () => {
    const randomSpin = Math.random() > 0.5 ? 0 : Math.PI;
    setParticle1Spin(randomSpin);
    setParticle2Spin(randomSpin + Math.PI);
    setMeasured(true);
    setShowInfo(false);

    setTimeout(() => {
      setMeasured(false);
      setTimeout(() => setShowInfo(true), 1000);
    }, 4000);
  };

  const isParticle1SpinUp = Math.cos(particle1Spin) > 0;
  const isParticle2SpinUp = Math.cos(particle2Spin) > 0;

  return (
    <div className="relative h-full">
      <Canvas camera={{ position: [0, 3, 7], fov: 60 }}>
        <color attach="background" args={["#0a0a1a"]} />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#0ea5e9" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#d946ef" />
        <spotLight
          position={[0, 10, 0]}
          intensity={0.5}
          angle={0.3}
          penumbra={1}
        />

        <Particle
          position={[-2.5, 0, 0]}
          color="#0ea5e9"
          rotation={particle1Spin}
          measured={measured}
          isSpinUp={isParticle1SpinUp}
        />

        <Particle
          position={[2.5, 0, 0]}
          color="#d946ef"
          rotation={particle2Spin}
          measured={measured}
          isSpinUp={isParticle2SpinUp}
        />

        <ConnectionBeam measured={measured} />

        {measured && (
          <>
            <Html position={[-2.5, 2, 0]} center>
              <div className="bg-quantum-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-xl border border-quantum-300 animate-bounce">
                {isParticle1SpinUp ? "↑ Spin Up" : "↓ Spin Down"}
              </div>
            </Html>
            <Html position={[2.5, 2, 0]} center>
              <div className="bg-entangled-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-xl border border-entangled-300 animate-bounce">
                {isParticle2SpinUp ? "↑ Spin Up" : "↓ Spin Down"}
              </div>
            </Html>
            <Html position={[0, -2, 0]} center>
              <div className="bg-green-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-base font-bold shadow-xl border border-green-300">
                ⚡ Opposite Spins - Instant Correlation!
              </div>
            </Html>
          </>
        )}

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {showInfo && !measured && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 animate-pulse">
          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border-2 border-quantum-300 flex items-center space-x-2">
            <span className="text-2xl">👇</span>
            <span className="font-semibold text-gray-800">
              Click to measure a particle!
            </span>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleMeasure}
          disabled={measured}
          className="group relative quantum-gradient text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-quantum-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span className="flex items-center space-x-2">
            <span className="text-2xl group-hover:scale-110 transition-transform">
              📡
            </span>
            <span>{measured ? "Measuring..." : "Measure Particle"}</span>
          </span>
          {!measured && (
            <div className="absolute inset-0 rounded-xl bg-white/20 animate-ping" />
          )}
        </button>
      </div>

      {showExplanation && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-5 py-4 rounded-xl shadow-2xl border-2 border-quantum-200 max-w-sm">
          <button
            onClick={() => setShowExplanation(false)}
            className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close explanation"
          >
            <IconX className="h-4 w-4 text-gray-600" />
          </button>

          <h3 className="font-bold text-quantum-700 mb-2 pr-6">
            🌟 What You're Seeing
          </h3>
          <div className="space-y-2 text-xs text-gray-700">
            <p>
              <strong className="text-gray-900">Before Measurement:</strong>{" "}
              Particles wobble chaotically with orbiting particles moving
              randomly. This represents <em>quantum superposition</em> — they're
              in all possible states at once!
            </p>
            <p>
              <strong className="text-gray-900">After Measurement:</strong>{" "}
              Everything becomes organized! The particles spin in opposite
              directions, rings rotate consistently, and orbiting particles
              follow stable paths.
            </p>
            <p>
              <strong className="text-green-600">Watch Carefully:</strong> Spin
              up (↑) rotates clockwise, spin down (↓) rotates counter-clockwise.
              The small particles orbit in the spin direction!
            </p>
            <p className="pt-2 border-t border-gray-200">
              <strong>The Magic:</strong> Measuring one particle instantly
              determines the other's opposite spin regardless of distance.
            </p>
          </div>
        </div>
      )}

      {!showExplanation && (
        <button
          onClick={() => setShowExplanation(true)}
          className="absolute top-4 right-4 bg-quantum-500 hover:bg-quantum-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold text-sm transition-all"
        >
          ❓ What am I seeing?
        </button>
      )}
    </div>
  );
}
