// TreeTraversalDetail.js
// This component visualizes a pre‑order traversal of a binary tree.
// The traversal steps are computed automatically on mount.
// The tree is rendered as an SVG with white edges on a black background.
// Toggle buttons for Theory/Practice mode are centered.
// Detailed comments and a separate CSS file ensure clarity and responsiveness.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS file for styling.
import '../CSS/TreeTraversalDetail.css';

// Default binary tree with positions for SVG rendering.
const defaultTree = {
  value: 'A',
  x: 300, y: 50,
  left: {
    value: 'B',
    x: 150, y: 150,
    left: { value: 'D', x: 75, y: 250 },
    right: { value: 'E', x: 225, y: 250 }
  },
  right: {
    value: 'C',
    x: 450, y: 150,
    left: { value: 'F', x: 375, y: 250 },
    right: { value: 'G', x: 525, y: 250 }
  }
};

/**
 * preOrderTraversalWithSteps - Performs a pre‑order traversal on the binary tree,
 * recording each step with the current node and the list of visited nodes.
 *
 * @param {Object} node - The current tree node.
 * @param {Array} visited - Array to record visited nodes.
 * @param {Array} steps - Array to record each traversal step.
 * @returns {Array} steps - The recorded traversal steps.
 */
function preOrderTraversalWithSteps(node, visited = [], steps = []) {
  if (!node) return;
  visited.push(node.value);
  steps.push({ current: node.value, visited: [...visited] });
  preOrderTraversalWithSteps(node.left, visited, steps);
  preOrderTraversalWithSteps(node.right, visited, steps);
  return steps;
}

/**
 * TreeDiagram Component
 * Renders the binary tree as an SVG.
 * White edges connect parent and child nodes. The background is set to black.
 *
 * @param {Object} props - Contains:
 *   - tree: the binary tree to render,
 *   - current: the current node value being visited,
 *   - visited: array of visited node values.
 */
