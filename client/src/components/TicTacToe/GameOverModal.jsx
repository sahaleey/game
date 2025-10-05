import React from "react";

// Modal that appears when the game ends.
function GameOverModal({ status, onReset }) {
  if (!status) return null; // Don't render if there's no status

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Content */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-80">
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl text-gray-700 mb-6">{status}</p>
        <button
          onClick={onReset}
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default GameOverModal;
