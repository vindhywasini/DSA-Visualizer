import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import '../CSS/racemodesearching.module.css';

// ---------------- Search Algorithm Functions ----------------

// Linear Search: For each iteration, record the current index and whether target was found.
function linearSearchSteps(arr, target) {
  const steps = [];
  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: arr, current: i, found: false });
    if (arr[i] === target) {
      steps.push({ array: arr, current: i, found: true });
      return steps;
    }
  }
  return steps;
}

// Binary Search: Assumes the array is sorted. Records the low, high, and mid indexes.
function binarySearchSteps(arr, target) {
  const steps = [];
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({ array: arr, low, high, mid, found: arr[mid] === target });
    if (arr[mid] === target) {
      break;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return steps;
}

// ---------------- SearchRaceMode Component ----------------

export default function SearchRaceMode() {
  const [inputData, setInputData] = useState("10,20,30,40,50,60,70");
  const [target, setTarget] = useState("40");
  const [speed, setSpeed] = useState(300);
  const [leaderboard, setLeaderboard] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const intervalsRef = useRef({});

  // Helper functions for best-case and worst-case performances.
  const getBestCase = (name) => {
    switch (name) {
      case "Linear Search": return "O(1)";
      case "Binary Search": return "O(1)";
      default: return "";
    }
  };

  const getWorstCase = (name) => {
    switch (name) {
      case "Linear Search": return "O(n)";
      case "Binary Search": return "O(log n)";
      default: return "";
    }
  };

  const getSortedArray = (arr) => {
    return [...arr].sort((a, b) => a - b);
  };

  // Initialize the search algorithms.
  const initializeAlgorithms = () => {
    const arr = inputData.split(",").map(num => parseInt(num.trim(), 10));
    const tgt = parseInt(target.trim(), 10);
    if (arr.some(isNaN) || isNaN(tgt)) {
      alert("Invalid input. Please enter numbers separated by commas and a valid target.");
      return;
    }
    const sortedArr = getSortedArray(arr);
    const newAlgorithms = [
      {
        name: "Linear Search",
        steps: linearSearchSteps(arr, tgt),
        currentStep: 0,
        executionTime: 0,
        finished: false,
      },
      {
        name: "Binary Search",
        steps: binarySearchSteps(sortedArr, tgt),
        currentStep: 0,
        executionTime: 0,
        finished: false,
      },
    ];
    setAlgorithms(newAlgorithms);
    setLeaderboard([]);
  };

  const startRace = () => {
    initializeAlgorithms();
  };

  // Start simulation timers for each algorithm.
  useEffect(() => {
    if (algorithms.length === 0) return;
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};

    algorithms.forEach((algo, index) => {
      const startTime = Date.now();
      intervalsRef.current[index] = setInterval(() => {
        setAlgorithms(prevAlgos => {
          const newAlgos = [...prevAlgos];
          const currentAlgo = newAlgos[index];
          if (currentAlgo.currentStep < currentAlgo.steps.length - 1) {
            currentAlgo.currentStep += 1;
          } else if (!currentAlgo.finished) {
            clearInterval(intervalsRef.current[index]);
            currentAlgo.finished = true;
            currentAlgo.executionTime = Date.now() - startTime;
          }
          return newAlgos;
        });
      }, speed);
    });
  }, [algorithms, speed]);

  // Update leaderboard once both algorithms finish.
  useEffect(() => {
    if (algorithms.length > 0 && algorithms.every(algo => algo.finished)) {
      const sorted = [...algorithms].sort((a, b) => a.executionTime - b.executionTime);
      setLeaderboard(sorted);
    }
  }, [algorithms]);

  // Automatically start the race when the component mounts.
  useEffect(() => {
    startRace();
  }, []);

  // Render each algorithm panel.
  const renderAlgorithmPanel = (algo, index) => {
    const stepData = algo.steps[algo.currentStep] || {};
    const currentArray = stepData.array || [];
    // Prevent division by zero for progress calculation.
    const progressPercent =
      algo.steps.length > 1
        ? Math.floor((algo.currentStep / (algo.steps.length - 1)) * 100)
        : 100;

    // Determine bar style based on algorithm.
    const getBarClass = (idx) => {
      if (algo.name === "Linear Search" && idx === stepData.current) {
        return stepData.found ? "arrayBar found" : "arrayBar active";
      }
      if (algo.name === "Binary Search" && idx === stepData.mid) {
        return stepData.found ? "arrayBar found" : "arrayBar active";
      }
      return "arrayBar";
    };

    return (
      <div key={index} className="algorithmPanel">
        <progress value={progressPercent} max="100" className="progressBar"></progress>
        <p>{progressPercent}% completed</p>
        <div className="arrayContainer">
          <div className="algoLabel">{algo.name}</div>
          {currentArray.map((value, idx) => (
            <motion.div
              key={idx}
              className={getBarClass(idx)}
              style={{ height: `${value * 3}px` }}
              animate={{ height: `${value * 3}px` }}
              transition={{ duration: speed / 1000 }}
            />
          ))}
        </div>
        {algo.finished && <p>Time: {algo.executionTime}ms</p>}
      </div>
    );
  };

  return (
    <div className="pageContainer">
      <h2 className="pageHeader">Search Race Mode</h2>
      <div className="controls">
        <label className="label">Input Array (comma separated):</label>
        <input
          type="text"
          value={inputData}
          onChange={e => setInputData(e.target.value)}
          className="input"
        />
        <label className="label">Target Value:</label>
        <input
          type="text"
          value={target}
          onChange={e => setTarget(e.target.value)}
          className="input"
        />
        <div className="buttonGroup">
          <button onClick={startRace} className="button">Start Race</button>
        </div>
        <div className="speedControl">
          <label className="label">Speed: {speed}ms</label>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="slider"
          />
          <select onChange={e => setSpeed(Number(e.target.value))} defaultValue={300} className="dropdown">
            <option value={600}>Slow</option>
            <option value={300}>Medium</option>
            <option value={100}>Fast</option>
          </select>
        </div>
      </div>
      
      <div className="racePanels">
        {algorithms.map((algo, index) => renderAlgorithmPanel(algo, index))}
      </div>
      
      {leaderboard.length > 0 && (
        <div className="leaderboard">
          <h3>Leaderboard</h3>
          <table className="leaderboardTable">
            <thead>
              <tr>
                <th className="tableHeader">Rank</th>
                <th className="tableHeader">Algorithm</th>
                <th className="tableHeader">Execution Time (ms)</th>
                <th className="tableHeader">Best-case</th>
                <th className="tableHeader">Worst-case</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((algo, idx) => (
                <tr key={idx}>
                  <td className="tableCell">{idx + 1}</td>
                  <td className="tableCell">{algo.name}</td>
                  <td className="tableCell">{algo.executionTime}</td>
                  <td className="tableCell">{getBestCase(algo.name)}</td>
                  <td className="tableCell">{getWorstCase(algo.name)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



