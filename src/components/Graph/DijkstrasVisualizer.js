// DijkstrasVisualizer.js
// This component visualizes Dijkstra's algorithm on a weighted graph.
// The algorithm computes the shortest paths from a start node to all other nodes.
// Each step (current node, distance map, visited and unvisited nodes) is recorded and animated.
// The computation starts automatically on mount from node "A".

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS file for styling.
import '../CSS/DijkstrasVisualizer.css';

// Default weighted graph represented as an adjacency list.
const defaultGraph = {
  A: { B: 2, C: 4 },
  B: { A: 2, C: 1, D: 7 },
  C: { A: 4, B: 1, D: 3 },
  D: { B: 7, C: 3 }
};

// Predefined positions for nodes in the SVG canvas.
const nodePositions = {
  A: { x: 300, y: 50 },
  B: { x: 200, y: 150 },
  C: { x: 400, y: 150 },
  D: { x: 300, y: 250 }
};

/**
 * solveDijkstrasWithSteps - Implements Dijkstra's algorithm for a weighted graph,
 * recording each step (current node being processed, current distance map, visited and unvisited nodes).
 *
 * @param {Object} graph - The weighted graph.
 * @param {string} start - The starting node.
 * @returns {Object[]} steps - Array of step snapshots.
 */
function solveDijkstrasWithSteps(graph, start) {
  const steps = [];
  const dist = {};
  const visited = new Set();
  const unvisited = new Set(Object.keys(graph));

  // Initialize distances.
  Object.keys(graph).forEach((node) => {
    dist[node] = Infinity;
  });
  dist[start] = 0;

  while (unvisited.size > 0) {
    // Select the unvisited node with the smallest distance.
    let current = null;
    unvisited.forEach((node) => {
      if (current === null || dist[node] < dist[current]) {
        current = node;
      }
    });
    if (dist[current] === Infinity) break; // Unreachable nodes remain.

    // Record current step.
    steps.push({
      current,
      dist: { ...dist },
      visited: Array.from(visited),
      unvisited: Array.from(unvisited),
    });

    unvisited.delete(current);
    visited.add(current);

    // Update distances for neighbors.
    const neighbors = graph[current] || {};
    Object.keys(neighbors).forEach((nbr) => {
      const alt = dist[current] + neighbors[nbr];
      if (alt < dist[nbr]) {
        dist[nbr] = alt;
      }
    });
  }

  // Record final state.
  steps.push({
    current: null,
    dist: { ...dist },
    visited: Array.from(visited),
    unvisited: [],
  });
  return steps;
}

/**
 * GraphDiagram Component
 * Renders the weighted graph as an SVG with nodes and edges.
 * Edge weights are displayed at the midpoints of edges.
 *
 * @param {Object} props - Contains:
 *   - graph: the weighted graph,
 *   - current: the current node being processed,
 *   - dist: the current distance map,
 *   - visited: an array of visited nodes.
 */
