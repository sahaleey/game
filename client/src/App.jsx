import { useState, useEffect } from "react";
import NameInput from "./components/NameInput";
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import "./index.css";

function App() {
  const [currentScreen, setCurrentScreen] = useState("nameInput");
  const [playerName, setPlayerName] = useState("");
  const [gameScore, setGameScore] = useState(0);

  // Load player name from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem("flappyBirdPlayerName");
    if (savedName) {
      setPlayerName(savedName);
      setCurrentScreen("start");
    }
  }, []);

  const handleNameSubmit = (name) => {
    setPlayerName(name);
    localStorage.setItem("flappyBirdPlayerName", name);
    setCurrentScreen("start");
  };

  const handleGameStart = () => {
    setCurrentScreen("game");
  };

  const handleGameOver = (score) => {
    setGameScore(score);
    setCurrentScreen("gameOver");

    // Save score to leaderboard
    const highScores = JSON.parse(
      localStorage.getItem("flappyBirdHighScores") || "[]"
    );
    highScores.push({
      name: playerName,
      score,
      date: new Date().toISOString(),
    });

    // Sort by score descending and keep top 10
    highScores.sort((a, b) => b.score - a.score);
    const topScores = highScores.slice(0, 10);
    localStorage.setItem("flappyBirdHighScores", JSON.stringify(topScores));
  };

  const handleBackToStart = () => {
    setCurrentScreen("start");
  };

  const handleResetName = () => {
    localStorage.removeItem("flappyBirdPlayerName");
    setPlayerName("");
    setCurrentScreen("nameInput");
  };

  const handlePlayAgain = () => {
    setCurrentScreen("game");
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
      <div className="game-container w-full max-w-md h-full max-h-[800px] bg-white rounded-lg shadow-2xl overflow-hidden relative">
        {currentScreen === "nameInput" && (
          <NameInput onNameSubmit={handleNameSubmit} />
        )}

        {currentScreen === "start" && (
          <StartScreen
            playerName={playerName}
            onGameStart={handleGameStart}
            onResetName={handleResetName}
          />
        )}

        {currentScreen === "game" && (
          <Game
            playerName={playerName}
            onGameOver={handleGameOver}
            onBackToStart={handleBackToStart}
          />
        )}

        {currentScreen === "gameOver" && (
          <GameOver
            playerName={playerName}
            score={gameScore}
            onPlayAgain={handlePlayAgain}
            onMainMenu={handleBackToStart}
            onResetName={handleResetName}
          />
        )}
      </div>
    </div>
  );
}

export default App;
