import { useState, useEffect, useRef, useCallback } from "react";
import Bird from "./Bird";
import Pillar from "./pillar";
import Scoreboard from "./Scoreboard";

const GAME_CONFIG = {
  gravity: 0.25, // slower fall
  jumpStrength: -8, // less aggressive jump
  gameSpeed: 3, // slower pillars
  pillarGap: 180, // bigger gap
  pillarWidth: 60,
  pillarFrequency: 150, // more frames between pillars
  groundHeight: 100,
  birdSize: 40,
};

function Game({ playerName, onGameOver, onBackToStart }) {
  const [birdPosition, setBirdPosition] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pillars, setPillars] = useState([]);
  const [score, setScore] = useState(0);
  const [playsLeft, setPlaysLeft] = useState(3); // 3 attempts max

  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [birdColor, setBirdColor] = useState("yellow");

  const gameLoopRef = useRef(null);
  const frameCountRef = useRef(0);
  const gameAreaRef = useRef(null);

  // Game dimensions
  const gameWidth = 360;
  const gameHeight = 600;

  // Handle jump
  const jump = useCallback(() => {
    if (playsLeft <= 0) {
      alert("❌ You have already played 3 times! Last score has been counted.");
      return;
    }

    if (!isPlaying && !gameStarted) {
      setIsPlaying(true);
      setGameStarted(true);
      setBirdVelocity(GAME_CONFIG.jumpStrength);
      return;
    }

    if (isPlaying) {
      setBirdVelocity(GAME_CONFIG.jumpStrength);
    }
  }, [isPlaying, gameStarted, playsLeft]);

  // Handle user input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      jump();
    };

    window.addEventListener("keydown", handleKeyPress);
    gameAreaRef.current?.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      gameAreaRef.current?.removeEventListener("click", handleClick);
    };
  }, [jump]);

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = () => {
      // Update bird position with gravity
      setBirdPosition((prev) => {
        const newPosition = prev + birdVelocity;
        const newVelocity = birdVelocity + GAME_CONFIG.gravity;

        setBirdVelocity(newVelocity);

        // Check ground collision
        if (
          newPosition >=
          gameHeight - GAME_CONFIG.groundHeight - GAME_CONFIG.birdSize / 2
        ) {
          gameOver();
          return (
            gameHeight - GAME_CONFIG.groundHeight - GAME_CONFIG.birdSize / 2
          );
        }

        // Check ceiling collision
        if (newPosition <= 0) {
          return 0;
        }

        return newPosition;
      });

      // Update pillars
      setPillars((prev) => {
        const updatedPillars = prev
          .map((pillar) => ({
            ...pillar,
            x: pillar.x - GAME_CONFIG.gameSpeed,
          }))
          .filter((pillar) => pillar.x > -GAME_CONFIG.pillarWidth);

        // Check for passed pillars and update score
        updatedPillars.forEach((pillar) => {
          if (
            !pillar.passed &&
            pillar.x + GAME_CONFIG.pillarWidth <
              gameWidth / 2 - GAME_CONFIG.birdSize / 2
          ) {
            pillar.passed = true;
            setScore((prev) => prev + 1);
          }
        });

        return updatedPillars;
      });

      // Generate new pillars
      frameCountRef.current += 1;
      if (frameCountRef.current % GAME_CONFIG.pillarFrequency === 0) {
        const gapPosition =
          Math.random() *
            (gameHeight -
              GAME_CONFIG.groundHeight -
              GAME_CONFIG.pillarGap -
              100) +
          50;

        setPillars((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: gameWidth,
            gapPosition,
            passed: false,
          },
        ]);
      }

      // Check collisions
      checkCollisions();

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, birdVelocity]);

  // Check for collisions with pillars
  const checkCollisions = () => {
    const birdX = gameWidth / 2 - GAME_CONFIG.birdSize / 2;
    const birdY = birdPosition - GAME_CONFIG.birdSize / 2;

    for (const pillar of pillars) {
      // Bird collision box
      const birdLeft = birdX;
      const birdRight = birdX + GAME_CONFIG.birdSize;
      const birdTop = birdY;
      const birdBottom = birdY + GAME_CONFIG.birdSize;

      // Pillar collision boxes
      const pillarLeft = pillar.x;
      const pillarRight = pillar.x + GAME_CONFIG.pillarWidth;
      const topPillarBottom = pillar.gapPosition;
      const bottomPillarTop = pillar.gapPosition + GAME_CONFIG.pillarGap;

      // Check collision with top pillar
      if (
        birdRight > pillarLeft &&
        birdLeft < pillarRight &&
        birdTop < topPillarBottom
      ) {
        gameOver();
        return;
      }

      // Check collision with bottom pillar
      if (
        birdRight > pillarLeft &&
        birdLeft < pillarRight &&
        birdBottom > bottomPillarTop
      ) {
        gameOver();
        return;
      }
    }
  };

  const gameOver = () => {
    setIsPlaying(false);
    setGameStarted(false);

    if (playsLeft > 0) {
      setPlaysLeft((prev) => prev - 1);
    }

    // Pass score to parent only on the last play
    if (playsLeft === 1) {
      onGameOver(score); // last play counts
    }
  };

  const resetGame = () => {
    setBirdPosition(250);
    setBirdVelocity(0);
    setPillars([]);
    setScore(0);
    setIsPlaying(false);
    setGameStarted(false);
    frameCountRef.current = 0;
  };

  const handleBackToStart = () => {
    resetGame();
    onBackToStart();
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-400 to-blue-600 overflow-hidden">
      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="relative w-full h-full cursor-pointer"
        style={{ width: gameWidth, height: gameHeight, margin: "0 auto" }}
      >
        {/* Clouds */}
        <div className="absolute top-10 left-10 w-20 h-10 bg-white/80 rounded-full"></div>
        <div className="absolute top-20 left-40 w-16 h-8 bg-white/80 rounded-full"></div>
        <div className="absolute top-15 right-20 w-24 h-12 bg-white/80 rounded-full"></div>

        {/* Pillars */}
        {pillars.map((pillar) => (
          <Pillar
            key={pillar.id}
            x={pillar.x}
            gapPosition={pillar.gapPosition}
            gapHeight={GAME_CONFIG.pillarGap}
            width={GAME_CONFIG.pillarWidth}
            gameHeight={gameHeight}
            groundHeight={GAME_CONFIG.groundHeight}
          />
        ))}

        {/* Bird */}
        <Bird
          x={gameWidth / 2 - GAME_CONFIG.birdSize / 2}
          y={birdPosition - GAME_CONFIG.birdSize / 2}
          size={GAME_CONFIG.birdSize}
          color={birdColor}
          velocity={birdVelocity}
        />

        {/* Ground */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-green-600 border-t-4 border-green-800"
          style={{ height: GAME_CONFIG.groundHeight }}
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-green-700"></div>
          <div className="absolute top-2 left-0 right-0 h-1 bg-green-800"></div>
        </div>

        {/* Score Display */}
        <Scoreboard score={score} />

        {/* Start Game Overlay */}
        {!gameStarted && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
              <p className="text-gray-600 mb-4">Press SPACE or TAP to start</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Bird Color:</p>
                <div className="flex justify-center space-x-2">
                  {["yellow", "red", "blue"].map((color) => (
                    <button
                      key={color}
                      onClick={(e) => {
                        e.stopPropagation();
                        setBirdColor(color);
                      }}
                      className={`w-8 h-8 rounded-full border-2 ${
                        birdColor === color ? "border-black" : "border-gray-300"
                      } bg-${color}-500`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {!isPlaying && gameStarted && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-2">
                Game Over!
              </h2>
              <p className="text-xl mb-4">Score: {score}</p>
              <div className="space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                    setIsPlaying(true);
                    setGameStarted(true);
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
                >
                  Play Again
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBackToStart();
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
