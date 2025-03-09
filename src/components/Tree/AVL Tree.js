// AVLTreeDetail.js
// This component visualizes the step-by-step construction of an AVL Tree.
// Each insertion is recorded as a snapshot. During the insertion step, the newly inserted node is highlighted in orange;
// in subsequent steps, nodes turn green. White edges connect nodes for contrast.
// Computation starts automatically on mount.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS file for styling.
import '../CSS/AVLTreeDetail.css';

/* ---------- AVL Node Class and AVL Insertion with Balancing ---------- */

// AVLNode class represents a node in an AVL tree.
class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    // Coordinates for visualization.
    this.x = 0;
    this.y = 0;
  }
}

// Helper: Get height of a node.
function getHeight(node) {
  return node ? node.height : 0;
}

// Helper: Get balance factor of a node.
function getBalance(node) {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

// Right rotation for balancing.
function rightRotate(y) {
  let x = y.left;
  let T2 = x.right;
  x.right = y;
  y.left = T2;
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
  return x;
}

// Left rotation for balancing.
function leftRotate(x) {
  let y = x.right;
  let T2 = y.left;
  y.left = x;
  x.right = T2;
  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
  return y;
}

/**
 * avlInsert - Inserts a value into the AVL tree with balancing.
 * Returns the new root after insertion.
 *
 * @param {AVLNode} root - Current AVL tree root.
 * @param {number} value - Value to insert.
 * @returns {AVLNode} New tree root.
 */
function avlInsert(root, value) {
  if (!root) return new AVLNode(value);
  if (value < root.value) {
    root.left = avlInsert(root.left, value);
  } else {
    root.right = avlInsert(root.right, value);
  }
  // Update height of this node.
  root.height = 1 + Math.max(getHeight(root.left), getHeight(root.right));
  // Get balance factor.
  const balance = getBalance(root);
  // Left Left Case.
  if (balance > 1 && value < root.left.value) return rightRotate(root);
  // Right Right Case.
  if (balance < -1 && value > root.right.value) return leftRotate(root);
  // Left Right Case.
  if (balance > 1 && value > root.left.value) {
    root.left = leftRotate(root.left);
    return rightRotate(root);
  }
  // Right Left Case.
  if (balance < -1 && value < root.right.value) {
    root.right = rightRotate(root.right);
    return leftRotate(root);
  }
  return root;
}

/**
 * assignPositions - Recursively assigns x,y coordinates for visualization.
 * Positions start at (300, 50) with an initial gap (e.g., 120) that halves each level.
 *
 * @param {AVLNode} node - Current node.
 * @param {number} x - x coordinate for current node.
 * @param {number} y - y coordinate for current node.
 * @param {number} gap - Horizontal gap.
 */
function assignPositions(node, x, y, gap) {
  if (!node) return;
  node.x = x;
  node.y = y;
  assignPositions(node.left, x - gap, y + 80, gap / 2);
  assignPositions(node.right, x + gap, y + 80, gap / 2);
}

/**
 * buildAVLTreeSteps - Builds an AVL tree by inserting values one-by-one.
 * Each insertion snapshot records the entire tree and the value that was just inserted.
 *
 * @param {number[]} values - Array of values to insert.
 * @returns {Array} steps - Array of snapshots.
 */
function buildAVLTreeSteps(values) {
  const steps = [];
  let root = null;
  values.forEach((val) => {
    root = avlInsert(root, val);
    assignPositions(root, 300, 50, 120);
    // Record a snapshot along with the current insertion.
    steps.push({ tree: JSON.parse(JSON.stringify(root)), current: val });
  });
  return steps;
}

/* ---------- AVL Diagram Component ---------- */

/**
 * AVLDiagram Component
 * Recursively renders the AVL tree as an SVG.
 * The node that was just inserted (current) is highlighted in orange;
 * all other nodes are rendered in green.
 *
 * @param {Object} props - Contains:
 *   - tree: The current AVL tree snapshot.
 *   - current: The value that was just inserted.
 */
function AVLDiagram({ tree, current }) {
  const renderNode = (node) => {
    if (!node) return null;
    // If this node's value equals the current insertion, render it orange; else green.
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
              className="avl-edge"
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
              className="avl-edge"
            />
            {renderNode(node.right)}
          </>
        )}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={20}
          className="avl-node"
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
    <svg width="600" height="400" className="avl-svg">
      {renderNode(tree)}
    </svg>
  );
}

/* ---------- Algorithm Visualizer Component ---------- */

/**
 * AlgorithmVisualizer Component
 * Animates through each AVL tree building step.
 * Displays the AVL tree snapshot at each step, highlighting the most recently inserted node in orange.
 * Once all steps are completed, a "BST Built!" (here "AVL Tree Built!") message is shown.
 *
 * @param {Object} props - Contains:
 *   - steps: Array of AVL tree snapshots with current insertion.
 *   - speed: Visualization speed in milliseconds.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset index when steps change.
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);

  // Automatically animate through steps.
  useEffect(() => {
    if (steps.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [steps, speed]);

  const currentSnapshot = steps[currentStepIndex] || { tree: null, current: null };

  return (
    <div className="avl-visualizerContainer">
      <motion.h4
        className="avl-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex}
      </motion.h4>
      {currentSnapshot.tree ? (
        <AVLDiagram tree={currentSnapshot.tree} current={currentSnapshot.current} />
      ) : (
        <p>Building AVL Tree...</p>
      )}
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && steps.length > 0 && (
          <motion.div
            className="avl-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            AVL Tree Built!
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
    <div className="avl-editorContainer">
      <motion.h3
        className="avl-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="avl-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="avl-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * AVLTreeDetail Component
 * Main component that renders the AVL tree visualizer.
 * Users can input comma-separated values to build the AVL tree.
 * Visualization speed and mode (theory vs. practice) can be controlled.
 * The AVL tree is built and its snapshots recorded automatically on mount.
 */
