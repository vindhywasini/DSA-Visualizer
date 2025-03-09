// BinarySearchDetail.js
// This component visualizes the Binary Search algorithm on a sorted array.
// It provides controls for custom array and target input, random array generation,
// speed control, and mode toggling between theory and practice.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import the external CSS file for styling.
import '../CSS/binarysearch.css';

/**
 * binarySearchSteps - Simulates the binary search algorithm and collects each iteration's state.
 *
 * @param {number[]} array - The sorted array on which to perform the search.
 * @param {number} target - The value to search for.
 * @returns {Object[]} steps - An array of snapshots for each iteration.
 *   Each snapshot contains the current low, high, mid indices, the array, and optionally a message.
 */
function binarySearchSteps(array, target) {
  const steps = [];
  let low = 0, high = array.length - 1;
  
  // Continue until the search space is exhausted.
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const state = { low, high, mid, array: [...array] };
    steps.push(state);
    
    if (array[mid] === target) {
      // Mark when the target is found.
      state.found = true;
      state.message = `Found target ${target} at index ${mid}`;
      return steps;
    } else if (array[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  // Record final state when target is not found.
  steps.push({ low, high, mid: null, array: [...array], message: `Target ${target} not found.` });
  return steps;
}

/**
 * BinarySearchDetail Component
 * Renders the UI for visualizing binary search including inputs for array and target,
 * speed control, visualization, and mode toggling (theory vs. practice).
 */
function BinarySearchDetail() {
  // State for the sorted array input as a comma-separated string.
  const [arrayInput, setArrayInput] = useState("0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95");
  // State for the target value to search.
  const [targetInput, setTargetInput] = useState("35");
  // Visualization speed in milliseconds.
  const [speed, setSpeed] = useState(500);
  // Mode state: "theory" shows explanation and pseudocode; "practice" shows an embedded editor.
  const [mode, setMode] = useState("theory");
  // Steps state: each step is a snapshot of the binary search process.
  const [steps, setSteps] = useState(() => {
    const arr = arrayInput.split(",").map(num => parseInt(num.trim(), 10));
    const target = parseInt(targetInput.trim(), 10);
    return binarySearchSteps(arr, target);
  });

  /**
   * updateSearch - Parses the custom input and updates the binary search snapshots.
   */
  const updateSearch = () => {
    const arr = arrayInput.split(",").map(num => parseInt(num.trim(), 10));
    const target = parseInt(targetInput.trim(), 10);
    if (arr.some(isNaN) || isNaN(target)) {
      alert("Invalid input. Ensure the array and target contain valid numbers.");
      return;
    }
    setSteps(binarySearchSteps(arr, target));
  };

  /**
   * generateRandomArray - Generates a random sorted array with 20 elements and updates the input.
   */
  const generateRandomArray = () => {
    const arr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 101));
    arr.sort((a, b) => a - b);
    setArrayInput(arr.join(","));
    updateSearch();
  };

  // Example steps text for illustration in theory mode.
  const exampleSteps = `
Step 0: low=0, high=19, mid=9, array=[...]
Step 1: low=0, high=8, mid=4, array=[...]
Step 2: low=5, high=8, mid=6, array=[...]
Step 3: Found target at index 7
  `.trim();

  return (
    <div className="binary-pageContainer">
      {/* Header */}
      <h2 className="binary-pageHeader">Binary Search Visualization</h2>

      {/* Array Input & Random Array Generation */}
      <div className="binary-inputSection">
        <label className="binary-label">Sorted Array (comma separated):</label>
        <input
          type="text"
          value={arrayInput}
          onChange={e => setArrayInput(e.target.value)}
          className="binary-input"
        />
        <button onClick={generateRandomArray} className="binary-button">
          Random Sorted Array
        </button>
      </div>
      {/* Target Input & Update Button */}
      <div className="binary-inputSection">
        <label className="binary-label">Target Value:</label>
        <input
          type="text"
          value={targetInput}
          onChange={e => setTargetInput(e.target.value)}
          className="binary-input binary-smallInput"
        />
        <button onClick={updateSearch} className="binary-button binary-buttonMarginLeft">
          Update Search
        </button>
      </div>

      {/* Speed Control */}
      <div className="binary-inputSection">
        <label className="binary-label">Visualization Speed: {speed}ms</label>
        <div className="binary-sliderContainer">
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="binary-slider"
          />
          <select
            onChange={e => setSpeed(Number(e.target.value))}
            className="binary-dropdown"
            defaultValue={500}
          >
            <option value={600}>Slow</option>
            <option value={500}>Medium</option>
            <option value={50}>Fast</option>
          </select>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="binary-inputSection">
        <button
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
          className={`binary-toggleButton ${mode === "theory" ? "binary-activeToggle" : ""}`}
        >
          Theory Mode
        </button>
        <button
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
          className={`binary-toggleButton ${mode === "practice" ? "binary-activeToggle" : ""} binary-buttonMarginLeft`}
        >
          Practice Mode
        </button>
      </div>

      {/* Visualization Component */}
      <AlgorithmVisualizer steps={steps} speed={speed} />

      {/* Theory/Practice Content */}
      {mode === "theory" ? (
        <div className="binary-theoryContainer">
          <h3 className="binary-sectionHeader">Algorithm Theory & Pseudocode</h3>
          <p className="binary-paragraph">
            Binary Search works on a sorted array by repeatedly comparing the target value
            to the middle element of the current search interval. Depending on the comparison,
            the algorithm narrows down the search interval to the left or right half until the
            target is found or the interval is empty.
          </p>
          <pre className="binary-codeBlock">
{`function binarySearch(array, target) {
  let low = 0, high = array.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (array[mid] === target)
      return mid;
    else if (array[mid] < target)
      low = mid + 1;
    else
      high = mid - 1;
  }
  return -1;
}`}
          </pre>
          <h3 className="binary-sectionHeader">Example: Binary Search Steps</h3>
          <pre className="binary-codeBlockAlt">{exampleSteps}</pre>
          <h3 className="binary-sectionHeader">Time Complexity</h3>
          <ul className="binary-list">
            <li>O(log n)</li>
          </ul>
        </div>
      ) : (
        <MyCompilerEditor />
      )}
    </div>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each snapshot (step) of the binary search process.
 *
 * @param {Object} props
 * @param {Object[]} props.steps - Array of binary search snapshots.
 * @param {number} props.speed - Visualization speed in milliseconds.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finalMessage, setFinalMessage] = useState("");

  // Reset step counter and clear final message when steps change.
  useEffect(() => {
    setCurrentStep(0);
    setFinalMessage("");
  }, [steps]);

  // Animate through steps unless paused.
  useEffect(() => {
    if (paused || steps.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        // Set final message when search completes.
        const lastMsg = steps[steps.length - 1].message;
        setFinalMessage(lastMsg ? lastMsg + " | Search Completed" : "Search Completed");
        return prev;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [paused, speed, steps]);

  // Get current state snapshot.
  const state = steps[currentStep] || {};
  const { low, high, mid, array } = state;

  return (
    <div className="binary-visualizerContainer">
      {/* Display current step number */}
      <motion.h4
        className="binary-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStep}
      </motion.h4>
      {/* Render the array as a series of boxes */}
      <div className="binary-arrayContainer">
        {array && array.map((num, idx) => {
          // Highlight the mid element.
          const bg = idx === mid ? "orange" : "#ddd";
          return (
            <motion.div
              key={idx}
              className="binary-arrayBox"
              style={{ backgroundColor: bg }}
              animate={{ backgroundColor: bg }}
              transition={{ duration: speed / 1000 }}
            >
              {num}
            </motion.div>
          );
        })}
      </div>
      {/* Removed the duplicate rendering of message */}
      {/* Display final message inside the visualization box */}
      {finalMessage && <p className="binary-completeMessage">{finalMessage}</p>}
      <p className="binary-infoText">
        Low: {low}, High: {high}{mid !== undefined && `, Mid: ${mid}`}
      </p>
      <div className="binary-centerText binary-marginTop10">
        <button onClick={() => setPaused(!paused)} className="binary-toggleButton">
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}

/**
 * MyCompilerEditor Component
 * Dummy component for Practice Mode that embeds an online code editor.
 */
function MyCompilerEditor() {
  return (
    <div className="binary-editorContainer">
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

export default BinarySearchDetail;
