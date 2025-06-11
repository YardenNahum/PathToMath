import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import generateQuestions from '../GameLogic';
import QuestionBox from '../RaceGame/QuestionBox';
import FeedbackMessage from '../RaceGame/FeedbackMessage';
import CountdownDisplay from '../RaceGame/CountdownDisplay';
import StartButton from '../RaceGame/StartButton';
import GameContainer from '../GameContainer';
import Track from '../RaceGame/Track';
import Planet from '../../../../assets/Images/SpaceGame/uranus.gif';
import Moon from '../../../../assets/Images/SpaceGame/moon.gif';
import TitleIcom from '../../../../assets/Images/SpaceGame/astronaut.png';
import spaceBg from '../../../../assets/Images/SpaceGame/spaceBg.jpg'
import Peer from 'peerjs'
import { peerConfig } from '../../../Utils/config'

const NUM_QUESTIONS = 10;

function BattleRocketGame() {
  const { subjectGame, grade, level } = useParams();

  const gameLevel = parseInt(level);
  const navigate = useNavigate();

  // Game state
  const [started, setStarted] = useState(false);
  const [opponentStarted, setOpponentStarted] = useState(false);
  const [userProgress, setUserProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [gameStart, setGameStart] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  // PeerJS state
  const [peer, setPeer] = useState(null)
  const [connection, setConnection] = useState(null)
  const [myPeerId, setMyPeerId] = useState('');
  const [opponentPeerId, setOpponentPeerId] = useState('');

  useEffect(() => {
    // init peer on component mount
    const pr = new Peer(peerConfig)
    setPeer(pr)
    return () => {
      pr.destroy()
    }
  }, [])

  useEffect(() => {
    if (!peer) return

    // Handle peer connection events
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
    peer.on('error', (err) => {
      setOpponentPeerId('')
      setConnection(null)
      setConnectionError('Connection Error: Please Try Again')
    })
  }, [peer])

  useEffect(() => {
    if (!connection) return

    connection.on('data', function (data) {
      handleData(data)
    })

    connection.on('close', () => {
      setConnection(null)
      setOpponentStarted(false)
    })

    connection.on('error', err => {
      console.error('Connection error:', err)
    })
  }, [connection])

  const connectToOpponent = (opponentId) => {
    setConnectionError('')
    if (!peer || !opponentId) return

    try {
      const con = peer.connect(opponentId)
      setConnection(con)

      con.on('open', () => {
        console.log('Connected to opponent')
        setOpponentPeerId(opponentId)
      })

      con.on('error', (err) => {
        console.error('Connection error:', err)
      })
    } catch (err) {
      console.error('Failed to connect:', err)
    }
  }

  const handleData = d => {
    console.log(d)
    if (d == 'start') {
      setOpponentStarted(true)
    }
    else if (d == 'finished') {
      handleFinishedGame(false)
    }
    else {
      setOpponentProgress(parseInt(d))
    }
  }
  const handleSend = e => {
    if (connection) {
      connection.send(e)
    }
  }
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
    setCurrentQuestion(loadedQuestions[userProgress]);
  }, [subjectGame, grade, gameLevel]);

  useEffect(() => {
    if (started && opponentStarted) {
      startCountdown()
    }
  }, [started, opponentStarted])

  const handleFinishedGame = (isWin) => {
    setGameFinished(true);
    if (isWin) {
      handleSend('finished');
      setMessage('You Win! Continue To The Next Race?');
    }
    else {
      setMessage('You Lose! Continue To The Next Race?');
    }
    setGameStart(false);
  };

  const handleNextRace = () => {
    setGameFinished(false);
    setGameStart(false);
    setStarted(false);
    setOpponentStarted(false);
    setUserProgress(0);
    setOpponentProgress(0);
    setCountdown(null);
    setQuestions(generateQuestions(subjectGame, grade, gameLevel, NUM_QUESTIONS, 1));
    setCurrentQuestion(questions[userProgress]);
    setUserAnswer('');
    setMessage('');
    setConnection(null);
    setOpponentPeerId('');
  }

  const handleAnswerSubmit = () => {
    if (!gameStart || !currentQuestion) return;

    if (userAnswer.trim() === String(currentQuestion.answer.value)) {
      const newProgress = userProgress + 1;
      setUserAnswer('');
      setMessage('Correct!');
      handleSend(newProgress)
      setUserProgress(newProgress);

      if (userProgress == NUM_QUESTIONS - 1) {
        handleFinishedGame(true)
      } else {
        setCurrentQuestion(questions[userProgress])
      }
    } else {
      setMessage('Incorrect, Try again!');
      setUserAnswer('');
    }
  };

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

  const startGame = () => {
    setStarted(true)
    handleSend('start')
  }

  return (
    <GameContainer gameName="Battle Rocket" gameSubject={subjectGame} gameLevel={gameLevel} icon={TitleIcom} backgroundImage={spaceBg}>
      <div className="rounded-lg p-4">
        {/* Connection UI */}
        {!connection && (
          <div className="shadow-2xl mb-4 p-4 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-300 rounded-xl text-white flex flex-col">
            <h2 className="text-3xl mb-2">Connect to Opponent!</h2>
            <p className="mb-2 text-xl">Your Peer ID: <span className="ml-5 text-xl tracking-widest">{myPeerId}</span></p>
            <p className="mb-2 text-xl">Share this ID with your opponent</p>
            <div className="flex gap-5 items-center justify-center">
              <input
                type="text"
                value={opponentPeerId}
                onChange={(e) => setOpponentPeerId(e.target.value)}
                placeholder="Enter opponent's Peer ID"
                className="text-lg bg-white text-black px-3 py-2 rounded bg-purple-700 placeholder-gray-400 w-100 text-center  "
              />
              <button
                onClick={() => connectToOpponent(opponentPeerId)}
                className="px-4 py-2 bg-pink-700 rounded hover:bg-pink-500"
              >
                Connect
              </button>
              {connectionError && (
                <p className="text-white text-lg font-bold">{connectionError}</p>
              )}
            </div>
          </div>
        )}

        {/* Start button */}
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

        {started && !opponentStarted && (
          <div className="flex justify-center text-white text-2xl font-bold">
            <h1>Waiting for opponent to start...</h1>
          </div>
        )}

        {/* Countdown */}
        <CountdownDisplay countdown={countdown} colorMap={colorMap} startWord={'🔥 Takeoff!'} />

        <div className="flex flex-row items-center justify-center gap-8">
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
            {gameStart && (
              <QuestionBox
                question={currentQuestion?.question}
                userAnswer={userAnswer}
                setUserAnswer={setUserAnswer}
                onSubmit={handleAnswerSubmit}
                feedback={<FeedbackMessage message={message} />}
              />
            )}

            {gameFinished && (
              <div className="flex flex-col items-center justify-center text-white text-2xl font-bold">
                <h1>{message}</h1>
                <button onClick={handleNextRace} className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500">
                  Continue To Next Race
                </button>
              </div>
            )}
          </div>

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
      </div>
    </GameContainer>
  );
}

export default BattleRocketGame;
