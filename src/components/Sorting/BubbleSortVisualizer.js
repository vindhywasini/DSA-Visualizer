// BubbleSortDetail.js
// This component visualizes the Bubble Sort algorithm.
// It includes user controls for custom input, random array generation,
// speed control, and mode toggling (theory vs. practice).

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import the external CSS file for styling.
import '../CSS/bubblesort.css';

/**
 * bubbleSort - Sorts an array using the Bubble Sort algorithm.
 * Also records each intermediate step for visualization.
 *
 * @param {number[]} arr - Array of numbers to sort.
 * @returns {number[][]} steps - Array containing snapshots of the array during sorting.
 */
function bubbleSort(arr) {
  const steps = [];
  const array = [...arr];
  // Record the initial state
  steps.push([...array]);

  // Loop through each element for the Bubble Sort process
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      // If the current element is greater than the next, swap them.
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        // Record the state after each swap.
        steps.push([...array]);
      }
    }
  }
  return steps;
}

/**
 * BubbleSortDetail Component
 * Main component that renders the Bubble Sort visualization,
 * input controls, theory content, and a practice mode editor.
 */
export default function BubbleSortDetail() {
  // States for speed, user input, mode, and sorting steps.
  const [speed, setSpeed] = useState(300);
  const [arrayInput, setArrayInput] = useState("30,10,20,40,50");
  const [mode, setMode] = useState("theory");
  const [steps, setSteps] = useState(bubbleSort([30, 10, 20, 40, 50]));

  /**
   * updateArray - Parses and validates user input, then updates visualization steps.
   */
  const updateArray = () => {
    const arr = arrayInput.split(",").map(num => parseInt(num.trim(), 10));
    if (arr.some(isNaN)) {
      alert("Invalid input. Please enter numbers separated by commas.");
      return;
    }
    setSteps(bubbleSort(arr));
  };

  /**
   * generateRandomArray - Generates a random array, updates the input field,
   * and recalculates the sorting steps.
   *
   * @param {number} size - Number of elements (default is 5).
   */
  const generateRandomArray = (size = 5) => {
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setArrayInput(arr.join(","));
    setSteps(bubbleSort(arr));
  };

  // Example steps for theory reference.
  const exampleSteps = `
Step 0: 30, 10, 20, 40, 50
Step 1: 30, 10, 20, 40, 50
Step 2: 10, 30, 20, 40, 50
Step 3: 10, 30, 20, 40, 50
Step 4: 10, 20, 30, 40, 50
  `.trim();

  return (
    <div className="pageContainer">
      {/* Header */}
      <h2 className="pageHeader">Bubble Sort Visualization</h2>

      {/* Input Section: Custom Array Input & Random Array Generator */}
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
          <button onClick={() => generateRandomArray()} className="button buttonMarginLeft">Random Array</button>
        </div>
      </div>

      {/* Input Section: Speed Control */}
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
      {mode === "theory" && (
        <div className="theoryContainer">
          <h3 className="sectionHeader">Algorithm Theory & Pseudocode</h3>
          <p className="paragraph">
            Bubble sort is a simple, iterative algorithm that repeatedly steps through the list,
            compares adjacent elements, and swaps them if they are in the wrong order.
            This process is repeated until the list is sorted.
          </p>
          <pre className="codeBlock">
{`function bubbleSort(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        swap(array[j], array[j + 1]);
      }
    }
  }
  return steps; // Each step is a snapshot of the array.
}`}
          </pre>
          <h3 className="sectionHeader">Example: Bubble Sort Steps</h3>
          <pre className="codeBlockAlt">{exampleSteps}</pre>
          <h3 className="sectionHeader">Time Complexity</h3>
          <ul className="list">
            <li>Best Case: O(n) (already sorted)</li>
            <li>Average Case: O(n²)</li>
            <li>Worst Case: O(n²)</li>
          </ul>
        </div>
      )}

      {/* Practice Mode: Dummy Embedded Editor */}
      {mode === "practice" && <MyCompilerEditor />}
    </div>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates the sorting process by stepping through each bubble sort snapshot.
 *
 * @param {Object} props
 * @param {number[][]} props.steps - Array of array states representing each step.
 * @param {number} props.speed - Visualization speed in milliseconds.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reset current step when steps update
  useEffect(() => {
    setCurrentStep(0);
  }, [steps]);

  // Animate through each step using setInterval
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
      {/* Display array bars */}
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
      {/* Display completion message when sorting is finished */}
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
 * Dummy component for Practice Mode that embeds an online compiler.
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