function TreeDiagram({ tree, current, visited }) {
  // Recursive function to render each node and its connecting edges.
  const renderNode = (node) => {
    if (!node) return null;
    const isVisited = visited.includes(node.value);
    const isCurrent = node.value === current;
    return (
      <g key={node.value}>
        {/* Draw edge to left child */}
        {node.left && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            className="tt-edge"
          />
        )}
        {/* Draw edge to right child */}
        {node.right && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            className="tt-edge"
          />
        )}
        {/* Render current node */}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={20}
          className="tt-node"
          fill={isCurrent ? "#FF8C00" : isVisited ? "#90EE90" : "#fff"}
          stroke="#444"
          strokeWidth="2"
          whileHover={{ scale: 1.2 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          title={`Node ${node.value}`}
        />
        {/* Node label */}
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          fontSize="16"
          fill="#444"
        >
          {node.value}
        </text>
        {/* Recursively render children */}
        {renderNode(node.left)}
        {renderNode(node.right)}
      </g>
    );
  };

  return (
    <svg width="600" height="320" className="tt-svg">
      {renderNode(tree)}
    </svg>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each step of the pre‑order traversal.
 * Displays the tree and shows a "Traversal Complete!" message when finished.
 *
 * @param {Object} props - Contains:
 *   - steps: Array of traversal step snapshots.
 *   - speed: Visualization speed in milliseconds.
 *   - tree: The binary tree to render.
 */
function AlgorithmVisualizer({ steps, speed, tree }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset step index whenever steps change.
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);

  // Automatically animate through the traversal steps.
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

  const currentStep = steps[currentStepIndex] || { current: null, visited: [] };

  return (
    <div className="tt-visualizerContainer">
      <motion.h4
        className="tt-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex}
      </motion.h4>
      <TreeDiagram tree={tree} current={currentStep.current} visited={currentStep.visited} />
      {currentStep.current && (
        <p className="tt-infoText">
          Currently visiting node "{currentStep.current}"
        </p>
      )}
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && (
          <motion.div
            className="tt-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Traversal Complete!
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
    <div className="tt-editorContainer">
      <motion.h3
        className="tt-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="tt-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="tt-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * TreeTraversalDetail Component
 * Main component that renders the tree traversal visualizer.
 * It includes controls for a custom tree input (JSON format), visualization speed,
 * and mode toggling between theory and practice.
 * The pre‑order traversal computation starts automatically on mount.
 */
function TreeTraversalDetail() {
  const [treeInput, setTreeInput] = useState(JSON.stringify(defaultTree, null, 2));
  const [currentTree] = useState(defaultTree);
  const [steps, setSteps] = useState(() => preOrderTraversalWithSteps(currentTree));
  const [speed, setSpeed] = useState(1000);
  const [mode, setMode] = useState("theory");

  // Recompute traversal steps whenever the current tree changes.
  useEffect(() => {
    setSteps(preOrderTraversalWithSteps(currentTree));
  }, [currentTree]);

  // Update traversal steps when user updates tree input.
  const updateTraversal = () => {
    try {
      const newTree = JSON.parse(treeInput);
      setSteps(preOrderTraversalWithSteps(newTree));
    } catch (e) {
      alert("Invalid JSON input for tree.");
    }
  };

  // Example traversal steps for theory mode.
  const exampleSteps = `
Step 0: Visit A -> [A]
Step 1: Visit B -> [A, B]
Step 2: Visit D -> [A, B, D]
Step 3: Visit E -> [A, B, D, E]
Step 4: Visit C -> [A, B, D, E, C]
Step 5: Visit F -> [A, B, D, E, C, F]
Step 6: Visit G -> [A, B, D, E, C, F, G]
  `.trim();

  return (
    <div className="tt-pageContainer">
      <motion.h2
        className="tt-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Pre‑Order Tree Traversal Visualizer
      </motion.h2>

      {/* Tree Input Section */}
      <div className="tt-inputContainer">
        <label className="tt-inputLabel">Tree (JSON format):</label>
        <br />
        <textarea
          rows="8"
          cols="50"
          value={treeInput}
          onChange={(e) => setTreeInput(e.target.value)}
          className="tt-textArea"
        />
        <br />
        <motion.button
          className="tt-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={updateTraversal}
        >
          Update Tree
        </motion.button>
      </div>

      {/* Speed Control */}
      <div className="tt-inputContainer">
        <label className="tt-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="500"
          max="3000"
          step="250"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="tt-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="tt-dropdown"
          defaultValue={1000}
        >
          <option value={3000}>Slow</option>
          <option value={1000}>Medium</option>
          <option value={500}>Fast</option>
        </select>
      </div>

      {/* Centered Mode Toggle Buttons */}
      <div className="tt-modeToggleContainer">
        <motion.button
          className={`tt-toggleButton ${mode === "theory" ? "tt-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory Mode
        </motion.button>
        <motion.button
          className={`tt-toggleButton ${mode === "practice" ? "tt-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
        >
          Practice Mode
        </motion.button>
      </div>

      {/* Visualization */}
      <AlgorithmVisualizer steps={steps} speed={speed} tree={currentTree} />

      {/* Theory / Practice Content */}
      {mode === "theory" ? (
        <div className="tt-theoryContainer">
          <motion.h3 className="tt-sectionHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Algorithm Theory & Pseudocode
          </motion.h3>
          <motion.p className="tt-paragraph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Pre‑order traversal visits nodes in the order: Root, Left Subtree, then Right Subtree.
            For example, the expected order in this tree is A, B, D, E, C, F, G.
          </motion.p>
          <motion.pre className="tt-codeBlock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
{`function preOrder(node) {
  if (node) {
    visit(node);
    preOrder(node.left);
    preOrder(node.right);
  }
}`}
          </motion.pre>
          <motion.h3 className="tt-sectionHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Example: Pre‑order Traversal Steps
          </motion.h3>
          <motion.pre className="tt-codeBlockAlt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {exampleSteps}
          </motion.pre>
          <motion.h3 className="tt-sectionHeader"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Time Complexity
          </motion.h3>
          <motion.ul className="tt-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <li>O(n), where n is the number of nodes</li>
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
          textarea {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default TreeTraversalDetail;






