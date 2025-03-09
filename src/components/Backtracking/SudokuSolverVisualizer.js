// SudokuSolverVisualizer.js
// This component visualizes the process of solving a Sudoku puzzle using backtracking.
// It provides controls for inputting a Sudoku board (in JSON format), adjusting the visualization speed,
// and toggling between theory and practice modes.
// The solver computation starts automatically when the component mounts.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import the external CSS file for styling.
import '../CSS/sudokusolvervisualizer.css';

// Initial Sudoku board (0 indicates an empty cell)
const initialBoard = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

/**
 * cloneBoard - Creates a deep copy of a 2D board.
 *
 * @param {number[][]} board - The board to clone.
 * @returns {number[][]} A new board that is a deep copy of the original.
 */
function cloneBoard(board) {
  return board.map(row => [...row]);
}

/**
 * solveSudokuWithSteps - Solves the Sudoku puzzle using backtracking,
 * recording each board state for visualization.
 *
 * @param {number[][]} board - The initial Sudoku board.
 * @returns {number[][][]} steps - Array of board snapshots.
 */
function solveSudokuWithSteps(board) {
  const steps = [];
  const n = board.length;

  /**
   * isValid - Checks if placing num at (row, col) is valid.
   *
   * @param {number[][]} board - Current board state.
   * @param {number} row - Row index.
   * @param {number} col - Column index.
   * @param {number} num - Number to check.
   * @returns {boolean} True if valid, false otherwise.
   */
  const isValid = (board, row, col, num) => {
    for (let x = 0; x < n; x++) {
      if (board[row][x] === num || board[x][col] === num) return false;
    }
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) return false;
      }
    }
    return true;
  };

  /**
   * backtrack - Recursively fills the board and records each state.
   *
   * @param {number} row - Current row.
   * @param {number} col - Current column.
   * @returns {boolean} True if the board is solved, false otherwise.
   */
  const backtrack = (row, col) => {
    if (row === n) return true;
    if (col === n) return backtrack(row + 1, 0);
    if (board[row][col] !== 0) return backtrack(row, col + 1);

    for (let num = 1; num <= 9; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
        steps.push(cloneBoard(board)); // Record state after placement.
        if (backtrack(row, col + 1)) return true;
        board[row][col] = 0;
        steps.push(cloneBoard(board)); // Record state after backtracking.
      }
    }
    return false;
  };

  // Record initial board state.
  steps.push(cloneBoard(board));
  backtrack(0, 0);
  return steps;
}

/**
 * BoardDiagram Component
 * Renders the Sudoku board as an SVG grid with numbers.
 *
 * @param {Object} props - Contains the board state (2D array).
 */
function BoardDiagram({ board }) {
  const n = board.length;
  const cellSize = 50;
  return (
    <svg width={n * cellSize} height={n * cellSize} className="sudoku-svg">
      {/* Draw grid cells */}
      {Array.from({ length: n }).map((_, i) =>
        Array.from({ length: n }).map((_, j) => (
          <rect
            key={`cell-${i}-${j}`}
            x={j * cellSize}
            y={i * cellSize}
            width={cellSize}
            height={cellSize}
            className="sudoku-cell"
          />
        ))
      )}
      {/* Draw numbers */}
      {board.map((row, i) =>
        row.map((num, j) =>
          num !== 0 ? (
            <motion.text
              key={`num-${i}-${j}`}
              x={j * cellSize + cellSize / 2}
              y={i * cellSize + cellSize / 1.5}
              textAnchor="middle"
              fontSize="24"
              className="sudoku-number"
              whileHover={{ scale: 1.2 }}
            >
              {num}
            </motion.text>
          ) : null
        )
      )}
    </svg>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through the recorded board states of the Sudoku solving process.
 *
 * @param {Object} props - Contains the steps array and visualization speed.
 */
function AlgorithmVisualizer({ steps, speed }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Reset the step index when new steps are provided.
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
    <div className="sudoku-visualizerContainer">
      <motion.h4
        className="sudoku-stepHeader"
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
            className="sudoku-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Sudoku Solved!
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
    <div className="sudoku-editorContainer">
      <h3 className="sudoku-editorHeader">MyCompiler Editor (Practice Mode)</h3>
      <iframe
        src="https://www.onlinegdb.com/"
        title="MyCompiler Editor"
        className="sudoku-editorFrame"
      />
    </div>
  );
}

/**
 * SudokuSolverVisualizer Component
 * Main component that renders the Sudoku solver visualizer, including input controls,
 * visualization speed control, mode toggling, and theory/practice content.
 * The solver computation starts automatically when the component mounts.
 */
export default function SudokuSolverVisualizer() {
  // Use the initial board as default.
  const [boardInput, setBoardInput] = useState(JSON.stringify(initialBoard, null, 2));
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  // Automatically run the solver when the component mounts.
  useEffect(() => {
    runSudoku();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * runSudoku - Parses the board input and computes the solving steps.
   */
  const runSudoku = () => {
    let board;
    try {
      board = JSON.parse(boardInput);
    } catch (e) {
      alert("Invalid board input. Please enter valid JSON.");
      return;
    }
    const solutionSteps = solveSudokuWithSteps(board);
    setSteps(solutionSteps);
  };

  // Content for theory mode.
  const theoryContent = (
    <>
      <motion.h3
        className="sudoku-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="sudoku-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        The Sudoku solver uses backtracking to fill the board. It attempts to fill each empty cell with a number (1-9)
        that does not conflict with the current row, column, or 3×3 sub-grid. If no valid number is found, it backtracks.
      </motion.p>
      <motion.pre
        className="sudoku-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function solveSudoku(board):
  for row from 0 to 8:
    for col from 0 to 8:
      if board[row][col] is empty:
        for num from 1 to 9:
          if placing num at (row, col) is safe:
            board[row][col] = num
            if solveSudoku(board) returns true:
              return true
            board[row][col] = empty
        return false
  return true`}
      </motion.pre>
      <motion.h3
        className="sudoku-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="sudoku-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>Worst-case: O(9^(n*n))</li>
        <li>Average-case: Exponential</li>
      </motion.ul>
    </>
  );

  return (
    <div className="sudoku-pageContainer">
      <motion.h2
        className="sudoku-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Sudoku Solver Visualizer
      </motion.h2>
      <div className="sudoku-inputContainer">
        <label className="sudoku-inputLabel">Board (JSON format):</label>
        <br />
        <textarea
          rows="10"
          cols="50"
          value={boardInput}
          onChange={(e) => setBoardInput(e.target.value)}
          className="sudoku-textInput"
        />
        <br />
        <motion.button
          className="sudoku-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runSudoku}
        >
          Solve Sudoku
        </motion.button>
      </div>
      <div className="sudoku-inputContainer">
        <label className="sudoku-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="sudoku-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="sudoku-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="sudoku-inputContainer">
        <motion.button
          className={`sudoku-toggleButton ${mode === "theory" ? "sudoku-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`sudoku-toggleButton ${mode === "practice" ? "sudoku-activeToggle" : ""}`}
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
          className="sudoku-theoryContainer"
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





