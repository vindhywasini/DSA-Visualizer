// BSTOperationsDetail.js
// This component visualizes the step‑by‑step construction of a Binary Search Tree (BST).
// At each insertion, the newly inserted node is highlighted in orange, while previously inserted nodes are shown in green.
// The BST is built and each snapshot is recorded automatically upon mount.
// All styling is handled via an external CSS file for responsiveness and maintainability.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS file for styling.
import '../CSS/BSTOperationsDetail.css';

/* ---------- BST Node Class and Helper Functions ---------- */

// BSTNode class for creating tree nodes.
class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    // x and y coordinates for visualization.
    this.x = 0;
    this.y = 0;
  }
}

// Inserts a value into the BST.
function insert(root, value) {
  if (!root) return new BSTNode(value);
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else {
    root.right = insert(root.right, value);
  }
  return root;
}

/**
 * assignPositions - Recursively assigns (x,y) positions to nodes in the BST for visualization.
 * Starts at (300, 50) with an initial horizontal gap that halves at each level.
 *
 * @param {BSTNode} node - The current node.
 * @param {number} x - x coordinate for current node.
 * @param {number} y - y coordinate for current node.
 * @param {number} gap - Horizontal gap for positioning children.
 */
function assignPositions(node, x, y, gap) {
  if (!node) return;
  node.x = x;
  node.y = y;
  assignPositions(node.left, x - gap, y + 80, gap / 2);
  assignPositions(node.right, x + gap, y + 80, gap / 2);
}

/**
 * buildBSTSteps - Builds the BST by inserting values one by one and records each step.
 * Each step is an object containing:
 *  - tree: A deep clone of the BST after the insertion.
 *  - current: The value that was just inserted.
 *
 * @param {number[]} values - Array of values to insert.
 * @returns {Array} steps - Array of snapshots.
 */
function buildBSTSteps(values) {
  const steps = [];
  let root = null;
  values.forEach((val) => {
    root = insert(root, val);
    assignPositions(root, 300, 50, 120);
    // Deep clone the BST and record the inserted value.
    steps.push({ tree: JSON.parse(JSON.stringify(root)), current: val });
  });
  return steps;
}

/* ---------- BST Diagram Component ---------- */

/**
 * BSTDiagram Component
 * Renders the BST as an SVG with connecting edges and node labels.
 * Nodes that match the current insertion value are filled orange;
 * All other nodes are displayed in green.
 *
 * @param {Object} props - Contains:
 *   - tree: The BST snapshot to render.
 *   - current: The value of the node being inserted in the current step.
 */
