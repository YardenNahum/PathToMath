import React from 'react';
import Cubes from './Cubes.jsx';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../Utils/UserContext.jsx';
import GameContainer from '../GamesUtils/GameContainer.jsx';
import CubesBg from '../../../../assets/Images/cube_game/cubesBg.jpg';
import TitleIcon from '../../../../assets/Images/cube_game/CubesIcon.png';
import { useLocation } from 'react-router-dom';
import { useUpdateQuiz } from '../../PopQuizPage/UpdateQuiz.jsx';
import updateUserProgress from '../GamesUtils/UpdateUserProgress.jsx';
import useGameSounds from '../GamesUtils/Sounds.jsx';
import SelectDice from '../../../../assets/sounds/DiceGame/selectDice.mp3';
import DeselectDice from '../../../../assets/sounds/DiceGame/deselectDice.mp3';
import useSound from 'use-sound';
import EndGameComponent from '../GamesUtils/EndGameComponent.jsx';
import successImage from '../../../../assets/Images/Games/success.png';
import failureImage from '../../../../assets/Images/Games/failure.png';

const GameCube = () => {
    // Constants for game configuration
    const MAX_TRIES = 2;    // Number of tries allowed per question
    const MAX_QUESTIONS = 5;    // Total number of questions per game

    // Sound effects using custom hook and useSound
    const { winLevelSound, loseSound, wrongAnswerSound, correctQuestionSound } = useGameSounds();
    const [dicePickSound] = useSound(SelectDice, { volume: 0.2 });
    const [diceDeselectSound] = useSound(DeselectDice, { volume: 0.2 });

    // Extract params from URL: subjectGame, grade, level
    const { subjectGame, grade, level } = useParams();
    const gameLevel = parseInt(level);
    const location = useLocation();
    const navigate = useNavigate();

    // Hooks for updating quiz progress and user info
    const updateQuiz = useUpdateQuiz();
    const { user, update } = useUser();

    // State variables
    const [correct, setCorrect] = useState(0);  // Number of correct answers so far
    const [endGameObject, setEndGameObject] = useState(null);   // End game message and config object
    const [endGame, setEndGame] = useState(false);  // Whether the end game screen is active
    const [isDisabled, setIsDisabled] = useState(false);    // Disable interaction when checking answer
    const [next, setNext] = useState("");   // Text for the next button ("Next question" or "Finish game")
    const [tries, setTries] = useState(MAX_TRIES);  // Remaining tries for current question
    const [question, setQuestion] = useState(0);    // Current question number
    const [solution, setSolution] = useState([]);   // Indices of cubes forming the solution (shown when user fails)
    const [feedbackMessage, setFeedbackMessage] = useState(""); // Feedback message after checking answer

    /**
     * Check recursively if cubesArr has a subset that sums to target.
     * @param {number[]} cubesArr - Array of cube values
     * @param {number} target - Target sum to find
     * @param {number} index - Current index in cubesArr (default 0)
     * @returns {boolean} True if subset exists, else false
     */
    const isValidCubes = (cubesArr, target, index = 0) => {
        if (target === 0) return true;
        if (index >= cubesArr.length) return false;
        // Either include current cube or skip it
        return isValidCubes(cubesArr, target - cubesArr[index], index + 1) || isValidCubes(cubesArr, target, index + 1);
    }

    /**
     * Generate an array of cubes where at least one subset sums to given sum.
     * @param {number} sum - Target sum to be achievable from cubes
     * @returns {number[]} Array of cube values (1-6)
     */
    const generate_cubes = (sum) => {
        const maxCubes = 6 + Math.floor(level / 3) + Math.floor(grade / 2);
        const cubeCount = Math.min(maxCubes, 12);
        let validCubes = false;
        let cubes = [];
        while (!validCubes) {
            cubes = [];
            for (let i = 0; i < cubeCount; i++) {
                cubes.push(Math.floor(Math.random() * 6) + 1);
                validCubes = isValidCubes(cubes, sum);
            }
        }
        return cubes;
    }

    /**
     * Generate a new question object with cubes and target sum.
     * @returns {{cubes: number[], sum: number}} Question data
     */
    const generate_question = () => {
        const numericGrade = parseInt(grade);
        const baseSum = 6 + gameLevel + numericGrade * 2;
        const sum = Math.floor(Math.random() * baseSum) + 6;
        const cubes = generate_cubes(sum, numericGrade, gameLevel);
        return { cubes, sum };
    };

    // Selected cubes indices
    const [selected, setSelected] = useState([]);
    // Current game data (cubes and sum)
    const [game, setGame] = useState(generate_question);
    const { cubes, sum } = game;

    /**
     * Check if user's selected cubes sum to target.
     * Handles feedback, sound, tries, and updates states accordingly.
     * @param {number[]} selected - Indices of selected cubes
     */
    const check_answer = (selected) => {
        if (selected.length === 0) {
            setFeedbackMessage("❌ Please select at least one cube.");
            wrongAnswerSound();
            return;
        }
        let check_sum = 0;
        selected.forEach(index => {
            check_sum += cubes[index];
        });

        setIsDisabled(true);

        if (check_sum === sum) {
            setFeedbackMessage("✅ Correct! You found a valid combination.");
            setCorrect(prev => prev + 1);
            correctQuestionSound();
        }
        else {
            wrongAnswerSound();
            if (tries > 1) {
                setFeedbackMessage(`❌ Incorrect! You have ${tries - 1} tries left.`);
                setSelected([]);
                setTries(prev => prev - 1);
                setIsDisabled(false);
                return;
            }
            else {
                setFeedbackMessage("❌ Incorrect! You have no tries left.");
                const sol = findSolution(cubes, sum);
                setSelected([]);
                setSolution(sol);
            }
        }
        if (question === MAX_QUESTIONS - 1) {
            setNext("Finish game");
        }
        else {
            setNext("Next question");
        }
    }

    /**
     * Find one valid subset of cubes that sums to target.
     * Uses dynamic programming approach.
     * @param {number[]} cubes - Array of cube values
     * @param {number} target - Target sum
     * @returns {number[]} Indices of cubes forming the solution subset
     */
    const findSolution = (cubes, target) => {
        const n = cubes.length;
        const dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));
        const parent = Array.from({ length: n + 1 }, () => Array(target + 1).fill(null));
        dp[0][0] = true;

        for (let i = 1; i <= n; i++) {
            for (let j = 0; j <= target; j++) {
                if (dp[i - 1][j]) {
                    dp[i][j] = true;
                    parent[i][j] = j;
                }
                const cube = cubes[i - 1];
                if (j >= cube && dp[i - 1][j - cube]) {
                    dp[i][j] = true;
                    parent[i][j] = j - cube;
                }
            }
        }

        const sol = [];
        let i = n, j = target;
        while (j !== 0) {
            if (parent[i][j] !== j) {
                sol.push(i - 1);
                j = parent[i][j];
            }
            i--;
        }
        return sol.reverse();
    }

    // Proceed to next question or finish game
    const renderGame = () => {
        if (question < MAX_QUESTIONS - 1) {
            // Reset states for new question
            setFeedbackMessage("");
            setSelected([]);
            setSolution([]);
            setNext("");
            setTries(MAX_TRIES);
            setIsDisabled(false);
            setQuestion(prev => prev + 1);
            setGame(generate_question());
        } else {
            // End game after last question
            finishGame();
        }
    }

    // Finish the game and show end game screen with stats and options
    const finishGame = () => {
        const isSuccess = correct >= 3;

        if (isSuccess) {
            winLevelSound();
        } else {
            loseSound();
        }
        // Update user progress and quiz data
        updateUserProgress({
            isSuccess,
            location,
            user,
            update,
            updateQuiz,
            gameLevel: parseInt(level),
            gameSubject: subjectGame
        });

        // Prepare end game screen content and actions
        setEndGameObject({
            isSuccess,
            text: `${isSuccess ? 'Great!' : 'Oh no!'} You answered ${correct} / ${MAX_QUESTIONS} Correct Answers.`,
            customImage: isSuccess ? successImage : failureImage,
            buttonText: isSuccess ? (location.state?.fromQuiz ? "Finish quiz" : "Continue to the next level!") : "Try Again!",
            bgColor: isSuccess ? "bg-green-200" : "bg-red-200",
            containerColor: isSuccess ? "bg-green-100" : "bg-red-100",
            handleClick: () => {
                if (isSuccess) {
                    if (location.state?.fromQuiz) {
                        navigate("/");
                    } else {
                        navigate(`/subjects/${subjectGame}`, { state: { fromGame: true } });
                    }
                } else {
                    restartGame();
                }
            }
        });
        setEndGame(true);
    }

    // Reset game to initial state to allow replay
    const restartGame = () => {
        setFeedbackMessage("");
        setSelected([]);
        setSolution([]);
        setNext("");
        setTries(MAX_TRIES);
        setIsDisabled(false);
        setQuestion(0);
        setCorrect(0);
        setGame(generate_question());
        setEndGame(false);
        setEndGameObject(null);
    }

    /**
     * Toggle the selection state of a cube.
     * Plays select or deselect sound accordingly.
     * @param {number} index - Index of the cube clicked
     */
    const toggleCube = (index) => {
        if (isDisabled) return;

        setSelected(prev => {
            const isAlreadySelected = prev.includes(index);

            if (isAlreadySelected) {
                diceDeselectSound();
            } else {
                dicePickSound();
            }

            return isAlreadySelected
                ? prev.filter(i => i !== index)
                : [...prev, index];
        });
    };

    return (
        <GameContainer
            gameName="Roll & Solve"
            gameSubject={subjectGame}
            gameLevel={gameLevel}
            icon={TitleIcon}
            backgroundImage={CubesBg}
            howToPlay={"Select dice that add up to the target sum. You have 2 tries per question. Get 3 out of 5 correct to pass!"}
        >
            <div className={`border-8 border-white rounded-lg p-4 shadow-lg relative max-w-2xl mx-auto mb-5 ${endGame ? endGameObject.containerColor : 'bg-yellow-100'}`}>
                {endGame ? (
                    <>
                        {/* End game message */}
                        <div className="text-center text-xl font-semibold mb-4 px-4">{endGameObject.text}</div>
                        <EndGameComponent
                            isSuccess={endGameObject.isSuccess}
                            customImage={endGameObject.customImage}
                            buttonText={endGameObject.buttonText}
                            handleClick={endGameObject.handleClick}
                            bgColor={endGameObject.bgColor}
                        />
                    </>
                ) : (
                    <>
                        {/* Tries left display */}
                        <div className='text-gray-700 text-lg mb-4'>
                            Tries: {'❤️'.repeat(tries)}{'🤍'.repeat(MAX_TRIES - tries)}
                        </div>

                        {/* Target sum */}
                        <h1 className="text-4xl font-bold text-center mb-3">
                            Sum: {sum}
                        </h1>

                        {/* Question count */}
                        <h2 className='mb-5 text-1xl font-semibold text-gray-800'>
                            Question: {question + 1} / {MAX_QUESTIONS}
                        </h2>

                        {/* Cubes grid */}
                        <div className="grid grid-cols-4 grid-rows-2 gap-4 mt-0">
                            {cubes.map((value, index) => (
                                <Cubes
                                    key={index}
                                    value={value}
                                    onClick={() => toggleCube(index)}
                                    className={
                                        selected.includes(index)
                                            ? "outline-4 outline-green-400"
                                            : solution.includes(index)
                                                ? "outline-4 outline-red-400"
                                                : "bg-gray-100"
                                    }
                                />
                            ))}
                        </div>

                        {/* Feedback message */}
                        <div
                            className={`mt-6 text-xl text-center transition-opacity duration-300 
                            ${feedbackMessage ? "opacity-100 text-purple-700" : "opacity-0"}`}
                        >
                            {feedbackMessage}
                        </div>

                        {/* Buttons for checking and next */}
                        <div className="flex justify-center items-center gap-4 mt-6">
                            <button
                                className="bg-blue-600 hover:cursor-pointer text-white px-4 py-2 rounded-lg"
                                onClick={() => check_answer(selected)}
                            >
                                Check
                            </button>
                            <button
                                className={`bg-orange-400 text-white hover:cursor-pointer px-4 py-2 rounded-lg transition-opacity duration-300 ${next ? "opacity-100" : "opacity-0"}`}
                                onClick={() => renderGame()}
                            >
                                {next}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </GameContainer>
    );

}

export default GameCube;
