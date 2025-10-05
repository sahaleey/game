import React from "react";

function PlayerInfo({ status, p1, p2, flappyScore }) {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg text-center shadow-md w-full max-w-md">
      {/* Display the score from Flappy Bird */}
      <div className="text-lg mb-2">
        Flappy Bird Score:{" "}
        <span className="font-bold text-blue-600">{flappyScore}</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-around my-2">
        <span className="font-bold text-lg">Player (X): {p1}</span>
        <span className="font-bold text-lg">Computer (O): {p2}</span>
      </div>
      <p className="text-xl font-semibold text-gray-700 min-h-[28px]">
        {status}
      </p>
    </div>
  );
}

export default PlayerInfo;
