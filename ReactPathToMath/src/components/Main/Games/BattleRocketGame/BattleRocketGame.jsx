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
  const [userIndex, setUserIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [countdown, setCountdown] = useState(null);

  // PeerJS state
  const [peer, setPeer] = useState(null)
  const [connection, setConnection] = useState(null)
  const [recipient, setRecipient] = useState('')

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
    // get my address (peer id)
    peer.on('open', id => {
      console.log('Peer ID', id)
    })
    // listen for incoming connections
    peer.on('connection', con => {
      console.log('Connection received')
      con.on('open', () => {
        console.log('Connected')
        setRecipient(con.peer)
        setConnection(con)
        const cn = peer.call(con.peer, localStream)
        setCall(cn)
      })
    })
  }, [peer])
  useEffect(() => {
    if (!connection) return
    connection.on('data', function (data) {
      handleData(data)
    })
    connection.on('close', () => {
      disconnect()
    })
    connection.on('error', err => {
      console.error('Connection error:', err)
    })
  }, [connection])
  const connectRecipient = e => {
    e.preventDefault()
    if (connection) {
      disconnect()
    } else {
      connect(recipient)
    }
  }

  const connect = recId => {
    const con = peer.connect(recId)
    setConnection(con)
    console.log('Connection established - sender')
  }

  const disconnect = () => {
    if (connection) {
      connection.close()
      setConnection(null) // sender side
    }
    setRecipient('')
  }
  const handleData = d => {
    console.log(d)
    setOpponentProgress(parseInt(d))
  }
  const handleSend = e => {
    e.preventDefault()
    if (connection) {
      connection.send(userProgress)
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
    setCurrentQuestion(loadedQuestions[0]);
  }, [subjectGame, grade, gameLevel]);



  const handleFinishedGame = () => {

  };



  const handleAnswerSubmit = () => {
    if (!started || !currentQuestion) return;
    if (userAnswer.trim() === String(currentQuestion.answer.value)) {
      const newProgress = userProgress + 1;
      setUserAnswer('');
      setMessage('Correct!');
      handleSend(newProgress)
      if (newProgress === TRACK_STEPS - 1) {
        setUserProgress(newProgress);
        setMessage('You Win! Continue To The Next Race?');
        setStarted(false);
      } else {
        setUserProgress(newProgress);
        setUserIndex(userIndex + 1);
      }
    } else {
      setMessage('Incorrect, Try again!');
      setUserAnswer('');
    }
  };
  const interval = setInterval(() => {
    setCountdown((prev) => {
      if (prev === 1) {
        clearInterval(interval);
        setCountdown('🔥 Takeoff!');
        setTimeout(() => {
          setCountdown(null);
          setStarted(true);
        }, 1000);
        return '🔥 Takeoff!';
      }
      return typeof prev === 'number' ? prev - 1 : prev;
    });
  }, 1000);


  return (
    <GameContainer gameName="Battle Rocket" gameSubject={subjectGame} gameLevel={gameLevel} icon={TitleIcom} backgroundImage={spaceBg}>
      <div className="rounded-lg p-4">
        {/* Start button or try again */}
        {!started && (
          <div className="flex justify-center">
            <StartButton
              onClick={connectRecipient}
              message={message} startMessage={'🚀 Ready To Launch?'}
              // Glow effect on StartButton
              startGameColor="bg-purple-600 relative shadow-lg
                before:absolute before:inset-0 before:rounded-xl
                before:animate-pulse
                before:shadow-[0_0_15px_5px_rgba(138,43,226,0.8)]
                before:pointer-events-none"
            />
          </div>
        )}

        {started && !opponentStarted && (
          <div className="flex justify-center">
            <h1>Waiting for opponent...</h1>
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
            {started && opponentStarted && (
              <QuestionBox
                question={currentQuestion?.question}
                userAnswer={userAnswer}
                setUserAnswer={setUserAnswer}
                onSubmit={handleAnswerSubmit}
                feedback={<FeedbackMessage message={message} />}
              />
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
