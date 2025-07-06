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
import useSound from 'use-sound';
import BalloonPopSound from '../../../../assets/sounds/BalloonsGame/balloonPop.mp3';
import useGameSounds from '../GamesUtils/Sounds.jsx'

const NUM_QUESTIONS = 5;  // Total number of questions in the game

/**
 * BalloonsGame component is an interactive game where players answer math questions
 * by popping balloons that represent different answer choices.
 * 
 * It includes score tracking, visual feedback, and user progress updates.
 */
function BalloonsGame() {
    const { subjectGame, grade, level } = useParams();  // Extract parameters from the URL
    const subjectName = subjectGame;
    const gameLevel = parseInt(level);

    const navigate = useNavigate();
    const location = useLocation();
    const updateQuiz = useUpdateQuiz();
    const { user, update } = useUser();
    
    // Sound effects
    const {winLevelSound,loseSound,wrongAnswerSound,correctQuestionSound} = useGameSounds();
    const [balloonPopSound] = useSound(BalloonPopSound, { volume: 0.3 });

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

    /**
     * Handle click on a balloon.
     * Checks if the selected answer is correct and shows feedback.
     * Then proceeds to the next question.
     */
    const handleBalloonClick = (value) => {
        if (!currentQuestion) return;

        // Play balloon pop sound for any balloon click
        balloonPopSound();

        const isCorrect = value === currentQuestion.answer.value;

        if (isCorrect) {
            setScore((prev) => prev + 1);
            setShowCorrectFeedback(true);
            correctQuestionSound(); // Play correct answer sound
            setTimeout(() => {
                setShowCorrectFeedback(false);
                proceedToNextQuestion();
            }, 1500);
        } else {
            setShowIncorrectFeedback(true);
            // Delay wrong answer sound slightly to avoid conflict with balloon pop sound
            setTimeout(() => {
                wrongAnswerSound(); // Play wrong answer sound
            }, 100);
            setTimeout(() => {
                setShowIncorrectFeedback(false);
                proceedToNextQuestion();
            }, 1500);
        }
    };

    /**
     * Proceed to the next question or end the game if all are completed.
     * Triggers progress update if game is over.
     */
    const proceedToNextQuestion = () => {
        if (currentQuestionIndex + 1 < NUM_QUESTIONS) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setGameOver(true);
            
            // Play win or lose sound based on score
            if (score >= 3) {
                winLevelSound(); // Play win sound for passing score
            } else {
                loseSound(); // Play lose sound for failing score
            }
            
            //update user progress based on success
            updateUserProgress({
                isSuccess: score >= 3,
                location,
                user,
                update,
                updateQuiz,
                gameLevel: parseInt(level),
                gameSubject: subjectGame
            });
        }
    };

    /**
     * Handle final steps when the game ends.
     * Navigates based on context (quiz or regular game mode),
     * and updates user's level progress if necessary.
     */
    const handleFinish = () => {
        if (location.state?.fromQuiz) {
            navigate("/");
        }
        else {
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
            howToPlay={"Pop the balloon with the correct answer to the question! Score at least 4 out of 5 to pass the level."}
        >
            <div className="bg-pink-100 rounded-3xl p-4 shadow-lg mb-5 max-w-3xl mx-auto">
                {!gameOver ? (
                    <div className="relative mb-10">
                        {/* Progress Bar */}
                        <div className="mb-8 mt-5 w-full max-w-md mx-auto">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-600">You Answered:</span>
                                <span className="text-sm font-semibold text-gray-600">
                                    {currentQuestionIndex}/{NUM_QUESTIONS} Questions
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-yellow-200 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${((currentQuestionIndex) / NUM_QUESTIONS) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Main Game Area: Question + Balloons */}
                        <div className="flex flex-col items-center">
                            <QuestionBox question={currentQuestion?.question} />
                            <BalloonField options={currentQuestion?.options} onBalloonClick={handleBalloonClick} />
                        </div>

                        {/* Correct Feedback Overlay */}
                        {showCorrectFeedback && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                                <div className="bg-green-500 text-white text-4xl font-black px-12 py-8 rounded-3xl shadow-2xl animate-bounce">
                                    🎉 Correct! 🎉
                                </div>
                            </div>
                        )}

                        {/* Incorrect Feedback Overlay */}
                        {showIncorrectFeedback && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                                <div className="bg-orange-500 text-white text-4xl font-black px-12 py-8 rounded-3xl shadow-2xl animate-bounce">
                                    💪 Try Again! 💪
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // End screen after all questions
                    <EndGameScreen score={score} total={NUM_QUESTIONS} onFinish={handleFinish} />
                )}
            </div>
        </GameContainer>
    );
}

export default BalloonsGame;