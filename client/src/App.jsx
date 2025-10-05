import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Game from "./components/FlappyBird/Game"; // Make sure this path is correct
import TicTacToe from "./components/TicTacToe/TicTacToe";
import MCQQuiz from "./components/MCQ/MCQQuiz"; // 1. Import
import FinalResults from "./components/MCQ/FinalResults";
import LeaderboardPage from "./components/LeaderboardPage";
import HomePage from "./components/HomePage"; // Make sure this path is correct

function App() {
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("flappyBirdPlayerName") || ""
  );
  const [isNameSet, setIsNameSet] = useState(
    !!localStorage.getItem("flappyBirdPlayerName")
  );

  const handleNameSubmit = (name) => {
    const trimmedName = name.trim();
    if (trimmedName) {
      setPlayerName(trimmedName);
      localStorage.setItem("flappyBirdPlayerName", trimmedName);
      setIsNameSet(true);
    }
  };

  // If the player's name hasn't been set, show an input screen.
  if (!isNameSet) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-400">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNameSubmit(playerName);
          }}
          className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-xs"
        >
          <h1 className="text-2xl font-bold mb-4">Enter Your Name</h1>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-4 text-center"
            placeholder="Player Name"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Let's Play!
          </button>
        </form>
      </div>
    );
  }

  // Once the name is set, render the main application with its routes.
  return (
    <BrowserRouter>
      {/* This div provides the full-screen background and centering for all pages */}
      <div className="w-screen h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
        <Routes>
          <Route path="/" element={<Game playerName={playerName} />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/quiz" element={<MCQQuiz />} />
          <Route path="/results" element={<FinalResults />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
