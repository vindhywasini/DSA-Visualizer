// PrimeFactorizationVisualizer.js
// This component visualizes the prime factorization process of a given number.
// It uses a trial-division approach for factorization, recording each step.
// The UI includes controls for entering a number, adjusting the animation speed,
// and toggling between theory and practice modes. Computation starts automatically on mount.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS for styling.
import '../CSS/primefactorization.css';

/**
 * buildFactorizationSteps - Simulates prime factorization of a number step by step.
 *
 * For a given number n, it finds its prime factors by testing candidate factors,
 * recording each step with the current value of n, the factors found so far, and a description.
 *
 * @param {number} n - The number to factorize.
 * @returns {Object[]} steps - Array of snapshot objects.
 */
function buildFactorizationSteps(n) {
  const steps = [];
  let factors = [];
  let candidate = 2;
  let current = n;

  // Record initial step.
  steps.push({
    current,
    factors: [...factors],
    candidate: null,
    description: `Start with n = ${n}.`
  });

  // Factorization loop: continue until current becomes 1.
  while (current > 1 && candidate <= current) {
    // Record the attempt with the current candidate.
    steps.push({
      current,
      factors: [...factors],
      candidate,
      description: `Trying candidate ${candidate}.`
    });
    if (current % candidate === 0) {
      // Candidate divides current; record the division step.
      factors.push(candidate);
      current = current / candidate;
      steps.push({
        current,
        factors: [...factors],
        candidate,
        description: `Candidate ${candidate} divides n. Updated n = ${current}.`
      });
    } else {
      // Candidate does not divide; move to next candidate.
      steps.push({
        current,
        factors: [...factors],
        candidate,
        description: `Candidate ${candidate} does not divide. Moving to ${candidate + 1}.`
      });
      candidate++;
    }
  }

  // Final step: complete factorization.
  steps.push({
    current,
    factors: [...factors],
    candidate: null,
    description: `Factorization complete. Factors: ${factors.join(' x ')}.`
  });
  return steps;
}

/**
 * FactorizationDiagram Component
 * Renders the current number (n) and the factors found so far.
 *
 * @param {Object} props - Contains the current step.
 */
function FactorizationDiagram({ step }) {
  const factors = step.factors || [];
  return (
    <div className="pf-diagramContainer">
      <motion.div
        className="pf-currentBox"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        Current: {step.current}
      </motion.div>
      <div className="pf-factorsRow">
        {factors.map((f, idx) => (
          <motion.div
            key={idx}
            className="pf-factorBox"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            {f}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each recorded step of the factorization process.
 * Includes a Pause/Resume button and shows a completion message when done.
 *
 * @param {Object} props - Contains the steps array and the animation speed.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reset step index when steps update.
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

  const currentStep = steps[currentStepIndex] || { current: "-", factors: [] };

  return (
    <div className="pf-visualizerContainer">
      <motion.h4
        className="pf-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex} – {currentStep.description}
      </motion.h4>
      <FactorizationDiagram step={currentStep} />
      <div className="pf-centerText pf-marginTop10">
        <button onClick={() => setPaused(!paused)} className="pf-toggleButton">
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && (
          <motion.div
            className="pf-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Factorization Complete!
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
    <div className="pf-editorContainer">
      <motion.h3
        className="pf-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="pf-editorText"
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
 * PrimeFactorizationVisualizer Component
 * Main component that renders the prime factorization visualizer, input controls, speed control,
 * mode toggling, and theory/practice content.
 * The factorization computation starts automatically when the component mounts.
 */
export default function PrimeFactorizationVisualizer() {
  const [number, setNumber] = useState(84);
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState("");
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  /**
   * runFactorization - Validates input and computes the factorization steps.
   */
  const runFactorization = () => {
    if (isNaN(number) || number < 2) {
      alert("Please enter a number greater than or equal to 2.");
      return;
    }
    const computedSteps = buildFactorizationSteps(number);
    setSteps(computedSteps);
    const finalStep = computedSteps[computedSteps.length - 1];
    setMessage(`Prime factors of ${number}: ${finalStep.factors.join(' x ')}`);
  };

  // Automatically run factorization when the component mounts.
  useEffect(() => {
    runFactorization();
  }, []);

  const theoryContent = (
    <>
      <motion.h3
        className="pf-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="pf-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        The prime factorization algorithm finds all prime factors of a given number by starting at 2 and testing
        whether the candidate factor divides the number. If it does, the candidate is recorded and the number is
        divided until it no longer divides evenly, then the process continues with the next candidate.
      </motion.p>
      <motion.pre
        className="pf-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function primeFactorization(n):
  factors = []
  candidate = 2
  while n > 1:
    if n % candidate == 0:
      factors.push(candidate)
      n = n / candidate
    else:
      candidate += 1
  return factors`}
      </motion.pre>
      <motion.h3
        className="pf-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="pf-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(n) in the worst-case scenario.</li>
      </motion.ul>
    </>
  );

  return (
    <div className="pf-pageContainer">
      <motion.h2
        className="pf-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Prime Factorization Visualizer
      </motion.h2>
      <div className="pf-inputContainer">
        <label className="pf-inputLabel">Enter a number:</label>
        <br />
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
          className="pf-textInput"
        />
        <br />
        <motion.button
          className="pf-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runFactorization}
        >
          Factorize
        </motion.button>
      </div>
      <div className="pf-inputContainer">
        <label className="pf-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="pf-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="pf-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="pf-inputContainer">
        <motion.button
          className={`pf-toggleButton ${mode === "theory" ? "pf-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`pf-toggleButton ${mode === "practice" ? "pf-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
        >
          Practice
        </motion.button>
      </div>
      {/* Always render the visualization box */}
      <AlgorithmVisualizer steps={steps} speed={speed} />
      {mode === "theory" ? (
        <div className="pf-theoryContainer">
          {theoryContent}
        </div>
      ) : (
        <MyCompilerEditor />
      )}
      {message && <p className="pf-finalMessage">{message}</p>}
    </div>
  );
}