function AVLTreeDetail() {
  // Default input values for AVL tree.
  const [inputValues, setInputValues] = useState("50,30,70,20,40,60,80");
  // Visualization speed (ms).
  const [speed, setSpeed] = useState(1000);
  // Mode: "theory" or "practice".
  const [mode, setMode] = useState("theory");
  // Recorded AVL tree building steps.
  const [steps, setSteps] = useState(() => {
    const values = inputValues.split(",").map(v => parseInt(v.trim(), 10));
    return buildAVLTreeSteps(values);
  });

  // Update AVL tree when input changes.
  const updateTree = () => {
    const values = inputValues.split(",").map(v => parseInt(v.trim(), 10));
    if (values.some(isNaN)) {
      alert("Invalid input. Please enter numbers separated by commas.");
      return;
    }
    setSteps(buildAVLTreeSteps(values));
  };

  // Generate random sorted values for a balanced AVL tree.
  const generateRandomValues = () => {
    const arr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 1);
    arr.sort((a, b) => a - b);
    setInputValues(arr.join(","));
    updateTree();
  };

  // Example steps text for theory mode.
  const exampleSteps = `
Step 0: Insert 50 -> AVL Tree: {50}
Step 1: Insert 30 -> AVL Tree: {50,30}
Step 2: Insert 70 -> AVL Tree: {50,30,70}
Step 3: Insert 20 -> AVL Tree: {50,30,70,20}
Step 4: Insert 40 -> AVL Tree: {50,30,70,20,40}
Step 5: Insert 60 -> AVL Tree: {50,30,70,20,40,60}
Step 6: Insert 80 -> AVL Tree: {50,30,70,20,40,60,80}
  `.trim();

  return (
    <div className="avl-pageContainer">
      <motion.h2
        className="avl-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        AVL Tree Operations Visualizer
      </motion.h2>

      {/* Input Section */}
      <div className="avl-inputContainer">
        <label className="avl-inputLabel">AVL Tree Values (comma separated):</label>
        <br />
        <input
          type="text"
          value={inputValues}
          onChange={(e) => setInputValues(e.target.value)}
          className="avl-textInput"
        />
        <br />
        <motion.button
          className="avl-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={updateTree}
        >
          Build AVL Tree
        </motion.button>
        <motion.button
          className="avl-primaryButton avl-randomButton"
          whileHover={{ scale: 1.05, rotate: -1 }}
          onClick={generateRandomValues}
        >
          Random Sorted Values
        </motion.button>
      </div>

      {/* Speed Control */}
      <div className="avl-inputContainer">
        <label className="avl-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="500"
          max="3000"
          step="250"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="avl-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="avl-dropdown"
          defaultValue={1000}
        >
          <option value={3000}>Slow</option>
          <option value={1000}>Medium</option>
          <option value={500}>Fast</option>
        </select>
      </div>

      {/* Mode Toggle */}
      <div className="avl-inputContainer avl-modeToggleContainer">
        <motion.button
          className={`avl-toggleButton ${mode === "theory" ? "avl-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory Mode
        </motion.button>
        <motion.button
          className={`avl-toggleButton ${mode === "practice" ? "avl-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
        >
          Practice Mode
        </motion.button>
      </div>

      {/* Visualization */}
      <AlgorithmVisualizer steps={steps} speed={speed} />

      {/* Theory Content */}
      {mode === "theory" ? (
        <div className="avl-theoryContainer">
          <motion.h3 className="avl-sectionHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Algorithm Theory & Pseudocode
          </motion.h3>
          <motion.p className="avl-paragraph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            An AVL tree is a self-balancing BST. After each insertion, the tree checks its balance factor and performs
            rotations if needed. During insertion, the newly inserted node is highlighted in orange, then turns green.
          </motion.p>
          <motion.pre className="avl-codeBlock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
{`class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

function getHeight(node) {
  return node ? node.height : 0;
}

function getBalance(node) {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

function rightRotate(y) {
  let x = y.left;
  let T2 = x.right;
  x.right = y;
  y.left = T2;
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
  return x;
}

function leftRotate(x) {
  let y = x.right;
  let T2 = y.left;
  y.left = x;
  x.right = T2;
  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
  return y;
}

function avlInsert(root, value) {
  if (!root) return new AVLNode(value);
  if (value < root.value) {
    root.left = avlInsert(root.left, value);
  } else {
    root.right = avlInsert(root.right, value);
  }
  root.height = 1 + Math.max(getHeight(root.left), getHeight(root.right));
  const balance = getBalance(root);
  if (balance > 1 && value < root.left.value) return rightRotate(root);
  if (balance < -1 && value > root.right.value) return leftRotate(root);
  if (balance > 1 && value > root.left.value) {
    root.left = leftRotate(root.left);
    return rightRotate(root);
  }
  if (balance < -1 && value < root.right.value) {
    root.right = rightRotate(root.right);
    return leftRotate(root);
  }
  return root;
}`}
          </motion.pre>
          <motion.h3 className="avl-sectionHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Example: AVL Tree Build Steps
          </motion.h3>
          <motion.pre className="avl-codeBlockAlt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {exampleSteps}
          </motion.pre>
          <motion.h3 className="avl-sectionHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Time Complexity
          </motion.h3>
          <motion.ul className="avl-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <li>Insertion: O(log n), where n is the number of nodes</li>
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

export default AVLTreeDetail;

