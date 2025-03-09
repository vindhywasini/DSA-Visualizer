
// QuickSortDetail.js
// This component visualizes the Quick Sort algorithm using a divide-and-conquer approach.
// It provides controls for custom input, random array generation, speed control,
// and mode toggling between theory and practice.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS for styling.
import '../CSS/quicksort.css';

/**
 * quickSortCollect - Recursively sorts the array using Quick Sort and records each snapshot.
 *
 * @param {number[]} arr - Array to sort.
 * @param {number} low - Starting index.
 * @param {number} high - Ending index.
 * @param {number[][]} steps - Array to collect each snapshot of the array.
 */
function quickSortCollect(arr, low, high, steps) {
  if (low < high) {
    const pivotIndex = partitionCollect(arr, low, high, steps);
    quickSortCollect(arr, low, pivotIndex - 1, steps);
    quickSortCollect(arr, pivotIndex + 1, high, steps);
  }
}

/**
 * partitionCollect - Partitions the array around a pivot and records snapshots.
 *
 * @param {number[]} arr - Array to partition.
 * @param {number} low - Starting index.
 * @param {number} high - Ending index.
 * @param {number[][]} steps - Array to collect snapshots.
 * @returns {number} - The final pivot index.
 */
function partitionCollect(arr, low, high, steps) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      // Swap and record the snapshot after each swap.
      [arr[i], arr[j]] = [arr[j], arr[i]];
      steps.push([...arr]);
    }
  }
  // Swap pivot into its final place and record the snapshot.
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  steps.push([...arr]);
  return i + 1;
}

/**
 * quickSortSteps - Initializes the sorting process and collects all snapshots.
 *
 * @param {number[]} arr - Array to sort.
 * @returns {number[][]} - Array of snapshots (steps) showing the array state.
 */
function quickSortSteps(arr) {
  const steps = [];
  const array = [...arr];
  // Record the initial state.
  steps.push([...array]);
  quickSortCollect(array, 0, array.length - 1, steps);
  return steps;
}

/**
 * QuickSortDetail Component
 * Renders the UI for visualizing Quick Sort, including input controls,
 * speed control, mode toggling, and theory content.
 */
