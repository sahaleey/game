import React from "react";

// Represents a single square on the board.
function Square({ value, onSquareClick, isWinning }) {
  // The style changes if the square is part of the winning line.
  const winningStyle = isWinning
    ? "bg-green-300 text-green-800"
    : "bg-white hover:bg-gray-100";

  return (
    <button
      className={`w-20 h-20 md:w-28 md:h-28 border border-gray-400 float-left text-4xl md:text-5xl font-bold leading-tight text-center transition-colors duration-200 ${winningStyle}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export default Square;
