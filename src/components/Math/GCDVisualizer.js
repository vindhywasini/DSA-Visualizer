// GCDVisualizer.js
// This component visualizes the computation of the GCD using the Euclidean algorithm.
// It provides controls for input values, speed control, and mode toggling (theory vs. practice).
// Computation now starts automatically when the component mounts, and the final result is shown
// inside the visualization box.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS for styling.
import '../CSS/gcdvisualizer.css';

/**
 * buildGCDEuclideanSteps - Computes the GCD of a and b using the Euclidean algorithm
 * while recording each step. Each step object includes:
 *   - a: current value of a,
 *   - b: current value of b,
 *   - description: a string describing the current step.
 *
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @returns {Object[]} steps - Array of snapshot objects.
 */
function buildGCDEuclideanSteps(a, b) {
  const steps = [];
  while (true) {
    steps.push({
      a: a,
      b: b,
      description: `Computing GCD(${a}, ${b})`
    });
    if (b === 0) break;
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  steps.push({
    a: a,
    b: b,
    description: `GCD is ${a}`
  });
  return steps;
}

/**
 * GCDDiagram Component
 * Displays the current values of "a" and "b" in styled boxes.
 *
 * @param {Object} props - Contains the current step.
 */
function GCDDiagram({ step }) {
  return (
    <div className="gcd-diagramContainer">
      <motion.div
        className="gcd-diagramBox"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        a = {step.a}
      </motion.div>
      <motion.div
        className="gcd-diagramBox"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        b = {step.b}
      </motion.div>
    </div>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each step of the Euclidean algorithm.
 * Includes a Pause/Resume button and displays the final GCD message inside the visualization box.
 *
 * @param {Object} props - Contains steps and speed.
 */
function AlgorithmVisualizer({ steps, speed, finalMessage }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reset step index when steps change.
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);

  // Animate through steps when not paused.
  useEffect(() => {
    if (paused || steps.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [paused, speed, steps]);

  const defaultStep = { a: "-", b: "-", description: "No computation yet" };
  const currentStep = steps[currentStepIndex] || defaultStep;

  return (
    <div className="gcd-visualizerContainer">
      <motion.h4
        className="gcd-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex} – {currentStep.description}
      </motion.h4>
      <GCDDiagram step={currentStep} />
      <div className="gcd-centerText gcd-marginTop10">
        <button onClick={() => setPaused(!paused)} className="gcd-toggleButton">
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && steps.length > 0 && (
          <motion.div
            className="gcd-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {finalMessage}
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
    <div className="gcd-editorContainer">
      <motion.h3
        className="gcd-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="gcd-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
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
      </motion.p>
    </div>
  );
}

/**
 * GCDVisualizer Component
 * Main component that renders the GCD visualizer, input controls, speed control,
 * mode toggling, and theory/practice content.
 * Computation starts automatically when the component mounts,
 * and the final GCD message is shown inside the visualization box.
 */
export default function GCDVisualizer() {
  const [a, setA] = useState(48);
  const [b, setB] = useState(18);
  const [steps, setSteps] = useState([]);
  const [finalMessage, setFinalMessage] = useState("");
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  /**
   * runGCD - Validates input and computes the GCD steps.
   */
  const runGCD = () => {
    if (isNaN(a) || isNaN(b) || a < 0 || b < 0) {
      alert("Please enter non-negative numbers.");
      return;
    }
    const computedSteps = buildGCDEuclideanSteps(a, b);
    setSteps(computedSteps);
    const finalStep = computedSteps[computedSteps.length - 1];
    setFinalMessage(`GCD(${a}, ${b}) = ${finalStep.a}`);
  };

  // Automatically run computation on mount.
  useEffect(() => {
    runGCD();
  }, []);

  const theoryContent = (
    <>
      <motion.h3
        className="gcd-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="gcd-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        The Euclidean algorithm computes the greatest common divisor (GCD) of two numbers by repeatedly applying:
        GCD(a, b) = GCD(b, a mod b) until b becomes 0, at which point a is the GCD.
      </motion.p>
      <motion.pre
        className="gcd-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function gcd(a, b):
  if b == 0:
    return a
  else:
    return gcd(b, a % b)`}
      </motion.pre>
      <motion.h3
        className="gcd-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="gcd-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(log(min(a, b))) in the worst case.</li>
      </motion.ul>
    </>
  );

  return (
    <div className="gcd-pageContainer">
      <motion.h2
        className="gcd-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        GCD (Euclidean) Visualizer
      </motion.h2>
      <div className="gcd-inputContainer">
        <label className="gcd-inputLabel">Enter value for a:</label>
        <br />
        <input
          type="number"
          value={a}
          onChange={(e) => setA(parseInt(e.target.value) || 0)}
          className="gcd-textInput"
        />
        <br />
        <label className="gcd-inputLabel">Enter value for b:</label>
        <br />
        <input
          type="number"
          value={b}
          onChange={(e) => setB(parseInt(e.target.value) || 0)}
          className="gcd-textInput"
        />
        <br />
        <motion.button
          className="gcd-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runGCD}
        >
          Compute GCD
        </motion.button>
      </div>
      <div className="gcd-inputContainer">
        <label className="gcd-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="gcd-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="gcd-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="gcd-inputContainer">
        <motion.button
          className={`gcd-toggleButton ${mode === "theory" ? "gcd-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`gcd-toggleButton ${mode === "practice" ? "gcd-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
        >
          Practice
        </motion.button>
      </div>
      {/* Visualization Box: Always rendered */}
      <AlgorithmVisualizer steps={steps} speed={speed} finalMessage={finalMessage} />
      {mode === "theory" ? (
        <div className="gcd-theoryContainer">
          {theoryContent}
        </div>
      ) : (
        <MyCompilerEditor />
      )}
    </div>
  );
}






