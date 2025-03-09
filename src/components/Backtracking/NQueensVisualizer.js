// NQueensVisualizer.js
// This component visualizes the N‑Queens problem using a backtracking algorithm.
// It provides controls for setting the board size, adjusting the visualization speed,
// and toggling between theory and practice modes.
// The computation starts automatically on mount, with a default board size of 4.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS file for styling.
import '../CSS/nqueensvisualizer.css';

/**
 * cloneBoard - Creates a deep copy of a 2D board.
 *
 * @param {string[][]} board - The board to clone.
 * @returns {string[][]} A deep copy of the board.
 */
function cloneBoard(board) {
  return board.map(row => row.slice());
}

/**
 * solveNQueensWithSteps - Uses backtracking to solve the N‑Queens problem,
 * recording each board state as a step.
 *
 * @param {number} n - The size of the board (n×n).
 * @returns {string[][][]} steps - An array of board snapshots.
 */
function solveNQueensWithSteps(n) {
  const steps = [];
  const board = Array.from({ length: n }, () => Array(n).fill('.'));

  /**
   * isSafe - Checks if placing a queen at (row, col) is safe.
   *
   * @param {number} row - Row index.
   * @param {number} col - Column index.
   * @returns {boolean} True if safe, false otherwise.
   */
  const isSafe = (row, col) => {
    // Check the column.
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    // Check upper left diagonal.
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    // Check upper right diagonal.
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    return true;
  };

  /**
   * backtrack - Recursively attempts to place queens row by row and records board states.
   *
   * @param {number} row - The current row index.
   * @returns {boolean} True if a solution is found, otherwise false.
   */
  const backtrack = (row) => {
    // Record current board state.
    steps.push(cloneBoard(board));
    if (row === n) return true;
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 'Q';
        // Record state after placing a queen.
        steps.push(cloneBoard(board));
        if (backtrack(row + 1)) return true;
        // Backtrack: remove the queen.
        board[row][col] = '.';
        steps.push(cloneBoard(board));
      }
    }
    return false;
  };

  backtrack(0);
  return steps;
}

/**
 * BoardDiagram Component
 * Renders the chessboard as an SVG grid and displays queens.
 *
 * @param {Object} props - Contains the board state (2D array).
 */
function BoardDiagram({ board }) {
  const n = board.length;
  const cellSize = 50;
  return (
    <svg
      width={n * cellSize}
      height={n * cellSize}
      className="nq-svg"
    >
      {board.map((row, i) =>
        row.map((cell, j) => (
          <rect
            key={`cell-${i}-${j}`}
            x={j * cellSize}
            y={i * cellSize}
            width={cellSize}
            height={cellSize}
            fill={(i + j) % 2 === 0 ? "#f0f0f0" : "#d9d9d9"}
            stroke="#999"
          />
        ))
      )}
      {board.map((row, i) =>
        row.map((cell, j) => {
          if (cell === 'Q') {
            return (
              <motion.text
                key={`queen-${i}-${j}`}
                x={j * cellSize + cellSize / 2}
                y={i * cellSize + cellSize / 1.5}
                textAnchor="middle"
                fontSize="24"
                fill="#e74c3c"
                whileHover={{ scale: 1.2 }}
              >
                Q
              </motion.text>
            );
          }
          return null;
        })
      )}
    </svg>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through the recorded board states (steps) of the N‑Queens solution.
 *
 * @param {Object} props - Contains the steps array and visualization speed.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset step index when steps change.
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);

  // Animate through steps.
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

  const currentBoard = steps[currentStepIndex] || [];
  return (
    <div className="nq-visualizerContainer">
      <motion.h4
        className="nq-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex}
      </motion.h4>
      <BoardDiagram board={currentBoard} />
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && steps.length > 0 && (
          <motion.div
            className="nq-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Solution Found!
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
    <div className="nq-editorContainer">
      <h3 className="nq-editorHeader">MyCompiler Editor (Practice Mode)</h3>
      <iframe
        src="https://www.onlinegdb.com/"
        title="MyCompiler Editor"
        className="nq-editorFrame"
      />
    </div>
  );
}

/**
 * NQueensVisualizer Component
 * Main component that renders the N‑Queens visualizer, including input controls,
 * visualization speed control, mode toggling, and theory/practice content.
 * The computation starts automatically when the component mounts.
 */
export default function NQueensVisualizer() {
  // Default board size is set to 4.
  const [boardSize, setBoardSize] = useState(4);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  // Automatically run N-Queens computation on mount.
  useEffect(() => {
    runNQueens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * runNQueens - Solves the N‑Queens problem and records the board states.
   */
  const runNQueens = () => {
    const solutionSteps = solveNQueensWithSteps(boardSize);
    setSteps(solutionSteps);
  };

  // Content for theory mode.
  const theoryContent = (
    <>
      <motion.h3
        className="nq-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="nq-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        The N‑Queens problem involves placing N queens on an N×N chessboard so that no two queens attack each other.
        A backtracking algorithm is used to place queens row by row, backtracking when conflicts occur.
      </motion.p>
      <motion.pre
        className="nq-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function solveNQueens(n):
  board = create n x n board filled with '.'
  solutions = []
  function backtrack(row):
    if row == n:
      solutions.push(copy of board)
      return
    for col from 0 to n-1:
      if isSafe(board, row, col):
        board[row][col] = 'Q'
        backtrack(row + 1)
        board[row][col] = '.'
  backtrack(0)
  return solutions`}
      </motion.pre>
      <motion.h3
        className="nq-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="nq-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>Worst-case: O(n!)</li>
        <li>Average-case: Exponential</li>
      </motion.ul>
    </>
  );

  return (
    <div className="nq-pageContainer">
      <motion.h2
        className="nq-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        N‑Queens Visualizer
      </motion.h2>
      <div className="nq-inputContainer">
        <label className="nq-inputLabel">Board Size (n):</label>
        <br />
        <input
          type="number"
          value={boardSize}
          onChange={(e) => setBoardSize(parseInt(e.target.value, 10))}
          className="nq-textInput"
          min="4"
          max="15"
        />
        <br />
        <motion.button
          className="nq-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runNQueens}
        >
          Solve N‑Queens
        </motion.button>
      </div>
      <div className="nq-inputContainer">
        <label className="nq-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="nq-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="nq-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="nq-inputContainer">
        <motion.button
          className={`nq-toggleButton ${mode === "theory" ? "nq-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`nq-toggleButton ${mode === "practice" ? "nq-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
        >
          Practice
        </motion.button>
      </div>
      {/* Always render visualization box */}
      <AnimatePresence>
        {steps.length > 0 && <AlgorithmVisualizer steps={steps} speed={speed} />}
      </AnimatePresence>
      {mode === "theory" ? (
        <motion.div
          className="nq-theoryContainer"
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









