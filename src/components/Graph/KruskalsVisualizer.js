// KruskalsVisualizer.js
// This component visualizes Kruskal’s algorithm for constructing a Minimum Spanning Tree (MST)
// from a weighted graph. The algorithm uses union–find to avoid cycles and records each step
// (candidate edge, MST edges so far, and nodes included in the MST). Computation starts automatically
// when the component mounts.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS file for styling.
import '../CSS/KruskalsVisualizer.css';

// Default weighted graph represented as an array of edges.
const defaultEdges = [
  { u: 'A', v: 'B', weight: 2 },
  { u: 'A', v: 'C', weight: 3 },
  { u: 'B', v: 'C', weight: 1 },
  { u: 'B', v: 'D', weight: 4 },
  { u: 'C', v: 'D', weight: 5 },
];

// Predefined positions for nodes in the SVG canvas.
const nodePositions = {
  A: { x: 300, y: 50 },
  B: { x: 200, y: 150 },
  C: { x: 400, y: 150 },
  D: { x: 300, y: 250 },
};

/* --- Union–Find Helper Functions --- */

/**
 * find - Finds the representative of the set that element i belongs to.
 *
 * @param {Object} parent - Parent map.
 * @param {string} i - The element.
 * @returns {string} The representative element.
 */
function find(parent, i) {
  if (parent[i] === i) return i;
  return (parent[i] = find(parent, parent[i]));
}

/**
 * union - Unions two sets represented by x and y using rank.
 *
 * @param {Object} parent - Parent map.
 * @param {Object} rank - Rank map.
 * @param {string} x - First element.
 * @param {string} y - Second element.
 */
function union(parent, rank, x, y) {
  const xroot = find(parent, x);
  const yroot = find(parent, y);
  if (rank[xroot] < rank[yroot]) {
    parent[xroot] = yroot;
  } else if (rank[xroot] > rank[yroot]) {
    parent[yroot] = xroot;
  } else {
    parent[yroot] = xroot;
    rank[xroot]++;
  }
}

/**
 * solveKruskalsWithSteps - Runs Kruskal’s algorithm on the edge list,
 * recording each step (candidate edge, MST edges so far, and nodes included in MST).
 *
 * @param {Object[]} edges - Array of weighted edges.
 * @returns {Object[]} steps - Array of snapshot steps.
 */
function solveKruskalsWithSteps(edges) {
  const steps = [];
  // Get unique nodes.
  const nodes = Array.from(new Set(edges.flatMap(e => [e.u, e.v])));
  const parent = {};
  const rank = {};
  nodes.forEach(n => {
    parent[n] = n;
    rank[n] = 0;
  });
  // Sort edges by weight.
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const mstEdges = [];

  // Record initial state.
  steps.push({
    candidate: null,
    mstEdges: [...mstEdges],
    inMST: [],
  });

  // Process each edge in sorted order.
  for (let edge of sortedEdges) {
    // Record state before processing the candidate.
    steps.push({
      candidate: edge,
      mstEdges: [...mstEdges],
      inMST: Array.from(mstEdges.flatMap(e => [e.u, e.v])),
    });
    if (find(parent, edge.u) !== find(parent, edge.v)) {
      union(parent, rank, edge.u, edge.v);
      mstEdges.push(edge);
      // Record state after adding the candidate edge.
      steps.push({
        candidate: edge,
        mstEdges: [...mstEdges],
        inMST: Array.from(mstEdges.flatMap(e => [e.u, e.v])),
      });
    }
  }
  // Final state.
  steps.push({
    candidate: null,
    mstEdges: [...mstEdges],
    inMST: Array.from(mstEdges.flatMap(e => [e.u, e.v])),
  });
  return steps;
}

/**
 * GraphDiagram Component
 * Renders the graph as an SVG, drawing all edges from the default edge list.
 * MST edges are highlighted in red, and non-MST edges are drawn in white.
 * Edge weights are displayed at the midpoints.
 *
 * @param {Object} props - Contains:
 *   - mstEdges: Array of edges included in the MST.
 *   - current: The candidate edge being processed.
 *   - inMST: Array of nodes that are currently in the MST.
 */
