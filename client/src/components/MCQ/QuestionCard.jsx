import React from "react";

// Displays a single question and its options.
function QuestionCard({ question, onAnswer, selectedOption, isAnswered }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2
        className="text-xl md:text-2xl font-semibold mb-6 text-gray-800"
        style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}
      >
        {question.question}
      </h2>
      <div className="flex flex-col space-y-4">
        {question.options.map((option, index) => {
          let buttonClass = "border-gray-300 bg-white hover:bg-gray-100";
          if (isAnswered) {
            if (option === question.correctAnswer) {
              buttonClass = "bg-green-200 border-green-400 text-green-800"; // Correct answer
            } else if (option === selectedOption) {
              buttonClass = "bg-red-200 border-red-400 text-red-800"; // Incorrectly selected
            }
          } else if (option === selectedOption) {
            buttonClass = "bg-blue-200 border-blue-400"; // Selected but not yet confirmed
          }

          return (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border-2 text-md md:text-lg transition-colors duration-200 ${buttonClass}`}
              style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionCard;
