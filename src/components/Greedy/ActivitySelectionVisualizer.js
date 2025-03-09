// ActivitySelectionVisualizer.js
// This component visualizes the Activity Selection problem using a greedy algorithm.
// Activities are first sorted by finish time, and then selected if their start time is 
// not less than the finish time of the last selected activity. The computation starts automatically on mount.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import external CSS file for styling.
import '../CSS/activityselectionvisualizer.css';

// Default activities array.
const defaultActivities = [
  { start: 1, finish: 4 },
  { start: 3, finish: 5 },
  { start: 0, finish: 6 },
  { start: 5, finish: 7 },
  { start: 3, finish: 9 },
  { start: 5, finish: 9 },
  { start: 6, finish: 10 },
  { start: 8, finish: 11 },
  { start: 8, finish: 12 },
  { start: 2, finish: 14 },
  { start: 12, finish: 16 }
];

/**
 * buildActivitySelectionSteps
 * Processes the activities (sorted by finish time) and records a snapshot at each step.
 * Each step object contains:
 *  - candidate: the activity currently being considered (or null),
 *  - result: the list of selected activities so far,
 *  - lastFinish: the finish time of the last selected activity,
 *  - description: a string describing the current step.
 *
 * @param {Object[]} activities - Array of activities.
 * @returns {Object[]} steps - Array of snapshots.
 */
function buildActivitySelectionSteps(activities) {
  // Sort activities by finish time.
  const sorted = [...activities].sort((a, b) => a.finish - b.finish);
  const steps = [];
  let result = [];
  let lastFinish = -Infinity;
  
  // Record the initial state.
  steps.push({
    candidate: null,
    result: [...result],
    lastFinish,
    description: "No activities selected yet."
  });
  
  // Process each activity.
  for (let activity of sorted) {
    steps.push({
      candidate: activity,
      result: [...result],
      lastFinish,
      description: `Considering activity [${activity.start}, ${activity.finish}].`
    });
    if (activity.start >= lastFinish) {
      result.push(activity);
      lastFinish = activity.finish;
      steps.push({
        candidate: activity,
        result: [...result],
        lastFinish,
        description: `Selected activity [${activity.start}, ${activity.finish}].`
      });
    } else {
      steps.push({
        candidate: activity,
        result: [...result],
        lastFinish,
        description: `Rejected activity [${activity.start}, ${activity.finish}] (starts before last finish ${lastFinish}).`
      });
    }
  }
  
  // Final snapshot with the complete selection.
  steps.push({
    candidate: null,
    result: [...result],
    lastFinish,
    description: `Final selected activities: ${result.map(a => `[${a.start},${a.finish}]`).join(', ')}.`
  });
  return steps;
}

/**
 * TimelineDiagram Component
 * Renders the activities as rectangles on a horizontal timeline.
 * The timeline scales based on the maximum finish time.
 *
 * @param {Object} props - Contains:
 *   - activities: full list of activities,
 *   - result: currently selected activities,
 *   - currentCandidate: the activity being considered.
 */
function TimelineDiagram({ activities = [], result, currentCandidate }) {
  const containerWidth = 700;
  const marginLeft = 20;
  const marginRight = 20;
  const effectiveWidth = containerWidth - marginLeft - marginRight;
  const maxFinish = activities.reduce((max, act) => Math.max(max, act.finish), 0) || 1;
  const scale = effectiveWidth / maxFinish;
  const yPos = 40;
  const timelineHeight = 80;
  
  return (
    <svg width={containerWidth} height="150" className="act-svg">
      <line 
        x1={marginLeft} 
        y1={yPos + timelineHeight} 
        x2={containerWidth - marginRight} 
        y2={yPos + timelineHeight} 
        stroke="#444" 
        strokeWidth="2" 
      />
      {activities.map((act, idx) => {
        const isSelected = result.some(r => r.start === act.start && r.finish === act.finish);
        const isCurrent = currentCandidate &&
          act.start === currentCandidate.start &&
          act.finish === currentCandidate.finish;
        return (
          <motion.rect
            key={idx}
            x={act.start * scale + marginLeft}
            y={yPos}
            width={(act.finish - act.start) * scale}
            height={timelineHeight - 20}
            fill={isCurrent ? "#FF8C00" : isSelected ? "#90EE90" : "#fefefe"}
            stroke="#444"
            strokeWidth="2"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          />
        );
      })}
      {activities.map((act, idx) => {
        const midX = ((act.start + act.finish) / 2) * scale + marginLeft;
        return (
          <text
            key={`label-${idx}`}
            x={midX}
            y={yPos + timelineHeight - 5}
            textAnchor="middle"
            fontSize="14"
            fill="#333"
          >
            {`${act.start}-${act.finish}`}
          </text>
        );
      })}
    </svg>
  );
}

/**
 * AlgorithmVisualizer Component
 * Animates through each step of the activity selection process.
 * Displays the current step description and a timeline diagram.
 * Shows a completion message when the process is complete.
 *
 * @param {Object} props - Contains:
 *   - steps: array of step snapshots,
 *   - speed: visualization speed,
 *   - activities: full list of activities.
 */
