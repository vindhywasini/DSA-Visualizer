// FibonacciVisualizer.js
// This component visualizes the iterative computation of Fibonacci numbers using a bottom-up approach.
// Each computed Fibonacci number is displayed in a box. The box corresponding to the current index is highlighted in orange,
// while previously computed values are shown in green. Once the final value is computed, a "Computation Complete!" message is displayed.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS for styling.
import '../CSS/FibonacciVisualizer.css';

/**
 * buildFibSteps - Computes Fibonacci numbers up to index n.
 * Records each step with a snapshot of the computed Fibonacci array.
 *
 * @param {number} n - The Fibonacci index to compute up to.
 * @returns {Array} steps - Array of step objects.
 */
function buildFibSteps(n) {
  const steps = [];
  const fibArr = [];
  // Handle base case for index 0.
  if (n >= 0) {
    fibArr.push(0);
    steps.push({ step: 0, fib: [...fibArr], current: 0 });
  }
  // Handle base case for index 1.
  if (n >= 1) {
    fibArr.push(1);
    steps.push({ step: 1, fib: [...fibArr], current: 1 });
  }
  // Compute subsequent Fibonacci numbers.
  for (let i = 2; i <= n; i++) {
    const nextVal = fibArr[i - 1] + fibArr[i - 2];
    fibArr.push(nextVal);
    steps.push({ step: i, fib: [...fibArr], current: i });
  }
  return steps;
}

/**
 * BoardDiagram Component
 * Renders the Fibonacci numbers as a horizontal row of boxes.
 * The box corresponding to the current step (current index) is highlighted in orange,
 * while all other boxes are displayed in green.
 *
 * @param {Object} props - Contains:
 *   - fib: The array of computed Fibonacci numbers.
 *   - current: The index of the Fibonacci number being computed in the current step.
 */
function BoardDiagram({ fib, current }) {
  return (
    <svg width="600" height="80" className="fibo-svg">
      {fib.map((val, idx) => (
        <motion.rect
          key={idx}
          x={idx * 60 + 10}
          y={10}
          width={50}
          height={50}
          // Highlight current index in orange, others in green.
          fill={idx === current ? "#FF8C00" : "#90EE90"}
          stroke="#fff"
          strokeWidth="2"
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
        />
      ))}
      {fib.map((val, idx) => (
        <text
          key={`label-${idx}`}
          x={idx * 60 + 35}
          y={40}
          textAnchor="middle"
          fontSize="16"
          fill="#fff"
        >
          {val}
        </text>
      ))}
    </svg>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each Fibonacci computation step.
 * Displays a completion message when the final Fibonacci number has been computed.
 *
 * @param {Object} props - Contains:
 *   - steps: Array of step objects with Fibonacci array snapshots.
 *   - speed: Visualization speed in milliseconds.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset step index when steps change.
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);

  // Automatically animate through the steps.
  useEffect(() => {
    if (steps.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [steps, speed]);

  const currentStep = steps[currentStepIndex] || { fib: [], current: 0 };

  return (
    <div className="fibo-visualizerContainer">
      <motion.h4
        className="fibo-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex}: Computing Fibonacci({currentStep.step})
      </motion.h4>
      <BoardDiagram fib={currentStep.fib} current={currentStep.current} />
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && (
          <motion.div
            className="fibo-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Computation Complete!
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
    <div className="fibo-editorContainer">
      <motion.h3
        className="fibo-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="fibo-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="fibo-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * FibonacciVisualizer Component
 * Main component that renders the Fibonacci Visualizer.
 * Users can input the Fibonacci index (n) to compute up to.
 * The computation is done iteratively, and each step is animated.
 * A completion message is shown when the final step is reached.
 *
 * Computation starts automatically on mount.
 */
export default function FibonacciVisualizer() {
  const [n, setN] = useState(6); // Default Fibonacci index.
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  // Compute Fibonacci steps automatically on mount.
  useEffect(() => {
    const computedSteps = buildFibSteps(n);
    setSteps(computedSteps);
  }, [n]);

  const runFib = () => {
    const computedSteps = buildFibSteps(n);
    setSteps(computedSteps);
  };

  const theoryContent = (
    <>
      <motion.h3
        className="fibo-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="fibo-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Fibonacci numbers are computed using a dynamic programming approach.
        Starting with fib(0) = 0 and fib(1) = 1, each subsequent Fibonacci number is computed as:
        fib(i) = fib(i-1) + fib(i-2).
      </motion.p>
      <motion.pre
        className="fibo-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function buildFibSteps(n):
  steps = []
  if n >= 0:
    steps.push({ step: 0, fib: [0], current: 0 })
  if n >= 1:
    steps.push({ step: 1, fib: [0, 1], current: 1 })
  for i from 2 to n:
    fib[i] = fib[i-1] + fib[i-2]
    steps.push({ step: i, fib: currentFibArray, current: i })
  return steps`}
      </motion.pre>
      <motion.h3
        className="fibo-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="fibo-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(n) time, O(n) space</li>
      </motion.ul>
    </>
  );

  return (
    <div className="fibo-pageContainer">
      <motion.h2
        className="fibo-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Fibonacci Visualizer
      </motion.h2>
      <div className="fibo-inputContainer">
        <label className="fibo-inputLabel">Enter n (Fibonacci index):</label>
        <br />
        <input
          type="number"
          value={n}
          onChange={(e) => setN(parseInt(e.target.value) || 0)}
          className="fibo-textInput"
          min="0"
        />
        <br />
        <motion.button
          className="fibo-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runFib}
        >
          Calculate Fibonacci
        </motion.button>
      </div>
      <div className="fibo-inputContainer">
        <label className="fibo-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="fibo-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="fibo-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="fibo-inputContainer">
        <motion.button
          className={`fibo-toggleButton ${mode === "theory" ? "fibo-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`fibo-toggleButton ${mode === "practice" ? "fibo-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
        >
          Practice
        </motion.button>
      </div>
      <AnimatePresence>
        {steps.length > 0 && <AlgorithmVisualizer steps={steps} speed={speed} />}
      </AnimatePresence>
      {mode === "theory" ? (
        <div className="fibo-theoryContainer">
          {theoryContent}
        </div>
      ) : (
        <MyCompilerEditor />
      )}
      <style>{`
        @media (max-width: 768px) {
          svg {
            width: 100% !important;
            height: auto !important;
          }
          input[type="number"], textarea {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}




