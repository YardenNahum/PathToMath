import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Peer from 'peerjs';
import { peerConfig } from '../../../Utils/config';
import generateQuestions from '../GamesUtils/GameLogic';
import GameContainer from '../GamesUtils/GameContainer';
import QuestionBox from '../RaceGame/QuestionBox';
import FeedbackMessage from '../RaceGame/FeedbackMessage';
import CountdownDisplay from '../RaceGame/CountdownDisplay';
import StartButton from '../RaceGame/StartButton';
import Track from '../RaceGame/Track';
import spaceBg from '../../../../assets/Images/SpaceGame/spaceBg.jpg';
import TitleIcom from '../../../../assets/Images/SpaceGame/astronaut.png';
import Planet from '../../../../assets/Images/SpaceGame/uranus.gif';
import Moon from '../../../../assets/Images/SpaceGame/moon.gif';
import ConnectionP2PBox from '../GamesUtils/MultiplayerUtils/ConnectionP2PBox.jsx';
import { connectToOpponent, handleData, handleSend } from '../GamesUtils/MultiplayerUtils/ConnectionHandler.jsx';
import useBotInterval from '../GamesUtils/useBotInterval';
import updateUserProgress from '../GamesUtils/UpdateUserProgress.jsx';
import { useUser } from '../../../Utils/UserContext';
import { useUpdateQuiz } from '../../PopQuizPage/UpdateQuiz.jsx';
import useSound from 'use-sound';
import SpaceshipStepSound from '../../../../assets/sounds/RocketGame/rocketStep.mp3';
import CountDownSound from '../../../../assets/sounds/RocketGame/robotic-countdown.mp3';
import WinSound from '../../../../assets/sounds/RocketGame/futuristicWin.mp3';
import useGameSounds from '../GamesUtils/Sounds.jsx'
import EndGameComponent from "../GamesUtils/EndGameComponent.jsx";
import successImage from '../../../../assets/Images/SpaceGame/astronautWin.png';
import failureImage from '../../../../assets/Images/SpaceGame/planetLost.png';

const NUM_QUESTIONS = 10; // Total number of questions per game;

/**
 * RocketGame component - a math race game where the user competes against a bot or another player.
 * Supports both single-player and multiplayer (via PeerJS) modes.
 *
 * @param {string} mode - The game mode: 'single' (default) or 'multi' for multiplayer.
 * @returns {JSX.Element}
 */
