// src/components/Home.js
import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h2>Welcome to Algorithm Visualizer</h2>
        <p>
          Discover and explore a variety of algorithms with interactive, step-by-step visualizations. 
          Whether you're a student, educator, or developer, our platform is designed to help you understand 
          how algorithms work under the hood.
        </p>
        <a href="/sorting/bubble" className="get-started-btn">Get Started</a>
      </section>

      <section className="features">
        <h3>Features</h3>
        <ul>
          <li><strong>Interactive Visualizations:</strong> See each algorithm in action.</li>
          <li><strong>Step-by-Step Explanations:</strong> Break down complex logic into simple steps.</li>
          <li><strong>Multiple Categories:</strong> From Sorting and Searching to Graphs and Dynamic Programming.</li>
          <li><strong>User-Friendly Interface:</strong> Easy navigation with dropdown menus and intuitive design.</li>
        </ul>
      </section>

      <section className="about">
        <h3>About This Project</h3>
        <p>
          Algorithm Visualizer is built to bridge the gap between theory and practical understanding. 
          Our goal is to make learning algorithms fun, accessible, and engaging. Explore the various 
          algorithm categories and get insights into how each one works.
        </p>
      </section>

      <footer className="footer-note">
        <p>Developed with passion to make learning algorithms fun and accessible!</p>
      </footer>
    </div>
  );
}

export default Home;
