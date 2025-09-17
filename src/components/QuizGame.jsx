import React, { useState, useEffect } from 'react';
import questionsData from '../data/questions.json';
import logo from '../assets/logo_transparent.png';

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    // Shuffle questions and select random subset
    const shuffledQuestions = [...questionsData]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 6) + 10); // Random number between 10-15
    
    setQuestions(shuffledQuestions);
    setIsLoading(false);
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      setShowResult(true);
    }
  }, [timeLeft, showResult]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(20);
    setShowResult(false);
    setSelectedAnswer(null);
  }, [currentQuestion]);

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    if (selectedAnswer === questions[currentQuestion].answer - 1) {
      setScore((prev) => prev + 1);
    }
    
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    // Shuffle questions and select random subset again
    const shuffledQuestions = [...questionsData]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 6) + 10);
    
    setQuestions(shuffledQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Excellent! 🎉";
    if (percentage >= 60) return "Good job! 👏";
    if (percentage >= 40) return "Not bad! 👍";
    return "Keep practicing! 📚";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100">
        <div className="text-center p-8 rounded-xl bg-gradient-to-br from-[#Fd688e] to-[#ff8ca8] shadow-lg">
          <img 
            src={logo} 
            alt="Loading..." 
            className="h-32 w-auto mx-auto mb-6 animate-pulse" 
          />
          <p className="text-white text-lg font-medium">Loading questions...</p>
          <div className="mt-4 w-48 h-2 bg-pink-200/30 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-white/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Quiz Completed!</h2>
          <div className="bg-gradient-to-r from-[#Fd688e] to-[#ff8ca8] text-white p-6 rounded-lg mb-6">
            <p className="text-xl mb-2">Your Final Score</p>
            <p className="text-4xl font-bold">{score}/{questions.length}</p>
            <p className="text-2xl mt-2">{getScoreMessage()}</p>
          </div>
          <button
            onClick={restartQuiz}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-2xl mx-auto p-4">
          {/* App Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center ">
              <img 
                src={logo} 
                alt="App logo" 
                className="h-16 w-15"  
              />
              <h1 className="text-3xl font-bold text-white">Sentient Trivia</h1>
            </div>
            <p className="text-white text-center mt-2">The ultimate quiz for the AGI generation.</p>
          </div>
          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100">

            {/* Question Header */}
            <div className="bg-gradient-to-r from-[#Fd688e] to-[#ff8ca8] p-4">
              <h2 className="text-xl font-bold text-white">Question {currentQuestion + 1}</h2>
             
            </div>
            {/* Progress Bar */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm font-medium">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-gray-600 text-sm font-medium">
                  Time Left: <span className={timeLeft <= 5 ? 'text-red-500 font-bold' : 'text-[#Fd688e]'}>{timeLeft}s</span>
                </span>
                <span className="text-gray-600 text-sm font-medium">
                  Score: <span className="text-[#Fd688e]">{score}</span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-1000 ${timeLeft <= 5 ? 'bg-red-500' : 'bg-[#Fd688e]'}`} 
                  style={{ width: `${(timeLeft / 20) * 100}%` }}
                ></div>
              </div>
            </div>

            
            {/* Question Content */}
            <div className="p-6">
              <div className="bg-gradient-to-r from-[#Fd688e] to-[#ff8ca8] rounded-lg shadow-md p-8 mb-6 transition-all duration-200 hover:shadow-lg">
                <div className="flex flex-col items-center justify-center min-h-[150px]">
                  <div className="text-center">
                    <p className="text-white text-xl font-medium leading-relaxed">
                      {questions[currentQuestion].question}
                    </p>
                  </div>
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? showResult
                          ? index === questions[currentQuestion].answer - 1
                            ? 'bg-green-50 border-green-500 text-green-800'
                            : 'bg-red-50 border-red-500 text-red-800'
                          : 'bg-blue-50 border-blue-500 text-blue-800'
                      : showResult && index === questions[currentQuestion].answer - 1
                      ? 'bg-green-50 border-green-500 text-green-800'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                        selectedAnswer === index
                          ? showResult && index === questions[currentQuestion].answer - 1
                            ? 'bg-green-500 text-white'
                            : showResult
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                          : showResult && index === questions[currentQuestion].answer - 1
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-gray-800">{option}</span>
                      {showResult && index === questions[currentQuestion].answer - 1 && (
                        <span className="ml-auto text-green-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                      {showResult && selectedAnswer === index && index !== questions[currentQuestion].answer - 1 && (
                        <span className="ml-auto text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Section */}
            {showResult && (
              <div className={`p-4 ${
                selectedAnswer === questions[currentQuestion].answer - 1
                  ? 'bg-green-50 border-t border-green-100'
                  : 'bg-red-50 border-t border-red-100'
              }`}>
                <div className={`flex items-start ${
                  selectedAnswer === questions[currentQuestion].answer - 1 ? 'text-green-700' : 'text-red-700'
                }`}>
                  <div className={`flex-shrink-0 h-5 w-5 ${
                    selectedAnswer === questions[currentQuestion].answer - 1 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {selectedAnswer === questions[currentQuestion].answer - 1 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {selectedAnswer === questions[currentQuestion].answer - 1
                        ? 'Correct! Well done! 🎉'
                        : `Incorrect. The correct answer is: ${questions[currentQuestion].options[questions[currentQuestion].answer - 1]}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
              {!showResult ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedAnswer === null
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#Fd688e] to-[#ff8ca8] text-white hover:opacity-90 transform hover:-translate-y-0.5'
                  }`}
                >
                  {timeLeft > 0 ? 'Submit Answer' : 'Time\'s Up!'}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-gradient-to-r from-[#Fd688e] to-[#ff8ca8] text-white rounded-lg hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                >
                  {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Black Banner */}
      <div className="bg-black text-white py-3 w-full">
        <div className="mx-auto px-4 text-center text-sm">
        Crafted by Cryptee ⚡ for the Sentient Community
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
