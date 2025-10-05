import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FinalResults() {
  const navigate = useNavigate();
  const [scores, setScores] = useState({
    playerName: "",
    totalScore: 0,
  });

  useEffect(() => {
    // 1. Calculate final scores from localStorage
    const playerName = localStorage.getItem("flappyBirdPlayerName") || "Player";
    const flappyScore = parseInt(
      localStorage.getItem("flappyBirdFinalScore") || "0",
      10
    );
    const ticTacToeResult = parseFloat(
      localStorage.getItem("ticTacToeResult") || "0"
    );
    const mcqScore = parseInt(localStorage.getItem("mcqScore") || "0", 10);
    const ticTacToePoints = ticTacToeResult === 1 ? 10 : 0;
    const totalScore = flappyScore + ticTacToePoints + mcqScore;

    setScores({ playerName, totalScore });

    // 2. Save the final score to your backend
    const saveScoreToServer = async () => {
      if (totalScore === 0 && playerName === "Player") return;
      try {
        await axios.post("http://localhost:5000/api/scores", {
          name: playerName,
          score: totalScore,
        });
        console.log("Score saved/updated in the database!");
      } catch (error) {
        console.error("Error saving score:", error);
      }
    };
    saveScoreToServer();

    // 3. Automatically redirect to the home/leaderboard page
    const redirectTimeout = setTimeout(() => {
      // Clear game data for the next round
      localStorage.removeItem("flappyBirdPlayCount");
      localStorage.removeItem("flappyBirdFinalScore");
      localStorage.removeItem("ticTacToeResult");
      localStorage.removeItem("mcqScore");
      navigate("/home"); // Redirect to the home page
    }, 4000); // 4-second delay

    return () => clearTimeout(redirectTimeout);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          🏆 Game Over! 🏆
        </h1>
        <h2 className="text-2xl font-semibold mb-8">{scores.playerName}</h2>
        <div className="text-left space-y-4 text-lg">
          <div className="flex justify-center pt-4 text-4xl">
            <strong>Grand Total:</strong>
            <strong className="text-green-500 ml-4">{scores.totalScore}</strong>
          </div>
        </div>
        <p className="text-gray-500 mt-8">
          Saving your score and redirecting to the leaderboard...
        </p>
      </div>
    </div>
  );
}

export default FinalResults;
