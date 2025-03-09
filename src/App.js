// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';

// Sorting Visualizers
import BubbleSortVisualizer from './components/Sorting/BubbleSortVisualizer';
import SelectionSortVisualizer from './components/Sorting/SelectionSortVisualizer';
import InsertionSortVisualizer from './components/Sorting/InsertionSortVisualizer';
import MergeSortVisualizer from './components/Sorting/MergeSortVisualizer';
import QuickSortVisualizer from './components/Sorting/QuickSortVisualizer';

// Searching Visualizers
import LinearSearchVisualizer from './components/Searching/LinearSearchVisualizer';
import BinarySearchVisualizer from './components/Searching/BinarySearchVisualizer';

// Graph Visualizers
import BFSVisualizer from './components/Graph/BFSVisualizer';
import DFSVisualizer from './components/Graph/DFSVisualizer';
import DijkstrasVisualizer from './components/Graph/DijkstrasVisualizer';
import PrimsVisualizer from './components/Graph/PrimsVisualizer';
import KruskalsVisualizer from './components/Graph/KruskalsVisualizer';

// Dynamic Programming Visualizers
import FibonacciVisualizer from './components/DP/FibonacciVisualizer';
import KnapsackVisualizer from './components/DP/KnapsackVisualizer';
import LCSVisualizer from './components/DP/LCSVisualizer';
import LISVisualizer from './components/DP/LISVisualizer';

// Greedy Visualizers
import ActivitySelectionVisualizer from './components/Greedy/ActivitySelectionVisualizer';
import HuffmanCodingVisualizer from './components/Greedy/HuffmanCodingVisualizer';

// Backtracking Visualizers
import NQueensVisualizer from './components/Backtracking/NQueensVisualizer';
import SudokuSolverVisualizer from './components/Backtracking/SudokuSolverVisualizer';

// Tree Visualizers
import TreeTraversalsVisualizer from './components/Tree/TreeTraversalsVisualizer';
import BSTOperationsVisualizer from './components/Tree/BSTOperationsVisualizer';
import RedBlackTreeDetail from './components/Tree/Red-black Tree';
import AVLTreeDetail from './components/Tree/AVL Tree';

// Mathematical Visualizers
import GCDVisualizer from './components/Math/GCDVisualizer';
import SieveVisualizer from './components/Math/SieveVisualizer';
import PrimeFactorizationVisualizer from './components/Math/PrimeFactorizationVisualizer';
import SearchRaceMode from './components/RaceMode/Searching';
import RaceMode from './components/RaceMode/Sorting';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="sticky-header">
          <div className="site-title">
            <h1>Algorithm Visualizer</h1>
          </div>
          <Navbar />
        </header>
        <main>
          <Routes>
            {/* Home Route: This ensures the Home component is displayed by default */}
            <Route path="/" element={<Home />} />

            {/* Sorting */}
            <Route path="/sorting/bubble" element={<BubbleSortVisualizer />} />
            <Route path="/sorting/selection" element={<SelectionSortVisualizer />} />
            <Route path="/sorting/insertion" element={<InsertionSortVisualizer />} />
            <Route path="/sorting/merge" element={<MergeSortVisualizer />} />
            <Route path="/sorting/quick" element={<QuickSortVisualizer />} />

            {/* Searching */}
            <Route path="/searching/linear" element={<LinearSearchVisualizer />} />
            <Route path="/searching/binary" element={<BinarySearchVisualizer />} />

            {/* Graph */}
            <Route path="/graph/bfs" element={<BFSVisualizer />} />
            <Route path="/graph/dfs" element={<DFSVisualizer />} />
            <Route path="/graph/dijkstras" element={<DijkstrasVisualizer />} />
            <Route path="/graph/prims" element={<PrimsVisualizer />} />
            <Route path="/graph/kruskals" element={<KruskalsVisualizer />} />

            {/* Dynamic Programming */}
            <Route path="/dp/fibonacci" element={<FibonacciVisualizer />} />
            <Route path="/dp/knapsack" element={<KnapsackVisualizer />} />
            <Route path="/dp/lcs" element={<LCSVisualizer />} />
            <Route path="/dp/lis" element={<LISVisualizer />} />

            {/* Greedy */}
            <Route path="/greedy/activity" element={<ActivitySelectionVisualizer />} />
            <Route path="/greedy/huffman" element={<HuffmanCodingVisualizer />} />

            {/* Backtracking */}
            <Route path="/backtracking/nqueens" element={<NQueensVisualizer />} />
            <Route path="/backtracking/sudoku" element={<SudokuSolverVisualizer />} />

            {/* Tree */}
            <Route path="/tree/traversals" element={<TreeTraversalsVisualizer />} />
            <Route path="/tree/bst" element={<BSTOperationsVisualizer />} />
            <Route path="/tree/avl" element={<RedBlackTreeDetail />} />
            <Route path="/tree/lca" element={<AVLTreeDetail/>} />

            {/* Mathematical */}
            <Route path="/math/gcd" element={<GCDVisualizer />} />
            <Route path="/math/sieve" element={<SieveVisualizer />} />
            <Route path="/math/prime" element={<PrimeFactorizationVisualizer />} />
            <Route path="/RaceMode/sorting" element={<RaceMode />} />
            <Route path="/RaceMode/searching" element={<SearchRaceMode />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;





