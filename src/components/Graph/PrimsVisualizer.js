// PrimsVisualizer.js
// This component visualizes Prim’s algorithm for constructing a Minimum Spanning Tree (MST)
// on a weighted graph. The algorithm starts from a given node ("A") and, at each step, adds the smallest
// edge that connects a node in the MST to a node outside it. Each step is recorded and animated.
// Computation starts automatically when the component mounts.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS file for styling.
import '../CSS/PrimsVisualizer.css';

// Default weighted graph represented as an adjacency list.
const defaultGraph = {
  A: { B: 2, C: 3 },
  B: { A: 2, C: 1, D: 4 },
  C: { A: 3, B: 1, D: 5 },
  D: { B: 4, C: 5 },
};

// Predefined positions for nodes in the SVG canvas.
const nodePositions = {
  A: { x: 300, y: 50 },
  B: { x: 200, y: 150 },
  C: { x: 400, y: 150 },
  D: { x: 300, y: 250 },
};

/**
 * solvePrimsWithSteps - Executes Prim’s algorithm on the weighted graph,
 * recording each step of the process. Each step records:
 *  - current: the candidate edge being considered (if any),
 *  - mstEdges: the list of edges included in the MST so far,
 *  - inMST: the list of nodes that are currently in the MST.
 *
 * @param {Object} graph - Weighted graph as an adjacency list.
 * @param {string} start - The starting node.
 * @returns {Object[]} steps - Array of step snapshots.
 */
function solvePrimsWithSteps(graph, start) {
  const steps = [];
  const nodes = Object.keys(graph);
  const inMST = new Set();
  const mstEdges = [];
  
  // Start from the initial node.
  inMST.add(start);
  // Record the initial state.
  steps.push({
    current: null,
    mstEdges: [...mstEdges],
    inMST: Array.from(inMST),
  });
  
  // Continue until all nodes are included.
  while (inMST.size < nodes.length) {
    let candidate = null;
    // For every node in the MST, check edges going out.
    inMST.forEach(u => {
      Object.keys(graph[u]).forEach(v => {
        if (!inMST.has(v)) {
          const weight = graph[u][v];
          if (candidate === null || weight < candidate.weight) {
            candidate = { u, v, weight };
          }
        }
      });
    });
    if (!candidate) break; // No candidate edge found.
    
    // Record state before adding the candidate.
    steps.push({
      current: candidate,
      mstEdges: [...mstEdges],
      inMST: Array.from(inMST),
    });
    // Add the candidate's endpoint to the MST and include the edge.
    inMST.add(candidate.v);
    mstEdges.push(candidate);
    // Record state after addition.
    steps.push({
      current: candidate,
      mstEdges: [...mstEdges],
      inMST: Array.from(inMST),
    });
  }
  // Record final state.
  steps.push({
    current: null,
    mstEdges: [...mstEdges],
    inMST: Array.from(inMST),
  });
  return steps;
}

/**
 * GraphDiagram Component
 * Renders the weighted graph as an SVG with nodes and edges.
 * Edge weights are displayed at the midpoints.
 *
 * @param {Object} props - Contains:
 *   - graph: the weighted graph,
 *   - current: the candidate edge being processed,
 *   - mstEdges: the list of edges in the MST,
 *   - inMST: the list of nodes in the MST.
 */
