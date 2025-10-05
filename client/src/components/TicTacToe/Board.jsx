import React from "react";
import Square from "./Square";

// The 3x3 game board.
function Board({ squares, onPlay, winningLine }) {
  function handleClick(i) {
    // If the square is already filled or the game is over, do nothing.
    if (squares[i] || calculateWinner(squares).winner) {
      return;
    }

    // Create a copy of the squares array to modify.
    const nextSquares = squares.slice();
    // Determine the next move ('X' or 'O').
    const xIsNext = squares.filter(Boolean).length % 2 === 0;
    nextSquares[i] = xIsNext ? "X" : "O";

    // Call the parent component's handler to update the game state.
    onPlay(nextSquares);
  }

  // Create the board by rendering 9 squares.
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const squareCols = [];
    for (let col = 0; col < 3; col++) {
      const i = row * 3 + col;
      squareCols.push(
        <Square
          key={i}
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
          isWinning={winningLine && winningLine.includes(i)}
        />
      );
    }
    boardRows.push(
      <div key={row} className="clear-both content-none table">
        {squareCols}
      </div>
    );
  }

  return <div>{boardRows}</div>;
}

// Helper function to determine the winner.
export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: [] };
}

export default Board;