function AlgorithmVisualizer({ steps, speed, activities }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  
  // Reset the step index when steps change.
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);
  
  // Animate through the steps.
  useEffect(() => {
    if (paused || steps.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [paused, speed, steps]);
  
  const currentStep = steps[currentStepIndex] || { result: [], candidate: null, lastFinish: null };
  
  return (
    <div className="act-visualizerContainer">
      <motion.h4
        className="act-stepHeader"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Step {currentStepIndex} – {currentStep.description}
      </motion.h4>
      <TimelineDiagram 
        activities={activities}
        result={currentStep.result || []}
        currentCandidate={currentStep.candidate}
      />
      <div className="act-centerText act-marginTop10">
        <button onClick={() => setPaused(!paused)} className="act-toggleButton">
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      <AnimatePresence>
        {currentStepIndex === steps.length - 1 && steps.length > 0 && (
          <motion.div
            className="act-completeMessage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Activity Selection Complete!
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
    <div className="act-editorContainer">
      <h3 className="act-editorHeader">MyCompiler Editor (Practice Mode)</h3>
      <iframe
        src="https://www.onlinegdb.com/"
        title="MyCompiler Editor"
        className="act-editorFrame"
      />
    </div>
  );
}

/**
 * ActivitySelectionVisualizer Component
 * Main component that renders the activity selection visualizer.
 * It includes input controls, visualization speed control, and mode toggling.
 * The computation starts automatically on mount.
 */
export default function ActivitySelectionVisualizer() {
  // Activities are provided in JSON format.
  const [inputActivities, setInputActivities] = useState(JSON.stringify(defaultActivities, null, 2));
  const [activities, setActivities] = useState(defaultActivities);
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState("");
  const [speed, setSpeed] = useState(500);
  const [mode, setMode] = useState("theory");

  // Automatically run the activity selection computation on mount.
  useEffect(() => {
    runActivitySelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * runActivitySelection - Parses the activity input and computes the selection steps.
   */
  const runActivitySelection = () => {
    let acts;
    try {
      acts = JSON.parse(inputActivities);
    } catch (e) {
      alert("Invalid activity input. Please enter valid JSON.");
      return;
    }
    setActivities(acts);
    const computedSteps = buildActivitySelectionSteps(acts);
    setSteps(computedSteps);
    const finalStep = computedSteps[computedSteps.length - 1];
    setMessage(`Selected activities: ${finalStep.result.map(a => `[${a.start},${a.finish}]`).join(', ')}`);
  };

  // Content for theory mode.
  const theoryContent = (
    <>
      <motion.h3
        className="act-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Algorithm Theory & Pseudocode
      </motion.h3>
      <motion.p
        className="act-paragraph"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        The Activity Selection problem is solved with a greedy algorithm. After sorting the activities by finish time,
        we iterate through them and select an activity if its start time is not less than the finish time of the last selected activity.
      </motion.p>
      <motion.pre
        className="act-codeBlock"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
{`function selectActivities(activities):
  sort activities by finish time
  result = []
  lastFinish = -∞
  for activity in activities:
    if activity.start >= lastFinish:
      result.push(activity)
      lastFinish = activity.finish
  return result`}
      </motion.pre>
      <motion.h3
        className="act-sectionHeader"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Time Complexity
      </motion.h3>
      <motion.ul
        className="act-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <li>O(n log n) due to sorting.</li>
      </motion.ul>
    </>
  );

  return (
    <div className="act-pageContainer">
      <motion.h2
        className="act-pageHeader"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        Activity Selection Visualizer
      </motion.h2>
      <div className="act-inputContainer">
        <label className="act-inputLabel">Activities (JSON format):</label>
        <br />
        <textarea
          rows="8"
          cols="50"
          value={inputActivities}
          onChange={(e) => setInputActivities(e.target.value)}
          className="act-textInput"
        />
        <br />
        <motion.button
          className="act-primaryButton"
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={runActivitySelection}
        >
          Run Activity Selection
        </motion.button>
      </div>
      <div className="act-inputContainer">
        <label className="act-inputLabel">Visualization Speed: {speed}ms</label>
        <br />
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="act-slider"
        />
        <select
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="act-dropdown"
          defaultValue={500}
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={50}>Fast</option>
        </select>
      </div>
      <div className="act-inputContainer">
        <motion.button
          className={`act-toggleButton ${mode === "theory" ? "act-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("theory")}
          disabled={mode === "theory"}
        >
          Theory
        </motion.button>
        <motion.button
          className={`act-toggleButton ${mode === "practice" ? "act-activeToggle" : ""}`}
          whileHover={{ scale: 1.1 }}
          onClick={() => setMode("practice")}
          disabled={mode === "practice"}
        >
          Practice
        </motion.button>
      </div>
      {/* Always render visualization box */}
      <AnimatePresence>
        {steps.length > 0 && <AlgorithmVisualizer steps={steps} speed={speed} activities={activities} />}
      </AnimatePresence>
      {mode === "theory" ? (
        <motion.div
          className="act-theoryContainer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {theoryContent}
        </motion.div>
      ) : (
        <MyCompilerEditor />
      )}
      {message && <p className="act-finalMessage">{message}</p>}
    </div>
  );
}
















