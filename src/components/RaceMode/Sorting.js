// RaceMode.js
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import '../CSS/racemodesorting.css'; // Import external CSS

// ---------------- Sorting Algorithm Functions ----------------

function bubbleSortSteps(arr) {
  const steps = [];
  const array = [...arr];
  steps.push([...array]);
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push([...array]);
      }
    }
  }
  return steps;
}

function mergeSortSteps(arr) {
  const steps = [];
  const array = [...arr];
  steps.push([...array]);
  function merge(arr, l, m, r) {
    let left = arr.slice(l, m + 1);
    let right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
      steps.push([...arr]);
    }
    while (i < left.length) {
      arr[k++] = left[i++];
      steps.push([...arr]);
    }
    while (j < right.length) {
      arr[k++] = right[j++];
      steps.push([...arr]);
    }
  }
  function mergeSort(arr, l, r) {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      mergeSort(arr, l, m);
      mergeSort(arr, m + 1, r);
      merge(arr, l, m, r);
    }
  }
  mergeSort(array, 0, array.length - 1);
  return steps;
}

function insertionSortSteps(arr) {
  const steps = [];
  const array = [...arr];
  steps.push([...array]);
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
      steps.push([...array]);
    }
    array[j + 1] = key;
    steps.push([...array]);
  }
  return steps;
}

function quickSortSteps(arr) {
  const steps = [];
  const array = [...arr];
  steps.push([...array]);
  function quickSortCollect(arr, low, high) {
    if (low < high) {
      const pivotIndex = partition(arr, low, high);
      quickSortCollect(arr, low, pivotIndex - 1);
      quickSortCollect(arr, pivotIndex + 1, high);
    }
  }
  function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push([...arr]);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push([...arr]);
    return i + 1;
  }
  quickSortCollect(array, 0, array.length - 1);
  return steps;
}

function selectionSortSteps(arr) {
  const steps = [];
  const array = [...arr];
  steps.push([...array]);
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      steps.push([...array]);
    }
  }
  return steps;
}

// ---------------- RaceMode Component ----------------

export default function RaceMode() {
  const [inputData, setInputData] = useState("30,10,20,40,50");
  const [speed, setSpeed] = useState(300);
  const [leaderboard, setLeaderboard] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const intervalsRef = useRef({});

  // Helper functions for best-case and worst-case performances
  const getBestCase = (name) => {
    switch (name) {
      case "Bubble Sort": return "O(n)";
      case "Merge Sort": return "O(n log n)";
      case "Insertion Sort": return "O(n)";
      case "Quick Sort": return "O(n log n)";
      case "Selection Sort": return "O(n²)";
      default: return "";
    }
  };

  const getWorstCase = (name) => {
    switch (name) {
      case "Bubble Sort": return "O(n²)";
      case "Merge Sort": return "O(n log n)";
      case "Insertion Sort": return "O(n²)";
      case "Quick Sort": return "O(n²)";
      case "Selection Sort": return "O(n²)";
      default: return "";
    }
  };

  // Initialize algorithms with snapshots
  const initializeAlgorithms = () => {
    const arr = inputData.split(",").map(num => parseInt(num.trim(), 10));
    if (arr.some(isNaN)) {
      alert("Invalid input. Please enter numbers separated by commas.");
      return;
    }
    const newAlgorithms = [
      { name: "Bubble Sort", steps: bubbleSortSteps(arr), currentStep: 0, executionTime: 0, finished: false },
      { name: "Merge Sort", steps: mergeSortSteps(arr), currentStep: 0, executionTime: 0, finished: false },
      { name: "Insertion Sort", steps: insertionSortSteps(arr), currentStep: 0, executionTime: 0, finished: false },
      { name: "Quick Sort", steps: quickSortSteps(arr), currentStep: 0, executionTime: 0, finished: false },
      { name: "Selection Sort", steps: selectionSortSteps(arr), currentStep: 0, executionTime: 0, finished: false },
    ];
    setAlgorithms(newAlgorithms);
    setLeaderboard([]);
  };

  // Automatically start the race on mount
  useEffect(() => {
    startRace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRace = () => {
    initializeAlgorithms();
  };

  // Start simulation for each algorithm
  useEffect(() => {
    if (algorithms.length === 0) return;
    // Clear any previous intervals
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

  // Update leaderboard once all algorithms finish
  useEffect(() => {
    if (algorithms.length > 0 && algorithms.every(algo => algo.finished)) {
      const sorted = [...algorithms].sort((a, b) => a.executionTime - b.executionTime);
      setLeaderboard(sorted);
    }
  }, [algorithms]);

  // Render each algorithm panel
  const renderAlgorithmPanel = (algo, index) => {
    const currentArray = algo.steps[algo.currentStep] || [];
    const progressPercent = Math.floor((algo.currentStep / (algo.steps.length - 1)) * 100);
    return (
      <div key={index} className="algorithmPanel">
        <h3 className="algoTitle">{algo.name}</h3>
        <progress value={progressPercent} max="100" className="progressBar"></progress>
        <p>{progressPercent}% completed</p>
        <div className="arrayContainer">
          {currentArray.map((value, idx) => (
            <motion.div
              key={idx}
              className="arrayBar"
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
    <div className="myComponent">
      <div className="pageContainer">
        <h2 className="pageHeader">Algorithm Race Mode</h2>
        
        {/* Controls Section */}
        <div className="inputSection">
          <label className="label">Input Array (comma separated):</label>
          <input
            type="text"
            value={inputData}
            onChange={e => setInputData(e.target.value)}
            className="input"
          />
          <div className="buttonGroup">
            <button onClick={startRace} className="button">Restart Race</button>
          </div>
          <div className="sliderContainer">
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
        
        {/* Race Panels */}
        <div className="racePanels">
          {algorithms.map((algo, index) => renderAlgorithmPanel(algo, index))}
        </div>
        
        {/* Leaderboard */}
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
    </div>
  );
}
