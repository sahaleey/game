import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import quizData from "../../assets/malayalam_gk_quiz.json";
import QuestionCard from "./QuestionCard";

function MCQQuiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Load and shuffle questions on component mount
  useEffect(() => {
    setQuestions(quizData.sort(() => Math.random() - 0.5));
  }, []);

  const handleAnswer = (option) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    // Move to the next question or finish the quiz after a delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        // End of the quiz
        localStorage.setItem(
          "mcqScore",
          score +
            (option === questions[currentQuestionIndex].correctAnswer ? 1 : 0)
        );
        navigate("/results");
      }
    }, 1500);
  };

  if (questions.length === 0) {
    return <div>Loading Quiz...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl">
        {/* Header and Score */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Malayalam GK Quiz</h1>
          <p className="text-xl font-semibold text-blue-600">Score: {score}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-300 rounded-full h-4 mb-6">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          selectedOption={selectedOption}
          isAnswered={isAnswered}
        />
      </div>
    </div>
  );
}

export default MCQQuiz;
