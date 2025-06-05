import React, { useState, useEffect } from 'react';
import ButtonComponent from '../../Utils/Button';
import GameContainer from './GameContainer';
import { useNavigate } from 'react-router-dom';
import successImage from '../../../assets/images/success.png';
import failureImage from '../../../assets/images/failure.png';
import generateQuestions from './GameLogic';
import { useParams } from 'react-router-dom';
import { useUser } from '../../Utils/UserContext';
import TitleIcon from '../../../assets/Images/OptionsIcon.png'
/**
 * Options Game Component
 */
export default function OptionsGame() {
    const { subjectGame, grade, level } = useParams();
    const gameSubject = subjectGame;
    const gameLevel = parseInt(level);
    const navigate = useNavigate();
    const { user,update } = useUser();

    // Correct answers user answered
    const [correctAnswers, setCorrectAnswers] = useState(0);

    // Generated questions
    const [questions, setQuestions] = useState([]);

    // Current question
    const [currentQuestion, setCurrentQuestion] = useState(null);

    // Answer visible
    const [isAnswerVisible, setIsAnswerVisible] = useState(false);

    // Flag for disabling buttons
    const [disableButtons, setDisableButtons] = useState(false);

    // Flag for ending the game
    const [endGame, setEndGame] = useState(false);

    // End game object
    const [endGameObject, setEndGameObject] = useState(null);

    // Selected option
    const [selectedOption, setSelectedOption] = useState(null);

    const numOfQuestions = 5;
    const numOfOptions = 4;

    /** Reset Game */
    const resetGame = () => {
        setCurrentQuestion(null);
        setDisableButtons(false);
        setIsAnswerVisible(false);
        setEndGame(false);
        setEndGameObject(null);
        setSelectedOption(null);
    };

    /** Option Background Color */
    const optionBgColor = (option) => {
        if (selectedOption) {
            let answerValue = currentQuestion.answer.value;
            let selectedValue = option.value;

            // Correct answer clicked or displayed when clicked on wrong answer
            if (selectedValue === answerValue) return "bg-green-400";

            // Wrong answer selected
            if (selectedValue === selectedOption.value && selectedValue !== answerValue) return "bg-red-400";
        }
        return "bg-gray-100";
    };

    /** Generate Options */
    const generateOptions = () => {
        return (
            <div className="grid grid-cols-2 gap-10 mb-10">
                {currentQuestion?.options.map((option, index) => (
                    <ButtonComponent
                        key={index}
                        id={option.value}
                        onClick={() => optionClicked(option)}
                        label={gameSubject === "Percentage" ? `${option.textValue}%` : option.textValue}
                        bgColor={optionBgColor(option)}
                        textColor="text-black"
                        size="lg"
                        disabled={disableButtons}
                    />
                ))}
            </div>
        );
    };

    /** Load new game level */
    const loadGameLevel = () => {
        setQuestions([]);
        setCorrectAnswers(0);

        // Set the questions for the game and the current question as the first in the array
        const questions = generateQuestions(gameSubject, grade, gameLevel, numOfQuestions, numOfOptions);
        setQuestions(questions);
        setCurrentQuestion(questions[0]);
    };

    /** User Clicked Answer */
    const optionClicked = (option) => {
        // Check if the answer is correct and set the clicked answer to correct
        if (option.isCorrect) setCorrectAnswers(prev => prev + 1);


        // Set the selected option and disable the buttons
        setSelectedOption(option);
        setDisableButtons(true);

        // Set the answer visible
        setIsAnswerVisible(true);
    };

    /** User Clicked Next Question */
    const nextQuestionClicked = () => {
        // Remove the first question from the array
        questions.shift();

        // Set the questions for the game and the current question as the first in the array
        setQuestions(questions);
        resetGame();

        // If there are remaining questions, set the current question as the first in the array
        questions.length >= 1 ? setCurrentQuestion(questions[0]) : generateEnd();
    };

    /** Generate End */
    const generateEnd = () => {
        // Check if the user answered 4 or more questions correctly
        const isSuccess = correctAnswers >= 4;

        // Set the end game object
        setEndGameObject({
            bgColor: isSuccess ? "bg-green-200" : "bg-red-200",
            text: `${isSuccess ? 'Great!' : 'Oh no!'} You answered ${correctAnswers} / ${numOfQuestions} Correct Answers.`,
            color: isSuccess ? "green" : "red",
            imgURL: isSuccess ? successImage : failureImage,
            headerText: isSuccess ? "Continue to the next level!" : "Try Again?",
            handleClick: () => {
                if (isSuccess) {
                    const currentFinished = user?.gradeLevel[user.grade - 1]?.[gameSubject];
                    if (gameLevel > currentFinished) {
                        let newUser = user;
                        newUser.gradeLevel[user.grade - 1][gameSubject] = gameLevel;
                        update(user.email, newUser);
                    }
                    navigate(`/subjects/${gameSubject}`);
                }
                else {
                    resetGame();
                    loadGameLevel();
                }
            },
            buttonText: isSuccess ? "Next Level" : "Try Again!",
            containerColor: isSuccess ? "bg-green-100" : "bg-red-100"
        });

        // Set the end game flag
        setEndGame(true);
    };

    /** End Game Component */
    const endGameComponent = () => {
        return (
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
        )
    };

    /** Reset game and load game level on mount */
    useEffect(() => {
        resetGame();
        loadGameLevel();
    }, [gameSubject, gameLevel]);

    return (
        <GameContainer gameName="Options Game" gameSubject={gameSubject} gameLevel={gameLevel} icon={TitleIcon}>
            {/* Cube Game Container */}
            <div className={`border-8 border-white rounded-lg p-9 inline-block shadow-lg ${endGame ? endGameObject?.containerColor : 'bg-blue-100'}`}>
                {/* Question Text */}
                <div className="text-5xl font-bold mb-6 p-6">
                    {!endGame ? currentQuestion?.question : endGameObject?.text}
                </div>

                {/* Options */}
                {!endGame ? generateOptions() : endGameComponent()}

                {/* Answer Visible */}
                {isAnswerVisible && !endGame && (
                    <div className="flex justify-center gap-10">
                        <ButtonComponent
                            label={'Next Question'}
                            onClick={nextQuestionClicked}
                            bgColor="bg-yellow-400"
                            textColor="text-black"
                            size="lg"
                        />
                    </div>
                )}
            </div>
        </GameContainer>
    );
}