import React, { useState, useEffect } from 'react';
import ButtonComponent from '../../../Utils/Button.jsx';
import GameContainer from '../GamesUtils/GameContainer.jsx';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import successImage from '../../../../assets/Images/Games/success.png';
import failureImage from '../../../../assets/Images/Games/failure.png';
import generateQuestions from '../GamesUtils/GameLogic.jsx';
import { useUser } from '../../../Utils/UserContext.jsx';
import TitleIcon from '../../../../assets/Images/Games/OptionsIcon.png';
import OptionsBg from '../../../../assets/Images/Background/optionsBg.jpg';
import { useUpdateQuiz } from '../../PopQuizPage/UpdateQuiz.jsx';
import MultipleChoiceCard from './MultipleChoiceCard.jsx';
import updateUserProgress from '../GamesUtils/UpdateUserProgress.jsx';
/**
 * OptionsGame component represents a multiple-choice quiz game with progression logic.
 * It loads questions based on subject, grade, and level, tracks correct answers,
 * shows feedback, and handles end-of-game logic including user progression.
 * 
 * Uses React Router for navigation and URL params.
 * 
 * @component
 * @returns {JSX.Element} Rendered OptionsGame component
 */
export default function OptionsGame() {
    const { subjectGame, grade, level } = useParams();  // URL params for subject, grade, and level
    const gameSubject = subjectGame;
    const gameLevel = parseInt(level);

    // React Router navigation and location
    const navigate = useNavigate();
    const location = useLocation();

    const { user, update } = useUser(); // User context for current user data and update function
    const updateQuiz = useUpdateQuiz(); // Hook to update quiz state (used if navigating from a quiz)

    // Local component states:
    const [correctAnswers, setCorrectAnswers] = useState(0);    // Number of correct answers so far
    const [questions, setQuestions] = useState([]); // Array of current questions
    const [currentQuestion, setCurrentQuestion] = useState(null); // Current question being displayed
    const [isAnswerVisible, setIsAnswerVisible] = useState(false); // Whether to reveal answer feedback
    const [disableButtons, setDisableButtons] = useState(false); // Whether option buttons are disabled (after selection)
    const [endGame, setEndGame] = useState(false);             // Whether game is over
    const [endGameObject, setEndGameObject] = useState(null);  // Object holding end game UI data (messages, colors, handlers)
    const [selectedOption, setSelectedOption] = useState(null); // Currently selected option by the player

    const numOfQuestions = 5;  // Total number of questions per game level
    const numOfOptions = 4;    // Number of options per question

    /**
     * Resets the game state to start fresh for the next question or game.
     */
    const resetGame = () => {
        setCurrentQuestion(null);
        setDisableButtons(false);
        setIsAnswerVisible(false);
        setEndGame(false);
        setEndGameObject(null);
        setSelectedOption(null);
    };

    /**
     * Loads questions for the current game subject, grade, and level.
     * Sets the first question as current and resets correct answers count.
     */
    const loadGameLevel = () => {
        const questions = generateQuestions(gameSubject, grade, gameLevel, numOfQuestions, numOfOptions);
        setQuestions(questions);
        setCurrentQuestion(questions[0]);
        setCorrectAnswers(0);
    };

    /**
     * Handler for when an option is clicked.
     * Updates the count of correct answers if the option is correct,
     * disables option buttons, and shows the answer.
     * 
     * @param {Object} option - The option object clicked (contains isCorrect flag)
     */
    const optionClicked = (option) => {
        if (option.isCorrect) {
            setCorrectAnswers(prev => prev + 1);
        }
        setSelectedOption(option);
        setDisableButtons(true);
        setIsAnswerVisible(true);
    };

    /**
     * Handler for clicking the "Next Question" button.
     * Removes the current question from the queue,
     * resets UI state, and moves to the next question or ends the game.
     */
    const nextQuestionClicked = () => {
        questions.shift();  // Remove first question
        setQuestions([...questions]);  // Trigger state update with new questions array
        resetGame();
        questions.length >= 1 ? setCurrentQuestion(questions[0]) : generateEnd();
    };

    /**
     * Generates the end game screen data based on player's performance.
     * If success, updates user progress and navigates accordingly.
     * If failure, offers retry.
     */

    const generateEnd = () => {
        const isSuccess = correctAnswers >= 4;
        //update user progress based on success
        updateUserProgress({
            isSuccess: isSuccess,
            location,
            user,
            update,
            updateQuiz,
            gameLevel: parseInt(level),
            gameSubject: subjectGame
        }); setEndGameObject({
            bgColor: isSuccess ? "bg-green-200" : "bg-red-200",
            text: `${isSuccess ? 'Great!' : 'Oh no!'} You answered ${correctAnswers} / ${numOfQuestions} Correct Answers.`,
            color: isSuccess ? "green" : "red",
            imgURL: isSuccess ? successImage : failureImage,
            headerText: isSuccess ? "Continue to the next level!" : "Try Again?",
            handleClick: () => {
                if (isSuccess) {
                    if (location.state?.fromQuiz) {
                        navigate("/");
                    } else {
                        navigate(`/subjects/${gameSubject}`, { state: { fromGame: true } });
                    }
                } else {
                    // Retry current level
                    resetGame();
                    loadGameLevel();
                }
            },
            buttonText: isSuccess ? (location.state?.fromQuiz ? "Finish quiz" : "Next Level") : "Try Again!",
            containerColor: isSuccess ? "bg-green-100" : "bg-red-100"
        });
        setEndGame(true);
    };

    /**
     * JSX component for the end game UI display with image and button.
     */
    const endGameComponent = () => (
        <div className="flex flex-col items-center justify-center gap-4">
            <img
                className="h-60 w-auto max-w-full object-contain"
                src={endGameObject?.imgURL}
                alt={endGameObject?.color === "green" ? "Success" : "Failure"}
            />
            <ButtonComponent
                label={endGameObject?.buttonText}
                onClick={endGameObject?.handleClick}
                textColor="text-black"
                bgColor={endGameObject?.bgColor}
            />
        </div>
    );

    // On component mount or when subject/level changes, reset and load new questions
    useEffect(() => {
        resetGame();
        loadGameLevel();
    }, [gameSubject, gameLevel]);

    return (
        <GameContainer
            gameName="Quest for the Golden Answer"
            gameSubject={gameSubject}
            gameLevel={gameLevel}
            icon={TitleIcon}
            backgroundImage={OptionsBg}
        >
            <div className="flex justify-center">
                <div className={`mb-5 border-8 border-amber-400 rounded-lg p-9 inline-block shadow-lg ${endGame ? endGameObject?.containerColor : 'bg-gray-700'}`}>
                    <div className={`text-5xl ${endGame ? 'text-black' : 'text-white'} mb-6 p-6 text-center`}>
                        {!endGame ? currentQuestion?.question : endGameObject?.text}
                    </div>

                    <div className="flex justify-center">
                        {!endGame && currentQuestion ? (
                            <MultipleChoiceCard
                                question={currentQuestion}
                                onOptionClick={optionClicked}
                                selectedOption={selectedOption}
                                subject={gameSubject}
                                isAnswerVisible={isAnswerVisible}
                                disableButtons={disableButtons}
                            />
                        ) : (
                            endGameComponent()
                        )}
                    </div>

                    {isAnswerVisible && !endGame && (
                        <div className="flex justify-center gap-10">
                            <ButtonComponent
                                label="Next Question"
                                onClick={nextQuestionClicked}
                                bgColor="bg-yellow-400"
                                textColor="text-black"
                                size="lg"
                            />
                        </div>
                    )}
                </div>
            </div>
        </GameContainer>
    );
}
