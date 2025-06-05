import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameContainer from '../GameContainer';
import generateQuestions from '../GameLogic';
import BalloonField from './BalloonField';
import QuestionBox from './QuestionBox';
import EndGameScreen from './EndGameScreen';
import { useUser } from '../../../Utils/UserContext';
import { updateUser } from '../../../../services/UserService';
import TitleIcon from '../../../../assets/Images/BalloonGame/balloon_icon.png';
// Constants
const NUM_QUESTIONS = 5;

function BalloonsGame() {
    // Extract parameters from the URL
    const { subjectGame, grade, level } = useParams();
    const subjectName = subjectGame;
    const gameLevel = parseInt(level);
    const navigate = useNavigate();
    const { user } = useUser();
    // State variables
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
    const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);

    // Generate questions when the component mounts or when grade or subjectName changes
    // This will ensure that the questions are generated based on the current subject and grade
    useEffect(() => {
        const generated = generateQuestions(subjectName, grade, gameLevel, NUM_QUESTIONS, 4);
        setQuestions(generated);
    }, [grade, subjectName]);

    const currentQuestion = questions[currentQuestionIndex];
    // Handle balloon click
    const handleBalloonClick = (value) => {
        if (!currentQuestion) return;

        const isCorrect = value === currentQuestion.answer.value;

        if (isCorrect) {
            setScore((prev) => prev + 1);
            setShowCorrectFeedback(true);
            setTimeout(() => {
                setShowCorrectFeedback(false);
                proceedToNextQuestion();
            }, 1500);
        } else {
            setShowIncorrectFeedback(true);
            setTimeout(() => {
                setShowIncorrectFeedback(false);
                proceedToNextQuestion();
            }, 1500);
        }
    };
    // Proceed to the next question or end the game if all questions are answered
    const proceedToNextQuestion = () => {
        if (currentQuestionIndex + 1 < NUM_QUESTIONS) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setGameOver(true);
        }
    };
    // Handle game finish
    const handleFinish = () => {
        const currentFinished = user?.gradeLevel[user.grade - 1]?.[subjectName];
        if (score >= 4 && gameLevel > currentFinished) {
            let newUser = user;
            newUser.gradeLevel[user.grade - 1][subjectName] = gameLevel;
            updateUser(user.email, newUser);
        }
        navigate(`/subjects/${subjectName}`);
    };

    return (
        <div className="relative min-h-screen">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100 -z-10">
                {/* Floating elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Sun */}
                    <div className="absolute top-8 right-8 text-6xl animate-pulse">☀️</div>

                    {/* Rainbow */}
                    <div className="absolute top-16 left-1/4 text-4xl opacity-70 animate-bounce">🌈</div>

                    {/* Floating Balloons */}
                    <div className="absolute top-1/5 left-10 text-4xl opacity-30 animate-bounce">🎈</div>
                    <div className="absolute top-2/5 right-16 text-4xl opacity-30 animate-bounce delay-1000">🎈</div>
                    <div className="absolute bottom-1/3 left-20 text-4xl opacity-30 animate-bounce delay-2000">🎈</div>
                </div>
            </div>
            {/* Game Container */}
            <GameContainer
                gameName="Balloons Game"
                gameSubject={subjectName}
                gameLevel={gameLevel}
                icon={TitleIcon}
            >
                
                {!gameOver ? (
                    <div className="relative">
                        {/* Progress Bar */}
                        <div className="mb-8 w-full max-w-md mx-auto">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-600">Progress</span>
                                <span className="text-sm font-semibold text-gray-600">
                                    {currentQuestionIndex + 1}/{NUM_QUESTIONS}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${((currentQuestionIndex + 1) / NUM_QUESTIONS) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Game Field */}
                        <div className="flex flex-col items-center">
                            <QuestionBox question={currentQuestion?.question} />
                            <BalloonField options={currentQuestion?.options} onBalloonClick={handleBalloonClick} />
                        </div>

                        {/* Feedback Overlays */}
                        {showCorrectFeedback && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                                <div className="bg-green-500 text-white text-4xl font-black px-12 py-8 rounded-3xl shadow-2xl animate-bounce">
                                    🎉 Correct! 🎉
                                </div>
                            </div>
                        )}

                        {showIncorrectFeedback && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                                <div className="bg-orange-500 text-white text-4xl font-black px-12 py-8 rounded-3xl shadow-2xl animate-bounce">
                                    💪 Try Again! 💪
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <EndGameScreen score={score} total={NUM_QUESTIONS} onFinish={handleFinish} />
                )}
            </GameContainer>
        </div>
    );
}

export default BalloonsGame;