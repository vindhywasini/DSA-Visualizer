// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-menu">
        <li className="nav-item">
          <Link to="/">Home</Link>
        </li>
        <li className="nav-item">
          <span>Sorting</span>
          <ul className="dropdown">
            <li><Link to="/sorting/bubble">Bubble Sort</Link></li>
            <li><Link to="/sorting/selection">Selection Sort</Link></li>
            <li><Link to="/sorting/insertion">Insertion Sort</Link></li>
            <li><Link to="/sorting/merge">Merge Sort</Link></li>
            <li><Link to="/sorting/quick">Quick Sort</Link></li>
          </ul>
        </li>
        <li className="nav-item">
          <span>Searching</span>
          <ul className="dropdown">
            <li><Link to="/searching/linear">Linear Search</Link></li>
            <li><Link to="/searching/binary">Binary Search</Link></li>
          </ul>
        </li>
        <li className="nav-item">
          <span>Graph</span>
          <ul className="dropdown">
            <li><Link to="/graph/bfs">BFS</Link></li>
            <li><Link to="/graph/dfs">DFS</Link></li>
            <li><Link to="/graph/dijkstras">Dijkstra’s</Link></li>
            <li><Link to="/graph/prims">Prim’s</Link></li>
            <li><Link to="/graph/kruskals">Kruskal’s</Link></li>
          </ul>
        </li>
        <li className="nav-item">
          <span>Dynamic Programming</span>
          <ul className="dropdown">
            <li><Link to="/dp/fibonacci">Fibonacci</Link></li>
            <li><Link to="/dp/knapsack">Knapsack</Link></li>
            <li><Link to="/dp/lcs">LCS</Link></li>
            <li><Link to="/dp/lis">LIS</Link></li>
          </ul>
        </li>
        <li className="nav-item">
          <span>Greedy</span>
          <ul className="dropdown">
            <li><Link to="/greedy/activity">Activity Selection</Link></li>
            <li><Link to="/greedy/huffman">Huffman Coding</Link></li>
          </ul>
        </li>
        <li className="nav-item">
          <span>Backtracking</span>
          <ul className="dropdown">
            <li><Link to="/backtracking/nqueens">N-Queens</Link></li>
            <li><Link to="/backtracking/sudoku">Sudoku Solver</Link></li>
          </ul>
        </li>
        <li className="nav-item">
          <span>Tree</span>
          <ul className="dropdown">
            <li><Link to="/tree/traversals">Traversals</Link></li>
            <li><Link to="/tree/bst">BST Operations</Link></li>
            <li><Link to="/tree/avl">Red-black Tree</Link></li>
            <li><Link to="/tree/lca">AVL Tree</Link></li>
          </ul>
        </li>
        <li className="nav-item">
          <span>Mathematical</span>
          <ul className="dropdown">
            <li><Link to="/math/gcd">GCD (Euclidean)</Link></li>
            <li><Link to="/math/sieve">Sieve of Eratosthenes</Link></li>
            <li><Link to="/math/prime">Prime Factorization</Link></li>
          </ul>
        </li>
        {/* Moved Race Mode into the nav-menu */}
        <li className="nav-item">
          <span>Race Mode</span>
          <ul className="dropdown">
            <li><Link to="/RaceMode/sorting">Sorting</Link></li>
            {/* <li><Link to="/RaceMode/searching">Searching</Link></li> */}
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
