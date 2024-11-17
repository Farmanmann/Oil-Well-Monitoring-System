import React from "react";
import "./App.css"; // Import App-specific styles
import CardList from "./CardList"; // CardList component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="/EOGlogo.png" alt="EOG Logo" className="logo" /> {/* Logo */}
      </header>
      <CardList /> {/* Card list below the logo */}
    </div>
  );
}

export default App;
