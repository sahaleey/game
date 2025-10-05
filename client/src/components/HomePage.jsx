import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function fetches the scores from your backend
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/scores");
        setLeaderboard(response.data); // The backend already sorts the data
      } catch (error) {
        console.error("Could not fetch the leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []); // The empty array ensures this runs only once when the page loads

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Game Hub</h1>
          <p className="text-xl text-gray-600 mb-8">
            Test your skills and climb the leaderboard!
          </p>
          {/* This Link should point to the page where your games start */}
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6">
            🏆 Leaderboard 🏆
          </h2>
          {isLoading ? (
            <p className="text-center text-gray-500">Loading scores...</p>
          ) : (
            <div className="overflow-x-auto">
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
                    <tr key={player._id || index}>
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
              {leaderboard.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No scores yet. Be the first to play!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