function GraphDiagram({ graph, current, dist, visited }) {
  // Build unique edges (avoid duplicates using alphabetical order).
  const edges = [];
  Object.keys(graph).forEach((node) => {
    Object.keys(graph[node]).forEach((nbr) => {
      if (node < nbr) {
        edges.push({ from: node, to: nbr, weight: graph[node][nbr] });
      }
    });
  });

  return (
    <svg width="600" height="320" className="dijk-svg">
      {/* Render weighted edges */}
      {edges.map((edge, idx) => {
        const fromPos = nodePositions[edge.from];
        const toPos = nodePositions[edge.to];
        // Calculate midpoint for the weight label.
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        return (
          <React.Fragment key={idx}>
            <motion.line
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              className="dijk-edge" // CSS class sets stroke to white.
              fill="none"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            />
            <text x={midX} y={midY - 5} textAnchor="middle" fontSize="14" fill="#fff">
              {edge.weight}
            </text>
          </React.Fragment>
        );
      })}
      {/* Render nodes */}
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
            className="dijk-node"
            fill={isCurrent ? "#FF8C00" : isVisited ? "#90EE90" : "#fefefe"}
            stroke="#444"
            strokeWidth="2"
            whileHover={{ scale: 1.2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            title={`Node ${node} (d = ${dist[node] === Infinity ? "∞" : dist[node]})`}
            layout
          />
        );
      })}
      {/* Render node labels */}
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
 * AlgorithmVisualizer Component
 * Animates through each step of Dijkstra's algorithm, displaying the graph and distance information.
 * A completion message ("Dijkstra’s Complete!") is shown when the algorithm finishes.
 *
 * @param {Object} props - Contains:
 *   - steps: array of Dijkstra's step snapshots,
 *   - speed: visualization speed in milliseconds.
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
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [steps, speed]);

  const currentStep = steps[currentStepIndex] || { current: null, dist: {}, visited: [], unvisited: [] };

  return (
    <div className="dijk-visualizerContainer">
      <motion.h4
        className="dijk-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex} – {currentStep.current ? `Processing ${currentStep.current}` : "Finished"}
      </motion.h4>
      <GraphDiagram graph={defaultGraph} current={currentStep.current} dist={currentStep.dist} visited={currentStep.visited} />
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && steps.length > 0 && (
          <motion.div
            className="dijk-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Dijkstra’s Complete!
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
    <div className="dijk-editorContainer">
      <motion.h3
        className="dijk-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="dijk-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="dijk-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * DijkstrasVisualizer Component
 * Main component that renders the Dijkstra’s algorithm visualizer.
 * It includes input controls for the graph (in JSON format) and visualization speed,
 * and toggles between theory and practice modes.
 * The Dijkstra’s computation starts automatically on mount from the default start node "A".
 */
export default function DijkstrasVisualizer() {
  const [graphInput, setGraphInput] = useState(JSON.stringify(defaultGraph, null, 2));
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  // Automatically run Dijkstra's algorithm on mount.
  useEffect(() => {
    runDijkstras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * runDijkstras - Parses the graph input and computes Dijkstra's steps starting from node "A".
   */
  const runDijkstras = () => {
    let graph;
    try {
      graph = JSON.parse(graphInput);
    } catch (e) {
      alert("Invalid graph input. Please enter valid JSON.");
      return;
    }
    const computedSteps = solveDijkstrasWithSteps(graph, "A");
    setSteps(computedSteps);
  };

  // Content for theory mode.
  const theoryContent = (
    <>
      <motion.h3
        className="dijk-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="dijk-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Dijkstra’s algorithm finds the shortest paths from a source node to all other nodes in a weighted graph.
        It initializes distances, then repeatedly selects the unvisited node with the smallest distance,
        updates its neighbors, and marks it as visited.
      </motion.p>
      <motion.pre
        className="dijk-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function Dijkstra(graph, start):
  for each node in graph:
    dist[node] = Infinity
  dist[start] = 0
  visited = new Set()
  while there are unvisited nodes:
    u = unvisited node with smallest dist[u]
    mark u as visited
    for each neighbor v of u:
      alt = dist[u] + weight(u, v)
      if alt < dist[v]:
        dist[v] = alt
  return dist`}
      </motion.pre>
      <motion.h3
        className="dijk-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="dijk-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(V²) or O((V+E) log V) with a priority queue.</li>
      </motion.ul>
    </>
  );

  return (
    <div className="dijk-pageContainer">
      <motion.h2
        className="dijk-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Dijkstra’s Algorithm Visualizer
      </motion.h2>
      <div className="dijk-inputContainer">
        <label className="dijk-inputLabel">Graph (JSON format):</label>
        <br />
        <textarea
          rows="8"
          cols="50"
          value={graphInput}
          onChange={(e) => setGraphInput(e.target.value)}
          className="dijk-textInput"
        />
        <br />
        <motion.button
          className="dijk-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runDijkstras}
        >
          Run Dijkstra’s from Node A
        </motion.button>
      </div>
      <div className="dijk-inputContainer">
        <label className="dijk-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="dijk-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="dijk-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="dijk-inputContainer">
        <motion.button
          className={`dijk-toggleButton ${mode === "theory" ? "dijk-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`dijk-toggleButton ${mode === "practice" ? "dijk-activeToggle" : ""}`}
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
          className="dijk-theoryContainer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {theoryContent}
        </motion.div>
      ) : (
        <MyCompilerEditor />
      )}
      <style>{`
        @media (max-width: 768px) {
          svg {
            width: 100% !important;
            height: auto !important;
          }
          input[type="number"], textarea {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}





