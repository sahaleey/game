import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PlayerInfo from "./PlayerInfo";
import GameOverModal from "./GameOverModal";
import Square from "./Square";

// A fixed score for winning the Tic Tac Toe game.
const TIC_TAC_TOE_WIN_SCORE = 10;

function TicTacToe() {
  const location = useLocation();
  const navigate = useNavigate(); // For internal navigation

  // State
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [flappyScore, setFlappyScore] = useState(0);
  const [status, setStatus] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const computerName = "Computer";

  // Get Player 1's name and Flappy Bird score from the navigation state.
  useEffect(() => {
    const { player1Name, flappyScore } = location.state || {};
    if (player1Name) setPlayer1Name(player1Name);
    if (flappyScore) setFlappyScore(flappyScore);
  }, [location.state]);

  // Function to save the final combined score to the database.
  const saveFinalScore = async (name, score) => {
    try {
      await axios.post("https://game-xvje.onrender.com/api/scores", {
        name,
        score,
      });
      console.log("✅ Final combined score updated successfully!");
    } catch (err) {
      console.error("❌ Error updating final score:", err);
    }
  };

  // Main game logic to handle win/draw/continue conditions.
  useEffect(() => {
    if (isGameOver) return;

    const { winner } = calculateWinner(squares);
    const isDraw = !winner && squares.every(Boolean);

    if (winner) {
      setIsGameOver(true);
      const winnerName = winner === "X" ? player1Name : computerName;
      setStatus(`Winner: ${winnerName}!`);

      if (winner === "X") {
        // --- HANDLE PLAYER WIN ---
        const calculatedFinalScore = flappyScore + TIC_TAC_TOE_WIN_SCORE;
        setFinalScore(calculatedFinalScore);
        localStorage.setItem("ticTacToeResult", 1); // Set win result for final screen

        const handleWin = async () => {
          await saveFinalScore(player1Name, calculatedFinalScore);
          // Navigate to the internal quiz page
          setTimeout(() => {
            navigate("/quiz");
          }, 3000);
        };
        handleWin();
      } else {
        // Computer won
        localStorage.setItem("ticTacToeResult", 0); // Set loss result
      }
    } else if (isDraw) {
      // --- HANDLE DRAW (auto-reset) ---
      setStatus("It's a Draw! The board will reset.");
      setTimeout(() => {
        handleReset();
      }, 2000);
    } else {
      // --- CONTINUE GAME ---
      setStatus(`Next player: ${xIsNext ? player1Name : computerName}`);
    }
  }, [squares, xIsNext, isGameOver, flappyScore, player1Name, navigate]);

  // Computer's turn logic.
  useEffect(() => {
    if (!xIsNext && !isGameOver) {
      const timer = setTimeout(() => {
        const bestMove = findBestMove(squares);
        if (bestMove !== null) {
          const nextSquares = squares.slice();
          nextSquares[bestMove] = "O";
          handlePlay(nextSquares);
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, squares, isGameOver]);

  const handleReset = useCallback(() => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsGameOver(false);
    setFinalScore(null);
    setStatus(`Next player: ${player1Name}`);
  }, [player1Name]);

  function handlePlay(nextSquares) {
    if (isGameOver) return;
    setSquares(nextSquares);
    setXIsNext((prev) => !prev);
  }

  const { winner, line: winningLine } = calculateWinner(squares);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <PlayerInfo
        status={status}
        p1={player1Name}
        p2={computerName}
        flappyScore={flappyScore}
      />
      <div className="shadow-2xl rounded-lg overflow-hidden">
        <Board
          squares={squares}
          onPlay={handlePlay}
          isGameOver={isGameOver || !xIsNext}
          winningLine={winningLine}
        />
      </div>
      <GameOverModal
        status={isGameOver ? status : null}
        finalScore={finalScore}
        onReset={handleReset}
        isPlayerWinner={winner === "X"}
      />
    </div>
  );
}

// --- HELPER COMPONENTS AND FUNCTIONS ---

function Board({ squares, onPlay, isGameOver, winningLine }) {
  function handleClick(i) {
    if (isGameOver || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    onPlay(nextSquares);
  }

  return (
    <div>
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex">
          {[0, 1, 2].map((col) => {
            const i = row * 3 + col;
            return (
              <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                isWinning={winningLine && winningLine.includes(i)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: [] };
}

function findBestMove(currentSquares) {
  // Check for a winning move for 'O'
  for (let i = 0; i < 9; i++) {
    if (!currentSquares[i]) {
      const tempSquares = currentSquares.slice();
      tempSquares[i] = "O";
      if (calculateWinner(tempSquares).winner === "O") return i;
    }
  }
  // Check for a blocking move for 'X'
  for (let i = 0; i < 9; i++) {
    if (!currentSquares[i]) {
      const tempSquares = currentSquares.slice();
      tempSquares[i] = "X";
      if (calculateWinner(tempSquares).winner === "X") return i;
    }
  }
  // Take a strategic position
  const strategicMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  for (const move of strategicMoves) {
    if (!currentSquares[move]) return move;
  }
  return null;
}

export default TicTacToe;
