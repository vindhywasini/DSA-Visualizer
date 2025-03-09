// LISVisualizer.js
// This component visualizes the computation of the Longest Increasing Subsequence (LIS)
// using dynamic programming. The DP array is built step-by-step, and each update is animated.
// The current cell being updated is highlighted in orange while previously computed cells are green.
// Once the computation is complete, a "Computation Complete!" message is displayed.
// All styling is managed externally via LISVisualizer.css.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../CSS/LISVisualizer.css';

/**
 * buildLISSteps - Computes the DP array for the Longest Increasing Subsequence (LIS)
 * and records a snapshot after each update.
 *
 * @param {number[]} array - The input array.
 * @returns {Array} steps - An array of snapshot objects.
 * Each snapshot contains:
 *    - i: current index being updated (or null when complete),
 *    - dp: a copy of the DP array at that point,
 *    - description: a description of the current step.
 */
function buildLISSteps(array) {
  const n = array.length;
  const dp = Array(n).fill(1);
  const steps = [];
  
  // Record initial state: DP array initialized to 1's.
  steps.push({
    i: -1,
    dp: [...dp],
    description: "Initialize dp array to all 1's",
  });
  
  // Build DP table: for each index, update dp[i] based on previous values.
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (array[i] > array[j] && dp[i] < dp[j] + 1) {
        dp[i] = dp[j] + 1;
        steps.push({
          i,
          j,
          dp: [...dp],
          description: `Updated dp[${i}] = dp[${j}] + 1 (since ${array[i]} > ${array[j]})`,
        });
      }
    }
  }
  // Record final state with computed LIS length.
  steps.push({
    i: null,
    dp: [...dp],
    description: `Final dp array; LIS Length = ${Math.max(...dp)}`,
  });
  return steps;
}

/**
 * BoardDiagram Component
 * Renders the DP array as a horizontal row of boxes.
 * Each box displays the original array value (as a top label)
 * and the current DP value inside the box.
 * The current cell (dp[i]) being updated is highlighted in orange,
 * while other cells are shown in green.
 *
 * @param {Object} props - Contains:
 *    - array: The original input array.
 *    - dp: The current DP array snapshot.
 *    - currentIndex: The index being updated (if any).
 */
