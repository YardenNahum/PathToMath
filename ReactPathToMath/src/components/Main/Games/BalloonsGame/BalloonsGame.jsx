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

const NUM_QUESTIONS = 5;

function BalloonsGame() {
    const { subjectGame, grade, level } = useParams();
    const subjectName = subjectGame;
    const gameLevel = parseInt(level);
    const navigate = useNavigate();
    const { user } = useUser();

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
    const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);

    useEffect(() => {
        const generated = generateQuestions(subjectName, grade, gameLevel, NUM_QUESTIONS, 4);
        setQuestions(generated);
    }, [grade, subjectName]);

    const currentQuestion = questions[currentQuestionIndex];

    const handleBalloonClick = (value) => {
        if (!currentQuestion) return;

        const isCorrect = value === currentQuestion.answer.value;
        
        if (isCorrect) {
            setScore((prev) => prev + 1);
            setShowCorrectFeedback(true);
            
            // Show correct feedback
            setTimeout(() => {
                setShowCorrectFeedback(false);
                proceedToNextQuestion();
            }, 1500);
        } else {
            setShowIncorrectFeedback(true);
            
            // Show incorrect feedback
            setTimeout(() => {
                setShowIncorrectFeedback(false);
                proceedToNextQuestion();
            }, 1500);
        }
    };

    const proceedToNextQuestion = () => {
        if (currentQuestionIndex + 1 < NUM_QUESTIONS) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setGameOver(true);
        }
    };

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
            {/* Enhanced Background */}
            <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100 -z-10">
                {/* Floating elements in background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Sun */}
                    <div className="absolute top-8 right-8 text-6xl animate-sun-glow">☀️</div>
                    
                    {/* Rainbow */}
                    <div className="absolute top-16 left-1/4 text-4xl opacity-70 animate-gentle-float">🌈</div>
                    
                    {/* Floating balloons in background */}
                    <div className="bg-balloon bg-balloon-1">🎈</div>
                    <div className="bg-balloon bg-balloon-2">🎈</div>
                    <div className="bg-balloon bg-balloon-3">🎈</div>
                </div>
            </div>

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

                        <div className="flex flex-col items-center">
                            <QuestionBox question={currentQuestion?.question} />
                            <BalloonField options={currentQuestion?.options} onBalloonClick={handleBalloonClick} />
                        </div>

                        {/* Feedback Overlays */}
                        {showCorrectFeedback && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                                <div className="bg-green-500 text-white text-4xl font-black px-12 py-8 rounded-3xl shadow-2xl animate-feedback-bounce">
                                    🎉 Correct! 🎉
                                </div>
                            </div>
                        )}

                        {showIncorrectFeedback && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                                <div className="bg-orange-500 text-white text-4xl font-black px-12 py-8 rounded-3xl shadow-2xl animate-feedback-bounce">
                                    💪 Try Again! 💪
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <EndGameScreen score={score} total={NUM_QUESTIONS} onFinish={handleFinish} />
                )}
            </GameContainer>

            <style jsx>{`
                @keyframes sun-glow {
                    0%, 100% {
                        transform: scale(1);
                        filter: brightness(1);
                    }
                    50% {
                        transform: scale(1.05);
                        filter: brightness(1.2);
                    }
                }
                
                @keyframes gentle-float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                @keyframes bg-balloon-float {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                    }
                    33% {
                        transform: translateY(-30px) translateX(20px);
                    }
                    66% {
                        transform: translateY(-15px) translateX(-10px);
                    }
                }
                
                @keyframes feedback-bounce {
                    0% {
                        transform: scale(0) rotate(-180deg);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.2) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }
                
                .animate-sun-glow {
                    animation: sun-glow 4s ease-in-out infinite;
                }
                
                .animate-gentle-float {
                    animation: gentle-float 6s ease-in-out infinite;
                }
                
                .bg-balloon {
                    position: absolute;
                    font-size: 2rem;
                    opacity: 0.3;
                    animation: bg-balloon-float 12s ease-in-out infinite;
                    pointer-events: none;
                }
                
                .bg-balloon-1 {
                    top: 20%;
                    left: 10%;
                    animation-delay: 0s;
                }
                
                .bg-balloon-2 {
                    top: 40%;
                    right: 15%;
                    animation-delay: 4s;
                }
                
                .bg-balloon-3 {
                    bottom: 30%;
                    left: 20%;
                    animation-delay: 8s;
                }
                
                .animate-feedback-bounce {
                    animation: feedback-bounce 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}

export default BalloonsGame;