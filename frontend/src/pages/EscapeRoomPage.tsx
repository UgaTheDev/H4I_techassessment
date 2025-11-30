import { QuantumEscapeRoom } from "../components/EscapeRoom";
import { IconLock } from "@tabler/icons-react";

export function EscapeRoomPage() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <IconLock className="h-10 w-10 text-purple-600" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
              Quantum Escape Room
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Test your quantum knowledge with puzzles!
          </p>
        </div>

        <QuantumEscapeRoom />
      </div>
    </div>
  );
}

export default EscapeRoomPage;
