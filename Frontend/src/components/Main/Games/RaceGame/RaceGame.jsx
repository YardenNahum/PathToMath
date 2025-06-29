import React, { useState, useEffect, useCallback  } from 'react';
import { useParams } from 'react-router-dom';
import GameContainer from '../GamesUtils/GameContainer';
import QuestionBox from './QuestionBox';
import generateQuestions from '../GamesUtils/GameLogic';
import FeedbackMessage from './FeedbackMessage';
import CountdownDisplay from './CountdownDisplay';
import StartButton from './StartButton';
import TrackSection from './TrackSection';
import { useUser } from '../../../Utils/UserContext';
import { useNavigate } from 'react-router-dom';
import TitleIcon from '../../../../assets/Images/RaceGame/RaceGameTitle.png'
import RaceBg from '../../../../assets/Images/RaceGame/RaceBg.jpg'
import { useLocation } from 'react-router-dom';
import { useUpdateQuiz } from '../../PopQuizPage/UpdateQuiz.jsx';
import useBotInterval from '../GamesUtils/useBotInterval.jsx';
import updateUserProgress from '../GamesUtils/UpdateUserProgress.jsx';
import useGameSounds from '../GamesUtils/Sounds.jsx'
import useSound from 'use-sound';
import CoundownSound from '../../../../assets/sounds/countdown.mp3';
import BotStepSound from '../../../../assets/sounds/passingCar.mp3';
import MyStepSound from '../../../../assets/sounds/myCar.mp3';

const NUM_QUESTIONS = 10; // Total number of questions per race

