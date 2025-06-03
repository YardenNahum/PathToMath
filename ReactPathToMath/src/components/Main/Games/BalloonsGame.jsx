import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameContainer from './GameContainer';
import generateQuestions from './GameLogic';
import { useUser } from '../../Utils/UserContext';
import { updateUser } from '../../../services/UserService';
import BalloonIcon from '../../../../assets/Images/BalloonGame/balloon_icon.png'; 

const NUM_QUESTIONS = 10;

function BalloonsGame() {
  const { subjectGame, grade, level } = useParams();
  const subjectName = subjectGame;
  const gameLevel = parseInt(level);
  const navigate = useNavigate();
  const { user } = useUser();

  // Game state
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [poppedBalloons, setPoppedBalloons] = useState(new Set());

  // Generate questions on mount
  useEffect(() => {
  const generated = generateQuestions(subjectName, grade, gameLevel, NUM_QUESTIONS, 4);
  if (generated.length === 0) {
    setMessage("⚠️ No questions available for this level.");
    setGameOver(true);
    return;
  }
  setQuestions(generated);
}, [grade, subjectName, gameLevel]);


  const currentQuestion = questions[currentQuestionIndex];

  const startGame = () => {
    setStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setMessage('');
    setGameOver(false);
    setPoppedBalloons(new Set());
  };

  const handleBalloonClick = (optionIndex, option) => {
    if (!started || showFeedback || poppedBalloons.has(optionIndex)) return;

    setSelectedAnswer(optionIndex);
    setShowFeedback(true);

    // Add balloon to popped set
    const newPoppedBalloons = new Set(poppedBalloons);
    newPoppedBalloons.add(optionIndex);
    setPoppedBalloons(newPoppedBalloons);

    // Check if answer is correct
    const isCorrect = option === currentQuestion.answer.value;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setMessage('🎉 Correct! Well done!');
    } else {
      setMessage(`❌ Wrong! The correct answer was ${currentQuestion.answer.value}`);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex + 1 >= questions.length) {
        // Game finished
        setGameOver(true);
        setStarted(false);
        setMessage(`🎈 Game Complete! You scored ${isCorrect ? score + 1 : score}/${questions.length}!`);
      } else {
        // Next question
        setCurrentQuestionIndex(prev => prev + 1);
        setShowFeedback(false);
        setSelectedAnswer(null);
        setPoppedBalloons(new Set());
        setMessage('');
      }
    }, 2000);
  };

  const handleFinishedGame = () => {
    const currentFinished = user?.gradeLevel[user.grade - 1]?.[subjectName];
    if (gameLevel > currentFinished) {
      let newUser = { ...user };
      newUser.gradeLevel[user.grade - 1][subjectName] = gameLevel;
      updateUser(user.email, newUser);
    }
    navigate(`/subjects/${subjectName}`);
  };

  const getBalloonColor = (index) => {
    const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];
    return colors[index % colors.length];
  };

  return (
    <GameContainer gameName="Balloon Pop" gameSubject={subjectName} gameLevel={grade} icon={BalloonIcon}>
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
        
        {/* Game Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Pop the Balloon with the Correct Answer!
          </h2>
          {started && (
            <div className="flex justify-center space-x-4 text-lg font-semibold">
              <span className="text-blue-600">Question: {currentQuestionIndex + 1}/{questions.length}</span>
              <span className="text-green-600">Score: {score}</span>
            </div>
          )}
        </div>

        {/* Start Button */}
        {!started && !gameOver && (
          <div className="text-center">
            <button
              onClick={startGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-colors duration-200"
            >
              🎈 Start Balloon Game!
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="text-center space-y-4">
            <div className="text-xl font-bold text-gray-800">{message}</div>
            <div className="space-x-4">
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200"
              >
                🔄 Play Again
              </button>
              <button
                onClick={handleFinishedGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200"
              >
                ✅ Continue
              </button>
            </div>
          </div>
        )}

        {/* Current Question */}
        {started && currentQuestion && (
          <div className="space-y-8">
            {/* Question Display */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentQuestion.question}
                </h3>
              </div>
            </div>

            {/* Feedback Message */}
            {showFeedback && message && (
              <div className="text-center">
                <div className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg ${
                  message.includes('Correct') ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {message}
                </div>
              </div>
            )}

            {/* Balloons Grid */}
            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex justify-center">
                  <div
                    onClick={() => handleBalloonClick(index, option)}
                    className={`relative cursor-pointer transform transition-all duration-300 hover:scale-110 ${
                      poppedBalloons.has(index) ? 'animate-pulse scale-75 opacity-50' : ''
                    } ${showFeedback ? 'cursor-not-allowed' : ''}`}
                  >
                    {/* Balloon */}
                    <div className={`w-32 h-40 ${getBalloonColor(index)} rounded-full shadow-lg relative overflow-hidden ${
                      poppedBalloons.has(index) ? 'bg-gray-300' : ''
                    }`}>
                      {/* Balloon shine effect */}
                      <div className="absolute top-4 left-4 w-6 h-8 bg-white opacity-30 rounded-full"></div>
                      
                      {/* Answer text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-white font-bold text-lg text-center px-2 ${
                          poppedBalloons.has(index) ? 'line-through text-gray-600' : ''
                        }`}>
                          {option}
                        </span>
                      </div>

                      {/* Pop effect */}
                      {poppedBalloons.has(index) && (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                          💥
                        </div>
                      )}
                    </div>
                    
                    {/* Balloon string */}
                    <div className="w-1 h-12 bg-gray-600 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
}

export default BalloonsGame;