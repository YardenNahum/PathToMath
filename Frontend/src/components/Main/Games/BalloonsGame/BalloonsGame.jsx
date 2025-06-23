import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import GameContainer from '../GamesUtils/GameContainer.jsx';
import generateQuestions from '../GamesUtils/GameLogic';
import BalloonField from './BalloonField';
import QuestionBox from './QuestionBox';
import { useUpdateQuiz } from '../../PopQuizPage/UpdateQuiz.jsx';
import EndGameScreen from './EndGameScreen';
import { useUser } from '../../../Utils/UserContext';
import TitleIcon3 from '../../../../assets/Images/BalloonGame/BalloonsGameIcon.png';
import BalloonsBg from '../../../../assets/Images/BalloonGame/BalloonsBg.jpg';
import updateUserProgress from '../GamesUtils/UpdateUserProgress.jsx';

// Constants
const NUM_QUESTIONS = 5;

function BalloonsGame() {
    // Extract parameters from the URL
    const { subjectGame, grade, level } = useParams();
    const subjectName = subjectGame;
    const gameLevel = parseInt(level);
    const navigate = useNavigate();
    const location = useLocation();
    const updateQuiz = useUpdateQuiz();

    const { user,update } = useUser();
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
            //update user progress based on success
            updateUserProgress({
                isSuccess: score >= 4,
                location,
                user,
                update,
                updateQuiz,
                gameLevel: parseInt(level),
                gameSubject: subjectGame
            });

        }
    };
    // Handle game finish
    const handleFinish = () => {
        if (location.state?.fromQuiz) {
            updateQuiz();
            navigate("/");
        }
        else {
            const currentFinished = user?.gradeLevel[user.grade - 1]?.[subjectName];
            if (score >= 4 && gameLevel > currentFinished) {
                let newUser = user;
                newUser.gradeLevel[user.grade - 1][subjectName] = gameLevel;
                updateUser(user.email, newUser);
            }
            navigate(`/subjects/${subjectName}`, { state: { fromGame: true } });
        }
    };


    return (
        <GameContainer
            gameName="Poppin' Problems"
            gameSubject={subjectName}
            gameLevel={gameLevel}
            icon={TitleIcon3}
            backgroundImage={BalloonsBg}
        >
            <div className="bg-pink-100 rounded-3xl p-4 shadow-lg mb-5 max-w-3xl mx-auto">
                {!gameOver ? (
                    <div className="relative mb-10">
                        {/* Progress Bar */}
                        <div className="mb-8 mt-5 w-full max-w-md mx-auto">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-600">Progress</span>
                                <span className="text-sm font-semibold text-gray-600">
                                    {currentQuestionIndex + 1}/{NUM_QUESTIONS}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-yellow-200 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
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
            </div>
        </GameContainer>
    );
}

export default BalloonsGame;