function RaceGame() {
  const { subjectGame, grade, level } = useParams(); //subject, grade and level from URL Params
  const subjectName = subjectGame;
  const gameLevel = parseInt(level);

  // Sound effects
  const {winLevelSound,loseSound,wrongAnswerSound,correctQuestionSound} = useGameSounds();
  const [countdownSound] = useSound(CoundownSound);
  const [botStepSound] = useSound(BotStepSound);
  const [myStepSound] = useSound(MyStepSound);

  const updateQuiz = useUpdateQuiz();
  const location = useLocation();
  const navigate = useNavigate();
  const { user,update } = useUser();
  
  // Game state management
  const [started, setStarted] = useState(false);  // Whether the race has started
  const [userPos, setUserPos] = useState(0);  // User's current position on the track
  const [botPos, setBotPos] = useState(0);  // Bot's position on the track
  const [questionIndex, setQuestionIndex] = useState(0); // Index of the current question
  const [message, setMessage] = useState(''); // Feedback message (correct/wrong/win/lose)
  const [userAnswer, setUserAnswer] = useState(''); // User's input
  const [questions, setQuestions] = useState([]); // List of generated questions
  const [countdown, setCountdown] = useState(null); // Countdown timer before game start
  const [success, setSuccess] = useState(false);  // Whether the user won
  const [gameEnded, setGameEnded] = useState(false);  // Whether the game has ended

  // Countdown display colors
  const colorMap = [
    'text-red-600',
    'text-yellow-500',
    'text-green-600',
    'text-black'
  ]

  // Generate questions once on component mount or when grade/subject changes
  useEffect(() => {
    const generated = generateQuestions(subjectName, grade, gameLevel, NUM_QUESTIONS, 1);
    setQuestions(generated);
  }, [grade, subjectName]);

  // After game ends and user wins, update progress or quiz data
  useEffect(() => {
  if (gameEnded) {
    updateUserProgress({
      isSuccess: success,
      location,
      user,
      update,
      updateQuiz,
      gameLevel,
      gameSubject: subjectName
    });
  }
}, [gameEnded, success]);

  const TRACK_LENGTH = 11; // 10 questions + 1 finish line block

  // Bot movement handler: advance bot one step and check for race end
  const handleBotMove = useCallback(() => {
    setBotPos((prev) => {
      const next = prev + 1;
      if (next >= TRACK_LENGTH - 1) {
        setStarted(false);  // Stop the game
        setSuccess(false); // Mark as lost
        setGameEnded(true); // Game has ended
        setMessage('Opponent wins! Try Again?');
        loseSound(); // Play lose sound when bot wins
        return TRACK_LENGTH - 1;
      }
      return next;
    });
    
    // Play bot step sound for regular movement (outside state setter)
    if (botPos < TRACK_LENGTH - 2) { // Only play if bot hasn't reached finish line
      botStepSound();
    }
  }, [TRACK_LENGTH, botPos]);

  // Triggers bot movement at intervals
  const botTimer = useBotInterval({
    started,
    onMove: handleBotMove,
    grade,
    level: gameLevel,
  });

  // Navigate and update user after finishing a successful race
  const handleFinishedGame = () => {

    if (location.state?.fromQuiz)
      navigate("/");
    else
      navigate(`/subjects/${subjectName}`, { state: { fromGame: true } });
  };

  // Initiates countdown sequence before race starts
  const startCountdown = () => {
    setUserPos(0);
    setBotPos(0);
    setQuestionIndex(0);
    setMessage('');
    setUserAnswer('');
    setCountdown(3);
    setGameEnded(false);
    setSuccess(false);
    
    // Play countdown sound when countdown starts
    countdownSound();

    // Countdown logic: 3 → 2 → 1 → "Race!" → start
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCountdown('🏁 Race!');
          setTimeout(() => {
            setCountdown(null);
            setStarted(true); // Game actually starts
          }, 1000);
          return '🏁 Race!';
        }
        return typeof prev === 'number' ? prev - 1 : prev;
      });
    }, 1000);
  };

  // The current question the user must answer based on questionIndex
  const currentQuestion = questions[questionIndex];

  // Process user submission and check correctness
  const handleAnswerSubmit = () => {
    if (!started || !currentQuestion) return;

    // Compare user's trimmed answer to the correct answer (converted to string)
    if (userAnswer.trim() === String(currentQuestion.answer.value)) {
      const newPos = userPos + 1; // User moves one step forward
      setUserAnswer(''); // Clear the input field
      myStepSound(); // Play correct answer sound

      // If user reaches finish line, declare user win and stop the game
      if (newPos === TRACK_LENGTH - 1) {
        setUserPos(newPos);
        clearInterval(botTimer.current);
        setStarted(false);
        setGameEnded(true);
        setSuccess(true);
        setMessage('You Win! Continue To The Next Race?');
        winLevelSound(); // Play win sound when user reaches finish line
      } else {
        // Move to next question and update position
        setUserPos(newPos);
        setQuestionIndex((prev) => prev + 1);
        setMessage('Correct!');
      }
    } else {
      // Wrong answer feedback
      setMessage('Incorrect, Try again!');
      setUserAnswer('');
      wrongAnswerSound(); // Play wrong answer sound
    }
  };

  return (
    <GameContainer 
      gameName="Math Race" 
      gameSubject={subjectName} 
      gameLevel={gameLevel} 
      icon={TitleIcon} 
      backgroundImage={RaceBg}
      howToPlay={"Answer math questions quickly to move forward and beat your opponent to the finish line. One correct answer = one step forward!"}
    >
      <div className="bg-gray-100 rounded-lg p-4 shadow-lg mb-5 max-w-4xl mx-auto">

        {/* Show start button or continue button depending on game state */}
        {!started && countdown === null && (
          <div className="flex justify-center">
            <StartButton
              onClick={gameEnded && success ? handleFinishedGame : startCountdown}
              message={message}
              startMessage={'🏁 Start Race'}
              startGameColor={'bg-orange-400'} />
          </div>
        )}

        {/* Countdown display before game starts */}
        <CountdownDisplay countdown={countdown} colorMap={colorMap} startWord={'🏁 Race!'} />

        {/* Question box only appears during the game */}
        {started && questionIndex < questions.length && (
          <QuestionBox
            question={currentQuestion?.question}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            onSubmit={handleAnswerSubmit}
            feedback={<FeedbackMessage message={message} />}
          />
        )}
        {/* Display the race track with user/bot positions */}
        {TRACK_LENGTH > 1 && (
          <TrackSection
            userPos={userPos}
            botPos={botPos}
            trackLength={TRACK_LENGTH}
            startIcon="🚦"
            finishIcon="🏁"
          />
        )}
      </div>
    </GameContainer>
  );
}

export default RaceGame;
