import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import generateQuestions from '../GamesUtils/GameLogic';
import QuestionBox from '../RaceGame/QuestionBox';
import FeedbackMessage from '../RaceGame/FeedbackMessage';
import CountdownDisplay from '../RaceGame/CountdownDisplay';
import StartButton from '../RaceGame/StartButton';
import GameContainer from '../GamesUtils/GameContainer';
import Track from '../RaceGame/Track';
import Planet from '../../../../assets/Images/SpaceGame/uranus.gif';
import Moon from '../../../../assets/Images/SpaceGame/moon.gif';
import TitleIcom from '../../../../assets/Images/SpaceGame/astronaut.png';
import spaceBg from '../../../../assets/Images/SpaceGame/spaceBg.jpg';
import Peer from 'peerjs';
import { peerConfig } from '../../../Utils/config';
import ConnectionP2P from './ConnectionP2P';
import { connectToOpponent, handleData, handleSend } from './ConnectionHandler';

// Number of questions in the game
const NUM_QUESTIONS = 10;

/**
 * BattleRocketGame component renders the Multiplayer game.
 * It handles peer-to-peer connections, question generation, and game logic.
 * 
 * @returns {React.ReactNode} The rendered BattleRocketGame component
 */
function BattleRocketGame() {
  // Get the subject, grade, and level from the URL
  const { subjectGame, grade, level } = useParams();

  // Game state
  const [started, setStarted] = useState(false);

  // Opponent state
  const [opponentStarted, setOpponentStarted] = useState(false);
  const [userProgress, setUserProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);

  // Message state
  const [message, setMessage] = useState('');

  // Answer state
  const [userAnswer, setUserAnswer] = useState('');

  // Question state
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Countdown state
  const [countdown, setCountdown] = useState(null);

  // Game state
  const [gameStart, setGameStart] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // PeerJS state
  const [peer, setPeer] = useState(null)
  const [connection, setConnection] = useState(null)
  const [myPeerId, setMyPeerId] = useState('');
  const [opponentPeerId, setOpponentPeerId] = useState('');

  const gameLevel = parseInt(level);

  // Initialize PeerJS
  useEffect(() => {
    const pr = new Peer(peerConfig)
    setPeer(pr)
    return () => {
      pr.destroy()
    }
  }, [])

  // Handle peer connection events
  useEffect(() => {
    if (!peer) return

    peer.on('open', id => {
      console.log('My Peer ID:', id)
      setMyPeerId(id)
    })

    // Listen for incoming connections
    peer.on('connection', con => {
      console.log('Connection received from opponent')
      con.on('open', () => {
        console.log('Connected to opponent')
        setOpponentPeerId(con.peer)
        setConnection(con)
      })
    })

    // Handle connection errors
    peer.on('error', (_) => {
      setOpponentPeerId('')
      setConnection(null)
      setConnectionError('Connection Error: Please Try Again')
    })
  }, [peer])

  // Handle connection events
  useEffect(() => {
    if (!connection) return;

    connection.on('data', function (data) {
      handleData(data, setOpponentStarted, setOpponentProgress, handleFinishedGame);
    });

    connection.on('close', () => {
      setConnection(null);
      setOpponentStarted(false);
    });

    connection.on('error', err => {
      console.error('Connection error:', err);
      setConnectionError('Connection lost. Please try again.');
    });
  }, [connection]);

  // Handle game finished
  const handleFinishedGame = (isWin) => {
    setGameFinished(true);
    if (isWin) {
      handleSend(connection, 'finished');
      setMessage('You Win! Continue To The Next Race?');
    }
    else {
      setMessage('You Lose! Continue To The Next Race?');
    }
    setGameStart(false);

  };
  
  // Color map for the countdown display
  const colorMap = [
    'text-white',
    'text-white',
    'text-white',
    'text-white'
  ]

  // Load game questions on component mount
  useEffect(() => {
    const loadedQuestions = generateQuestions(subjectGame, grade, gameLevel, NUM_QUESTIONS, 1);
    setQuestions(loadedQuestions);
    setCurrentQuestion(loadedQuestions[0]);
  }, [subjectGame, grade, gameLevel]);

  // Handle countdown
  useEffect(() => {
    if (started && opponentStarted) {
      startCountdown()
    }
  }, [started, opponentStarted])

  // Handle next race
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

    const newQuestions = generateQuestions(subjectGame, grade, gameLevel, NUM_QUESTIONS, 1);
    setQuestions(newQuestions);
    setCurrentQuestion(newQuestions[0]);
  }

  // Handle answer submit
  const handleAnswerSubmit = () => {
    if (!gameStart || !currentQuestion) return;

    if (userAnswer.trim() === String(currentQuestion.answer.value)) {
      const newProgress = userProgress + 1;
      setUserAnswer('');
      setMessage('Correct!');
      handleSend(connection, newProgress);
      setUserProgress(newProgress);

      if (newProgress == NUM_QUESTIONS - 1) {
        handleFinishedGame(true);
      } else {
        setCurrentQuestion(questions[newProgress]);
      }
    } else {
      setMessage('Incorrect, Try again!');
      setUserAnswer('');
    }
  };

  // Handle countdown
  const startCountdown = () => {
    setUserProgress(0);
    setOpponentProgress(0);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCountdown('🔥 Takeoff!');
          setTimeout(() => {
            setCountdown(null);
            setGameStart(true);
          }, 1000);
          return '🔥 Takeoff!';
        }
        return typeof prev === 'number' ? prev - 1 : prev;
      });
    }, 1000);
  };

  // Handle game start
  const startGame = () => {
    setStarted(true);
    handleSend(connection, 'start');
  };

  return (
    <GameContainer
      gameName="Rocket Battle"
      gameSubject={subjectGame} 
      gameLevel={gameLevel}
      icon={TitleIcom} 
      backgroundImage={spaceBg}
      howToPlay={"Enter your opponent’s Peer ID or share yours to connect. When both are ready, answer questions to race — first to reach the planet wins!"}
    >
      {/* Connection P2P */}
      <ConnectionP2P
        connection={connection}
        myPeerId={myPeerId}
        opponentPeerId={opponentPeerId}
        setOpponentPeerId={setOpponentPeerId}
        connectToOpponent={(id) => connectToOpponent(peer, id, setConnection, setOpponentPeerId, setConnectionError)}
        connectionError={connectionError}
      />
      {/* Start Game Button */}
      {!started && connection && (
        <div className="flex justify-center">
          <StartButton
            onClick={startGame}
            message={message}
            startMessage={'🚀 Ready To Launch?'}
            startGameColor="bg-purple-600 relative shadow-lg
                before:absolute before:inset-0 before:rounded-xl
                before:animate-pulse
                before:shadow-[0_0_15px_5px_rgba(138,43,226,0.8)]
                before:pointer-events-none"
          />
        </div>
      )}

      {/* Waiting for opponent to start */}
      {started && !opponentStarted && (
        <div className="flex justify-center text-white text-2xl font-bold">
          <h1>Waiting for opponent to start...</h1>
        </div>
      )}

      {/* Countdown Display */}
      <CountdownDisplay countdown={countdown} colorMap={colorMap} startWord={'🔥 Takeoff!'} />

      <div className="flex flex-row items-center justify-center gap-8">
        {/* User Progress Track */}
        <Track
          position={userProgress}
          length={NUM_QUESTIONS}
          startLabel="Your Rocket"
          endLabel=""
          startIcon=""
          finishIcon={
            <img
              src={Planet}
              alt="Planet"
              className="h-15 w-15 rounded-full object-cover"
            />
          }
          direction="vertical"
          type="climb"
        />

        {/* Question Box container */}
        <div
          className="flex items-center justify-center bg-purple-400 rounded-lg shadow-md w-150 min-h-[200px]"
          style={{
            animation: 'glowPulse 2s infinite',
            boxShadow: '0 0 15px 5px rgba(139, 92, 246, 0.8)',
            color: 'white'  // <- Force all text inside to be white
          }}
        >
          {/* Question Box */}
          {gameStart && connection && (
            <QuestionBox
              question={currentQuestion?.question}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              onSubmit={handleAnswerSubmit}
              feedback={<FeedbackMessage message={message} />}
            />
          )}

          {/* Opponent Disconnected */}
          {gameStart && !connection && (
            <div className="flex flex-col items-center justify-center text-white text-3xl font-bold">
              <h1> Opponent Disconnected 🤔</h1>
            </div>
          )}

          {/* Game Finished */}
          {gameFinished && (
            <div className="flex flex-col items-center justify-center text-white text-2xl font-bold">
              <h1>{message}</h1>
              <button onClick={handleNextRace} className="hover:scale-105 transition-all duration-300 cursor-pointer px-4 py-2 bg-purple-600 rounded hover:bg-purple-500">
                Continue To Next Race
              </button>
            </div>
          )}
        </div>

        {/* Opponent Progress Track */}
        <Track
          position={opponentProgress}
          length={NUM_QUESTIONS}
          startLabel="Opponent's Rocket"
          endLabel=""
          startIcon=""
          finishIcon={
            <img
              src={Moon}
              alt="Moon"
              className="h-15 w-15 rounded-full object-cover"
            />
          }
          direction="vertical"
          type="climb"
        />
      </div>
    </GameContainer>
  );
}

export default BattleRocketGame;
