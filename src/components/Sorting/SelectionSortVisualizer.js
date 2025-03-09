// SelectionSortDetail.js
// This component visualizes the Selection Sort algorithm.
// It provides controls for custom input, random array generation,
// speed control, and mode toggling (theory vs. practice).

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS for styling.
import '../CSS/selectionsort.css';

/**
 * selectionSort - Sorts an array using the Selection Sort algorithm.
 * Records each snapshot (step) of the array for visualization.
 *
 * @param {number[]} arr - Array of numbers to sort.
 * @returns {number[][]} steps - Array of snapshots representing each sort step.
 */
function selectionSort(arr) {
  const steps = [];
  const array = [...arr];
  // Record the initial state.
  steps.push([...array]);
  
  // Loop over each element to place it at its correct sorted position.
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    // Find the index of the minimum element in the unsorted portion.
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    // If a new minimum is found, swap and record the snapshot.
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      steps.push([...array]);
    }
  }
  return steps;
}

/**
 * SelectionSortDetail Component
 * Renders the UI for visualizing the Selection Sort process,
 * including input fields, speed control, mode toggling, and theory content.
 */
function SelectionSortDetail() {
  // States for controlling visualization speed, user input, mode, and algorithm steps.
  const [speed, setSpeed] = useState(300);
  const [arrayInput, setArrayInput] = useState("30,10,20,40,50");
  const [mode, setMode] = useState("theory");
  const [steps, setSteps] = useState(selectionSort([30, 10, 20, 40, 50]));

  /**
   * updateArray - Parses user input, validates it, and updates the steps.
   */
  const updateArray = () => {
    const arr = arrayInput.split(",").map(num => parseInt(num.trim(), 10));
    if (arr.some(isNaN)) {
      alert("Invalid input. Please enter numbers separated by commas.");
      return;
    }
    setSteps(selectionSort(arr));
  };

  /**
   * generateRandomArray - Generates a random array, updates the input field,
   * and recalculates the selection sort steps.
   *
   * @param {number} size - Number of elements in the array (default is 5).
   */
  const generateRandomArray = (size = 5) => {
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setArrayInput(arr.join(","));
    setSteps(selectionSort(arr));
  };

  // Example steps for theory mode reference.
  const exampleSteps = `
Step 0: 30,10,20,40,50
Step 1: 10,30,20,40,50
Step 2: 10,20,30,40,50
Step 3: 10,20,30,40,50
  `.trim();

  return (
    <div className="pageContainer">
      {/* Header */}
      <h2 className="pageHeader">Selection Sort Visualization</h2>

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

      {/* Visualization Speed Control */}
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

      {/* Mode Toggle: Theory vs. Practice */}
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
            Selection Sort works by repeatedly finding the minimum element from the unsorted portion of the array
            and swapping it with the first unsorted element. The process continues until the entire array is sorted.
          </p>
          <pre className="codeBlock">
{`function selectionSort(array) {
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      swap(array[i], array[minIndex]);
      recordStep(array);
    }
  }
  return steps;
}`}
          </pre>
          <h3 className="sectionHeader">Example: Selection Sort Steps</h3>
          <pre className="codeBlockAlt">{exampleSteps}</pre>
          <h3 className="sectionHeader">Time Complexity</h3>
          <ul className="list">
            <li>Best, Average, Worst Case: O(n²)</li>
          </ul>
        </div>
      ) : (
        // Render Practice Mode component.
        <MyCompilerEditor />
      )}
    </div>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each snapshot of the Selection Sort process.
 *
 * @param {Object} props
 * @param {number[][]} props.steps - Array of snapshots representing the sort steps.
 * @param {number} props.speed - Visualization speed in milliseconds.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset step counter when steps update.
  useEffect(() => {
    setCurrentStep(0);
    if (steps.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [steps, speed]);

  const currentArray = steps[currentStep] || [];
  return (
    <div className="visualizerContainer">
      {/* Display current step */}
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

export default SelectionSortDetail;