function BSTDiagram({ tree, current }) {
  // Recursively render nodes and their connecting edges.
  const renderNode = (node) => {
    if (!node) return null;
    // Determine fill: if this node is the one just inserted, use orange; otherwise, green.
    const fillColor = node.value === current ? "#FF8C00" : "#90EE90";
    return (
      <g key={node.value}>
        {node.left && (
          <>
            <line
              x1={node.x}
              y1={node.y}
              x2={node.left.x}
              y2={node.left.y}
              className="bst-edge"
            />
            {renderNode(node.left)}
          </>
        )}
        {node.right && (
          <>
            <line
              x1={node.x}
              y1={node.y}
              x2={node.right.x}
              y2={node.right.y}
              className="bst-edge"
            />
            {renderNode(node.right)}
          </>
        )}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={20}
          className="bst-node"
          fill={fillColor}
          stroke="#444"
          strokeWidth="2"
          whileHover={{ scale: 1.2 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          title={`Node ${node.value}`}
          layout
        />
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          fontSize="16"
          fill="#444"
        >
          {node.value}
        </text>
      </g>
    );
  };

  return (
    <svg width="600" height="400" className="bst-svg">
      {renderNode(tree)}
    </svg>
  );
}

/* ---------- Algorithm Visualizer Component ---------- */

/**
 * AlgorithmVisualizer Component
 * Animates through the BST building steps.
 * Displays the BST at each step with the current inserted node highlighted in orange.
 * At the end, a "BST Built!" message is displayed.
 *
 * @param {Object} props - Contains:
 *   - steps: Array of BST snapshots with current insertion.
 *   - speed: Visualization speed (in milliseconds).
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset step index when steps update.
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);

  // Animate automatically through the steps.
  useEffect(() => {
    if (steps.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [steps, speed]);

  const currentStep = steps[currentStepIndex] || { tree: null, current: null };

  return (
    <div className="bst-visualizerContainer">
      <motion.h4
        className="bst-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex}
      </motion.h4>
      {currentStep.tree ? (
        <BSTDiagram tree={currentStep.tree} current={currentStep.current} />
      ) : (
        <p>Building BST...</p>
      )}
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && (
          <motion.div
            className="bst-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            BST Built!
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
    <div className="bst-editorContainer">
      <motion.h3
        className="bst-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="bst-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="bst-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * BSTOperationsDetail Component
 * Main component that renders the BST visualizer.
 * Users can input comma‑separated values to build the BST.
 * Visualization speed and mode (theory vs. practice) can be controlled.
 * The BST is built and traversal steps recorded automatically on mount.
 */
function BSTOperationsDetail() {
  const [inputValues, setInputValues] = useState("50,30,70,20,40,60,80");
  const [speed, setSpeed] = useState(1000);
  const [mode, setMode] = useState("theory");
  const [steps, setSteps] = useState(() => {
    const values = inputValues.split(",").map(v => parseInt(v.trim(), 10));
    return buildBSTSteps(values);
  });

  // Update BST when input changes.
  const updateBST = () => {
    const values = inputValues.split(",").map(v => parseInt(v.trim(), 10));
    if (values.some(isNaN)) {
      alert("Invalid input. Please enter numbers separated by commas.");
      return;
    }
    setSteps(buildBSTSteps(values));
  };

  // Generate random sorted values for a balanced BST.
  const generateRandomValues = () => {
    const arr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 1);
    arr.sort((a, b) => a - b);
    setInputValues(arr.join(","));
    updateBST();
  };

  // Example traversal steps text for theory mode.
  const exampleSteps = `
Step 0: Insert 50 -> BST: {50}
Step 1: Insert 30 -> BST: {50,30}
Step 2: Insert 70 -> BST: {50,30,70}
Step 3: Insert 20 -> BST: {50,30,70,20}
Step 4: Insert 40 -> BST: {50,30,70,20,40}
Step 5: Insert 60 -> BST: {50,30,70,20,40,60}
Step 6: Insert 80 -> BST: {50,30,70,20,40,60,80}
  `.trim();

  return (
    <div className="bst-pageContainer">
      <motion.h2
        className="bst-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        BST Operations Visualizer
      </motion.h2>

      {/* Input Section */}
      <div className="bst-inputContainer">
        <label className="bst-inputLabel">BST Values (comma separated):</label>
        <br />
        <input
          type="text"
          value={inputValues}
          onChange={(e) => setInputValues(e.target.value)}
          className="bst-textInput"
        />
        <br />
        <motion.button
          className="bst-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={updateBST}
        >
          Build BST
        </motion.button>
        <motion.button
          className="bst-primaryButton bst-randomButton"
          whileHover={{ scale: 1.05, rotate: -1 }}
          onClick={generateRandomValues}
        >
          Random Sorted Values
        </motion.button>
      </div>

      {/* Speed Control */}
      <div className="bst-inputContainer">
        <label className="bst-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="500"
          max="3000"
          step="250"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="bst-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="bst-dropdown"
          defaultValue={1000}
        >
          <option value={3000}>Slow</option>
          <option value={1000}>Medium</option>
          <option value={500}>Fast</option>
        </select>
      </div>

      {/* Mode Toggle */}
      <div className="bst-inputContainer bst-modeToggleContainer">
        <motion.button
          className={`bst-toggleButton ${mode === "theory" ? "bst-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory Mode
        </motion.button>
        <motion.button
          className={`bst-toggleButton ${mode === "practice" ? "bst-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
        >
          Practice Mode
        </motion.button>
      </div>

      {/* Visualization */}
      <AlgorithmVisualizer steps={steps} speed={speed} />

      {/* Theory / Practice Content */}
      {mode === "theory" ? (
        <div className="bst-theoryContainer">
          <motion.h3 className="bst-sectionHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Algorithm Theory & Pseudocode
          </motion.h3>
          <motion.p className="bst-paragraph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            A BST is built by inserting values one by one. Each new value is compared with the current node and placed in the left subtree if it’s smaller or in the right subtree if it’s larger. During insertion, the new node is highlighted in orange, and afterward it turns green.
          </motion.p>
          <motion.pre className="bst-codeBlock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
{`class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function insert(root, value) {
  if (!root) return new BSTNode(value);
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else {
    root.right = insert(root.right, value);
  }
  return root;
}`}
          </motion.pre>
          <motion.h3 className="bst-sectionHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Example: BST Build Steps
          </motion.h3>
          <motion.pre className="bst-codeBlockAlt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {exampleSteps}
          </motion.pre>
          <motion.h3 className="bst-sectionHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Time Complexity
          </motion.h3>
          <motion.ul className="bst-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <li>Insertion: O(h), where h is the height of the tree</li>
          </motion.ul>
        </div>
      ) : (
        <MyCompilerEditor />
      )}

      <style>{`
        @media (max-width: 768px) {
          svg {
            width: 100% !important;
            height: auto !important;
          }
          input[type="text"], textarea {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default BSTOperationsDetail;
