import { useState } from "react";

function NameInput({ onNameSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 p-6">
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm w-full">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2 drop-shadow-lg">
          Flappy Bird
        </h1>
        <p className="text-gray-600 mb-6">Enter your name to start playing!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-full text-center text-lg focus:outline-none focus:border-yellow-400"
            maxLength={20}
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            Start Game
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          <p>Press SPACE or TAP to flap</p>
          <p>Avoid the pipes and don't hit the ground!</p>
        </div>
      </div>
    </div>
  );
}

export default NameInput;
