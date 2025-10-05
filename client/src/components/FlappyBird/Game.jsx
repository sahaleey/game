import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Bird from "./Bird";
import Pillar from "./Pillar";
import Scoreboard from "./Scoreboard";
import VIRTUE_NAMES from "./virtueNames"; // Adjust the path if needed

// --- Constants ---
const GAME_CONFIG = {
  GRAVITY: 0.25,
  JUMP_STRENGTH: -8,
  GAME_SPEED: 3,
  PILLAR_GAP: 180,
  PILLAR_WIDTH: 60,
  PILLAR_FREQUENCY: 150,
  GROUND_HEIGHT: 100,
  BIRD_SIZE: 40,
};
const GAME_DIMENSIONS = { WIDTH: 360, HEIGHT: 600 };
const PLAY_COUNT_KEY = "flappyBirdPlayCount";

// --- Main Game Component ---
function Game({ playerName }) {
  const navigate = useNavigate();

  // State
  const [scale, setScale] = useState(1);
  const [birdPosition, setBirdPosition] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pillars, setPillars] = useState([]);
  const [score, setScore] = useState(0);
  const [playsLeft, setPlaysLeft] = useState(() => {
    const savedPlays = localStorage.getItem(PLAY_COUNT_KEY);
    return savedPlays ? parseInt(savedPlays, 10) : 3;
  });
  const [totalScore, setTotalScore] = useState(0);
  const [gameState, setGameState] = useState("start-screen");
  const [birdColor, setBirdColor] = useState("yellow");
  const [highScore, setHighScore] = useState(0);

  // Refs
  const isGameOverRef = useRef(false);
  const gameLoopRef = useRef(null);
  const frameCountRef = useRef(0);
  const gameAreaRef = useRef(null);

  // Fetch High Score on Initial Load
  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const response = await axios.get(
          "https://game-xvje.onrender.com/api/scores"
        );
        if (response.data && response.data.length > 0) {
          setHighScore(response.data[0].score);
        }
      } catch (error) {
        console.error("Failed to fetch high score:", error);
      }
    };
    fetchHighScore();
  }, []);

  // Handle Window Scaling
  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / GAME_DIMENSIONS.WIDTH;
      const scaleY = window.innerHeight / GAME_DIMENSIONS.HEIGHT;
      setScale(Math.min(scaleX, scaleY));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Core Logic ---
  const startGame = useCallback(() => {
    if (playsLeft <= 0) return;
    setBirdPosition(250);
    setBirdVelocity(0);
    setPillars([]);
    setScore(0);
    frameCountRef.current = 0;
    isGameOverRef.current = false;
    setGameState("playing");
  }, [playsLeft]);

  const saveScore = async (name, finalScore) => {
    try {
      await axios.post("https://game-xvje.onrender.com/api/scores", {
        name,
        score: finalScore,
      });
      console.log("✅ Final score saved successfully!");
    } catch (err) {
      console.error("❌ Error saving final score:", err);
    }
  };

  const gameOver = useCallback(async () => {
    if (isGameOverRef.current) return;
    isGameOverRef.current = true;
    setGameState("game-over");

    const newTotalScore = totalScore + score;
    setTotalScore(newTotalScore);

    const newPlaysLeft = playsLeft - 1;
    setPlaysLeft(newPlaysLeft);
    localStorage.setItem(PLAY_COUNT_KEY, newPlaysLeft);

    if (newPlaysLeft <= 0) {
      localStorage.setItem(PLAY_COUNT_KEY, "3");

      // --- THIS IS THE IMPORTANT ADDED LINE ---
      // This saves the final score so the results page can find it.
      localStorage.setItem("flappyBirdFinalScore", newTotalScore);

      await saveScore(playerName, newTotalScore);
      setTimeout(
        () =>
          navigate("/tictactoe", {
            state: { player1Name: playerName, flappyScore: newTotalScore },
          }),
        2000
      );
    } else {
      setTimeout(() => setGameState("start-screen"), 2000);
    }
  }, [score, totalScore, playsLeft, playerName, navigate]);

  // --- Game Loop (useEffect) ---
  useEffect(() => {
    if (gameState !== "playing") return;
    const gameLoop = () => {
      setBirdVelocity((v) => v + GAME_CONFIG.GRAVITY);
      setBirdPosition((pos) => pos + birdVelocity);

      setPillars((prevPillars) =>
        prevPillars
          .map((p) => ({ ...p, x: p.x - GAME_CONFIG.GAME_SPEED }))
          .filter((p) => p.x > -GAME_CONFIG.PILLAR_WIDTH)
          .map((p) => {
            if (
              !p.passed &&
              p.x + GAME_CONFIG.PILLAR_WIDTH <
                GAME_DIMENSIONS.WIDTH / 2 - GAME_CONFIG.BIRD_SIZE / 2
            ) {
              setScore((s) => s + 1);
              return { ...p, passed: true };
            }
            return p;
          })
      );

      frameCountRef.current++;
      if (frameCountRef.current % GAME_CONFIG.PILLAR_FREQUENCY === 0) {
        const gapPos =
          Math.random() *
            (GAME_DIMENSIONS.HEIGHT -
              GAME_CONFIG.GROUND_HEIGHT -
              GAME_CONFIG.PILLAR_GAP -
              100) +
          50;
        const pillarIndex = Math.floor(
          frameCountRef.current / GAME_CONFIG.PILLAR_FREQUENCY
        );
        const nameToShow = VIRTUE_NAMES[pillarIndex % VIRTUE_NAMES.length];
        setPillars((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: GAME_DIMENSIONS.WIDTH,
            gapPosition: gapPos,
            passed: false,
            name: nameToShow,
          },
        ]);
      }

      const birdRect = {
        top: birdPosition,
        bottom: birdPosition + GAME_CONFIG.BIRD_SIZE,
        left: GAME_DIMENSIONS.WIDTH / 2,
        right: GAME_DIMENSIONS.WIDTH / 2 + GAME_CONFIG.BIRD_SIZE,
      };
      if (birdRect.bottom >= GAME_DIMENSIONS.HEIGHT - GAME_CONFIG.GROUND_HEIGHT)
        return gameOver();

      for (const p of pillars) {
        const topRect = {
          top: 0,
          bottom: p.gapPosition,
          left: p.x,
          right: p.x + GAME_CONFIG.PILLAR_WIDTH,
        };
        const botRect = {
          top: p.gapPosition + GAME_CONFIG.PILLAR_GAP,
          bottom: GAME_DIMENSIONS.HEIGHT,
          left: p.x,
          right: p.x + GAME_CONFIG.PILLAR_WIDTH,
        };
        if (
          (birdRect.right > topRect.left &&
            birdRect.left < topRect.right &&
            birdRect.top < topRect.bottom) ||
          (birdRect.right > botRect.left &&
            birdRect.left < botRect.right &&
            birdRect.bottom > botRect.top)
        ) {
          return gameOver();
        }
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameState, birdVelocity, birdPosition, pillars, gameOver]);

  // --- User Input ---
  const handleUserAction = useCallback(() => {
    if (gameState === "start-screen") startGame();
    else if (gameState === "playing")
      setBirdVelocity(GAME_CONFIG.JUMP_STRENGTH);
  }, [gameState, startGame]);

  useEffect(() => {
    const handleKeyPress = (e) => e.code === "Space" && handleUserAction();
    window.addEventListener("keydown", handleKeyPress);
    const gameArea = gameAreaRef.current;
    gameArea?.addEventListener("click", handleUserAction); // Allow tap to jump/start
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      gameArea?.removeEventListener("click", handleUserAction);
    };
  }, [handleUserAction]);

  return (
    <div
      ref={gameAreaRef}
      className="relative cursor-pointer overflow-hidden bg-gradient-to-b from-blue-400 to-blue-600"
      style={{
        width: GAME_DIMENSIONS.WIDTH,
        height: GAME_DIMENSIONS.HEIGHT,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      <Scoreboard score={score} />
      {pillars.map((p) => (
        <Pillar
          key={p.id}
          {...p}
          gapHeight={GAME_CONFIG.PILLAR_GAP}
          width={GAME_CONFIG.PILLAR_WIDTH}
          gameHeight={GAME_DIMENSIONS.HEIGHT}
        />
      ))}
      <Bird
        x={GAME_DIMENSIONS.WIDTH / 2 - GAME_CONFIG.BIRD_SIZE / 2}
        y={birdPosition}
        size={GAME_CONFIG.BIRD_SIZE}
        color={birdColor}
      />
      <div
        className="absolute bottom-0 left-0 right-0 bg-green-600 border-t-4 border-green-800"
        style={{ height: GAME_CONFIG.GROUND_HEIGHT }}
      />
      {gameState === "start-screen" && (
        <StartScreenOverlay
          playsLeft={playsLeft}
          birdColor={birdColor}
          setBirdColor={setBirdColor}
          highScore={highScore}
          onStartGame={startGame}
        />
      )}
      {gameState === "game-over" && (
        <GameOverOverlay
          score={score}
          totalScore={totalScore}
          isFinalRound={playsLeft <= 0}
        />
      )}
    </div>
  );
}

// --- Overlay Sub-components ---
const StartScreenOverlay = ({
  playsLeft,
  birdColor,
  setBirdColor,
  highScore,
  onStartGame,
}) => (
  <div
    className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
    onClick={onStartGame} // Tap anywhere on the overlay to start
  >
    <div className="bg-white rounded-2xl p-8 text-center w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-2">
        {playsLeft < 3 ? `Round ${4 - playsLeft}` : "Ready to Play?"}
      </h2>
      <p className="font-bold text-lg mb-4 text-yellow-500">
        🏆 High Score: {highScore}
      </p>
      <p className="font-bold text-lg mb-6">Plays Left: {playsLeft}</p>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent the main div's onClick from firing twice
          onStartGame();
        }}
        className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-600 transition-colors mb-6"
      >
        Play
      </button>
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
);

const GameOverOverlay = ({ score, totalScore, isFinalRound }) => (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-8 text-center w-full max-w-sm">
      <h2 className="text-2xl font-bold text-red-500 mb-2">Game Over!</h2>
      <p className="text-xl mb-2">
        Round Score: <span className="font-bold">{score}</span>
      </p>
      <p className="text-lg mb-4">
        Total Score: <span className="font-bold">{totalScore}</span>
      </p>
      <p className="text-gray-700">
        {isFinalRound
          ? "Saving your final score..."
          : "Get ready for the next round..."}
      </p>
    </div>
  </div>
);

export default Game;
