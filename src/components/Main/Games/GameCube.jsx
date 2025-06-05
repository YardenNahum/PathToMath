import { React } from 'react';
import help_icon from '../../../assets/Images/cube_game/how_to_play.png';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cubes from './Cubes.jsx';
import { useUser } from '../../Utils/UserContext';
import GameContainer from './GameContainer.jsx';
const GameCube = () => {
    const MAX_TRIES = 2;
    const MAX_QUESTIONS = 5;

    const { subjectGame, grade, level } = useParams();
    const gameSubject = subjectGame;
    const gameLevel = parseInt(level);

    const navigate = useNavigate();
    const generate_question = () => {
        let sum = Math.floor(Math.random() * ((grade) * 2 + gameLevel + 5)) + 6;
        let cubes = [];
        cubes = generate_cubes(sum);
        return { cubes, sum };
    }

    // Generate randome cubes values
    const generate_cubes = (sum) => {
        let validCubes = false;
        let cubes = [];
        while (!validCubes) {
            cubes = []
            for (let i = 0; i <3+ grade * 2; i++) {
                // Generate a random cube value between 1 and 6
                cubes.push(Math.floor(Math.random() * 6) + 1);
                validCubes = isValidCubes(cubes, sum);
            }
        }
        return cubes;
    }

    const isValidCubes = (cubesArr, target, index = 0) => {
        if (target == 0) {
            return true;
        }
        if (index >= cubesArr.length) {
            return false;
        }
        return isValidCubes(cubesArr, target - cubesArr[index], index + 1) || isValidCubes(cubesArr, target, index + 1);
    }

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

        //find reversed sol
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
        }
    }

    const toggleCube = (index) => {
        if (isDisabled) return;
        setSelected(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const [isDisabled, setIsDisabled] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [next, setNext] = useState("");
    const [tries, setTries] = useState(MAX_TRIES);
    const [question, setQuestion] = useState(0);
    const [solution, setSolution] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [game, setGame] = useState(generate_question);
    const [selected, setSelected] = useState([]);
    const { cubes, sum } = game;
    const [gameFinished, setGameFinished] = useState(false);

    // Handle finished game
    const { user,update } = useUser();
    const handleFinishedGame = () => {
        const currentFinished = user?.gradeLevel[user.grade - 1]?.[gameSubject];
        if (currentFinished && gameLevel > currentFinished) {
            let newUser = user;
            newUser.gradeLevel[user.grade - 1][gameSubject] = gameLevel;
            update(user.email, newUser);
        }
        navigate(`/subjects/${gameSubject}`);
    }

    return (
        <GameContainer gameName="Cubes Game" gameSubject={gameSubject} gameLevel={{grade}}>
            <div className="border-8 border-white bg-blue-100 rounded-lg p-4 shadow-lg relative">
                <div className='text-sm group inline-block absolute top-4 left-4'>
                    {/* How to play button */}
                    <button className="group items-center flex gap-2 bg-purple-200 px-4 py-2 rounded-lg hover:bg-purple-300 transition-colors cursor-pointer">
                        <img src={help_icon} alt="How to play" className="h-5 w-5"/>
                        How to play
                    </button>
                    {/* Dropdown text */}
                    <div className="p-2 mt-2 rounded shadow-md bg-white absolute left-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 ">
                        Choose cubes that sum up to the given number. You have {MAX_TRIES} tries per question.
                    </div>
                </div>
                {gameFinished ? (
                    <div className="flex flex-col items-center justify-center min-h-screen text-center">
                        <h2 className="text-3xl font-semibold text-green-600 mb-4">
                            {feedbackMessage}
                        </h2>
                        <button
                            className="bg-blue-500 text-white mt-10 px-6 py-3 rounded-lg text-xl hover:cursor-pointer"
                            onClick={handleFinishedGame}
                        >
                            back to {gameSubject} levels
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className='text-gray-700 text-lg mb-4'>
                            Tries: {'❤️'.repeat(tries)}{'🤍'.repeat(MAX_TRIES - tries)}
                        </div>

                        <h1 className="text-4xl font-bold text-center mb-5">
                            Sum: {sum}
                        </h1>

                        <div className="grid grid-cols-4 grid-rows-2 gap-4 mt-0">
                            {cubes.map((value, index) => (
                                <Cubes
                                    key={index}
                                    value={value}
                                    onClick={() => toggleCube(index)}
                                    className={
                                        selected.includes(index)
                                            ? "outline-3 outline-green-400"
                                            : solution.includes(index)
                                                ? "outline-3 outline-red-400"
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

                        <div>
                            <button
                                className="bg-blue-400 hover:cursor-pointer text-white mt-4 px-4 py-2 rounded-lg"
                                onClick={() => check_answer(selected)}
                            >
                                Check
                            </button>

                            <button
                                className={`bg-gray-400 text-white hover:cursor-pointer px-4 py-2 rounded-lg mt-5 ml-3 ${next ? "opacity-100" : "opacity-0"
                                    }`}
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
