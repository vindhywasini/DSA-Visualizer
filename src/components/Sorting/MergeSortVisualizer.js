// MergeSortDetail.js
// This component visualizes the Merge Sort algorithm.
// It provides controls for custom input, random array generation,
// speed control, and mode toggling between theory and practice.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS file for styling.
import '../CSS/mergesort.css';

/**
 * mergeSortSteps - Performs merge sort on the given array while recording each snapshot.
 *
 * @param {number[]} arr - Array of numbers to sort.
 * @returns {number[][]} steps - An array of snapshots showing the state of the array at each merge operation.
 */
function mergeSortSteps(arr) {
  let steps = [];
  // Clone the input array and record its initial state.
  let array = [...arr];
  steps.push([...array]);

  /**
   * merge - Merges two sorted subarrays (left and right) and records snapshots after each change.
   *
   * @param {number[]} arr - The array being sorted.
   * @param {number} l - Left index of the subarray.
   * @param {number} m - Middle index.
   * @param {number} r - Right index of the subarray.
   */
  function merge(arr, l, m, r) {
    let left = arr.slice(l, m + 1);
    let right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    // Merge the two arrays while recording changes.
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
      steps.push([...arr]);
    }
    // Copy any remaining elements from left array.
    while (i < left.length) {
      arr[k++] = left[i++];
      steps.push([...arr]);
    }
    // Copy any remaining elements from right array.
    while (j < right.length) {
      arr[k++] = right[j++];
      steps.push([...arr]);
    }
  }

  /**
   * mergeSort - Recursively sorts the array and uses the merge function to combine sorted subarrays.
   *
   * @param {number[]} arr - The array being sorted.
   * @param {number} l - Left index.
   * @param {number} r - Right index.
   */
  function mergeSort(arr, l, r) {
    if (l < r) {
      let m = Math.floor((l + r) / 2);
      mergeSort(arr, l, m);
      mergeSort(arr, m + 1, r);
      merge(arr, l, m, r);
    }
  }

  mergeSort(array, 0, array.length - 1);
  return steps;
}

/**
 * MergeSortDetail Component
 * Renders the Merge Sort visualization interface, including input controls,
 * speed control, mode toggling, and theory content.
 */
function MergeSortDetail() {
  // State for visualization speed (in ms), array input, mode, and recorded steps.
  const [speed, setSpeed] = useState(300);
  const [arrayInput, setArrayInput] = useState("30,10,20,40,50");
  const [mode, setMode] = useState("theory");
  const [steps, setSteps] = useState(mergeSortSteps([30, 10, 20, 40, 50]));

  /**
   * updateArray - Parses the user input and updates the visualization steps.
   */
  const updateArray = () => {
    const arr = arrayInput.split(",").map(num => parseInt(num.trim(), 10));
    if (arr.some(isNaN)) {
      alert("Invalid input. Please enter numbers separated by commas.");
      return;
    }
    setSteps(mergeSortSteps(arr));
  };

  /**
   * generateRandomArray - Generates a random array, updates the input field,
   * and calculates the merge sort snapshots.
   *
   * @param {number} size - Number of elements in the random array (default is 5).
   */
  const generateRandomArray = (size = 5) => {
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setArrayInput(arr.join(","));
    setSteps(mergeSortSteps(arr));
  };

  // Example steps text for display in the theory section.
  const exampleSteps = `
Step 0: 30,10,20,40,50
...
Final Step: 10,20,30,40,50
  `.trim();

  return (
    <div className="pageContainer">
      {/* Header */}
      <h2 className="pageHeader">Merge Sort Visualization</h2>

      {/* Array Input & Random Array Generator */}
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
          <button onClick={() => generateRandomArray()} className="button buttonMarginLeft">
            Random Array
          </button>
        </div>
      </div>

      {/* Speed Control */}
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

      {/* Mode Toggle */}
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
            Merge Sort divides the array into halves, recursively sorts each half,
            and then merges the sorted halves to produce the final sorted array.
            It is a stable sorting algorithm with a time complexity of O(n log n).
          </p>
          <pre className="codeBlock">
{`function mergeSort(array) {
  if (array.length <= 1) return array;
  const mid = Math.floor(array.length / 2);
  const left = mergeSort(array.slice(0, mid));
  const right = mergeSort(array.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  while (left.length && right.length) {
    if (left[0] <= right[0]) result.push(left.shift());
    else result.push(right.shift());
  }
  return result.concat(left, right);
}`}
          </pre>
          <h3 className="sectionHeader">Example: Merge Sort Steps</h3>
          <pre className="codeBlockAlt">{exampleSteps}</pre>
          <h3 className="sectionHeader">Time Complexity</h3>
          <ul className="list">
            <li>Best Case: O(n log n)</li>
            <li>Average Case: O(n log n)</li>
            <li>Worst Case: O(n log n)</li>
          </ul>
        </div>
      ) : (
        // Render Practice Mode embedded editor.
        <MyCompilerEditor />
      )}
    </div>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through the snapshots of the Merge Sort process using Framer Motion.
 *
 * @param {Object} props
 * @param {number[][]} props.steps - Array of snapshots showing each step.
 * @param {number} props.speed - Visualization speed (milliseconds).
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reset step counter when new steps are provided.
  useEffect(() => {
    setCurrentStep(0);
  }, [steps]);

  // Animate through the steps unless paused.
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
      {/* Display current step number */}
      <motion.h4
        className="stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStep}
      </motion.h4>
      {/* Render array bars */}
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
      {/* Pause/Resume Button */}
      <div className="centerText marginTop10">
        <button onClick={() => setPaused(!paused)} className="toggleButton">
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      {/* Completion Message */}
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

export default MergeSortDetail;
