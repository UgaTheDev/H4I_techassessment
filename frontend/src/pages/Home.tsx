import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Float, Stars, Trail } from "@react-three/drei";
import {
  IconAtom2,
  IconMathFunction,
  IconBrain,
  IconFlask,
  IconRocket,
  IconArrowRight,
  IconSparkles,
  IconTrophy,
  IconBulb,
  IconChevronDown,
} from "@tabler/icons-react";
import * as THREE from "three";

// ============ 3D HERO VISUALIZATION ============
function EntangledParticle({
  basePosition,
  color,
}: {
  basePosition: [number, number, number];
  color: string;
  partner: React.RefObject<THREE.Mesh>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.elapsedTime;

    // Orbital motion
    meshRef.current.position.x = basePosition[0] + Math.sin(t * 0.8) * 0.5;
    meshRef.current.position.y = basePosition[1] + Math.cos(t * 1.2) * 0.3;
    meshRef.current.position.z = basePosition[2] + Math.sin(t * 0.5) * 0.4;

    // Pulsing glow
    const scale = 1 + Math.sin(t * 3) * 0.1;
    meshRef.current.scale.set(scale, scale, scale);

    // Trail particle
    if (trailRef.current) {
      trailRef.current.position.x =
        meshRef.current.position.x + Math.cos(t * 2) * 0.3;
      trailRef.current.position.y =
        meshRef.current.position.y + Math.sin(t * 2) * 0.2;
      trailRef.current.position.z = meshRef.current.position.z;
    }
  });

  return (
    <group>
      <Float speed={2} floatIntensity={0.5}>
        <Trail width={0.3} length={6} color={color} attenuation={(t) => t * t}>
          <Sphere ref={meshRef} args={[0.2, 32, 32]} position={basePosition}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
            />
          </Sphere>
        </Trail>
      </Float>
    </group>
  );
}

function EntanglementBeam() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  return (
    <>
      <mesh ref={ref} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 4, 16]} />
        <meshBasicMaterial color="#d946ef" transparent opacity={0.4} />
      </mesh>
      {Array.from({ length: 20 }).map((_, i) => (
        <WaveDot key={i} index={i} />
      ))}
    </>
  );
}

function WaveDot({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.x = -2 + index * 0.2;
      ref.current.position.y = Math.sin(t * 4 + index * 0.4) * 0.2;
      ref.current.position.z = Math.cos(t * 3 + index * 0.3) * 0.15;
    }
  });

  return (
    <Sphere ref={ref} args={[0.03, 8, 8]}>
      <meshBasicMaterial color="#d946ef" transparent opacity={0.7} />
    </Sphere>
  );
}

