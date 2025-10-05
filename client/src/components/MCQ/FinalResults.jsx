import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FinalResults() {
  const navigate = useNavigate();
  const [scores, setScores] = useState({
    playerName: "",
    flappyScore: 0,
    ticTacToeResult: 0,
    mcqScore: 0,
    totalScore: 0,
  });

  useEffect(() => {
    // Fetch all scores and player name from localStorage
    const playerName = localStorage.getItem("flappyBirdPlayerName") || "Player";
    const flappyScore = parseInt(
      localStorage.getItem("flappyBirdFinalScore") || "0",
      10
    );
    const ticTacToeResult = parseFloat(
      localStorage.getItem("ticTacToeResult") || "0"
    );
    const mcqScore = parseInt(localStorage.getItem("mcqScore") || "0", 10);

    const ticTacToePoints = ticTacToeResult === 1 ? 10 : 0; // 10 points for a win, 0 otherwise
    const totalScore = flappyScore + ticTacToePoints + mcqScore;

    setScores({
      playerName,
      flappyScore,
      ticTacToeResult: ticTacToePoints,
      mcqScore,
      totalScore,
    });
  }, []);

  const handleRestart = () => {
    // Clear all game-related data and navigate home
    localStorage.removeItem("flappyBirdPlayCount");
    localStorage.removeItem("flappyBirdFinalScore");
    localStorage.removeItem("ticTacToeResult");
    localStorage.removeItem("mcqScore");
    navigate("/");
    window.location.reload(); // Force a refresh to reset all component states
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          🏆 Final Results 🏆
        </h1>
        <h2 className="text-2xl font-semibold mb-8">{scores.playerName}</h2>

        <div className="text-left space-y-4 text-lg">
          <div className="flex justify-between border-b pb-2">
            <span>Flappy Bird Score:</span>
            <span className="font-bold">{scores.flappyScore}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Tic Tac Toe Bonus:</span>
            <span className="font-bold">{scores.ticTacToeResult}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>MCQ Quiz Score:</span>
            <span className="font-bold">{scores.mcqScore}</span>
          </div>
          <div className="flex justify-between pt-4 text-2xl">
            <strong>Grand Total:</strong>
            <strong className="text-green-500">{scores.totalScore}</strong>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="mt-10 w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Play Again From Start
        </button>
      </div>
    </div>
  );
}

export default FinalResults;
