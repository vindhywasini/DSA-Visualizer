// Import necessary libraries and CSS file
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../CSS/insertionsort.css';

/**
 * insertionSort - Sorts an array using the Insertion Sort algorithm.
 * Also records each intermediate step for visualization.
 *
 * @param {number[]} arr - Array of numbers to sort.
 * @returns {number[][]} steps - Array of steps showing the array at each stage.
 */
function insertionSort(arr) {
  const steps = [];
  const array = [...arr];
  // Record the initial state of the array
  steps.push([...array]);

  // Loop through each element starting from the second one
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;

    // Shift elements that are greater than key to one position ahead
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
      // Record the state after each shift
      steps.push([...array]);
    }
    // Insert the key into its correct position
    array[j + 1] = key;
    // Record the state after the key is inserted
    steps.push([...array]);
  }
  return steps;
}

/**
 * InsertionSortDetail Component
 * Main component that renders the Insertion Sort visualization,
 * input controls, and theory information.
 */
function InsertionSortDetail() {
  // State to control animation speed, user input, mode, and sorting steps.
  const [speed, setSpeed] = useState(300);
  const [arrayInput, setArrayInput] = useState("30,10,20,40,50");
  const [mode, setMode] = useState("theory");
  const [steps, setSteps] = useState(insertionSort([30, 10, 20, 40, 50]));

  /**
   * updateArray - Parses user input, validates it, and updates the steps for visualization.
   */
  const updateArray = () => {
    const arr = arrayInput.split(",").map(num => parseInt(num.trim(), 10));
    if (arr.some(isNaN)) {
      alert("Invalid input. Please enter numbers separated by commas.");
      return;
    }
    setSteps(insertionSort(arr));
  };

  /**
   * generateRandomArray - Generates a random array, updates the input field, and recalculates steps.
   *
   * @param {number} size - Number of elements in the array (default is 5).
   */
  const generateRandomArray = (size = 5) => {
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setArrayInput(arr.join(","));
    setSteps(insertionSort(arr));
  };

  // Example steps for display in the theory section.
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
      <h2 className="pageHeader">Insertion Sort Visualization</h2>

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

      {/* Theory Content or Practice Editor based on mode */}
      {mode === "theory" ? (
        <div className="theoryContainer">
          <h3 className="sectionHeader">Algorithm Theory & Pseudocode</h3>
          <p className="paragraph">
            Insertion Sort builds the sorted array one element at a time.
            It takes each element (starting from the second) and inserts it into its proper position in the already-sorted portion.
          </p>
          <pre className="codeBlock">
{`function insertionSort(array):
  for i = 1 to array.length - 1:
    key = array[i]
    j = i - 1
    while j >= 0 and array[j] > key:
      array[j + 1] = array[j]
      j = j - 1
    array[j + 1] = key
  return steps  // Each step is recorded
`}
          </pre>
          <h3 className="sectionHeader">Example: Insertion Sort Steps</h3>
          <pre className="codeBlockAlt">{exampleSteps}</pre>
          <h3 className="sectionHeader">Time Complexity</h3>
          <ul className="list">
            <li>Best Case: O(n) (already sorted)</li>
            <li>Average Case: O(n²)</li>
            <li>Worst Case: O(n²)</li>
          </ul>
        </div>
      ) : (
        // Render Practice Mode component
        <MyCompilerEditor />
      )}
    </div>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates the sorting process by stepping through the array states.
 *
 * @param {Object} props
 * @param {number[][]} props.steps - Array of array states representing each step.
 * @param {number} props.speed - Visualization speed (ms).
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reset current step when steps change
  useEffect(() => {
    setCurrentStep(0);
  }, [steps]);

  // Animate through steps using setInterval
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
      {/* Display complete message when sorting is finished */}
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

export default InsertionSortDetail;
