import Leaderboard from "./Leaderboard";

function StartScreen({ playerName, onGameStart, onResetName }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 p-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-yellow-400 mb-2 drop-shadow-lg">
          Flappy Bird
        </h1>
        <p className="text-white text-lg">Welcome, {playerName}!</p>
      </div>

      <div className="space-y-4 mb-8">
        <button
          onClick={onGameStart}
          className="w-64 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-colors shadow-lg"
        >
          Play Game
        </button>

        <button
          onClick={onResetName}
          className="w-64 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
        >
          Change Name
        </button>
      </div>

      <div className="bg-white/90 rounded-2xl p-6 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          How to Play
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Press SPACEBAR or TAP to make the bird flap</p>
          <p>• Avoid the pipes and don't hit the ground</p>
          <p>• Each pipe you pass gives you 1 point</p>
          <p>• Try to beat your high score!</p>
        </div>
      </div>

      <div className="mt-6 w-full max-w-sm">
        <Leaderboard />
      </div>
    </div>
  );
}

export default StartScreen;
