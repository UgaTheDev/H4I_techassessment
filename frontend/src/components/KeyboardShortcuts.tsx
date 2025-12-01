import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconKeyboard, IconX } from "@tabler/icons-react";

export function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "?") {
        setShowHelp(true);
        return;
      }

      if (e.key === "Escape" && showHelp) {
        setShowHelp(false);
        return;
      }

      if (e.key === "h") navigate("/");
      if (e.key === "e") navigate("/what-is-entanglement");
      if (e.key === "b") navigate("/bells-theorem");
      if (e.key === "a") navigate("/applications");
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate, showHelp]);

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className="fixed top-6 left-6 z-40 glass-card px-4 py-2 rounded-full shadow-lg border-2 border-gray-200 hover:scale-105 transition-transform text-sm font-medium text-gray-700 flex items-center space-x-2"
        title="Keyboard shortcuts"
      >
        <IconKeyboard className="h-4 w-4" />
        <span>Press ? for shortcuts</span>
      </button>

      {showHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-start p-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full border-2 border-quantum-300 ml-0 mt-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Home</span>
                <kbd className="px-3 py-1 bg-gray-200 rounded font-mono text-sm">
                  H
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">What is Entanglement?</span>
                <kbd className="px-3 py-1 bg-gray-200 rounded font-mono text-sm">
                  E
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Bell's Theorem</span>
                <kbd className="px-3 py-1 bg-gray-200 rounded font-mono text-sm">
                  B
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Applications</span>
                <kbd className="px-3 py-1 bg-gray-200 rounded font-mono text-sm">
                  A
                </kbd>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-gray-700">Show this help</span>
                <kbd className="px-3 py-1 bg-gray-200 rounded font-mono text-sm">
                  ?
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Close dialogs</span>
                <kbd className="px-3 py-1 bg-gray-200 rounded font-mono text-sm">
                  ESC
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
