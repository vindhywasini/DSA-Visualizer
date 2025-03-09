// RedBlackTreeDetail.js
// This component visualizes the step‑by‑step construction of a Red‑Black Tree.
// New nodes are inserted as red and then fixed to maintain tree properties.
// Each insertion step is recorded and animated. The tree is rendered as an SVG
// with white edges connecting nodes. Computation starts automatically on mount.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS file for styling.
import '../CSS/RedBlackTreeDetail.css';

const RED = "red";
const BLACK = "black";

/* ---------- Red-Black Tree Node and Helper Functions ---------- */

// RedBlackNode class. New nodes are created as red.
class RedBlackNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.color = RED; // New nodes are red
    // Coordinates for visualization.
    this.x = 0;
    this.y = 0;
  }
}

// Left rotate subtree rooted with x.
function leftRotate(root, x) {
  let y = x.right;
  x.right = y.left;
  if (y.left !== null) {
    y.left.parent = x;
  }
  y.parent = x.parent;
  if (x.parent === null) {
    root = y;
  } else if (x === x.parent.left) {
    x.parent.left = y;
  } else {
    x.parent.right = y;
  }
  y.left = x;
  x.parent = y;
  return root;
}

// Right rotate subtree rooted with y.
function rightRotate(root, y) {
  let x = y.left;
  y.left = x.right;
  if (x.right !== null) {
    x.right.parent = y;
  }
  x.parent = y.parent;
  if (y.parent === null) {
    root = x;
  } else if (y === y.parent.left) {
    y.parent.left = x;
  } else {
    y.parent.right = x;
  }
  x.right = y;
  y.parent = x;
  return root;
}

// Fix-up the tree after insertion to maintain red-black properties.
function fixInsert(root, z) {
  while (z.parent && z.parent.color === RED) {
    if (z.parent === z.parent.parent.left) {
      let y = z.parent.parent.right;
      if (y && y.color === RED) {
        z.parent.color = BLACK;
        y.color = BLACK;
        z.parent.parent.color = RED;
        z = z.parent.parent;
      } else {
        if (z === z.parent.right) {
          z = z.parent;
          root = leftRotate(root, z);
        }
        z.parent.color = BLACK;
        z.parent.parent.color = RED;
        root = rightRotate(root, z.parent.parent);
      }
    } else {
      let y = z.parent.parent.left;
      if (y && y.color === RED) {
        z.parent.color = BLACK;
        y.color = BLACK;
        z.parent.parent.color = RED;
        z = z.parent.parent;
      } else {
        if (z === z.parent.left) {
          z = z.parent;
          root = rightRotate(root, z);
        }
        z.parent.color = BLACK;
        z.parent.parent.color = RED;
        root = leftRotate(root, z.parent.parent);
      }
    }
  }
  root.color = BLACK;
  return root;
}

/**
 * redBlackInsert - Inserts a value into the Red-Black Tree and fixes up the tree.
 *
 * @param {RedBlackNode} root - Current tree root.
 * @param {number} value - Value to insert.
 * @returns {RedBlackNode} New tree root.
 */
function redBlackInsert(root, value) {
  let z = new RedBlackNode(value);
  let y = null;
  let x = root;
  while (x !== null) {
    y = x;
    if (z.value < x.value) {
      x = x.left;
    } else {
      x = x.right;
    }
  }
  z.parent = y;
  if (y === null) {
    root = z;
  } else if (z.value < y.value) {
    y.left = z;
  } else {
    y.right = z;
  }
  root = fixInsert(root, z);
  return root;
}

/**
 * assignPositions - Recursively assigns (x,y) positions for visualization.
 * Starts at (300, 50) with an initial horizontal gap (e.g., 120) that halves at each level.
 *
 * @param {RedBlackNode} node - Current node.
 * @param {number} x - x coordinate.
 * @param {number} y - y coordinate.
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
 * cloneTree - Deep clones the Red-Black tree while omitting circular references (i.e. the parent field).
 *
 * @param {RedBlackNode} root - The tree root to clone.
 * @returns {Object} Cloned tree object.
 */
