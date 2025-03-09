// HuffmanCodingVisualizer.js
// This component visualizes the construction of a Huffman tree for a set of character frequencies.
// It builds the tree step by step using a greedy algorithm, and records each merge step.
// The computation starts automatically when the component mounts, and a completion message is shown at the end.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS file for styling.
import '../CSS/huffmanvisualizer.css';

/* ---------- Helper Functions ---------- */

/**
 * assignPositions - Recursively assigns (x, y) positions to each node in a binary tree
 * using an in‑order traversal. xRef is used to track the current x coordinate.
 *
 * @param {Object} node - The tree node.
 * @param {number} depth - Current depth in the tree.
 * @param {Object} xRef - Object with property "value" to share x position across recursion.
 */
function assignPositions(node, depth = 0, xRef = { value: 0 }) {
  if (!node) return;
  assignPositions(node.left, depth + 1, xRef);
  node.x = xRef.value * 60 + 50;
  node.y = depth * 70 + 50;
  xRef.value += 1;
  assignPositions(node.right, depth + 1, xRef);
}

/**
 * getBoundingBox - Recursively computes the bounding box for a binary tree.
 *
 * @param {Object} node - The tree node.
 * @returns {Object} Object with properties: minX, minY, maxX, maxY.
 */
function getBoundingBox(node) {
  if (!node) return { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  const leftBox = getBoundingBox(node.left);
  const rightBox = getBoundingBox(node.right);
  const minX = Math.min(node.x, leftBox.minX, rightBox.minX);
  const minY = Math.min(node.y, leftBox.minY, rightBox.minY);
  const maxX = Math.max(node.x, leftBox.maxX, rightBox.maxX);
  const maxY = Math.max(node.y, leftBox.maxY, rightBox.maxY);
  return { minX, minY, maxX, maxY };
}

/**
 * buildHuffmanSteps - Constructs the Huffman tree step by step from given frequencies.
 * At each merge step, it records a snapshot of the forest (array of trees) and a description.
 *
 * @param {Object} frequencies - An object mapping characters to their frequencies.
 * @returns {Object[]} steps - Array of snapshot steps.
 */
function buildHuffmanSteps(frequencies) {
  let forest = Object.entries(frequencies).map(([char, freq]) => ({
    char,
    freq,
    left: null,
    right: null
  }));
  const steps = [];
  // Record initial state.
  steps.push({
    forest: JSON.parse(JSON.stringify(forest)),
    description: "Initial forest (leaf nodes)."
  });
  
  while (forest.length > 1) {
    forest.sort((a, b) => a.freq - b.freq);
    const left = forest.shift();
    const right = forest.shift();
    const parent = { char: null, freq: left.freq + right.freq, left, right };
    forest.push(parent);
    // Deep clone and assign positions for each tree in the forest.
    const forestCopy = JSON.parse(JSON.stringify(forest));
    forestCopy.forEach(tree => {
      assignPositions(tree);
    });
    steps.push({
      forest: forestCopy,
      description: `Combined nodes with frequencies ${left.freq} and ${right.freq}.`
    });
  }
  return steps;
}

/* ---------- Visualization Components ---------- */

/**
 * TreeDiagram Component
 * Recursively renders a binary tree (Huffman tree) as SVG elements.
 *
 * @param {Object} props - Contains "node" representing the current tree node.
 */
function TreeDiagram({ node }) {
  if (!node) return null;
  return (
    <g>
      {node.left && (
        <line
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
          stroke="#444"
          strokeWidth="2"
        />
      )}
      {node.right && (
        <line
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
          stroke="#444"
          strokeWidth="2"
        />
      )}
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={20}
        fill={node.char ? "#90EE90" : "#fefefe"}
        stroke="#444"
        strokeWidth="2"
        whileHover={{ scale: 1.1 }}
        layout
      />
      <text
        x={node.x}
        y={node.y + 5}
        textAnchor="middle"
        fontSize="16"
        fill="#444"
      >
        {node.char ? `${node.char} (${node.freq})` : node.freq}
      </text>
      {/* Recursively render left and right subtrees */}
      {TreeDiagram({ node: node.left })}
      {TreeDiagram({ node: node.right })}
    </g>
  );
}

/**
 * ForestDiagram Component
 * Renders an array of Huffman trees side by side in an SVG.
 * The viewBox is dynamically computed to fit the entire forest.
 *
 * @param {Object} props - Contains the forest (array of trees).
 */
function ForestDiagram({ forest }) {
  // Compute a global bounding box for all trees.
  let globalBox = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  forest.forEach(tree => {
    const box = getBoundingBox(tree);
    globalBox.minX = Math.min(globalBox.minX, box.minX);
    globalBox.minY = Math.min(globalBox.minY, box.minY);
    globalBox.maxX = Math.max(globalBox.maxX, box.maxX);
    globalBox.maxY = Math.max(globalBox.maxY, box.maxY);
  });
  
  // Add margin.
  const margin = 20;
  const viewBox = `${globalBox.minX - margin} ${globalBox.minY - margin} ${globalBox.maxX - globalBox.minX + 2 * margin} ${globalBox.maxY - globalBox.minY + 2 * margin}`;
  
  return (
    <svg width="100%" height="300" className="huff-svg" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
      {forest.map((tree, idx) => (
        <g key={idx}>
          {TreeDiagram({ node: tree })}
        </g>
      ))}
    </svg>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through the recorded steps of the Huffman tree construction.
 * Displays the current step description and the forest diagram.
 * Shows a completion message when the process is complete.
 *
 * @param {Object} props - Contains the steps array and visualization speed.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reset step index when steps change.
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);

  // Animate through steps automatically.
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

  const currentStep = steps[currentStepIndex] || { forest: [] };

  return (
    <div className="huff-visualizerContainer">
      <motion.h4
        className="huff-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex} – {currentStep.description}
      </motion.h4>
      <ForestDiagram forest={currentStep.forest} />
      <div className="huff-centerText huff-marginTop10">
        <button onClick={() => setPaused(!paused)} className="huff-toggleButton">
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && steps.length > 0 && (
          <motion.div
            className="huff-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Huffman Tree Construction Complete!
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
    <div className="huff-editorContainer">
      <motion.h3
        className="huff-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="huff-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="huff-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * HuffmanCodingVisualizer Component
 * Main component that renders the Huffman coding visualizer, including input controls,
 * visualization speed control, and mode toggling (theory vs. practice).
 * The computation starts automatically on mount.
 */
export default function HuffmanCodingVisualizer() {
  // Default frequencies provided as JSON.
  const [inputFrequencies, setInputFrequencies] = useState(
    JSON.stringify({ A: 5, B: 9, C: 12, D: 13, E: 16, F: 45 }, null, 2)
  );
  const [frequencies, setFrequencies] = useState({ A: 5, B: 9, C: 12, D: 13, E: 16, F: 45 });
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState("");
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  // Automatically run the Huffman coding computation on mount.
  useEffect(() => {
    runHuffman();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * runHuffman - Parses the input frequencies, builds the Huffman tree steps,
   * assigns positions for display, and records the final frequency sum.
   */
  const runHuffman = () => {
    let freqs;
    try {
      freqs = JSON.parse(inputFrequencies);
    } catch (e) {
      alert("Invalid input. Please enter valid JSON for frequencies.");
      return;
    }
    setFrequencies(freqs);
    const computedSteps = buildHuffmanSteps(freqs);
    // For each step, assign positions to each tree in the forest.
    computedSteps.forEach(step => {
      step.forest.forEach(tree => assignPositions(tree));
    });
    setSteps(computedSteps);
    const finalStep = computedSteps[computedSteps.length - 1];
    setMessage(`Total frequency (root): ${finalStep.forest[0].freq}`);
  };

  // Content for theory mode.
  const theoryContent = (
    <>
      <motion.h3
        className="huff-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="huff-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Huffman coding builds an optimal prefix code by constructing a binary tree.
        Each leaf node represents a character and its frequency. In each step,
        the two nodes with the lowest frequencies are merged into a new node.
      </motion.p>
      <motion.pre
        className="huff-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function buildHuffmanTree(frequencies):
  forest = [for each (char, freq) create node {char, freq}]
  while forest.length > 1:
    sort forest by freq
    left = forest.shift()
    right = forest.shift()
    parent = { char: null, freq: left.freq + right.freq, left, right }
    forest.push(parent)
  return forest[0]`}
      </motion.pre>
      <motion.h3
        className="huff-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="huff-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(n log n) due to sorting at each merge step.</li>
      </motion.ul>
    </>
  );

  return (
    <div className="huff-pageContainer">
      <motion.h2
        className="huff-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Huffman Coding Visualizer
      </motion.h2>
      <div className="huff-inputContainer">
        <label className="huff-inputLabel">Frequencies (JSON format):</label>
        <br />
        <textarea
          rows="8"
          cols="50"
          value={inputFrequencies}
          onChange={(e) => setInputFrequencies(e.target.value)}
          className="huff-textInput"
        />
        <br />
        <motion.button
          className="huff-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runHuffman}
        >
          Build Huffman Tree
        </motion.button>
      </div>
      <div className="huff-inputContainer">
        <label className="huff-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="huff-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="huff-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="huff-inputContainer">
        <motion.button
          className={`huff-toggleButton ${mode === "theory" ? "huff-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`huff-toggleButton ${mode === "practice" ? "huff-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
        >
          Practice
        </motion.button>
      </div>
      {/* Always render the visualization box */}
      <AnimatePresence>
        {steps.length > 0 && <AlgorithmVisualizer steps={steps} speed={speed} />}
      </AnimatePresence>
      {mode === "theory" ? (
        <motion.div
          className="huff-theoryContainer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {theoryContent}
        </motion.div>
      ) : (
        <MyCompilerEditor />
      )}
      {message && <p className="huff-finalMessage">{message}</p>}
    </div>
  );
}









