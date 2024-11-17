import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"; // Import App-specific styles
import CardList from "./CardList"; // CardList component
import DetailedCard from "./DetailedCard"; // DetailedCard component (the page you want to view)

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src="/EOGlogo.png" alt="EOG Logo" className="logo" />
        </header>
        <Routes>
          <Route path="/" element={<CardList />} /> {/* Main card list view */}
          <Route path="/card/:id" element={<DetailedCard />} /> {/* Detailed card page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