function GraphDiagram({ graph, current, mstEdges, inMST }) {
  // Compute all unique edges from the graph.
  const allEdges = [];
  Object.keys(graph).forEach(node => {
    Object.keys(graph[node]).forEach(nbr => {
      // Use alphabetical order to avoid duplicates.
      if (node < nbr) {
        allEdges.push({ from: node, to: nbr, weight: graph[node][nbr] });
      }
    });
  });
  
  return (
    <svg width="600" height="320" className="prims-svg">
      {/* Render edges */}
      {allEdges.map((edge, idx) => {
        const fromPos = nodePositions[edge.from];
        const toPos = nodePositions[edge.to];
        // Determine if the edge is in the MST.
        const inMSTEdge = mstEdges.find(e =>
          (e.u === edge.from && e.v === edge.to) || (e.u === edge.to && e.v === edge.from)
        );
        return (
          <React.Fragment key={idx}>
            <motion.line
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              className="prims-edge"  /* CSS class ensures white edges */
              style={{
                stroke: inMSTEdge ? "#e74c3c" : "#fff",
                strokeWidth: inMSTEdge ? 4 : 2,
              }}
              fill="none"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            />
            <text
              x={(fromPos.x + toPos.x) / 2}
              y={(fromPos.y + toPos.y) / 2 - 5}
              textAnchor="middle"
              fontSize="14"
              fill="#fff"
            >
              {edge.weight}
            </text>
          </React.Fragment>
        );
      })}
      {/* Render nodes */}
      {Object.keys(nodePositions).map((node) => {
        const pos = nodePositions[node];
        const isInMST = inMST.includes(node);
        // Highlight candidate endpoints if applicable.
        const isCurrent = current && (node === current.u || node === current.v || node === current);
        return (
          <motion.circle
            key={node}
            cx={pos.x}
            cy={pos.y}
            r={20}
            className="prims-node"
            fill={isCurrent ? "#FF8C00" : isInMST ? "#90EE90" : "#fefefe"}
            stroke="#444"
            strokeWidth="2"
            whileHover={{ scale: 1.2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            title={`Node ${node}`}
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
 * Animates through each step of Prim’s algorithm, displaying the graph and MST information.
 * A completion message ("Prim’s Complete!") is displayed when the algorithm finishes.
 *
 * @param {Object} props - Contains:
 *   - steps: Array of step snapshots from Prim’s algorithm.
 *   - speed: Visualization speed (in milliseconds).
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

  const currentStep = steps[currentStepIndex] || { current: null, mstEdges: [], inMST: [] };

  return (
    <div className="prims-visualizerContainer">
      <motion.h4
        className="prims-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex}
      </motion.h4>
      <GraphDiagram
        graph={defaultGraph}
        current={currentStep.current}
        mstEdges={currentStep.mstEdges}
        inMST={currentStep.inMST}
      />
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && steps.length > 0 && (
          <motion.div
            className="prims-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Prim’s Complete!
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
    <div className="prims-editorContainer">
      <motion.h3
        className="prims-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="prims-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="prims-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * PrimsVisualizer Component
 * Main component that renders the Prim’s algorithm visualizer.
 * It includes input controls for the graph (in JSON format) and visualization speed,
 * and toggles between theory and practice modes.
 * The Prim’s algorithm computation starts automatically on mount from node "A".
 */
export default function PrimsVisualizer() {
  const [graphInput, setGraphInput] = useState(JSON.stringify(defaultGraph, null, 2));
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  // Automatically run Prim’s algorithm on mount.
  useEffect(() => {
    runPrims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * runPrims - Parses the graph input and computes Prim’s algorithm steps starting from node "A".
   */
  const runPrims = () => {
    let graph;
    try {
      graph = JSON.parse(graphInput);
    } catch (e) {
      alert("Invalid graph input. Please enter valid JSON.");
      return;
    }
    const computedSteps = solvePrimsWithSteps(graph, "A");
    setSteps(computedSteps);
  };

  // Content for theory mode.
  const theoryContent = (
    <>
      <motion.h3
        className="prims-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="prims-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Prim’s algorithm builds a Minimum Spanning Tree (MST) by starting with a single node and
        repeatedly adding the smallest edge that connects a node in the MST to a node outside it.
      </motion.p>
      <motion.pre
        className="prims-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function Prim(graph, start):
  inMST = {start}
  mstEdges = []
  while inMST.size < number of nodes:
    candidate = null
    for each u in inMST:
      for each v in graph[u]:
        if v not in inMST and (candidate is null or graph[u][v] < candidate.weight):
          candidate = { u, v, weight: graph[u][v] }
    inMST.add(candidate.v)
    mstEdges.push(candidate)
  return mstEdges`}
      </motion.pre>
      <motion.h3
        className="prims-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="prims-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(V²) or O((V+E) log V) with a priority queue</li>
      </motion.ul>
    </>
  );

  return (
    <div className="prims-pageContainer">
      <motion.h2
        className="prims-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Prim’s Algorithm Visualizer
      </motion.h2>
      <div className="prims-inputContainer">
        <label className="prims-inputLabel">Graph (JSON format):</label>
        <br />
        <textarea
          rows="8"
          cols="50"
          value={graphInput}
          onChange={(e) => setGraphInput(e.target.value)}
          className="prims-textInput"
        />
        <br />
        <motion.button
          className="prims-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runPrims}
        >
          Run Prim’s
        </motion.button>
      </div>
      <div className="prims-inputContainer">
        <label className="prims-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="prims-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="prims-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="prims-inputContainer">
        <motion.button
          className={`prims-toggleButton ${mode === "theory" ? "prims-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`prims-toggleButton ${mode === "practice" ? "prims-activeToggle" : ""}`}
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
          className="prims-theoryContainer"
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





