// DFSVisualizer.js
// This component visualizes the Depth-First Search (DFS) algorithm on a graph.
// The graph is represented as an adjacency list with predefined node positions.
// DFS records each step (current node, visited nodes, and the stack), and the computation
// starts automatically when the component mounts (starting from node "A").

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../CSS/DFSVisualizer.css';

// Default graph represented as an adjacency list.
const defaultGraph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

// Predefined positions for nodes in the SVG canvas.
const nodePositions = {
  A: { x: 300, y: 50 },
  B: { x: 200, y: 150 },
  C: { x: 400, y: 150 },
  D: { x: 150, y: 250 },
  E: { x: 250, y: 250 },
  F: { x: 400, y: 250 },
};

/**
 * solveDFSWithSteps - Runs the DFS algorithm starting from a given node,
 * recording each step of the process.
 *
 * @param {Object} graph - The graph as an adjacency list.
 * @param {string} start - The starting node.
 * @returns {Object[]} steps - An array of snapshot steps.
 */
function solveDFSWithSteps(graph, start) {
  const steps = [];
  const stack = [start];
  const visited = new Set();

  while (stack.length) {
    const node = stack.pop();
    // Record the current step.
    steps.push({
      current: node,
      visited: Array.from(visited),
      stack: [...stack]
    });
    if (!visited.has(node)) {
      visited.add(node);
      // To preserve the order, add neighbors in reverse order.
      const neighbors = graph[node] || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor) && !stack.includes(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
  // Final step: all nodes visited.
  steps.push({
    current: null,
    visited: Array.from(visited),
    stack: []
  });
  return steps;
}

/**
 * GraphDiagram Component
 * Renders the graph's nodes and edges using an SVG.
 *
 * @param {Object} props - Contains:
 *   - graph: the graph data,
 *   - current: the current node being processed,
 *   - visited: an array of visited nodes.
 */
function GraphDiagram({ graph, current, visited }) {
  // Compute unique edges (avoid duplicates by comparing node labels).
  const edges = [];
  Object.keys(graph).forEach((node) => {
    (graph[node] || []).forEach((nbr) => {
      if (node < nbr) {
        edges.push({ from: node, to: nbr });
      }
    });
  });

  return (
    <svg width="600" height="320" className="dfs-svg">
      {/* Draw edges */}
      {edges.map((edge, idx) => {
        const fromPos = nodePositions[edge.from];
        const toPos = nodePositions[edge.to];
        return (
          <motion.line
            key={idx}
            x1={fromPos.x}
            y1={fromPos.y}
            x2={toPos.x}
            y2={toPos.y}
            className="dfs-edge"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
          />
        );
      })}
      {/* Draw nodes */}
      {Object.keys(nodePositions).map((node) => {
        const pos = nodePositions[node];
        const isVisited = visited.includes(node);
        const isCurrent = node === current;
        return (
          <motion.circle
            key={node}
            cx={pos.x}
            cy={pos.y}
            r={20}
            className="dfs-node"
            fill={isCurrent ? "#6A5ACD" : isVisited ? "#87CEFA" : "#fefefe"}
            stroke="#444"
            strokeWidth="2"
            whileHover={{ scale: 1.2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            title={`Node ${node}`}
          />
        );
      })}
      {/* Draw node labels */}
      {Object.keys(nodePositions).map((node) => {
        const pos = nodePositions[node];
        return (
          <text
            key={`label-${node}`}
            x={pos.x}
            y={pos.y + 5}
            textAnchor="middle"
            fontSize="16"
            fill="#444"
          >
            {node}
          </text>
        );
      })}
    </svg>
  );
}

/**
 * StackVisualization Component
 * Displays the current DFS stack as a series of circular elements.
 *
 * @param {Object} props - Contains:
 *   - stack: an array of nodes in the DFS stack.
 */
function StackVisualization({ stack }) {
  return (
    <div className="dfs-stackContainer">
      <span className="dfs-stackLabel">Stack:</span>
      {stack.map((node, idx) => (
        <motion.div
          key={idx}
          className="dfs-stackNode"
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
        >
          {node}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each DFS step, displaying the graph and the current stack.
 * A completion message is shown inside the visualization box once DFS finishes.
 *
 * @param {Object} props - Contains:
 *   - steps: array of DFS step snapshots,
 *   - speed: visualization speed (in ms).
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset step index when steps change.
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

  const currentStep = steps[currentStepIndex] || { current: null, visited: [], stack: [] };

  return (
    <div className="dfs-visualizerContainer">
      <motion.h4
        className="dfs-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex} – {currentStep.current ? `Processing ${currentStep.current}` : "Finished"}
      </motion.h4>
      <GraphDiagram graph={defaultGraph} current={currentStep.current} visited={currentStep.visited} />
      <StackVisualization stack={currentStep.stack} />
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && steps.length > 0 && (
          <motion.div
            className="dfs-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            DFS Complete!
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
    <div className="dfs-editorContainer">
      <motion.h3
        className="dfs-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="dfs-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="dfs-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * DFSVisualizer Component
 * Main component that renders the DFS visualizer, including input controls,
 * visualization speed control, and mode toggling (theory vs. practice).
 * The DFS computation starts automatically on mount (from node "A").
 */
export default function DFSVisualizer() {
  const [graphInput, setGraphInput] = useState(JSON.stringify(defaultGraph, null, 2));
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  // Automatically run DFS on mount.
  useEffect(() => {
    runDFS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * runDFS - Parses the graph input and computes DFS steps starting from node "A".
   */
  const runDFS = () => {
    let graph;
    try {
      graph = JSON.parse(graphInput);
    } catch (e) {
      alert("Invalid graph input. Please enter valid JSON.");
      return;
    }
    const computedSteps = solveDFSWithSteps(graph, "A");
    setSteps(computedSteps);
  };

  // Content for theory mode.
  const theoryContent = (
    <>
      <motion.h3
        className="dfs-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="dfs-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Depth-first search (DFS) explores a graph by going as deep as possible before backtracking.
        It uses a stack (or recursion) to visit nodes and records the order in which nodes are visited.
      </motion.p>
      <motion.pre
        className="dfs-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function DFS(graph, start):
  stack = [start]
  visited = new Set()
  while stack is not empty:
    node = stack.pop()
    if node not in visited:
      visited.add(node)
      for neighbor in reverse(graph[node]):
        if neighbor not in visited:
          stack.push(neighbor)
  return visited`}
      </motion.pre>
      <motion.h3
        className="dfs-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="dfs-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(V + E), where V is the number of vertices and E is the number of edges.</li>
      </motion.ul>
    </>
  );

  return (
    <div className="dfs-pageContainer">
      <motion.h2
        className="dfs-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        DFS Visualizer
      </motion.h2>
      <div className="dfs-inputContainer">
        <label className="dfs-inputLabel">Graph (JSON format):</label>
        <br />
        <textarea
          rows="8"
          cols="50"
          value={graphInput}
          onChange={(e) => setGraphInput(e.target.value)}
          className="dfs-textInput"
        />
        <br />
        <motion.button
          className="dfs-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runDFS}
        >
          Run DFS from Node A
        </motion.button>
      </div>
      <div className="dfs-inputContainer">
        <label className="dfs-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="dfs-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="dfs-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="dfs-inputContainer">
        <motion.button
          className={`dfs-toggleButton ${mode === "theory" ? "dfs-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`dfs-toggleButton ${mode === "practice" ? "dfs-activeToggle" : ""}`}
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
          className="dfs-theoryContainer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {theoryContent}
        </motion.div>
      ) : (
        <MyCompilerEditor />
      )}
    </div>
  );
}
