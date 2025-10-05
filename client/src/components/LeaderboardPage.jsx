// src/components/LeaderboardPage.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch scores from your backend API
        const response = await axios.get(
          "https://game-xvje.onrender.com/api/scores"
        );
        setLeaderboard(response.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Could not load the scores. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []); // The empty array ensures this runs only once when the page loads

  // A helper function to format the date nicely
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            🏆 Full Leaderboard 🏆
          </h1>
          <p className="text-lg text-gray-700">See who the top players are!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {isLoading ? (
            <p className="text-center p-8">Loading scores...</p>
          ) : error ? (
            <p className="text-center p-8 text-red-500">{error}</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plays
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((player, index) => (
                  <tr key={player._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-lg">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                      {player.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {player.plays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {formatDate(player.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600 text-lg">
                      {player.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && leaderboard.length === 0 && (
            <p className="text-center text-gray-500 p-8">
              The leaderboard is empty. Be the first to set a score!
            </p>
          )}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
