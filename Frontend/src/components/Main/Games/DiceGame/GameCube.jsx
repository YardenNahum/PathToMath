import { React } from 'react';
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

/**
 * GameCube component - Interactive game where children solve sum-up Addition problems.
 * Users answer 5 rounds, and if they get at least 3 correct, they progress to the next level.
 * @returns {JSX.Element} - The rendered component.
 */
const GameCube = () => {
    // Maximum number of tries allowed per question
    const MAX_TRIES = 2;
    // Total number of questions in the game
    const MAX_QUESTIONS = 5;

    // Extract subject, grade, and level from the URL parameters
    const { subjectGame, grade, level } = useParams();
    // The current game level as a number
    const gameLevel = parseInt(level);
    // React Router hook to access the current location object
    const location = useLocation();
    // React Router hook to programmatically navigate
    const navigate = useNavigate();
    // Custom hook to update quiz progress
    const updateQuiz = useUpdateQuiz();
    // Access the current user and update function from context
    const { user, update } = useUser();
    // State to track the number of correct answers
    const [correct, setCorrect] = useState(0);

    // Generates a new question with cubes and a target sum based on grade and level
    const generate_question = () => {
        const numericGrade = parseInt(grade); // ensure number
        const baseSum = 6 + gameLevel + numericGrade * 2; // scale with grade and level
        const sum = Math.floor(Math.random() * baseSum) + 6;

        const cubes = generate_cubes(sum, numericGrade, gameLevel);
        return { cubes, sum };
    };

    // Generates an array of random cube values that can sum to the target value
    const generate_cubes = (sum) => {
        const minCubes = 4;
        const maxCubes = 6 + Math.floor(level / 3) + Math.floor(grade / 2); // scale cubes count
        const cubeCount = Math.min(maxCubes, 12); // limit to 12 max

        let validCubes = false;
        let cubes = [];
        while (!validCubes) {
            cubes = []
            for (let i = 0; i < cubeCount; i++) {
                // Generate a random cube value between 1 and 6
                cubes.push(Math.floor(Math.random() * 6) + 1);
                validCubes = isValidCubes(cubes, sum);
            }
        }
        return cubes;
    }

    // Checks if any subset of cubes can sum to the target value (recursive)
    const isValidCubes = (cubesArr, target, index = 0) => {
        if (target == 0) {
            return true;
        }
        if (index >= cubesArr.length) {
            return false;
        }
        return isValidCubes(cubesArr, target - cubesArr[index], index + 1) || isValidCubes(cubesArr, target, index + 1);
    }

    // Handles the main game logic for checking answers, updating tries, and providing feedback
    // Also determines when to finish the game or move to the next question
    const check_answer = (selected) => {
        if (selected.length === 0) {
            setFeedbackMessage("❌ Please select at least one cube.");
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
        }
        else {
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
                setSelected([])
                setSolution(sol);
            }
        }
        if (question == MAX_QUESTIONS - 1) {
            setNext("Finish game");
        }
        else {
            setNext("Next question");
        }
    }

    // Finds a solution (indices of cubes) that sum to the target using dynamic programming
    const findSolution = (cubes, target) => {
        const n = cubes.length;
        const dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));
        const parent = Array.from({ length: n + 1 }, () => Array(target + 1).fill(null));
        dp[0][0] = true;
        for (let i = 1; i <= n; i++) {
            for (let j = 0; j <= target; j++) {
                // not taking current cube
                if (dp[i - 1][j]) {
                    dp[i][j] = true;
                    parent[i][j] = j;
                }
                // take current cube
                const cube = cubes[i - 1];
                if (j >= cube && dp[i - 1][j - cube]) {
                    dp[i][j] = true;
                    parent[i][j] = j - cube;
                }
            }
        }

        // Backtrack to find which cubes were used in the solution
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

    // Advances the game to the next question or finishes the game if all questions are answered
    const renderGame = () => {
        if (question < 4) {
            setFeedbackMessage("");
            setSelected([]);
            setSolution([]);
            setNext("");
            setTries(MAX_TRIES);
            setIsDisabled(false);
            setQuestion(prev => prev + 1);
            setGame(generate_question());
        }
        else {
            setGameFinished(true);
            setFeedbackMessage(`🎉 You answered ${correct}/${MAX_QUESTIONS} questions correct!`);
            // Update user progress based on success
            updateUserProgress({
                isSuccess: correct >= 3,
                location,
                user,
                update,
                updateQuiz,
                gameLevel: parseInt(level),
                gameSubject: subjectGame
            });
        }
    }
    // Resets all state to restart the game from the beginning
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
        setGameFinished(false);
        setGameFinished(false);
    }
    // Toggles the selection state of a cube when clicked
    const toggleCube = (index) => {
        if (isDisabled) return;
        setSelected(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    // State hooks for game control and UI
    const [isDisabled, setIsDisabled] = useState(false); // disables input when needed
    const [next, setNext] = useState(""); // label for next action
    const [tries, setTries] = useState(MAX_TRIES); // remaining tries for current question
    const [question, setQuestion] = useState(0); // current question index
    const [solution, setSolution] = useState([]); // stores solution indices for feedback
    const [feedbackMessage, setFeedbackMessage] = useState(""); // feedback to user
    const [game, setGame] = useState(generate_question); // current game state (cubes and sum)
    const [selected, setSelected] = useState([]); // indices of selected cubes
    const { cubes, sum } = game; // destructure cubes and sum from game state
    const [gameFinished, setGameFinished] = useState(false); // whether the game is finished
    const success = correct >= 3; // did the user pass the level?

    // Handles navigation after finishing the game
    const handleFinishedGame = () => {
        if (location.state?.fromQuiz) {
            navigate("/");
        }
        else {
            navigate(`/subjects/${subjectGame}`, { state: { fromGame: true } });
        }
    }

    return (
        <GameContainer
            gameName="Roll & Solve"
            gameSubject={subjectGame}
            gameLevel={gameLevel}
            icon={TitleIcon}
            backgroundImage={CubesBg}
            howToPlay={"Select dice that add up to the target sum. You have 2 tries per question. Get 3 out of 5 correct to pass!"}
        >
            <div className="border-8 border-white bg-yellow-100 rounded-lg p-4 shadow-lg relative max-w-2xl mx-auto mb-5">
                {gameFinished ? (
                    <div className="text-2xl flex flex-col items-center justify-center min-h-screen text-center">
                        <h2 className="text-3xl font-semibold text-green-600 mb-4">
                            {feedbackMessage}
                        </h2>
                        {success ? "Level up!" : " Try again next time!"}
                        <button className="bg-yellow-400 text-white mt-6 px-6 py-3 rounded-lg text-xl hover:cursor-pointer mb-4"
                            onClick={() => {
                                if (success) {
                                    handleFinishedGame();   // navigates to next level
                                } else {
                                    restartGame();  // replay same level
                                }
                            }}
                        >
                            {success ? "Next level" : "Try again"}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className='text-gray-700 text-lg mb-4'>
                            Tries: {'❤️'.repeat(tries)}{'🤍'.repeat(MAX_TRIES - tries)}
                        </div>

                        <h1 className="text-4xl font-bold text-center mb-3">
                            Sum: {sum}
                        </h1>
                        <h2 className='mb-5 text-1xl font-semibold text-gray-800'>
                            Question: {question + 1} / {MAX_QUESTIONS}
                        </h2>

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
                        <div
                            className={`mt-6 text-xl text-center transition-opacity duration-300 ${feedbackMessage ? "opacity-100 text-purple-700" : "opacity-0"
                                }`}
                        >
                            {feedbackMessage}
                        </div>
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
                    </div>
                )}
            </div>
        </GameContainer>
    );
}

export default GameCube;