function cloneTree(root) {
  return JSON.parse(JSON.stringify(root, (key, value) => {
    if (key === "parent") return undefined;
    return value;
  }));
}

/**
 * buildRedBlackTreeSteps - Builds the Red-Black tree by inserting values one by one,
 * recording each snapshot.
 *
 * @param {number[]} values - Array of values to insert.
 * @returns {Array} steps - Array of tree snapshots.
 */
function buildRedBlackTreeSteps(values) {
  const steps = [];
  let root = null;
  values.forEach((val) => {
    root = redBlackInsert(root, val);
    assignPositions(root, 300, 50, 120);
    // Use custom cloneTree to deep clone without circular references.
    steps.push(cloneTree(root));
  });
  return steps;
}

/* ---------- Red-Black Diagram Component ---------- */

/**
 * RedBlackDiagram Component
 * Renders the Red-Black Tree as an SVG.
 * Nodes are rendered as circles with fill colors based on their color property (red or black).
 * White edges connect parent and child nodes.
 *
 * @param {Object} props - Contains:
 *   - tree: The current Red-Black tree snapshot.
 */
function RedBlackDiagram({ tree }) {
  const edgeStyle = {
    stroke: "#fff", // White edges for high contrast.
    strokeWidth: 2,
  };

  const renderNode = (node) => {
    if (!node) return null;
    return (
      <g key={node.value}>
        {node.left && (
          <>
            <line
              x1={node.x}
              y1={node.y}
              x2={node.left.x}
              y2={node.left.y}
              style={edgeStyle}
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
              style={edgeStyle}
            />
            {renderNode(node.right)}
          </>
        )}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={20}
          className="rbt-node"
          fill={node.color === RED ? "#e74c3c" : "#3498db"}
          stroke="#444"
          strokeWidth="2"
          whileHover={{ scale: 1.2 }}
          title={`Node ${node.value} (${node.color})`}
          layout
        />
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          fontSize="16"
          fill="#fff"
        >
          {node.value}
        </text>
      </g>
    );
  };

  return (
    <svg width="600" height="400" className="rbt-svg">
      {renderNode(tree)}
    </svg>
  );
}

/* ---------- Algorithm Visualizer Component ---------- */

/**
 * AlgorithmVisualizer Component
 * Animates through the recorded Red-Black tree building steps.
 * Once all steps are completed, a "Red-Black Tree Built!" message is displayed.
 *
 * @param {Object} props - Contains:
 *   - steps: Array of Red-Black tree snapshots.
 *   - speed: Visualization speed (in milliseconds).
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset step index when steps update.
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

  const currentTree = steps[currentStepIndex] || null;

  return (
    <div className="rbt-visualizerContainer">
      <motion.h4
        className="rbt-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex}
      </motion.h4>
      {currentTree ? (
        <RedBlackDiagram tree={currentTree} />
      ) : (
        <p>Building Red-Black Tree...</p>
      )}
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && steps.length > 0 && (
          <motion.div
            className="rbt-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Red-Black Tree Built!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Dummy MyCompilerEditor Component ---------- */

/**
 * MyCompilerEditor Component
 * Dummy component for Practice Mode that embeds an online code editor.
 */
