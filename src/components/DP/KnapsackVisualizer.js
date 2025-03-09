// KnapsackVisualizer.js
// This component visualizes the dynamic programming solution for the Knapsack problem.
// It builds a DP table step-by-step using an iterative bottom-up approach.
// The current cell being computed is highlighted in orange, while other cells are shown in green.
// White borders are used for all cells to ensure high contrast on a dark background.
// The computation starts automatically on mount.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import the external CSS file for styling.
import '../CSS/KnapsackVisualizer.css';

// Pre-defined items for the knapsack (each with a weight and a value).
const defaultItems = [
  { weight: 10, value: 60 },
  { weight: 20, value: 100 },
  { weight: 30, value: 120 },
];

/**
 * buildKnapsackSteps - Builds the DP table for the Knapsack problem iteratively.
 * It creates a table dp[i][w] for 0 ≤ i ≤ number of items and 0 ≤ w ≤ capacity,
 * and records a snapshot after computing each cell.
 *
 * @param {number} capacity - Maximum weight capacity of the knapsack.
 * @param {Array} items - Array of items, each with weight and value.
 * @returns {Array} steps - Array of snapshot objects.
 */
function buildKnapsackSteps(capacity, items) {
  const n = items.length;
  const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
  const steps = [];
  
  // Record initial state: DP table initialized to zeros.
  steps.push({
    i: 0,
    w: 0,
    dp: dp.map(row => [...row]),
    description: "Initial DP table (all zeros)."
  });
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (items[i - 1].weight > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - items[i - 1].weight] + items[i - 1].value
        );
      }
      // Record a snapshot after updating dp[i][w]
      steps.push({
        i,
        w,
        dp: dp.map(row => [...row]),
        description: `Computed dp[${i}][${w}].`
      });
    }
  }
  return steps;
}

/**
 * BoardDiagram Component
 * Renders the DP table as an SVG grid.
 * Each cell is a rectangle with a white border. The current cell (dp[i][w]) is highlighted in orange,
 * while other cells are rendered in green.
 *
 * @param {Object} props - Contains:
 *   - dp: 2D DP table array.
 *   - currentCell: An object { i, w } indicating the currently computed cell.
 */
function BoardDiagram({ dp, currentCell }) {
  const rows = dp.length;
  const cols = dp[0].length;
  const cellSize = 40;
  return (
    <svg
      width={cols * cellSize + 20}
      height={rows * cellSize + 20}
      className="knapsack-svg"
    >
      {dp.map((row, i) =>
        row.map((val, j) => {
          const isCurrent = currentCell && currentCell.i === i && currentCell.w === j;
          return (
            <motion.rect
              key={`cell-${i}-${j}`}
              x={j * cellSize + 10}
              y={i * cellSize + 10}
              width={cellSize}
              height={cellSize}
              fill={isCurrent ? "#FF8C00" : "#90EE90"}
              stroke="#fff"
              strokeWidth="2"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: (i * cols + j) * 0.02 }}
            />
          );
        })
      )}
      {dp.map((row, i) =>
        row.map((val, j) => (
          <text
            key={`label-${i}-${j}`}
            x={j * cellSize + cellSize / 2 + 10}
            y={i * cellSize + cellSize / 1.5 + 10}
            textAnchor="middle"
            fontSize="14"
            fill="#fff"
          >
            {val}
          </text>
        ))
      )}
    </svg>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each DP table snapshot for the Knapsack problem.
 * Once all steps are complete, a "Computation Complete!" message is displayed.
 *
 * @param {Object} props - Contains:
 *   - steps: Array of DP table snapshots.
 *   - speed: Visualization speed in milliseconds.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset step index when steps update.
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);

  // Automatically animate through the steps.
  useEffect(() => {
    if (steps.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [steps, speed]);

  const currentStep = steps[currentStepIndex] || { dp: [[]], i: null, w: null };

  return (
    <div className="knapsack-visualizerContainer">
      <motion.h4
        className="knapsack-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex} – {currentStep.description}
      </motion.h4>
      <BoardDiagram dp={currentStep.dp} currentCell={{ i: currentStep.i, w: currentStep.w }} />
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && (
          <motion.div
            className="knapsack-completeMessage"
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
    <div className="knapsack-editorContainer">
      <motion.h3
        className="knapsack-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="knapsack-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="knapsack-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * KnapsackVisualizer Component
 * Main component that renders the Knapsack Problem Visualizer.
 * It uses dynamic programming to build a DP table and animates through each computed step.
 * Users can control the capacity, speed, and mode (theory vs. practice).
 * Computation starts automatically on mount.
 */
export default function KnapsackVisualizer() {
  const [capacity, setCapacity] = useState(50);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  // Compute the DP table steps automatically on mount and whenever capacity changes.
  useEffect(() => {
    const computedSteps = buildKnapsackSteps(capacity, defaultItems);
    setSteps(computedSteps);
  }, [capacity]);

  const runKnapsack = () => {
    const computedSteps = buildKnapsackSteps(capacity, defaultItems);
    setSteps(computedSteps);
  };

  const theoryContent = (
    <>
      <motion.h3
        className="knapsack-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="knapsack-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        The Knapsack problem is solved using dynamic programming.
        We build a DP table where dp[i][w] represents the maximum value achievable with the first i items and capacity w.
        The recurrence used is:
        <br /><br />
        dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i]] + value[i]) (if the item can be included).
      </motion.p>
      <motion.pre
        className="knapsack-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function buildKnapsackSteps(capacity, items):
  dp = 2D array of size (n+1) x (capacity+1) initialized to 0
  for i = 1 to n:
    for w = 0 to capacity:
      if items[i-1].weight > w:
        dp[i][w] = dp[i-1][w]
      else:
        dp[i][w] = max(dp[i-1][w], dp[i-1][w - items[i-1].weight] + items[i-1].value)
      record snapshot of dp table in steps
  return steps`}
      </motion.pre>
      <motion.h3
        className="knapsack-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="knapsack-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(n * capacity) time and space</li>
      </motion.ul>
    </>
  );

  return (
    <div className="knapsack-pageContainer">
      <motion.h2
        className="knapsack-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Knapsack Problem Visualizer
      </motion.h2>
      <div className="knapsack-inputContainer">
        <label className="knapsack-inputLabel">Capacity:</label>
        <br />
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
          className="knapsack-textInput"
          min="0"
        />
        <br />
        <motion.button
          className="knapsack-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runKnapsack}
        >
          Solve Knapsack
        </motion.button>
      </div>
      <div className="knapsack-inputContainer">
        <label className="knapsack-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="knapsack-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="knapsack-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="knapsack-inputContainer">
        <motion.button
          className={`knapsack-toggleButton ${mode === "theory" ? "knapsack-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`knapsack-toggleButton ${mode === "practice" ? "knapsack-activeToggle" : ""}`}
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
        <div className="knapsack-theoryContainer">
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




