// BFSVisualizer.js
// This component visualizes the Breadth-First Search (BFS) algorithm on a graph.
// The graph is represented as an adjacency list with predefined node positions.
// BFS records each step (current node, visited nodes, and the queue), and the computation
// starts automatically when the component mounts (starting from node "A").

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS file for styling.
import '../CSS/BFSVisualizer.css';

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
 * solveBFSWithSteps - Runs the BFS algorithm starting from a given node,
 * recording each step of the process.
 *
 * @param {Object} graph - The graph as an adjacency list.
 * @param {string} start - The starting node.
 * @returns {Object[]} steps - An array of snapshot steps.
 */
function solveBFSWithSteps(graph, start) {
  const steps = [];
  const queue = [start];
  const visited = new Set();

  // Process nodes until the queue is empty.
  while (queue.length) {
    const node = queue.shift();
    // Record the current step.
    steps.push({
      current: node,
      visited: Array.from(visited),
      queue: [...queue],
    });
    if (!visited.has(node)) {
      visited.add(node);
      const neighbors = graph[node] || [];
      for (let neighbor of neighbors) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
  }
  // Final step: all nodes visited.
  steps.push({
    current: null,
    visited: Array.from(visited),
    queue: [],
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
    <svg width="600" height="320" className="bfs-svg">
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
            className="bfs-edge" // CSS class defines white stroke.
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
            className="bfs-node"
            fill={isCurrent ? "#FF8C00" : isVisited ? "#90EE90" : "#fefefe"}
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
 * QueueVisualization Component
 * Displays the current BFS queue as a series of circular elements.
 *
 * @param {Object} props - Contains:
 *   - queue: an array of nodes in the BFS queue.
 */
function QueueVisualization({ queue }) {
  return (
    <div className="bfs-queueContainer">
      <span className="bfs-queueLabel">Queue:</span>
      {queue.map((node, idx) => (
        <motion.div
          key={idx}
          className="bfs-queueNode"
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
 * Animates through each BFS step, displaying the graph and the current queue.
 * A completion message is shown inside the visualization box once BFS finishes.
 *
 * @param {Object} props - Contains:
 *   - steps: array of BFS step snapshots,
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

  const currentStep = steps[currentStepIndex] || { current: null, visited: [], queue: [] };

  return (
    <div className="bfs-visualizerContainer">
      <motion.h4
        className="bfs-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex} – {currentStep.current ? `Processing ${currentStep.current}` : "Finished"}
      </motion.h4>
      <GraphDiagram graph={defaultGraph} current={currentStep.current} visited={currentStep.visited} />
      <QueueVisualization queue={currentStep.queue} />
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && steps.length > 0 && (
          <motion.div
            className="bfs-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            BFS Complete!
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
    <div className="bfs-editorContainer">
      <motion.h3
        className="bfs-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="bfs-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="bfs-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * BFSVisualizer Component
 * Main component that renders the BFS visualizer, including input controls,
 * visualization speed control, and mode toggling (theory vs. practice).
 * The BFS computation starts automatically on mount (from node "A").
 */
export default function BFSVisualizer() {
  const [graphInput, setGraphInput] = useState(JSON.stringify(defaultGraph, null, 2));
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  // Automatically run BFS on mount.
  useEffect(() => {
    runBFS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * runBFS - Parses the graph input and computes BFS steps starting from node "A".
   */
  const runBFS = () => {
    let graph;
    try {
      graph = JSON.parse(graphInput);
    } catch (e) {
      alert("Invalid graph input. Please enter valid JSON.");
      return;
    }
    const computedSteps = solveBFSWithSteps(graph, "A");
    setSteps(computedSteps);
  };

  // Content for theory mode.
  const theoryContent = (
    <>
      <motion.h3
        className="bfs-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="bfs-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Breadth-first search (BFS) explores a graph level by level, starting from a source node.
        It uses a queue to visit nodes and records the order in which nodes are discovered.
      </motion.p>
      <motion.pre
        className="bfs-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function BFS(graph, start):
  queue = [start]
  visited = new Set()
  while queue is not empty:
    node = queue.shift()
    if node not in visited:
      visited.add(node)
      for neighbor in graph[node]:
        if neighbor not in visited:
          queue.push(neighbor)
  return visited`}
      </motion.pre>
      <motion.h3
        className="bfs-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="bfs-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(V + E), where V is the number of vertices and E is the number of edges.</li>
      </motion.ul>
    </>
  );

  return (
    <div className="bfs-pageContainer">
      <motion.h2
        className="bfs-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        BFS Visualizer
      </motion.h2>
      <div className="bfs-inputContainer">
        <label className="bfs-inputLabel">Graph (JSON format):</label>
        <br />
        <textarea
          rows="8"
          cols="50"
          value={graphInput}
          onChange={(e) => setGraphInput(e.target.value)}
          className="bfs-textInput"
        />
        <br />
        <motion.button
          className="bfs-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runBFS}
        >
          Run BFS from Node A
        </motion.button>
      </div>
      <div className="bfs-inputContainer">
        <label className="bfs-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="bfs-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="bfs-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="bfs-inputContainer">
        <motion.button
          className={`bfs-toggleButton ${mode === "theory" ? "bfs-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`bfs-toggleButton ${mode === "practice" ? "bfs-activeToggle" : ""}`}
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
          className="bfs-theoryContainer"
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
















