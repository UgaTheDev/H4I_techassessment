import { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

function StateVector({ 
  theta, 
  phi, 
  onDrag 
}: { 
  theta: number, 
  phi: number,
  onDrag: (theta: number, phi: number) => void
}) {
  const arrowRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);

  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isDragging && e.point) {
      const point = e.point;
      const length = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2);
      const newTheta = Math.acos(point.z / length);
      const newPhi = Math.atan2(point.y, point.x);
      onDrag(newTheta, newPhi);
    }
  };

  return (
    <group
      ref={arrowRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      {/* Arrow shaft */}
      <mesh position={[x * 0.5, y * 0.5, z * 0.5]} rotation={[Math.PI / 2 - theta, 0, phi]}>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
      </mesh>

      {/* Arrow head */}
      <mesh position={[x * 1, y * 1, z * 1]} rotation={[Math.PI / 2 - theta, 0, phi]}>
        <coneGeometry args={[0.08, 0.2, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.7} />
      </mesh>

      {/* Interactive sphere at tip */}
      <Sphere args={[0.12, 16, 16]} position={[x, y, z]}>
        <meshStandardMaterial 
          color={isDragging ? "#fbbf24" : "#10b981"} 
          emissive={isDragging ? "#fbbf24" : "#10b981"}
          emissiveIntensity={0.8}
        />
      </Sphere>

      {/* Label */}
      <Html position={[x * 1.3, y * 1.3, z * 1.3]} center>
        <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg">
          |ψ⟩ State
        </div>
      </Html>
    </group>
  );
}

function BlochSphereVisual({ 
  theta, 
  phi, 
  onDrag 
}: { 
  theta: number, 
  phi: number,
  onDrag: (theta: number, phi: number) => void
}) {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  // Axes
  const xAxis = [new THREE.Vector3(-1.2, 0, 0), new THREE.Vector3(1.2, 0, 0)];
  const yAxis = [new THREE.Vector3(0, -1.2, 0), new THREE.Vector3(0, 1.2, 0)];
  const zAxis = [new THREE.Vector3(0, 0, -1.2), new THREE.Vector3(0, 0, 1.2)];

  return (
    <>
      {/* Transparent sphere */}
      <Sphere ref={sphereRef} args={[1, 64, 64]}>
        <meshStandardMaterial 
          color="#0ea5e9" 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide}
          wireframe={false}
        />
      </Sphere>

      {/* Wireframe */}
      <Sphere args={[1, 16, 16]}>
        <meshBasicMaterial color="#0ea5e9" wireframe opacity={0.3} transparent />
      </Sphere>

      {/* Axes */}
      <Line points={xAxis} color="#ef4444" lineWidth={2} />
      <Line points={yAxis} color="#22c55e" lineWidth={2} />
      <Line points={zAxis} color="#3b82f6" lineWidth={2} />

      {/* Axis labels */}
      <Html position={[1.4, 0, 0]} center>
        <div className="text-red-500 font-bold text-sm">X</div>
      </Html>
      <Html position={[0, 1.4, 0]} center>
        <div className="text-green-500 font-bold text-sm">Y</div>
      </Html>
      <Html position={[0, 0, 1.4]} center>
        <div className="text-blue-500 font-bold text-sm">|0⟩</div>
      </Html>
      <Html position={[0, 0, -1.4]} center>
        <div className="text-blue-500 font-bold text-sm">|1⟩</div>
      </Html>

      {/* State vector */}
      <StateVector theta={theta} phi={phi} onDrag={onDrag} />

      {/* Equator circle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.01, 16, 100]} />
        <meshBasicMaterial color="#d946ef" opacity={0.5} transparent />
      </mesh>
    </>
  );
}

export function BlochSphere() {
  const [theta, setTheta] = useState(Math.PI / 4);
  const [phi, setPhi] = useState(Math.PI / 4);

  const handleDrag = (newTheta: number, newPhi: number) => {
    setTheta(newTheta);
    setPhi(newPhi);
  };

  // Calculate state probabilities
  const prob0 = Math.cos(theta / 2) ** 2;
  const prob1 = Math.sin(theta / 2) ** 2;

  // Determine if it's a basis state or superposition
  const isZero = theta < 0.1;
  const isOne = theta > Math.PI - 0.1;
  const isPlusX = Math.abs(theta - Math.PI / 2) < 0.1 && Math.abs(phi) < 0.1;
  const isMinusX = Math.abs(theta - Math.PI / 2) < 0.1 && Math.abs(phi - Math.PI) < 0.1;
  const isPlusY = Math.abs(theta - Math.PI / 2) < 0.1 && Math.abs(phi - Math.PI / 2) < 0.1;
  const isMinusY = Math.abs(theta - Math.PI / 2) < 0.1 && Math.abs(phi - 3 * Math.PI / 2) < 0.1;

  let stateDescription = "Superposition State";
  if (isZero) stateDescription = "Pure |0⟩ State";
  else if (isOne) stateDescription = "Pure |1⟩ State";
  else if (isPlusX) stateDescription = "|+⟩ State (equal superposition)";
  else if (isMinusX) stateDescription = "|−⟩ State";
  else if (isPlusY) stateDescription = "|+i⟩ State";
  else if (isMinusY) stateDescription = "|−i⟩ State";

  return (
    <div className="space-y-4">
      <div className="h-[500px] relative glass-card rounded-xl overflow-hidden border-2 border-gray-200">
        <Canvas camera={{ position: [2, 2, 3], fov: 50 }}>
          <color attach="background" args={['#0a0a1a']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <BlochSphereVisual theta={theta} phi={phi} onDrag={handleDrag} />
          
          <OrbitControls enableZoom={true} enablePan={false} />
        </Canvas>

        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">💡 Drag the green sphere!</p>
          <p className="text-sm font-semibold text-quantum-700">{stateDescription}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-lg border-2 border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-blue-700">Probability |0⟩</span>
            <span className="text-lg font-bold text-blue-900">{(prob0 * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${prob0 * 100}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-4 rounded-lg border-2 border-red-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-red-700">Probability |1⟩</span>
            <span className="text-lg font-bold text-red-900">{(prob1 * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-red-100 rounded-full h-3">
            <div 
              className="bg-red-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${prob1 * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            θ (theta): {(theta * 180 / Math.PI).toFixed(1)}°
          </label>
          <input
            type="range"
            min="0"
            max={Math.PI}
            step="0.01"
            value={theta}
            onChange={(e) => setTheta(parseFloat(e.target.value))}
            className="w-full accent-quantum-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            φ (phi): {(phi * 180 / Math.PI).toFixed(1)}°
          </label>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.01"
            value={phi}
            onChange={(e) => setPhi(parseFloat(e.target.value))}
            className="w-full accent-entangled-500"
          />
        </div>
      </div>

      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold text-purple-900 mb-2">📚 Understanding the Bloch Sphere:</p>
        <ul className="space-y-1 text-xs">
          <li><strong>North Pole (|0⟩):</strong> Qubit is definitely in state 0</li>
          <li><strong>South Pole (|1⟩):</strong> Qubit is definitely in state 1</li>
          <li><strong>Equator:</strong> Equal superposition with different phases</li>
          <li><strong>Interior points:</strong> Various superposition states</li>
          <li><strong>θ (theta):</strong> Controls probability mixture between |0⟩ and |1⟩</li>
          <li><strong>φ (phi):</strong> Controls the phase relationship (rotation around Z-axis)</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setTheta(0); setPhi(0); }} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition">
          |0⟩ State
        </button>
        <button onClick={() => { setTheta(Math.PI); setPhi(0); }} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition">
          |1⟩ State
        </button>
        <button onClick={() => { setTheta(Math.PI / 2); setPhi(0); }} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition">
          |+⟩ State
        </button>
        <button onClick={() => { setTheta(Math.PI / 2); setPhi(Math.PI); }} className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition">
          |−⟩ State
        </button>
        <button onClick={() => { setTheta(Math.PI / 2); setPhi(Math.PI / 2); }} className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition">
          |+i⟩ State
        </button>
      </div>
    </div>
  );
}
