import React, { useState, useEffect } from 'react';
import ButtonComponent from '../../Utils/Button';
import GameContainer from './GameContainer';
import { useNavigate } from 'react-router-dom';
import successImage from '../../../assets/images/success.png';
import failureImage from '../../../assets/images/failure.png';

/** Subject Map */
const subjectMap = {
    "Addition": {
        "mathAction": "+",
        "function": (a, b) => a + b
    },
    "Subtraction": {
        "mathAction": "-",
        "function": (a, b) => a - b
    },
    "Multiplication": {
        "mathAction": "X",
        "function": (a, b) => a * b
    },
    "Division": {
        "mathAction": "/",
        "function": (a, b) => a / b
    },
    "Percentage": {
        "mathAction": "%",
        "function": (a, b) => a / b * 100
    }
};

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

    // Number of questions
    const numOfQuestions = 5;

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

    /** Generate Variable */
    const generateVariable = () => {
        let mathLevel = Math.floor(gameLevel / 10) + 1;
        let min = 1 + (mathLevel - 1) * 5;
        let max = 10 * mathLevel;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /** Generate Option */
    const generateOption = (answer) => {
        const offset = Math.max(2, (Math.floor(gameLevel / 10) + 1) * 2);
        const minBorder = answer - offset;
        const maxBorder = answer + offset;
        const option = (Math.random() * (maxBorder - minBorder) + minBorder);
        return Math.round(option);
    };

    /** Make Question */
    const makeQuestion = () => {
        const mathAction = subjectMap[gameSubject].mathAction;
        const mathFunction = subjectMap[gameSubject].function;

        const var1 = generateVariable();
        const var2 = generateVariable();
        const answer = mathFunction(var1, var2);

        let options = [];
        let questionText;

        // Generate 3 fake answers
        while (options.length < 3) {
            const fakeAnswer = generateOption(answer);
            if (options.indexOf(fakeAnswer) === -1 && fakeAnswer !== answer) {
                options.push(fakeAnswer);
            }
        }

        // Insert the correct answer in a random position
        const insertIndex = Math.floor(Math.random() * options.length + 1);
        options.splice(insertIndex, 0, answer);

        // Generate the question text
        if (gameSubject === "Percentage") {
            questionText = `What percent is ${var1} of ${var2}?`;
        } else {
            questionText = `What's ${var1} ${mathAction} ${var2}?`;
        }

        return {
            question: questionText,
            var1,
            var2,
            answer,
            options
        };
    };

    const optionBgColor = (option) => {
        if (selectedOption) {
            // Correct answer clicked or displayed when clicked on wrong answer
            if (option === currentQuestion.answer) return "bg-green-400";

            // Wrong answer selected
            if (option === selectedOption && option !== currentQuestion.answer) return "bg-red-400";
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
                    id={option}
                    onClick={() => optionClicked(currentQuestion.answer, option)}
                    label={gameSubject === "Percentage" ? `${option}%` : option}
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

        const newQuestions = [];
        while (newQuestions.length < numOfQuestions) {
            // Generate a new question
            const question = makeQuestion();
            let isDuplicate = false;

            // Check if the question is a duplicate of any existing questions
            for (const existing of newQuestions) {
                const isSameOrder = question.var1 === existing.var1 && question.var2 === existing.var2;
                const isReversedOrder = question.var1 === existing.var2 && question.var2 === existing.var1;

                if ((gameSubject === "Addition" || gameSubject === "Multiply") && (isSameOrder || isReversedOrder)) {
                    isDuplicate = true;
                    break;
                } else if (isSameOrder) {
                    isDuplicate = true;
                    break;
                }
            }

            // If the question is not a duplicate, add it to the list
            if (!isDuplicate) newQuestions.push(question);
        }

        // Set the questions for the game and the current question as the first in the array
        setQuestions(newQuestions);
        setCurrentQuestion(newQuestions[0]);
    };

    /** User Clicked Answer */
    const optionClicked = (answer, option) => {
        // Check if the answer is correct and set the clicked answer to correct
        if (option === answer) {
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