export default function RocketGame({ mode = 'single' }) {
  const isMultiplayer = mode === 'multi';   // Determine if game is in multiplayer version
  const { subjectGame, grade, level } = useParams();

  const gameLevel = parseInt(level);
  const subjectName = subjectGame;
  const navigate = useNavigate();
  const location = useLocation();
  const { user, update } = useUser();
  const updateQuiz = useUpdateQuiz();

  // Sound effects state
  const [spaceshipStepSound] = useSound(SpaceshipStepSound, { volume: 0.1 });
  const [countdownSound] = useSound(CountDownSound, { volume: 0.4 });
  const { loseSound, wrongAnswerSound, opponentStepSound } = useGameSounds();
  const [playWinSound] = useSound(WinSound, { volume: 0.3 });

  // Game state
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(null);

  // Single player
  const [started, setStarted] = useState(false);
  const [botProgress, setBotProgress] = useState(0);
  const [userProgress, setUserProgress] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [success, setSuccess] = useState(false);
  const [endGameObject, setEndGameObject] = useState(null); // Object to hold end game details

  // Multiplayer
  const [opponentStarted, setOpponentStarted] = useState(false);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [gameStart, setGameStart] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [peer, setPeer] = useState(null);
  const [connection, setConnection] = useState(null);
  const [myPeerId, setMyPeerId] = useState('');
  const [opponentPeerId, setOpponentPeerId] = useState('');
  const [connectionError, setConnectionError] = useState('');
  const [opponentGrade, setOpponentGrade] = useState(null);
  const [myGrade] = useState(grade);
  const [gameGrade, setGameGrade] = useState(parseInt(grade));

  const colorMap = ['text-white', 'text-white', 'text-white', 'text-white'];  // All white for countdown
  const TRACK_STEPS = NUM_QUESTIONS + 1;
  const currentQuestion = questions[questionIndex];

  /**
   * Generate questions when subject/grade/level change.
   */
  useEffect(() => {
    const generated = generateQuestions(subjectName, gameGrade, gameLevel, NUM_QUESTIONS, 1);
    setQuestions(generated);
  }, [subjectName, gameGrade, gameLevel]);

  /**
   * Initialize PeerJS in multiplayer mode.
   */
  useEffect(() => {
    if (!isMultiplayer) return;
    const pr = new Peer(peerConfig);
    setPeer(pr);
    return () => pr.destroy();
  }, [isMultiplayer]);

  /**
   *  Handle Grade as min grade between both players on multi mode
   */
  useEffect(() => {
    if (isMultiplayer && myGrade && opponentGrade) {
      const minGrade = Math.min(parseInt(myGrade), parseInt(opponentGrade));
      setGameGrade(minGrade);
    }
    console.log("both players playing on grade", gameGrade)
  }, [isMultiplayer, myGrade, opponentGrade]);

  /**
   * Handle PeerJS events: open connection, receive connection, or errors.
   */
  useEffect(() => {
    if (!peer) return;
    peer.on('open', (id) => setMyPeerId(id));
    peer.on('connection', (con) => {
      setConnection(con);
      setOpponentPeerId(con.peer);

      // Send my Grade to opponent
      con.on('open', () => {
        handleSend(con, { type: 'grade', grade: myGrade });
      });

      // Recive Opponent Grade
      con.on('data', (data) => {
        if (typeof data === 'object' && data.type === 'grade') {
          setOpponentGrade(data.grade);
        }
      });

    });
    peer.on('error', () => setConnectionError('Connection Error. Try Again.'));
  }, [peer]);


  /**
   * Start countdown when both players are ready.
   */
  useEffect(() => {
    if (started && opponentStarted) {
      startCountdown();
    }
  }, [started, opponentStarted]);

  /**
   * Handle receiving data from opponent.
   */
  useEffect(() => {
    if (!connection) return;
    connection.on('data', (data) => {
      if (data === 'start') {
        setOpponentStarted(true);
      }
      else if (data === 'finished') {
        // Opponent finished first - you lost
        handleFinishedGame(false);
      }
      else {
        // Only play sound if game has started and data is a progress update (a number)
        if (gameStart && typeof data === 'number') {
          opponentStepSound();
        }
        handleData(data, setOpponentStarted, setOpponentProgress, handleFinishedGame);
      }
    });
    connection.on('close', () => {
      handleNextRace();
      setConnectionError('Opponent Disconnected');
    });
    connection.on('error', () => {
      setConnectionError('Connection lost. Please try again.');
    });
  }, [connection, gameStart]);

  /**
   * Handles bot movement for single player.
   */
  const handleBotMove = useCallback(() => {
    setBotProgress((prev) => {
      const next = prev + 1;

      opponentStepSound();

      if (next >= TRACK_STEPS - 1) {
        setStarted(false);
        setSuccess(false);
        setGameEnded(true);
        loseSound();

        setEndGameObject({
          isSuccess: false,
          text: "Oh no! The asteroid crashed into the planet before you could stop it!",
          customImage: failureImage,
          buttonText: "Try Again!",
          bgColor: "bg-red-200",
          containerColor: "bg-red-100",
          handleClick: () => {
            startCountdown(); // Resets and restarts the race
          },
        });

        return TRACK_STEPS - 1;
      }
      return next;
    });
  }, [opponentStepSound]);

  // Move the bot at intervals based on grade and level
  const botTimer = useBotInterval({
    started,
    onMove: handleBotMove,
    gameGrade,
    level: gameLevel,
  });

  /**
   * Triggers a 3-second countdown before starting game.
   */
  const startCountdown = () => {
    setUserProgress(0);
    isMultiplayer ? setOpponentProgress(0) : setBotProgress(0);
    setQuestionIndex(0);
    setMessage('');
    setUserAnswer('');
    setCountdown(3);
    countdownSound();
    if (!isMultiplayer) {
      setGameEnded(false);
      setSuccess(false);
    }

    const interval = setInterval(() => {

      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCountdown('🔥 Takeoff!');
          setTimeout(() => {
            setCountdown(null);
            isMultiplayer ? setGameStart(true) : setStarted(true);
          }, 1000);
          return '🔥 Takeoff!';
        }
        return typeof prev === 'number' ? prev - 1 : prev;
      });
    }, 1000);
  };

  /**
   * Starts multiplayer game and notifies opponent.
   */
  const startGame = () => {
    setStarted(true);
    handleSend(connection, 'start');
  };

  /**
   * Handles user's submitted answer and game logic per mode.
   */
  const handleAnswerSubmit = () => {
    const correct = userAnswer.trim() === String(currentQuestion?.answer?.value);
    setUserAnswer('');
    setMessage(correct ? 'Correct!' : 'Incorrect, Try again!');
    if (correct)
      spaceshipStepSound();
    else {
      wrongAnswerSound();
    }
    if (!correct) return;

    const newProgress = userProgress + 1;
    setUserProgress(newProgress);
    setQuestionIndex(newProgress);

    if (isMultiplayer) {
      handleSend(connection, newProgress);
      if (newProgress === TRACK_STEPS - 1) handleFinishedGame(true);
    }
    // Single player
    else {
      if (newProgress === TRACK_STEPS - 1) {
        clearInterval(botTimer.current);
        setStarted(false);
        setGameEnded(true);
        setSuccess(true);
        playWinSound();

        setEndGameObject({
          isSuccess: true,
          text: `Great! You beat your opponent to the finish line!`,
          customImage: successImage,
          buttonText: location.state?.fromQuiz ? "Finish quiz" : "Continue to next planet!",
          bgColor: "bg-green-200",
          containerColor: "bg-green-100",
          handleClick: () => {
            if (location.state?.fromQuiz) {
              navigate("/");
            } else {
              navigate(`/subjects/${subjectName}`, { state: { fromGame: true } });
            }
          },
        });
      }
    }
  };

  /**
   * Handles game finish (either win or loss).
   * @param {boolean} isWin - Whether the user won.
   */
  const handleFinishedGame = (isWin) => {
    setGameFinished(true);
    if (isMultiplayer && isWin) {
      handleSend(connection, 'finished');
      setMessage('You Win! Continue To The Next Race?');
      playWinSound();
    }
    else {
      setMessage('You Lose! Continue To The Next Race?');
      loseSound();
    }
    setGameStart(false);
  };

  /**
   * Navigates to home page if from quiz, or to subject page if not.
   */
  const handleFinished = () => {
    if (location.state?.fromQuiz) navigate("/");
    else navigate(`/subjects/${subjectName}`, { state: { fromGame: true } });
  };

  /**
   * Resets game state to replay next race.
   */
  const handleNextRace = () => {
    setGameFinished(false);
    setGameStart(false);
    setStarted(false);
    setOpponentStarted(false);
    setUserProgress(0);
    setOpponentProgress(0);
    setCountdown(null);
    setConnectionError('');
    setOpponentPeerId('');
    setConnection(null);
    setUserAnswer('');
    setMessage('');
    setOpponentGrade('')
    setGameGrade(grade);
    const newQuestions = generateQuestions(subjectGame, grade, gameLevel, NUM_QUESTIONS, 1);
    setQuestions(newQuestions);
    setQuestionIndex(0);
  };

  /**
   * Updates user progress after game ends.
   * if multiplyer dont update
   * @param {boolean} success - Whether the user won the game.
   * @param {string} location - The current location object.
   * @param {Object} user - The current user object.
   * @param {Function} update - Function to update user data.
   * @param {Function} updateQuiz - Function to update quiz data.
   * @param {number} gameLevel - The current game level.
   * @param {string} subjectName - The subject name for the game.
  
   */
  useEffect(() => {
    if (!gameEnded || isMultiplayer) return;

    updateUserProgress({
      isSuccess: success,
      location,
      user,
      update,
      updateQuiz,
      gameLevel,
      gameSubject: subjectName,
    });
  }, [gameEnded, isMultiplayer]);

  // Determines if question box should be visible
  const showQuestionBox = isMultiplayer ? gameStart && connection?.open : started;

  return (
    <GameContainer
      gameName={'Math Planets'}
      gameSubject={subjectName}
      gameLevel={gameLevel}
      icon={TitleIcom}
      backgroundImage={spaceBg}
      howToPlay={
        isMultiplayer
          ? "Enter your opponent's Peer ID or share yours to connect. When both are ready, answer questions to race — first to reach their planet wins!"
          : "After takeoff, answer math questions correctly to fly your rocket. Reach the planet before the falling asteroid crashes into it!"
      }
    >
      {isMultiplayer && (
        <ConnectionP2PBox
          connection={connection}
          myPeerId={myPeerId}
          opponentPeerId={opponentPeerId}
          setOpponentPeerId={setOpponentPeerId}
          connectToOpponent={(id) =>
            connectToOpponent(
              peer,
              id,
              setConnection,
              setOpponentPeerId,
              setConnectionError,
              setOpponentGrade,
              myGrade
            )
          }
          connectionError={connectionError}
        />
      )}

      {((isMultiplayer && connection?.open) || !isMultiplayer) &&
        (!started && !gameFinished && countdown === null && (!endGameObject || isMultiplayer)) ? (
        <div className="flex justify-center">
          <StartButton
            onClick={gameEnded && success ? handleFinished : isMultiplayer && !connection?.open ? handleFinished : isMultiplayer ? startGame : startCountdown}
            message={message}
            startMessage={'🚀 Ready To Launch?'}
            startGameColor="bg-purple-600 relative shadow-lg before:absolute before:inset-0 before:rounded-xl before:animate-pulse before:shadow-[0_0_15px_5px_rgba(138,43,226,0.8)] before:pointer-events-none"
          />
        </div>
      ) : null}

      {isMultiplayer && connection?.open && started && !opponentStarted && (
        <div className="flex justify-center text-white text-2xl font-bold">
          Waiting for opponent to start...
        </div>
      )}

      {/* Show end game screen ONLY in single-player mode */}
      {!isMultiplayer && gameEnded && endGameObject ? (
        <div className={`rounded-xl p-4 mb-4 ${endGameObject.containerColor}`}>
          <div className="text-center text-xl font-medium mt-4 mb-6 px-4">
            {endGameObject.text}
          </div>
          <EndGameComponent
            isSuccess={endGameObject.isSuccess}
            customImage={endGameObject.customImage}
            buttonText={endGameObject.buttonText}
            handleClick={endGameObject.handleClick}
            bgColor={endGameObject.bgColor}
          />
        </div>
      ) : (
        <>
          <CountdownDisplay countdown={countdown} colorMap={colorMap} startWord={'🔥 Takeoff!'} />

          <div className="flex flex-row items-center justify-center gap-8">
            <Track
              position={userProgress}
              length={NUM_QUESTIONS}
              startLabel="Your Rocket"
              finishIcon={<img src={Planet} alt="Planet" className="h-15 w-15 rounded-full object-cover" />}
              direction="vertical"
              type="climb"
              isUserTrack={true}
            />
            <div
              className="flex items-center justify-center bg-purple-400 rounded-lg shadow-md w-150 min-h-[200px]"
              style={{ animation: 'glowPulse 2s infinite', boxShadow: '0 0 15px 5px rgba(139, 92, 246, 0.8)', color: 'white' }}
            >
              {showQuestionBox && (
                <QuestionBox
                  question={currentQuestion?.question}
                  userAnswer={userAnswer}
                  setUserAnswer={setUserAnswer}
                  onSubmit={handleAnswerSubmit}
                  feedback={<FeedbackMessage message={message} />}
                />
              )}
              {gameFinished && (
                <div className="flex flex-col items-center justify-center text-white text-xl font-bold">
                  <h1>{message}</h1>
                  <button onClick={handleNextRace} className="mt-2 px-4 py-2 bg-purple-600 rounded hover:bg-purple-500 cursor-pointer">
                    Continue To Next Race
                  </button>
                </div>
              )}
            </div>
            <Track
              position={isMultiplayer ? opponentProgress : botProgress}
              length={NUM_QUESTIONS}
              startLabel={isMultiplayer ? "Opponent's Rocket" : "Asteroid"}
              finishIcon={
                <img
                  src={isMultiplayer ? Moon : Planet}
                  alt="Opponent Finish"
                  className="h-15 w-15 rounded-full object-cover"
                />
              }
              direction="vertical"
              type="climb"
              isMultiplayer={isMultiplayer}
              isUserTrack={false}
            />
          </div>
        </>
      )}
    </GameContainer>
  );
}
