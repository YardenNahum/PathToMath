import React, { useState, useEffect } from 'react';
import ButtonComponent from '../../Utils/Button';
import GameContainer from './GameContainer';
import { useNavigate } from 'react-router-dom';
import successImage from '../../../assets/images/success.png';
import failureImage from '../../../assets/images/failure.png';
import generateQuestions from './GameLogic';

/**
 * Cube Game Component
 * @param {Object} props - The component props
 * @param {string} props.gameSubject - The subject of the game
 * @param {number} props.gameLevel - The level of the game
 */
export default function CubeGame({ gameSubject, gameLevel }) {
    const navigate = useNavigate();

    // Correct answers user answered
    const [correctAnswers, setCorrectAnswers] = useState(0);

    // Generated questions
    const [questions, setQuestions] = useState([]);

    // Current question
    const [currentQuestion, setCurrentQuestion] = useState(null);

    // User clicked answer
    const [clickedAnswer, setClickedAnswer] = useState({ text: '', color: '' });

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
        setClickedAnswer({ text: '', color: '' });
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
        <div className="grid grid-cols-2 gap-10">
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
        const questions = generateQuestions(gameSubject, gameLevel, numOfQuestions, numOfOptions);
        setQuestions(questions);
        setCurrentQuestion(questions[0]);
    };

    /** User Clicked Answer */
    const optionClicked = (option) => {
        // Check if the answer is correct and set the clicked answer to correct
        if (option.isCorrect) {
            setClickedAnswer({ text: "Correct!", color: "green" });
            setCorrectAnswers(prev => prev + 1);
        }
        else setClickedAnswer({ text: "Wrong!", color: "red" });

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
                isSuccess ? navigate('/') : (resetGame(), loadGameLevel());
            },
            buttonText: isSuccess ? "Back to Main" : "Try Again!",
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

    // Add effect to track currentQuestion changes
    useEffect(() => {
        console.log('Current Question:', currentQuestion);
    }, [currentQuestion]);

    return (
        <GameContainer gameName="Cube Game" gameSubject={gameSubject} gameLevel={gameLevel}>
            {/* Cube Game Container */}
            <div className={`border-8 border-blue-200 rounded-lg p-9 inline-block shadow-lg ${endGame ? endGameObject?.containerColor : 'bg-blue-100'}`}>
                {/* Question Text */}
                <div className="text-5xl font-bold mb-6 p-6">
                    {!endGame ? currentQuestion?.question : endGameObject?.text}
                </div>

                {/* Options */}
                {!endGame ? generateOptions() : endGameComponent()}
            </div>

            {/* Answer Visible */}
            {isAnswerVisible && !endGame && (
                <div className="flex flex-row items-center justify-center gap-4">
                    <div className={`text-2xl mb-4 font-bold text-${clickedAnswer.color}`}>
                        {clickedAnswer.text}
                    </div>

                    {/* Next Question Button */}
                    <div className="flex justify-center gap-10">
                    <ButtonComponent
                        label={'Next Question'}
                        onClick={nextQuestionClicked}
                        bgColor="bg-gray-100"
                        textColor="text-black"
                        size="lg"
                    />
                    </div>
                </div>
            )}
        </GameContainer>
    );
}