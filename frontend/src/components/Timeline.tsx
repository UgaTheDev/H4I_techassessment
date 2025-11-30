import { useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconExternalLink,
} from "@tabler/icons-react";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  category: "theory" | "experiment" | "technology" | "award";
  details?: string;
  link?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  title?: string;
}

const categoryStyles = {
  theory: {
    bg: "bg-purple-500",
    border: "border-purple-300",
    light: "bg-purple-50",
  },
  experiment: {
    bg: "bg-green-500",
    border: "border-green-300",
    light: "bg-green-50",
  },
  technology: {
    bg: "bg-blue-500",
    border: "border-blue-300",
    light: "bg-blue-50",
  },
  award: {
    bg: "bg-amber-500",
    border: "border-amber-300",
    light: "bg-amber-50",
  },
};

const categoryLabels = {
  theory: "📐 Theory",
  experiment: "🔬 Experiment",
  technology: "💻 Technology",
  award: "🏆 Award",
};

export function Timeline({ events, title = "Timeline" }: TimelineProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const filteredEvents = filter
    ? events.filter((e) => e.category === filter)
    : events;

  const sortedEvents = [...filteredEvents].sort((a, b) => a.year - b.year);

  return (
    <div className="glass-card rounded-xl p-6 mb-8 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-semibold text-gray-900">
          📅 {title}
        </h3>

        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === null
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key === filter ? null : key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === key
                  ? `${
                      categoryStyles[key as keyof typeof categoryStyles].bg
                    } text-white`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Events */}
        <div className="space-y-4">
          {sortedEvents.map((event, index) => {
            const styles = categoryStyles[event.category];
            const isExpanded = expandedId === index;

            return (
              <div key={index} className="relative pl-12">
                {/* Timeline dot */}
                <div
                  className={`absolute left-2 top-2 w-5 h-5 rounded-full ${styles.bg} border-4 border-white shadow-md`}
                />

                {/* Event card */}
                <div
                  className={`rounded-lg border-2 ${styles.border} ${
                    styles.light
                  } overflow-hidden transition-all duration-300 ${
                    isExpanded ? "shadow-lg" : ""
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : index)}
                    className="w-full p-4 text-left flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${styles.bg} text-white`}
                        >
                          {event.year}
                        </span>
                        <span className="text-xs text-gray-500">
                          {categoryLabels[event.category]}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.description}
                      </p>
                    </div>

                    {event.details && (
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <IconChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <IconChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Expanded details */}
                  {isExpanded && event.details && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {event.details}
                        </p>
                        {event.link && (
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-quantum-600 hover:text-quantum-700 mt-2"
                          >
                            Learn more <IconExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No events match this filter.
        </p>
      )}
    </div>
  );
}

// Pre-made timeline for quantum entanglement history
export const QUANTUM_TIMELINE: TimelineEvent[] = [
  {
    year: 1935,
    title: "EPR Paper Published",
    description: "Einstein, Podolsky, and Rosen challenge quantum mechanics.",
    category: "theory",
    details:
      'The famous EPR paper argued that quantum mechanics must be incomplete because it seemed to require "spooky action at a distance." They proposed that hidden variables must exist to explain correlations without instantaneous effects.',
  },
  {
    year: 1964,
    title: "Bell's Theorem",
    description:
      "John Bell shows how to experimentally test hidden variable theories.",
    category: "theory",
    details:
      "Bell derived inequalities that any local hidden variable theory must satisfy. Crucially, quantum mechanics predicts violations of these inequalities, making the debate experimentally testable.",
  },
  {
    year: 1972,
    title: "First Bell Test",
    description: "Freedman and Clauser conduct first experimental test.",
    category: "experiment",
    details:
      "At UC Berkeley, the first experimental test of Bell's inequality found violations matching quantum mechanics predictions, though skeptics pointed to potential loopholes.",
  },
  {
    year: 1982,
    title: "Aspect's Experiments",
    description: "Alain Aspect closes the locality loophole.",
    category: "experiment",
    details:
      "Using fast-switching polarizers that changed settings while photons were in flight, Aspect's team provided compelling evidence that no signal could coordinate measurement results.",
  },
  {
    year: 1997,
    title: "Long-Distance Entanglement",
    description: "Gisin's team demonstrates entanglement over 10 km.",
    category: "experiment",
    details:
      "The Geneva experiment showed entanglement works over practical distances using fiber optics, opening the door to quantum communication networks.",
  },
  {
    year: 2001,
    title: "First Quantum Computer",
    description: "IBM demonstrates 7-qubit quantum computer.",
    category: "technology",
    details:
      "Using nuclear magnetic resonance, IBM's quantum computer successfully ran Shor's algorithm to factor 15, demonstrating the potential of quantum computing.",
  },
  {
    year: 2015,
    title: "Loophole-Free Bell Tests",
    description: "Multiple groups close all major loopholes simultaneously.",
    category: "experiment",
    details:
      "Three independent experiments at Delft, NIST, and Vienna closed the locality, detection, and memory loopholes all at once, providing definitive proof of Bell inequality violation.",
  },
  {
    year: 2017,
    title: "Micius Satellite",
    description: "China demonstrates space-based quantum communication.",
    category: "technology",
    details:
      "The Micius satellite distributed entangled photons over 1,200 km and performed quantum key distribution between ground stations, demonstrating global-scale quantum networks are possible.",
  },
  {
    year: 2019,
    title: "Quantum Supremacy",
    description: "Google claims quantum computational advantage.",
    category: "technology",
    details:
      "Google's 53-qubit Sycamore processor performed a calculation in 200 seconds that they claimed would take the world's fastest supercomputer 10,000 years.",
  },
  {
    year: 2022,
    title: "Nobel Prize",
    description: "Aspect, Clauser, and Zeilinger win Physics Nobel.",
    category: "award",
    details:
      'The Nobel Prize recognized "experiments with entangled photons, establishing the violation of Bell inequalities and pioneering quantum information science."',
  },
];
export default Timeline;
