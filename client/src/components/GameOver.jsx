import { useState, useEffect } from "react";
import Leaderboard from "./Leaderboard";

function GameOver({ playerName, score, onPlayAgain, onMainMenu, onResetName }) {
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    // Check if this is a new high score for the player
    const highScores = JSON.parse(
      localStorage.getItem("flappyBirdHighScores") || "[]"
    );
    const playerHighScore = highScores
      .filter((score) => score.name === playerName)
      .sort((a, b) => b.score - a.score)[0];

    if (playerHighScore) {
      setHighScore(playerHighScore.score);
    }

    // Check if current score is higher than previous high score
    if (!playerHighScore || score > playerHighScore.score) {
      setIsNewHighScore(true);
    } else {
      setIsNewHighScore(false);
    }

    // Save the current score to leaderboard
    saveScoreToLeaderboard();
  }, [playerName, score]);

  const saveScoreToLeaderboard = () => {
    const highScores = JSON.parse(
      localStorage.getItem("flappyBirdHighScores") || "[]"
    );

    // Add new score
    highScores.push({
      name: playerName,
      score: score,
      date: new Date().toISOString(),
    });

    // Sort by score descending and keep top 10
    highScores.sort((a, b) => b.score - a.score);
    const topScores = highScores.slice(0, 10);
    localStorage.setItem("flappyBirdHighScores", JSON.stringify(topScores));
  };

  const getScoreMessage = () => {
    if (score === 0) return "Better luck next time! 🐦";
    if (score < 5) return "Good start! Keep practicing! 🌟";
    if (score < 10) return "Great job! You're getting better! 🎯";
    if (score < 20) return "Excellent flying skills! 🚀";
    if (score < 30) return "Outstanding performance! 🌈";
    return "Legendary bird master! 🏆";
  };

  const getMedal = () => {
    if (score >= 30) return "🥇";
    if (score >= 20) return "🥈";
    if (score >= 10) return "🥉";
    if (score >= 5) return "⭐";
    return "";
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 p-4">
      {/* Animated Game Over Title */}
      <div className="text-center mb-6 animate-bounce">
        <h1 className="text-5xl font-bold text-red-500 mb-2 drop-shadow-lg">
          Game Over!
        </h1>
        {isNewHighScore && (
          <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
            🎉 New High Score! 🎉
          </div>
        )}
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md w-full mb-6 transform hover:scale-105 transition-transform duration-300">
        {/* Player Info */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-600">
              <span className="text-xl">🐦</span>
            </div>
            <div>
              <p className="text-lg text-gray-600">Player</p>
              <p className="text-2xl font-bold text-gray-800">{playerName}</p>
            </div>
          </div>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl p-6 mb-4 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
            SCORE
          </div>
          <div className="flex items-center justify-center space-x-4">
            <span className="text-6xl font-bold text-white drop-shadow-lg">
              {score}
            </span>
            {getMedal() && (
              <span className="text-4xl animate-pulse">{getMedal()}</span>
            )}
          </div>
          {highScore > 0 && (
            <p className="text-white/90 text-sm mt-2">
              Personal Best: {highScore}
            </p>
          )}
        </div>

        {/* Score Message */}
        <p className="text-lg text-gray-700 mb-2 font-medium">
          {getScoreMessage()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 w-full max-w-md mb-6">
        <button
          onClick={onPlayAgain}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
        >
          <span>🔄</span>
          <span>Play Again</span>
        </button>

        <button
          onClick={onMainMenu}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
        >
          <span>🏠</span>
          <span>Main Menu</span>
        </button>

        <button
          onClick={onResetName}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
        >
          <span>✏️</span>
          <span>Change Player</span>
        </button>
      </div>

      {/* Leaderboard */}
      <div className="w-full max-w-md">
        <Leaderboard currentScore={score} currentPlayer={playerName} />
      </div>

      {/* Quick Tips */}
      <div className="mt-6 bg-black/20 rounded-2xl p-4 max-w-md">
        <p className="text-white/80 text-sm text-center">
          💡 <strong>Tip:</strong> Time your jumps carefully and maintain a
          steady rhythm!
        </p>
      </div>
    </div>
  );
}

export default GameOver;