function QuickSortDetail() {
  // States for controlling speed, array input, mode, and algorithm snapshots.
  const [speed, setSpeed] = useState(300);
  const [arrayInput, setArrayInput] = useState("30,10,20,40,50");
  const [mode, setMode] = useState("theory");
  const [steps, setSteps] = useState(quickSortSteps([30, 10, 20, 40, 50]));

  /**
   * updateArray - Parses user input and updates the quick sort snapshots.
   */
  const updateArray = () => {
    const arr = arrayInput.split(",").map(num => parseInt(num.trim(), 10));
    if (arr.some(isNaN)) {
      alert("Invalid input. Please enter numbers separated by commas.");
      return;
    }
    setSteps(quickSortSteps(arr));
  };

  /**
   * generateRandomArrayInput - Generates a random array, updates the input field,
   * and recalculates the quick sort snapshots.
   *
   * @param {number} size - Number of elements (default is 5).
   */
  const generateRandomArrayInput = (size = 5) => {
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setArrayInput(arr.join(","));
    setSteps(quickSortSteps(arr));
  };

  // Example steps to display in the theory section.
  const exampleSteps = `
Step 0: 30,10,20,40,50
...
Final Step: 10,20,30,40,50
  `.trim();

  return (
    <div className="pageContainer">
      {/* Header */}
      <h2 className="pageHeader">Quick Sort Visualization</h2>

      {/* Input Section: Array Input & Random Array Generator */}
      <div className="inputSection">
        <label className="label">Input Array (comma separated):</label>
        <input
          type="text"
          value={arrayInput}
          onChange={e => setArrayInput(e.target.value)}
          className="input"
        />
        <div className="buttonGroup">
          <button onClick={updateArray} className="button">Update Array</button>
          <button onClick={() => generateRandomArrayInput()} className="button buttonMarginLeft">
            Random Array
          </button>
        </div>
      </div>

      {/* Input Section: Visualization Speed Control */}
      <div className="inputSection">
        <label className="label">Visualization Speed: {speed}ms</label>
        <div className="sliderContainer">
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="slider"
          />
          <select
            onChange={e => setSpeed(Number(e.target.value))}
            className="dropdown"
            defaultValue={300}
          >
            <option value={600}>Slow</option>
            <option value={300}>Medium</option>
            <option value={100}>Fast</option>
          </select>
        </div>
      </div>

      {/* Input Section: Mode Toggle */}
      <div className="inputSection">
        <button
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
          className={`toggleButton ${mode === "theory" ? "activeToggle" : ""}`}
        >
          Theory Mode
        </button>
        <button
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
          className={`toggleButton ${mode === "practice" ? "activeToggle" : ""} buttonMarginLeft`}
        >
          Practice Mode
        </button>
      </div>

      {/* Visualization Component */}
      <AnimatePresence>
        {steps.length > 0 && <AlgorithmVisualizer steps={steps} speed={speed} />}
      </AnimatePresence>

      {/* Theory Content */}
      {mode === "theory" ? (
        <div className="theoryContainer">
          <h3 className="sectionHeader">Algorithm Theory & Pseudocode</h3>
          <p className="paragraph">
            Quick Sort is a divide-and-conquer algorithm that partitions the array around a pivot element.
            It recursively sorts the subarrays and combines them to produce the final sorted array.
            Its best and average-case time complexity is O(n log n), while the worst case is O(n²).
          </p>
          <pre className="codeBlock">
{`function quickSort(array) {
  if (array.length <= 1) return array;
  const pivot = array[array.length - 1];
  let left = [], right = [];
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] < pivot) left.push(array[i]);
    else right.push(array[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}`}
          </pre>
          <h3 className="sectionHeader">Example: Quick Sort Steps</h3>
          <pre className="codeBlockAlt">{exampleSteps}</pre>
          <h3 className="sectionHeader">Time Complexity</h3>
          <ul className="list">
            <li>Best/Average Case: O(n log n)</li>
            <li>Worst Case: O(n²)</li>
          </ul>
        </div>
      ) : (
        // Render the Practice Mode editor.
        <MyCompilerEditor />
      )}
    </div>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each recorded snapshot (step) of the Quick Sort process.
 *
 * @param {Object} props
 * @param {number[][]} props.steps - Array of snapshots representing the array state.
 * @param {number} props.speed - Animation speed in milliseconds.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reset the step counter when steps change.
  useEffect(() => {
    setCurrentStep(0);
  }, [steps]);

  // Animate through the steps using setInterval.
  useEffect(() => {
    if (paused || steps.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [paused, speed, steps]);

  const currentArray = steps[currentStep] || [];
  return (
    <div className="visualizerContainer">
      {/* Display the current step number */}
      <motion.h4
        className="stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStep}
      </motion.h4>
      {/* Render the array as a series of bars */}
      <div className="arrayContainer">
        {currentArray.map((value, idx) => (
          <motion.div
            key={idx}
            className="arrayBar"
            style={{ height: `${value * 3}px` }}
            animate={{ height: `${value * 3}px` }}
            transition={{ duration: speed / 1000 }}
          />
        ))}
      </div>
      {/* Pause/Resume button */}
      <div className="centerText marginTop10">
        <button onClick={() => setPaused(!paused)} className="toggleButton">
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      {/* Completion message when sorting is done */}
      <AnimatePresence>
        {currentStep === steps.length - 1 && (
          <motion.div
            className="completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Array Sorted!
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
    <div className="editorContainer">
      <h3 style={{ marginBottom: "10px" }}>MyCompiler Editor (Practice Mode)</h3>
      <iframe
        src="https://www.onlinegdb.com/"
        title="MyCompiler Editor"
        style={{
          width: '100%',
          height: '500px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
    </div>
  );
}

export default QuickSortDetail;
