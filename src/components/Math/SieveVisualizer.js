// SieveVisualizer.js
// This component visualizes the Sieve of Eratosthenes algorithm.
// It computes prime numbers up to a given limit and records each significant step.
// The UI includes controls for setting the limit, adjusting speed, and toggling between theory and practice modes.
// Computation starts automatically on component mount.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS for styling.
import '../CSS/sievevisualizer.css';

/**
 * buildSieveSteps - Runs the Sieve of Eratosthenes up to the given limit,
 * recording a snapshot at each significant step.
 *
 * Each step object contains:
 *   - current: the prime currently being processed (or null),
 *   - status: an array of objects { num, isPrime } for numbers 2..limit,
 *   - description: a string describing the current step.
 *
 * @param {number} limit - The upper limit for the sieve.
 * @returns {Object[]} steps - Array of snapshot steps.
 */
function buildSieveSteps(limit) {
  const status = [];
  // Initialize status array for numbers 2 to limit.
  for (let i = 2; i <= limit; i++) {
    status.push({ num: i, isPrime: true });
  }
  const steps = [];
  steps.push({
    current: null,
    status: JSON.parse(JSON.stringify(status)),
    description: `Start with all numbers (2 to ${limit}) marked as prime.`
  });
  
  // Process each candidate prime.
  for (let p = 2; p * p <= limit; p++) {
    steps.push({
      current: p,
      status: JSON.parse(JSON.stringify(status)),
      description: `Processing candidate ${p}.`
    });
    if (status[p - 2].isPrime) {
      // Mark multiples of p as composite.
      for (let multiple = p * p; multiple <= limit; multiple += p) {
        const idx = multiple - 2;
        if (status[idx].isPrime) {
          status[idx].isPrime = false;
          steps.push({
            current: p,
            status: JSON.parse(JSON.stringify(status)),
            description: `Marking ${multiple} as composite (multiple of ${p}).`
          });
        }
      }
    }
  }
  steps.push({
    current: null,
    status: JSON.parse(JSON.stringify(status)),
    description: `Sieve complete. Remaining true values are primes up to ${limit}.`
  });
  return steps;
}

/**
 * SieveDiagram Component
 * Renders the list of numbers in a grid using an SVG.
 * Each number is shown in a rectangle with its color indicating whether it is prime.
 *
 * @param {Object} props - Contains the "status" array.
 */
function SieveDiagram({ status }) {
  // Grid settings.
  const boxSize = 60;
  const spacing = 5;
  const columns = 10;
  const total = status.length;
  const rows = Math.ceil(total / columns);
  
  // Calculate SVG dimensions.
  const width = columns * (boxSize + spacing) + spacing;
  const height = rows * (boxSize + spacing) + spacing;
  
  // Use viewBox for responsive scaling.
  const viewBox = `0 0 ${width} ${height}`;
  
  return (
    <svg width="100%" height={height} viewBox={viewBox} className="sieve-svg">
      {status.map((item, idx) => {
        const col = idx % columns;
        const row = Math.floor(idx / columns);
        const x = spacing + col * (boxSize + spacing);
        const y = spacing + row * (boxSize + spacing);
        return (
          <motion.g
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.03 }}
          >
            <rect
              x={x}
              y={y}
              width={boxSize}
              height={boxSize}
              fill={item.isPrime ? "#90EE90" : "#FF8C00"}
              stroke="#fff"
              strokeWidth="2"
            />
            <text
              x={x + boxSize / 2}
              y={y + boxSize / 2 + 6}
              textAnchor="middle"
              fontSize="16"
              fill="#fff"
            >
              {item.num}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each snapshot of the sieve algorithm.
 * Includes a Pause/Resume button and displays a completion message when done.
 *
 * @param {Object} props - Contains steps and speed.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reset the step index when new steps are provided.
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);

  // Animate through steps when not paused.
  useEffect(() => {
    if (paused || steps.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [paused, speed, steps]);

  const currentStep = steps[currentStepIndex] || { status: [] };

  return (
    <div className="sieve-visualizerContainer">
      <motion.h4
        className="sieve-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex} – {currentStep.description}
      </motion.h4>
      <SieveDiagram status={currentStep.status} />
      <div className="sieve-centerText sieve-marginTop10">
        <button onClick={() => setPaused(!paused)} className="sieve-toggleButton">
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && steps.length > 0 && (
          <motion.div
            className="sieve-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Sieve Complete!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * MyCompilerEditor Component
 * Dummy component for Practice Mode that embeds an online code editor.
 */
function MyCompilerEditor() {
  return (
    <div className="sieve-editorContainer">
      <motion.h3
        className="sieve-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="sieve-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="sieve-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * SieveVisualizer Component
 * Main component that renders the Sieve visualizer, input controls, speed control,
 * mode toggling, and theory/practice content.
 * Computation starts automatically when the component mounts.
 */
export default function SieveVisualizer() {
  // Default limit is now set to 30.
  const [limit, setLimit] = useState(30);
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState("");

  /**
   * runSieve - Validates input and computes the sieve steps.
   */
  const runSieve = () => {
    if (isNaN(limit) || limit < 2) {
      alert("Please enter a valid limit (>=2).");
      return;
    }
    const computedSteps = buildSieveSteps(limit);
    setSteps(computedSteps);
    setMessage("");
  };

  // Automatically run the sieve computation on mount.
  useEffect(() => {
    runSieve();
  }, []);

  // Content for theory mode.
  const theoryContent = (
    <>
      <motion.h3
        className="sieve-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="sieve-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        The Sieve of Eratosthenes is an efficient algorithm for finding all primes up to a given limit.
        It starts with a list of numbers from 2 to the limit, then iteratively marks the multiples of each prime.
      </motion.p>
      <motion.pre
        className="sieve-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function sieve(limit):
  let status = array of true for numbers 2 to limit
  for p = 2 to sqrt(limit):
    if status[p]:
      mark all multiples of p as false
  return all numbers with status true`}
      </motion.pre>
      <motion.h3
        className="sieve-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="sieve-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(n log log n) in the average case.</li>
      </motion.ul>
    </>
  );

  return (
    <div className="sieve-pageContainer">
      <motion.h2
        className="sieve-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Sieve of Eratosthenes Visualizer
      </motion.h2>
      <div className="sieve-inputContainer">
        <label className="sieve-inputLabel">Enter limit (>=2):</label>
        <br />
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value) || 2)}
          className="sieve-textInput"
        />
        <br />
        <motion.button
          className="sieve-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runSieve}
        >
          Compute Sieve
        </motion.button>
      </div>
      <div className="sieve-inputContainer">
        <label className="sieve-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="sieve-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="sieve-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="sieve-inputContainer">
        <motion.button
          className={`sieve-toggleButton ${mode === "theory" ? "sieve-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`sieve-toggleButton ${mode === "practice" ? "sieve-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
        >
          Practice
        </motion.button>
      </div>
      {/* Always render visualization box */}
      <AlgorithmVisualizer steps={steps} speed={speed} />
      {mode === "theory" ? (
        <div className="sieve-theoryContainer">
          {theoryContent}
        </div>
      ) : (
        <MyCompilerEditor />
      )}
    </div>
  );
}





