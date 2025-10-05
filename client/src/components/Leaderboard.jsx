// src/components/Leaderboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";

function Leaderboard({ currentScore, currentPlayer }) {
  const [highScores, setHighScores] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadHighScores();
  }, []);

  useEffect(() => {
    if (currentScore > 0 && currentPlayer) {
      saveScore(currentPlayer, currentScore);
    }
  }, [currentScore, currentPlayer]);

  const loadHighScores = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/scores");

      // Keep only the latest score per player
      const uniqueScores = Object.values(
        res.data.reduce((acc, curr) => {
          acc[curr.name] = curr; // overwrite older scores with the latest
          return acc;
        }, {})
      );

      // Sort descending
      const sorted = uniqueScores.sort((a, b) => b.score - a.score);
      setHighScores(sorted);
    } catch (err) {
      console.error("❌ Failed to load scores:", err);
    }
  };

  const saveScore = async (name, score) => {
    try {
      await axios.post("http://localhost:5000/api/scores", { name, score });
      loadHighScores();
    } catch (err) {
      console.error("❌ Failed to save score:", err);
    }
  };

  const getDisplayScores = () =>
    showAll ? highScores : highScores.slice(0, 5);

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "from-yellow-400 to-yellow-500";
      case 1:
        return "from-gray-400 to-gray-500";
      case 2:
        return "from-orange-400 to-orange-500";
      default:
        return "from-blue-400 to-blue-500";
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  if (highScores.length === 0) {
    return (
      <div className="bg-white/90 rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          🏆 Leaderboard
        </h2>
        <p className="text-gray-500 mb-4">
          No scores yet. Be the first to play!
        </p>
        <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-2xl">📝</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          🏆 Leaderboard
        </h2>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {getDisplayScores().map((score, index) => (
          <div
            key={score._id || index}
            className={`flex justify-between items-center rounded-lg px-4 py-3 transition-all duration-200 ${
              currentScore === score.score && currentPlayer === score.name
                ? "ring-2 ring-yellow-400 bg-yellow-50 transform scale-105"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3 flex-1">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold bg-gradient-to-r ${getRankColor(
                  index
                )}`}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {score.name}
                  {currentScore === score.score &&
                    currentPlayer === score.name && (
                      <span className="ml-2 text-yellow-500 animate-pulse">
                        ✨
                      </span>
                    )}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(score.date)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-green-600 text-lg">
                {score.score}
              </span>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>
        ))}
      </div>

      {currentScore > 0 &&
        !highScores.some(
          (s) => s.score === currentScore && s.name === currentPlayer
        ) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              Your score: <strong>{currentScore}</strong> - Keep practicing! 🐦
            </p>
          </div>
        )}
    </div>
  );
}

export default Leaderboard;
