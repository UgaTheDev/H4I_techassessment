import { useState } from "react";
import { IconShare, IconCheck } from "@tabler/icons-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "Quantum Entanglement Interactive Learning",
      text: "Check out this amazing interactive guide to quantum entanglement! 🌌⚛️",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="fixed top-20 right-6 z-40 glass-card p-3 rounded-full shadow-lg border-2 border-quantum-200 hover:scale-110 transition-transform"
      aria-label="Share this page"
    >
      {copied ? (
        <IconCheck className="h-5 w-5 text-green-500" />
      ) : (
        <IconShare className="h-5 w-5 text-quantum-600" />
      )}
    </button>
  );
}