function GraphDiagram({ mstEdges, current, inMST }) {
  return (
    <svg width="600" height="320" className="kruskals-svg">
      {/* Draw all edges from defaultEdges */}
      {defaultEdges.map((edge, idx) => {
        const fromPos = nodePositions[edge.u];
        const toPos = nodePositions[edge.v];
        // Determine if the edge is part of the MST.
        const isInMST = mstEdges.some(
          e =>
            (e.u === edge.u && e.v === edge.v) ||
            (e.u === edge.v && e.v === edge.u)
        );
        return (
          <React.Fragment key={idx}>
            <motion.line
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              className="kruskals-edge"  /* CSS sets stroke to white for non-MST, MST edges highlighted */
              style={{
                stroke: isInMST ? "#e74c3c" : "#fff",
                strokeWidth: isInMST ? 4 : 2,
              }}
              fill="none"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            />
            <text x={(fromPos.x + toPos.x) / 2} y={(fromPos.y + toPos.y) / 2 - 5} textAnchor="middle" fontSize="14" fill="#fff">
              {edge.weight}
            </text>
          </React.Fragment>
        );
      })}
      {/* Draw nodes */}
      {Object.keys(nodePositions).map((node) => {
        const pos = nodePositions[node];
        const isInMST = inMST.includes(node);
        const isCurrent = current && (current.u === node || current.v === node || current === node);
        return (
          <motion.circle
            key={node}
            cx={pos.x}
            cy={pos.y}
            r={20}
            className="kruskals-node"
            fill={isCurrent ? "#FF8C00" : isInMST ? "#90EE90" : "#fefefe"}
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
 * AlgorithmVisualizer Component
 * Animates through each step of Kruskal’s algorithm, displaying the current candidate edge,
 * the MST edges so far, and a completion message upon finishing.
 *
 * @param {Object} props - Contains:
 *   - steps: Array of Kruskal’s algorithm step snapshots.
 *   - speed: Visualization speed in milliseconds.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset step index when steps change.
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);

  // Automatically animate through the steps.
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

  const currentStep = steps[currentStepIndex] || { candidate: null, mstEdges: [], inMST: [] };

  return (
    <div className="kruskals-visualizerContainer">
      <motion.h4
        className="kruskals-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex}
      </motion.h4>
      <GraphDiagram
        mstEdges={currentStep.mstEdges}
        current={currentStep.candidate}
        inMST={currentStep.inMST}
      />
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && steps.length > 0 && (
          <motion.div
            className="kruskals-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Kruskal’s Complete!
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
    <div className="kruskals-editorContainer">
      <motion.h3
        className="kruskals-editorHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        MyCompiler Editor (Practice Mode)
      </motion.h3>
      <motion.p
        className="kruskals-editorText"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.onlinegdb.com/"
          title="MyCompiler Editor"
          className="kruskals-editorFrame"
        />
      </motion.p>
    </div>
  );
}

/**
 * KruskalsVisualizer Component
 * Main component that renders the Kruskal’s algorithm visualizer.
 * It includes input controls for the edge list (in JSON format) and visualization speed,
 * and toggles between theory and practice modes.
 * The computation starts automatically on mount.
 */
export default function KruskalsVisualizer() {
  const [graphInput, setGraphInput] = useState(JSON.stringify(defaultEdges, null, 2));
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  // Automatically run Kruskal’s algorithm on mount.
  useEffect(() => {
    runKruskals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * runKruskals - Parses the edge list input and computes Kruskal’s algorithm steps.
   */
  const runKruskals = () => {
    let edgeList;
    try {
      edgeList = JSON.parse(graphInput);
    } catch (e) {
      alert("Invalid graph input. Please enter valid JSON.");
      return;
    }
    const computedSteps = solveKruskalsWithSteps(edgeList);
    setSteps(computedSteps);
  };

  // Content for theory mode.
  const theoryContent = (
    <>
      <motion.h3
        className="kruskals-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="kruskals-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Kruskal’s algorithm builds a Minimum Spanning Tree (MST) by sorting all edges by weight and selecting the
        smallest edge that doesn’t form a cycle (using union–find). It repeats this until all nodes are connected.
      </motion.p>
      <motion.pre
        className="kruskals-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function Kruskal(graphEdges):
  nodes = unique nodes from graphEdges
  for each node in nodes:
    parent[node] = node, rank[node] = 0
  sort graphEdges by weight
  mstEdges = []
  for edge in graphEdges:
    if find(parent, edge.u) != find(parent, edge.v):
      mstEdges.push(edge)
      union(parent, rank, edge.u, edge.v)
  return mstEdges`}
      </motion.pre>
      <motion.h3
        className="kruskals-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="kruskals-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(E log E) due to sorting the edges, plus union–find operations.</li>
      </motion.ul>
    </>
  );

  return (
    <div className="kruskals-pageContainer">
      <motion.h2
        className="kruskals-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Kruskal’s Algorithm Visualizer
      </motion.h2>
      <div className="kruskals-inputContainer">
        <label className="kruskals-inputLabel">Graph (Edge List JSON):</label>
        <br />
        <textarea
          rows="8"
          cols="50"
          value={graphInput}
          onChange={(e) => setGraphInput(e.target.value)}
          className="kruskals-textInput"
        />
        <br />
        <motion.button
          className="kruskals-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runKruskals}
        >
          Run Kruskal’s
        </motion.button>
      </div>
      <div className="kruskals-inputContainer">
        <label className="kruskals-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="kruskals-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="kruskals-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="kruskals-inputContainer">
        <motion.button
          className={`kruskals-toggleButton ${mode === "theory" ? "kruskals-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`kruskals-toggleButton ${mode === "practice" ? "kruskals-activeToggle" : ""}`}
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
          className="kruskals-theoryContainer"
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