function BoardDiagram({ array, dp, currentIndex }) {
  const cellSize = 60;
  return (
    <svg width={array.length * cellSize + 20} height={120} className="lis-svg">
      {array.map((num, idx) => (
        <g key={`cell-${idx}`}>
          {/* Rectangle for the DP value */}
          <motion.rect
            x={idx * cellSize + 10}
            y={40}
            width={cellSize - 10}
            height={cellSize - 20}
            fill={idx === currentIndex ? "#FF8C00" : "#90EE90"}
            stroke="#fff"
            strokeWidth="2"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          />
          {/* Original array number label at the top */}
          <text
            x={idx * cellSize + cellSize / 2 + 10}
            y={25}
            textAnchor="middle"
            fontSize="16"
            fill="#fff"
          >
            {num}
          </text>
          {/* DP value displayed inside the rectangle */}
          <text
            x={idx * cellSize + cellSize / 2 + 10}
            y={70}
            textAnchor="middle"
            fontSize="16"
            fill="#000"
          >
            {dp[idx]}
          </text>
        </g>
      ))}
    </svg>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each snapshot of the DP computation for the LIS problem.
 * When the final step is reached, a "Computation Complete!" message is displayed.
 *
 * @param {Object} props - Contains:
 *    - steps: An array of snapshots from buildLISSteps.
 *    - speed: The visualization speed in milliseconds.
 *    - array: The original input array.
 */
function AlgorithmVisualizer({ steps, speed, array }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Reset step index when steps update.
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);
  
  // Automatically animate through each step.
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
  
  const currentStep = steps[currentStepIndex] || { dp: Array(array.length).fill(1), i: null };

  return (
    <div className="lis-visualizerContainer">
      <motion.h4
        className="lis-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex} – {currentStep.description}
      </motion.h4>
      <BoardDiagram array={array} dp={currentStep.dp} currentIndex={currentStep.i} />
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && (
          <motion.div
            className="lis-completeMessage"
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
    <div className="lis-editorContainer">
      <motion.h3
        className="lis-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="lis-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="lis-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * LCSVisualizer Component
 * Main component that renders the Longest Increasing Subsequence (LIS) visualizer.
 * Users can input an array (comma-separated). The DP array is built step-by-step,
 * and the current cell being updated is highlighted. Computation starts automatically on mount.
 * The user can also control visualization speed and toggle between theory and practice modes.
 */
export default function LISVisualizer() {
  const [inputArray, setInputArray] = useState("10,22,9,33,21,50,41,60");
  const [array, setArray] = useState([10, 22, 9, 33, 21, 50, 41, 60]);
  const [steps, setSteps] = useState([]);
  const [lisLength, setLisLength] = useState(null);
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  // Compute LIS steps automatically when inputArray changes.
  useEffect(() => {
    const arr = inputArray.split(',').map(num => parseInt(num.trim(), 10));
    setArray(arr);
    const computedSteps = buildLISSteps(arr);
    setSteps(computedSteps);
    // Final LIS length from last snapshot.
    const finalDP = computedSteps[computedSteps.length - 1].dp;
    setLisLength(Math.max(...finalDP));
  }, [inputArray]);

  const runLIS = () => {
    const arr = inputArray.split(',').map(num => parseInt(num.trim(), 10));
    setArray(arr);
    const computedSteps = buildLISSteps(arr);
    setSteps(computedSteps);
    const finalDP = computedSteps[computedSteps.length - 1].dp;
    setLisLength(Math.max(...finalDP));
  };

  const theoryContent = (
    <>
      <motion.h3
        className="lis-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="lis-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        The Longest Increasing Subsequence (LIS) problem is solved using dynamic programming.
        We initialize a DP array where each element starts with a value of 1 (each element is a subsequence of length 1).
        Then for each index i, we update dp[i] by checking all previous indices j.
        If array[i] > array[j], we update dp[i] to max(dp[i], dp[j] + 1).
        The final LIS length is the maximum value in the DP array.
      </motion.p>
      <motion.pre
        className="lis-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function buildLISSteps(array):
  n = length(array)
  dp = Array(n).fill(1)
  steps = []
  steps.push({ i: -1, dp: copy(dp), description: "Initialize dp array to all 1's" })
  for i from 1 to n-1:
    for j from 0 to i-1:
      if array[i] > array[j] and dp[i] < dp[j] + 1:
        dp[i] = dp[j] + 1
        steps.push({ i, dp: copy(dp), description: "Updated dp[i] = dp[j] + 1" })
  steps.push({ i: null, dp: copy(dp), description: "Final dp array; LIS Length = " + max(dp) })
  return steps`}
      </motion.pre>
      <motion.h3
        className="lis-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="lis-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(n²) time and O(n) space, where n is the number of elements.</li>
      </motion.ul>
    </>
  );

  return (
    <div className="lis-pageContainer">
      <motion.h2
        className="lis-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Longest Increasing Subsequence Visualizer
      </motion.h2>
      <div className="lis-inputContainer">
        <label className="lis-inputLabel">Enter Array (comma separated):</label>
        <br />
        <input
          type="text"
          value={inputArray}
          onChange={(e) => setInputArray(e.target.value)}
          className="lis-textInput"
        />
        <br />
        <motion.button
          className="lis-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runLIS}
        >
          Calculate LIS
        </motion.button>
      </div>
      <div className="lis-inputContainer">
        <label className="lis-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="lis-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="lis-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="lis-inputContainer">
        <motion.button
          className={`lis-toggleButton ${mode === "theory" ? "lis-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`lis-toggleButton ${mode === "practice" ? "lis-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
        >
          Practice
        </motion.button>
      </div>
      <AnimatePresence>
        {steps.length > 0 && <AlgorithmVisualizer steps={steps} speed={speed} array={array} />}
      </AnimatePresence>
      {mode === "theory" ? (
        <div className="lis-theoryContainer">
          {theoryContent}
        </div>
      ) : (
        <MyCompilerEditor />
      )}
      {/* Hide scrollbars if any container overflows */}
      <style>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}





