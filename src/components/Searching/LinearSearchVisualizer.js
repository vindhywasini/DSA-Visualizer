// LinearSearchDetail.js
// This component visualizes the Linear Search algorithm on an array.
// It provides controls for custom array and target input, random array generation,
// speed control, and mode toggling between theory and practice.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import the external CSS file for styling.
import '../CSS/linearsearch.css';

/**
 * linearSearchSteps - Simulates linear search and records each iteration's state.
 *
 * @param {number[]} array - The array to search.
 * @param {number} target - The target value to search for.
 * @returns {Object[]} steps - An array of snapshots for each iteration.
 *   Each snapshot contains the currentIndex, a copy of the array, and a message.
 */
function linearSearchSteps(array, target) {
  const steps = [];
  // Record initial state.
  steps.push({ currentIndex: -1, array: [...array], message: "Starting search..." });
  
  // Iterate through each element in the array.
  for (let i = 0; i < array.length; i++) {
    const state = { currentIndex: i, array: [...array] };
    if (array[i] === target) {
      state.message = `Target ${target} found at index ${i}`;
      steps.push(state);
      return steps;
    } else {
      state.message = `Checking index ${i}: ${array[i]} is not ${target}`;
      steps.push(state);
    }
  }
  // Record final state when target is not found.
  steps.push({ currentIndex: null, array: [...array], message: `Target ${target} not found.` });
  return steps;
}

/**
 * LinearSearchDetail Component
 * Renders the UI for visualizing linear search including inputs for array and target,
 * speed control, visualization, and mode toggling (theory vs. practice).
 */
function LinearSearchDetail() {
  // State for the array input (comma-separated numbers).
  const [arrayInput, setArrayInput] = useState("1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20");
  // State for the target value.
  const [targetInput, setTargetInput] = useState("10");
  // Visualization speed in milliseconds.
  const [speed, setSpeed] = useState(500);
  // Mode state: "theory" shows explanation; "practice" shows an embedded editor.
  const [mode, setMode] = useState("theory");
  // Steps state: each step is a snapshot of the linear search process.
  const [steps, setSteps] = useState(() => {
    const arr = arrayInput.split(",").map(num => parseInt(num.trim(), 10));
    const target = parseInt(targetInput.trim(), 10);
    return linearSearchSteps(arr, target);
  });
  // Final message state (if needed, for consistency with other components).
  const [finalMessage, setFinalMessage] = useState("");

  /**
   * updateSearch - Parses the custom inputs and updates the linear search snapshots.
   */
  const updateSearch = () => {
    const arr = arrayInput.split(",").map(num => parseInt(num.trim(), 10));
    const target = parseInt(targetInput.trim(), 10);
    if (arr.some(isNaN) || isNaN(target)) {
      alert("Invalid input. Please enter valid numbers.");
      return;
    }
    setSteps(linearSearchSteps(arr, target));
    setFinalMessage("");
  };

  /**
   * generateRandomArray - Generates a random array (20 elements, values between 1 and 100),
   * updates the input field, and recomputes the search snapshots.
   */
  const generateRandomArray = () => {
    const arr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 1);
    setArrayInput(arr.join(","));
    updateSearch();
  };

  // Example steps text for illustration in theory mode.
  const exampleSteps = `
Step 0: Starting search...
Step 1: Checking index 0: 5 is not 10
Step 2: Checking index 1: 8 is not 10
Step 3: Checking index 2: 10 is 10  <-- Found!
  `.trim();

  return (
    <div className="linear-pageContainer">
      {/* Header */}
      <h2 className="linear-pageHeader">Linear Search Visualization</h2>

      {/* Array Input & Random Array Generation */}
      <div className="linear-inputSection">
        <label className="linear-label">Array (comma separated):</label>
        <input
          type="text"
          value={arrayInput}
          onChange={e => setArrayInput(e.target.value)}
          className="linear-input"
        />
        <button onClick={generateRandomArray} className="linear-button">
          Random Array
        </button>
      </div>
      {/* Target Input & Update Button */}
      <div className="linear-inputSection">
        <label className="linear-label">Target Value:</label>
        <input
          type="text"
          value={targetInput}
          onChange={e => setTargetInput(e.target.value)}
          className="linear-input linear-smallInput"
        />
        <button onClick={updateSearch} className="linear-button linear-buttonMarginLeft">
          Update Search
        </button>
      </div>

      {/* Speed Control */}
      <div className="linear-inputSection">
        <label className="linear-label">Visualization Speed: {speed}ms</label>
        <div className="linear-sliderContainer">
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="linear-slider"
          />
          <select
            onChange={e => setSpeed(Number(e.target.value))}
            className="linear-dropdown"
            defaultValue={500}
          >
            <option value={600}>Slow</option>
            <option value={500}>Medium</option>
            <option value={100}>Fast</option>
          </select>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="linear-inputSection">
        <button
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
          className={`linear-toggleButton ${mode === "theory" ? "linear-activeToggle" : ""}`}
        >
          Theory Mode
        </button>
        <button
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
          className={`linear-toggleButton ${mode === "practice" ? "linear-activeToggle" : ""} linear-buttonMarginLeft`}
        >
          Practice Mode
        </button>
      </div>

      {/* Visualization Component */}
      <AlgorithmVisualizer steps={steps} speed={speed} />

      {/* Theory / Practice Content */}
      {mode === "theory" ? (
        <div className="linear-theoryContainer">
          <h3 className="linear-sectionHeader">Algorithm Theory & Pseudocode</h3>
          <p className="linear-paragraph">
            Linear Search sequentially checks each element in the array until the target is found
            or the array ends. Its worst-case time complexity is O(n).
          </p>
          <pre className="linear-codeBlock">
{`function linearSearch(array, target) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target)
      return i;
  }
  return -1;
}`}
          </pre>
          <h3 className="linear-sectionHeader">Example: Linear Search Steps</h3>
          <pre className="linear-codeBlockAlt">{exampleSteps}</pre>
          <h3 className="linear-sectionHeader">Time Complexity</h3>
          <ul className="linear-list">
            <li>O(n) in the worst case</li>
          </ul>
        </div>
      ) : (
        <MyCompilerEditor />
      )}

      {/* (Optional) Final message can be rendered here if needed */}
      {finalMessage && <p className="linear-finalMessage">{finalMessage}</p>}
    </div>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each snapshot (step) of the linear search process.
 *
 * @param {Object} props
 * @param {Object[]} props.steps - Array of linear search snapshots.
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
  const { currentIndex, array, message } = state;

  return (
    <div className="linear-visualizerContainer">
      {/* Display current step number */}
      <motion.h4
        className="linear-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStep}
      </motion.h4>
      {/* Render the array as a series of boxes */}
      <div className="linear-arrayContainer">
        {array && array.map((num, idx) => {
          const bg = idx === currentIndex ? "orange" : "#ddd";
          return (
            <motion.div
              key={idx}
              className="linear-arrayBox"
              style={{ backgroundColor: bg }}
              animate={{ backgroundColor: bg }}
              transition={{ duration: speed / 1000 }}
            >
              {num}
            </motion.div>
          );
        })}
      </div>
      {message && <p>{message}</p>}
      {/* Display final message inside the visualization box */}
      {finalMessage && <p className="linear-completeMessage">{finalMessage}</p>}
      <div className="linear-centerText linear-marginTop10">
        <button onClick={() => setPaused(!paused)} className="linear-toggleButton">
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
    <div className="linear-editorContainer">
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

export default LinearSearchDetail;