function HeroScene() {
  const partner1 = useRef<THREE.Mesh>(null);
  const partner2 = useRef<THREE.Mesh>(null);

  return (
    <>
      <color attach="background" args={["#030712"]} />
      <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d946ef" />

      <EntangledParticle
        basePosition={[-1.5, 0, 0]}
        color="#06b6d4"
        partner={partner2}
      />
      <EntangledParticle
        basePosition={[1.5, 0, 0]}
        color="#f97316"
        partner={partner1}
      />
      <EntanglementBeam />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// ============ PROGRESS TRACKER ============
interface LearningProgress {
  pagesVisited: string[];
  quizzesCompleted: string[];
  quizScores: Record<string, number>;
}

function ProgressTracker() {
  const [progress, setProgress] = useState<LearningProgress>({
    pagesVisited: [],
    quizzesCompleted: [],
    quizScores: {},
  });

  useEffect(() => {
    const stored = localStorage.getItem("quantum-learning-progress");
    if (stored) {
      setProgress(JSON.parse(stored));
    }
  }, []);

  const pages = [
    { id: "what-is-entanglement", name: "Basics", icon: IconAtom2 },
    { id: "epr-paradox", name: "EPR", icon: IconBrain },
    { id: "bells-theorem", name: "Bell's", icon: IconMathFunction },
    { id: "famous-experiments", name: "Experiments", icon: IconFlask },
    { id: "applications", name: "Applications", icon: IconRocket },
  ];

  const completedCount = progress.pagesVisited.length;
  const totalPages = pages.length;
  const percentComplete = Math.round((completedCount / totalPages) * 100);

  return (
    <div className="glass-card rounded-xl p-6 border-2 border-quantum-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-gray-900 flex items-center gap-2">
          <IconTrophy className="h-5 w-5 text-yellow-500" />
          Your Progress
        </h3>
        <span className="text-2xl font-bold text-quantum-600">
          {percentComplete}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-gradient-to-r from-quantum-500 to-entangled-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {/* Page completion indicators */}
      <div className="flex justify-between">
        {pages.map((page) => {
          const isComplete = progress.pagesVisited.includes(page.id);
          const Icon = page.icon;
          return (
            <div
              key={page.id}
              className={`flex flex-col items-center gap-1 ${
                isComplete ? "text-quantum-600" : "text-gray-400"
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  isComplete ? "bg-quantum-100" : "bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs">{page.name}</span>
            </div>
          );
        })}
      </div>

      {completedCount === 0 && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          Start exploring to track your learning journey!
        </p>
      )}
    </div>
  );
}

// ============ TOPIC CARDS ============
interface TopicCardProps {
  to: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
}

function TopicCard({
  to,
  icon: Icon,
  title,
  description,
  color,
  difficulty,
  duration,
}: TopicCardProps) {
  const difficultyColors = {
    Beginner: "bg-green-100 text-green-700",
    Intermediate: "bg-yellow-100 text-yellow-700",
    Advanced: "bg-red-100 text-red-700",
  };

  return (
    <Link
      to={to}
      className="group glass-card rounded-xl p-6 border-2 border-gray-200 hover:border-quantum-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[difficulty]}`}
          >
            {difficulty}
          </span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
            {duration}
          </span>
        </div>
      </div>

      <h3 className="font-display text-xl font-semibold text-gray-900 mb-2 group-hover:text-quantum-600 transition-colors">
        {title}
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

      <div className="flex items-center text-quantum-600 text-sm font-medium">
        <span>Start Learning</span>
        <IconArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

// ============ QUICK FACTS CAROUSEL ============
function QuickFacts() {
  const facts = [
    {
      emoji: "🔬",
      fact: "Entanglement has been demonstrated over 1,400 km using satellites",
    },
    {
      emoji: "⚡",
      fact: "The correlation between entangled particles is instantaneous",
    },
    {
      emoji: "🏆",
      fact: "The 2022 Nobel Prize was awarded for proving entanglement is real",
    },
    {
      emoji: "🔐",
      fact: "Quantum cryptography uses entanglement for unbreakable encryption",
    },
    {
      emoji: "💻",
      fact: "Quantum computers use entanglement to process exponentially more data",
    },
  ];

  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-quantum-500/10 to-entangled-500/10 rounded-xl p-6 border border-quantum-200">
      <div className="flex items-center gap-2 mb-3">
        <IconBulb className="h-5 w-5 text-yellow-500" />
        <span className="text-sm font-semibold text-gray-700">
          Did You Know?
        </span>
      </div>
      <div className="min-h-[60px] flex items-center">
        <p className="text-lg text-gray-800 transition-opacity duration-500">
          <span className="text-2xl mr-2">{facts[currentFact].emoji}</span>
          {facts[currentFact].fact}
        </p>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {facts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentFact(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentFact ? "bg-quantum-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ============ MAIN HOME COMPONENT ============
export function Home() {
  const scrollToContent = () => {
    document
      .getElementById("main-content")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with 3D Visualization */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <HeroScene />
          </Canvas>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-quantum-700 mb-6 shadow-lg">
            <IconSparkles className="h-4 w-4" />
            <span>Hack4Impact IdeaCon 2025</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white drop-shadow-lg">Quantum</span>
            <br />
            <span className="bg-gradient-to-r from-quantum-400 to-entangled-400 bg-clip-text text-transparent drop-shadow-lg">
              Entanglement
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow">
            The phenomenon Einstein called "spooky action at a distance" — and
            why it's revolutionizing technology
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/what-is-entanglement"
              className="px-8 py-4 bg-gradient-to-r from-quantum-500 to-entangled-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Learning
              <IconArrowRight className="h-5 w-5" />
            </Link>
            <button
              onClick={scrollToContent}
              className="px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-800 rounded-xl font-semibold text-lg hover:bg-white transition-all duration-300"
            >
              Explore Topics
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce"
        >
          <IconChevronDown className="h-8 w-8" />
        </button>
      </section>

      {/* Main Content */}
      <section
        id="main-content"
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        {/* Progress Tracker */}
        <div className="mb-12">
          <ProgressTracker />
        </div>

        {/* Quick Facts */}
        <div className="mb-12">
          <QuickFacts />
        </div>

        {/* Learning Path */}
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Your Learning Path
          </h2>
          <p className="text-gray-600">
            Follow the recommended order, or jump to any topic that interests
            you
          </p>
        </div>

        {/* Topic Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <TopicCard
            to="/what-is-entanglement"
            icon={IconAtom2}
            title="What is Entanglement?"
            description="Start here! Learn the basics of quantum entanglement through intuitive explanations and analogies."
            color="bg-gradient-to-br from-cyan-500 to-blue-600"
            difficulty="Beginner"
            duration="10 min"
          />

          <TopicCard
            to="/epr-paradox"
            icon={IconBrain}
            title="The EPR Paradox"
            description="Einstein's famous thought experiment that challenged quantum mechanics — and lost."
            color="bg-gradient-to-br from-rose-500 to-pink-600"
            difficulty="Intermediate"
            duration="12 min"
          />

          <TopicCard
            to="/bells-theorem"
            icon={IconMathFunction}
            title="Bell's Theorem"
            description="The mathematical proof that settled the Einstein-Bohr debate and won a Nobel Prize."
            color="bg-gradient-to-br from-violet-500 to-purple-600"
            difficulty="Advanced"
            duration="15 min"
          />

          <TopicCard
            to="/famous-experiments"
            icon={IconFlask}
            title="Famous Experiments"
            description="From Aspect's breakthrough to loophole-free tests — the experiments that proved it all."
            color="bg-gradient-to-br from-amber-500 to-orange-600"
            difficulty="Intermediate"
            duration="12 min"
          />

          <TopicCard
            to="/applications"
            icon={IconRocket}
            title="Real Applications"
            description="Quantum cryptography, quantum computers, and teleportation — the technology of tomorrow."
            color="bg-gradient-to-br from-emerald-500 to-green-600"
            difficulty="Beginner"
            duration="10 min"
          />
        </div>

        {/* Why Learn Section */}
        <div className="glass-card rounded-2xl p-8 border-2 border-gray-200 mb-16">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Learn About Quantum Entanglement?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-quantum-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconBrain className="h-8 w-8 text-quantum-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Mind-Bending Physics
              </h3>
              <p className="text-gray-600 text-sm">
                Understand one of the strangest and most fascinating phenomena
                in the universe
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-entangled-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconRocket className="h-8 w-8 text-entangled-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Future Technology
              </h3>
              <p className="text-gray-600 text-sm">
                Learn the foundation of quantum computing, cryptography, and
                communication
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconTrophy className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Nobel Prize Science
              </h3>
              <p className="text-gray-600 text-sm">
                Explore the 2022 Nobel Prize-winning research that proved
                Einstein wrong
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Ready to have your mind blown by quantum physics?
          </p>
          <Link
            to="/what-is-entanglement"
            className="inline-flex items-center gap-2 px-6 py-3 bg-quantum-500 text-white rounded-lg font-semibold hover:bg-quantum-600 transition-colors"
          >
            Begin Your Journey
            <IconArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
