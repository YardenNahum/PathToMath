import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import spaceBg from '../../../../assets/Images/SpaceGame/spaceBg.jpg'
import { useUser } from '../../../Utils/UserContext';
import useBotInterval from '../GamesUtils/useBotInterval';
import { useUpdateQuiz } from '../../PopQuizPage/UpdateQuiz.jsx';

const NUM_QUESTIONS = 10;

function RocketGame() {
  const { subjectGame, grade, level } = useParams();
  const subjectName = subjectGame;
  const gameLevel = parseInt(level);
  const navigate = useNavigate();
  const { user, update } = useUser();
  const updateQuiz = useUpdateQuiz(); // Hook to update quiz state (used if navigating from a quiz)
  const location = useLocation();
  // Game state
  const [started, setStarted] = useState(false);
  const [userProgress, setUserProgress] = useState(0);
  const [botProgress, setBotProgress] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [questions, setQuestions] = useState([]);
  const [countdown, setCountdown] = useState(null);

  const colorMap = [
    'text-white',
    'text-white',
    'text-white',
    'text-white'
  ]

  const TRACK_STEPS = NUM_QUESTIONS + 1;

  useEffect(() => {
    const generated = generateQuestions(subjectName, grade, gameLevel, NUM_QUESTIONS, 1);
    setQuestions(generated);
  }, [subjectName, grade, gameLevel]);

  const handleBotMove = useCallback(() => {
    setBotProgress((prev) => {
      const next = prev + 1;
      if (next >= TRACK_STEPS - 1) {
        setStarted(false);
        setMessage('Opponent wins! Try Again?');
        return TRACK_STEPS - 1;
      }
      return next;
    });
  }, [TRACK_STEPS]);

  const botTimer = useBotInterval({
    started,
    onMove: handleBotMove,
    grade,
    level: gameLevel,
  });

  const handleFinishedGame = () => {
    if (location.state?.fromQuiz) {
      updateQuiz();
      navigate("/");
    } else {
      const currentFinished = user?.gradeLevel[user.grade - 1]?.[subjectName];
      if (gameLevel > currentFinished) {
        let newUser = user;
        newUser.gradeLevel[user.grade - 1][subjectName] = gameLevel;
        update(user.email, newUser);
      }
      navigate(`/subjects/${subjectName}`, { state: { fromGame: true } });
    }
  };

  const startCountdown = () => {
    setUserProgress(0);
    setBotProgress(0);
    setQuestionIndex(0);
    setMessage('');
    setUserAnswer('');
    setCountdown(3);

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
  };

  const currentQuestion = questions[questionIndex];
  const handleAnswerSubmit = () => {
    if (!started || !currentQuestion) return;
    if (userAnswer.trim() === String(currentQuestion.answer.value)) {
      const newProgress = userProgress + 1;
      setUserAnswer('');
      setMessage('Correct!');

      if (newProgress === TRACK_STEPS - 1) {
        setUserProgress(newProgress);
        clearInterval(botTimer.current);
        setMessage(location.state?.fromQuiz ? 'Congrats! You finished the quiz!' : 'You Win! Continue To The Next Race?');
        setStarted(false);
      } else {
        setUserProgress(newProgress);
        setQuestionIndex(questionIndex + 1);
      }
    } else {
      setMessage('Incorrect, Try again!');
      setUserAnswer('');
    }
  };

  return (
    <GameContainer gameName="Math Planets" gameSubject={subjectName} gameLevel={gameLevel} icon={TitleIcom} backgroundImage={spaceBg}>
      <div className="rounded-lg p-4">
        {/* Start button or try again */}
        {!started && countdown === null && (
          <div className="flex justify-center">
            <StartButton

              onClick={message === 'You Did It! Continue To The Next Planet?' || message === 'Congrats! You finished the quiz!' ? handleFinishedGame : startCountdown}
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
            {started && (
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
            position={botProgress}
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

export default RocketGame;