function MyCompilerEditor() {
  return (
    <div className="rbt-editorContainer">
      <motion.h3
        className="rbt-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="rbt-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="rbt-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/* ---------- Main RedBlackTreeDetail Component ---------- */

/**
 * RedBlackTreeDetail Component
 * Main component that renders the Red-Black Tree Visualizer.
 * Users can input comma-separated values to build the tree.
 * Visualization speed and mode (theory vs. practice) can be controlled.
 * The tree is built and its snapshots recorded automatically on mount.
 */
function RedBlackTreeDetail() {
  const [inputValues, setInputValues] = useState("50,30,70,20,40,60,80");
  const [speed, setSpeed] = useState(1000);
  const [mode, setMode] = useState("theory");
  const [steps, setSteps] = useState(() => {
    const values = inputValues.split(",").map(v => parseInt(v.trim(), 10));
    return buildRedBlackTreeSteps(values);
  });

  // Update Red-Black Tree when input changes.
  const updateTree = () => {
    const values = inputValues.split(",").map(v => parseInt(v.trim(), 10));
    if (values.some(isNaN)) {
      alert("Invalid input. Please enter numbers separated by commas.");
      return;
    }
    setSteps(buildRedBlackTreeSteps(values));
  };

  // Generate random sorted values for a balanced tree.
  const generateRandomValues = () => {
    const arr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 1);
    arr.sort((a, b) => a - b);
    setInputValues(arr.join(","));
    updateTree();
  };

  // Example steps text for theory mode.
  const exampleSteps = `
Step 0: Insert 50 (Red) -> Tree: {50 (Black)}
Step 1: Insert 30 (Red) -> Tree: {50 (Black),30 (Red)}
Step 2: Insert 70 (Red) -> Tree: {50 (Black),30 (Red),70 (Red)}
Step 3: Insert 20 (Red) -> Tree: {50 (Black),30 (Red),70 (Red),20 (Red)} -> Fixup -> ...
Final: {50 (Black),30 (Black),70 (Black),20 (Red),40 (Red),60 (Red),80 (Red)}
  `.trim();

  return (
    <div className="rbt-pageContainer">
      <motion.h2
        className="rbt-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Red-Black Tree Operations Visualizer
      </motion.h2>

      {/* Input Section */}
      <div className="rbt-inputContainer">
        <label className="rbt-inputLabel">Tree Values (comma separated):</label>
        <br />
        <input
          type="text"
          value={inputValues}
          onChange={(e) => setInputValues(e.target.value)}
          className="rbt-textInput"
        />
        <br />
        <motion.button
          className="rbt-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={updateTree}
        >
          Build Red-Black Tree
        </motion.button>
        <motion.button
          className="rbt-primaryButton rbt-randomButton"
          whileHover={{ scale: 1.05, rotate: -1 }}
          onClick={generateRandomValues}
        >
          Random Sorted Values
        </motion.button>
      </div>

      {/* Speed Control */}
      <div className="rbt-inputContainer">
        <label className="rbt-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="500"
          max="3000"
          step="250"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="rbt-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="rbt-dropdown"
          defaultValue={1000}
        >
          <option value={3000}>Slow</option>
          <option value={1000}>Medium</option>
          <option value={500}>Fast</option>
        </select>
      </div>

      {/* Mode Toggle */}
      <div className="rbt-inputContainer rbt-modeToggleContainer">
        <motion.button
          className={`rbt-toggleButton ${mode === "theory" ? "rbt-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory Mode
        </motion.button>
        <motion.button
          className={`rbt-toggleButton ${mode === "practice" ? "rbt-activeToggle" : ""}`}
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
        <div className="rbt-theoryContainer">
          <motion.h3 className="rbt-sectionHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Algorithm Theory & Pseudocode
          </motion.h3>
          <motion.p className="rbt-paragraph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            A Red-Black Tree is a self-balancing BST. New nodes are inserted as red and then fixed using rotations and color flips to maintain tree properties.
            In this visualizer, the node being inserted is highlighted in orange; once fixed, nodes are shown in blue.
          </motion.p>
          <motion.pre className="rbt-codeBlock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
{`class RedBlackNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.color = "red"; // New nodes are red.
  }
}

function insert(root, value) {
  let z = new RedBlackNode(value);
  let y = null;
  let x = root;
  while (x !== null) {
    y = x;
    if (z.value < x.value)
      x = x.left;
    else
      x = x.right;
  }
  z.parent = y;
  if (y === null) {
    root = z;
  } else if (z.value < y.value) {
    y.left = z;
  } else {
    y.right = z;
  }
  root = fixInsert(root, z);
  return root;
}

function fixInsert(root, z) {
  // Fix-up logic to maintain Red-Black properties.
  return root;
}`}
          </motion.pre>
          <motion.h3 className="rbt-sectionHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Example: Red-Black Tree Build Steps
          </motion.h3>
          <motion.pre className="rbt-codeBlockAlt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {exampleSteps}
          </motion.pre>
          <motion.h3 className="rbt-sectionHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Time Complexity
          </motion.h3>
          <motion.ul className="rbt-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <li>Insertion: O(log n) on average</li>
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

export default RedBlackTreeDetail;
