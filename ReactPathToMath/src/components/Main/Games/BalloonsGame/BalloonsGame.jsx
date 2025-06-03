import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameContainer from '../GameContainer';
import { useUser } from '../../../Utils/UserContext';
import { updateUser } from '../../../../services/UserService';

const BalloonsGame = () => {
    const MAX_TRIES = 2;
    const MAX_QUESTIONS = 5;

    const { subjectGame, grade, level } = useParams();
    const gameSubject = subjectGame;
    const gameLevel = parseInt(level);
    const navigate = useNavigate();

    // Generate questions based on subject and grade
    const generate_question = () => {
        const gradeNum = parseInt(grade);
        let question, correctAnswer, options;

        switch (gameSubject.toLowerCase()) {
            case 'addition':
                // Addition problems based on grade
                if (gradeNum <= 2) {
                    const num1 = Math.floor(Math.random() * 10) + 1;
                    const num2 = Math.floor(Math.random() * 10) + 1;
                    question = `${num1} + ${num2}`;
                    correctAnswer = num1 + num2;
                } else if (gradeNum <= 4) {
                    const num1 = Math.floor(Math.random() * 50) + 10;
                    const num2 = Math.floor(Math.random() * 50) + 10;
                    question = `${num1} + ${num2}`;
                    correctAnswer = num1 + num2;
                } else {
                    const num1 = Math.floor(Math.random() * 100) + 50;
                    const num2 = Math.floor(Math.random() * 100) + 50;
                    question = `${num1} + ${num2}`;
                    correctAnswer = num1 + num2;
                }
                break;

            case 'subtraction':
                // Subtraction problems based on grade
                if (gradeNum <= 2) {
                    const num1 = Math.floor(Math.random() * 15) + 5;
                    const num2 = Math.floor(Math.random() * num1) + 1;
                    question = `${num1} - ${num2}`;
                    correctAnswer = num1 - num2;
                } else if (gradeNum <= 4) {
                    const num1 = Math.floor(Math.random() * 50) + 20;
                    const num2 = Math.floor(Math.random() * num1) + 5;
                    question = `${num1} - ${num2}`;
                    correctAnswer = num1 - num2;
                } else {
                    const num1 = Math.floor(Math.random() * 200) + 100;
                    const num2 = Math.floor(Math.random() * num1) + 10;
                    question = `${num1} - ${num2}`;
                    correctAnswer = num1 - num2;
                }
                break;

            case 'multiplication':
                // Multiplication problems based on grade
                if (gradeNum <= 2) {
                    const num1 = Math.floor(Math.random() * 5) + 1;
                    const num2 = Math.floor(Math.random() * 5) + 1;
                    question = `${num1} × ${num2}`;
                    correctAnswer = num1 * num2;
                } else if (gradeNum <= 4) {
                    const num1 = Math.floor(Math.random() * 10) + 1;
                    const num2 = Math.floor(Math.random() * 10) + 1;
                    question = `${num1} × ${num2}`;
                    correctAnswer = num1 * num2;
                } else {
                    const num1 = Math.floor(Math.random() * 12) + 1;
                    const num2 = Math.floor(Math.random() * 12) + 1;
                    question = `${num1} × ${num2}`;
                    correctAnswer = num1 * num2;
                }
                break;

            case 'division':
                // Division problems based on grade
                if (gradeNum <= 2) {
                    const num2 = Math.floor(Math.random() * 5) + 1;
                    const correctAnswer = Math.floor(Math.random() * 10) + 1;
                    const num1 = num2 * correctAnswer;
                    question = `${num1} ÷ ${num2}`;
                } else if (gradeNum <= 4) {
                    const num2 = Math.floor(Math.random() * 10) + 1;
                    const correctAnswer = Math.floor(Math.random() * 12) + 1;
                    const num1 = num2 * correctAnswer;
                    question = `${num1} ÷ ${num2}`;
                } else {
                    const num2 = Math.floor(Math.random() * 12) + 1;
                    const correctAnswer = Math.floor(Math.random() * 15) + 1;
                    const num1 = num2 * correctAnswer;
                    question = `${num1} ÷ ${num2}`;
                }
                break;

            case 'percentage':
                // Percentage problems based on grade
                if (gradeNum <= 3) {
                    // Simple percentage of 100
                    const percentage = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)];
                    question = `${percentage}% of 100`;
                    correctAnswer = percentage;
                } else if (gradeNum <= 4) {
                    // Percentage of simple numbers
                    const percentage = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
                    const number = [20, 40, 60, 80, 100][Math.floor(Math.random() * 5)];
                    question = `${percentage}% of ${number}`;
                    correctAnswer = (percentage * number) / 100;
                } else {
                    // More complex percentage problems
                    const percentage = Math.floor(Math.random() * 50) + 10;
                    const number = Math.floor(Math.random() * 100) + 50;
                    question = `${percentage}% of ${number}`;
                    correctAnswer = Math.round((percentage * number) / 100);
                }
                break;

            default:
                // Default to addition if subject not recognized
                const num1 = Math.floor(Math.random() * 10) + 1;
                const num2 = Math.floor(Math.random() * 10) + 1;
                question = `${num1} + ${num2}`;
                correctAnswer = num1 + num2;
        }

        // Generate 4 options with one correct answer
        options = generate_options(correctAnswer);
        
        return { question, correctAnswer, options };
    };

    const generate_options = (correctAnswer) => {
        const options = [correctAnswer];
        
        while (options.length < 4) {
            let wrongAnswer;
            
            // Generate wrong answers based on the correct answer range
            if (correctAnswer <= 20) {
                wrongAnswer = Math.floor(Math.random() * 30) + 1;
            } else if (correctAnswer <= 100) {
                wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
            } else {
                wrongAnswer = correctAnswer + Math.floor(Math.random() * 50) - 25;
            }
            
            if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer) && wrongAnswer > 0) {
                options.push(wrongAnswer);
            }
        }
        
        // Shuffle the options
        return options.sort(() => Math.random() - 0.5);
    };

    const check_answer = (selectedAnswer) => {
        setIsDisabled(true);
        setPoppedBalloons(prev => [...prev, selectedAnswer]);
        
        if (selectedAnswer === correctAnswer) {
            setFeedbackMessage("🎉 Correct! Great job!");
            setCorrect(prev => prev + 1);
        } else {
            if (tries > 1) {
                setFeedbackMessage(`❌ Incorrect! You have ${tries - 1} tries left.`);
                setTries(prev => prev - 1);
                setTimeout(() => {
                    setIsDisabled(false);
                    setFeedbackMessage("");
                }, 1500);
                return;
            } else {
                setFeedbackMessage(`❌ Wrong! The correct answer was ${correctAnswer}`);
            }
        }
        
        if (question === MAX_QUESTIONS - 1) {
            setNext("Finish game");
        } else {
            setNext("Next question");
        }
    };

    const renderGame = () => {
        if (question < MAX_QUESTIONS - 1) {
            setFeedbackMessage("");
            setPoppedBalloons([]);
            setNext("");
            setTries(MAX_TRIES);
            setIsDisabled(false);
            setQuestion(prev => prev + 1);
            setGame(generate_question());
        } else {
            setGameFinished(true);
            setFeedbackMessage(`🎉 You answered ${correct}/${MAX_QUESTIONS} questions correctly!`);
        }
    };

    const getBalloonColor = (index) => {
        const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400'];
        return colors[index];
    };

    // State variables
    const [isDisabled, setIsDisabled] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [next, setNext] = useState("");
    const [tries, setTries] = useState(MAX_TRIES);
    const [question, setQuestion] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [game, setGame] = useState(generate_question);
    const [gameFinished, setGameFinished] = useState(false);
    const [poppedBalloons, setPoppedBalloons] = useState([]);

    const { question: questionText, correctAnswer, options } = game;

    // Handle finished game
    const { user } = useUser();
    const handleFinishedGame = () => {
        const currentFinished = user?.gradeLevel[user.grade - 1]?.[gameSubject];
        if (currentFinished && gameLevel > currentFinished) {
            let newUser = { ...user };
            newUser.gradeLevel[user.grade - 1][gameSubject] = gameLevel;
            updateUser(user.email, newUser);
        }
        navigate(`/subjects/${gameSubject}`);
    };

    return (
        <GameContainer gameName="🎈 Balloon Pop" gameSubject={gameSubject}>
            {gameFinished ? (
                <div className="flex flex-col items-center justify-center text-center bg-white rounded-lg p-8 shadow-lg">
                    <h2 className="text-3xl font-semibold text-green-600 mb-4">
                        {feedbackMessage}
                    </h2>
                    <button
                        className="bg-blue-500 text-white mt-6 px-6 py-3 rounded-lg text-xl hover:bg-blue-600 transition-colors"
                        onClick={handleFinishedGame}
                    >
                        Back to {gameSubject} levels
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow-lg">
                    {/* Game Info */}
                    <div className="text-center mb-6">
                      
                        <div className="text-base font-semibold text-gray-700 mb-2">
                            Question {question + 1}/{MAX_QUESTIONS}
                        </div>
                        <div className="text-base font-semibold text-gray-700 mb-4">
                            Tries: {'❤️'.repeat(tries)}{'🤍'.repeat(MAX_TRIES - tries)}
                        </div>
                        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
                            {questionText} = ?
                        </h1>
                        <p className="text-lg text-gray-600">
                            Pop the balloon with the correct answer!
                        </p>
                    </div>

                    {/* Balloons Grid */}
                    <div className="grid grid-cols-2 gap-8 mb-6">
                        {options.map((option, index) => (
                            <div key={index} className="flex justify-center">
                                <div
                                    onClick={() => !isDisabled && !poppedBalloons.includes(option) && check_answer(option)}
                                    className={`relative cursor-pointer transform transition-all duration-300 hover:scale-110 ${
                                        poppedBalloons.includes(option) ? 'scale-75 opacity-50' : ''
                                    } ${isDisabled ? 'cursor-not-allowed' : ''}`}
                                >
                                    {/* Balloon */}
                                    <div className={`w-32 h-40 ${getBalloonColor(index)} rounded-full shadow-lg relative overflow-hidden ${
                                        poppedBalloons.includes(option) ? 'bg-gray-300' : ''
                                    }`}>
                                        {/* Balloon shine effect */}
                                        <div className="absolute top-4 left-4 w-6 h-8 bg-white opacity-30 rounded-full"></div>
                                        
                                        {/* Answer text */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className={`text-white font-bold text-xl text-center ${
                                                poppedBalloons.includes(option) ? 'line-through text-gray-600' : ''
                                            }`}>
                                                {option}
                                            </span>
                                        </div>

                                        {/* Pop effect */}
                                        {poppedBalloons.includes(option) && (
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

                    {/* Feedback Message */}
                    <div className={`mb-6 text-xl font-semibold text-center transition-opacity duration-300 ${
                        feedbackMessage ? "opacity-100" : "opacity-0"
                    }`}>
                        <div className={`inline-block px-6 py-3 rounded-full text-white ${
                            feedbackMessage.includes('Correct') || feedbackMessage.includes('🎉') 
                                ? 'bg-green-500' 
                                : 'bg-red-500'
                        }`}>
                            {feedbackMessage}
                        </div>
                    </div>

                    {/* Next Button */}
                    <div>
                        <button
                            className={`bg-green-500 text-white hover:bg-green-600 px-6 py-3 rounded-lg text-lg transition-all duration-300 ${
                                next ? "opacity-100 cursor-pointer" : "opacity-0 cursor-not-allowed"
                            }`}
                            onClick={() => next && renderGame()}
                            disabled={!next}
                        >
                            {next}
                        </button>
                    </div>
                </div>
            )}
        </GameContainer>
    );
};

export default BalloonsGame;