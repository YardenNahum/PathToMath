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

const NUM_QUESTIONS = 10; // Number of questions in the race

function RaceGame() {
  // Game state flags and data
  const { subjectGame, grade, level } = useParams(); //subject, grade and level from URL Params
  const subjectName = subjectGame;
  const gameLevel = parseInt(level);
  const updateQuiz = useUpdateQuiz();
  const location = useLocation();

  const navigate = useNavigate();

  const { user,update } = useUser();
  const [started, setStarted] = useState(false); // Is the game currently running?
  const [userPos, setUserPos] = useState(0); // User's current position on the track
  const [botPos, setBotPos] = useState(0); // Opponent bot position on the track
  const [questionIndex, setQuestionIndex] = useState(0); // Index of the current question the user is answering
  const [message, setMessage] = useState(''); // Message shown to the user (win/loss, correct/incorrect)
  const [userAnswer, setUserAnswer] = useState(''); // User's answer input
  const [questions, setQuestions] = useState([]); // Array of generated math questions for the race
  const [countdown, setCountdown] = useState(null); // Countdown before game starts
  const [success, setSuccess] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const colorMap = [
    'text-red-600',
    'text-yellow-500',
    'text-green-600',
    'text-black'
  ]

  useEffect(() => {
    const generated = generateQuestions(subjectName, grade, gameLevel, NUM_QUESTIONS, 1);
    setQuestions(generated);
  }, [grade, subjectName]);

  useEffect(() => {
  if (gameEnded && success) {
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
}, [gameEnded, success, location, user, update, updateQuiz, gameLevel, subjectName]);

  // The total length of the track is number of questions + a "Finish" block
  // Show full length (NUM_QUESTIONS + 1) even if questions haven't loaded yet
  const TRACK_LENGTH = 11; // Total blocks on the track (including start and finish)

  const handleBotMove = useCallback(() => {
    setBotPos((prev) => {
      const next = prev + 1;
      if (next >= TRACK_LENGTH - 1) {
        setStarted(false);
        setSuccess(false); // You lost
        setMessage('Opponent wins! Try Again?');
        return TRACK_LENGTH - 1;
      }
      return next;
    });
  }, [TRACK_LENGTH]);

  const botTimer = useBotInterval({
    started,
    onMove: handleBotMove,
    grade,
    level: gameLevel,
  });

  

  // Updating levels progress on levels page after finishing a level successfully
  const handleFinishedGame = () => {
    updateUserProgress({
      isSuccess: success,
      location,
      user,
      update,
      updateQuiz,
      gameLevel,
      gameSubject: subjectName
    });

    if (location.state?.fromQuiz)
      navigate("/");
    else
      navigate(`/subjects/${subjectName}`, { state: { fromGame: true } });
  };

  // Starts the countdown before the game and resets positions and states
  const startCountdown = () => {
    setUserPos(0);
    setBotPos(0);
    setQuestionIndex(0);
    setMessage('');
    setUserAnswer('');
    setCountdown(3);
    setGameEnded(false);
    setSuccess(false);

    // Countdown from 3 to "Race!" then start the game
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

  // Handles user submitting an answer
  const handleAnswerSubmit = () => {
    // Prevent submission if game not started or no current question available
    if (!started || !currentQuestion) return;

    // Compare user's trimmed answer to the correct answer (converted to string)
    if (userAnswer.trim() === String(currentQuestion.answer.value)) {
      const newPos = userPos + 1; // User moves one step forward
      setUserAnswer(''); // Clear the input field

      // If user reaches finish line, declare user win and stop the game
      if (newPos === TRACK_LENGTH - 1) {
        setUserPos(newPos);
        clearInterval(botTimer.current);
        setStarted(false);
        setGameEnded(true);
        setSuccess(true);
        setMessage('You Win! Continue To The Next Race?');
      } else {
        // Otherwise, update user position and move to next question
        setUserPos(newPos);
        setQuestionIndex((prev) => prev + 1);
        setMessage('Correct!');
      }
    } else {
      // If answer is wrong, show message and clear input
      setMessage('Incorrect, Try again!');
      setUserAnswer('');
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

        {/* Show start race button (for first race) or try again message (for next races)
          when the game is not running (before clicking start race or after a race finished and try again needs to be clicked) */}
        {!started && countdown === null && (
          <div className="flex justify-center">
            <StartButton
              onClick={gameEnded && success ? handleFinishedGame : startCountdown}
              message={message}
              startMessage={'🏁 Start Race'}
              startGameColor={'bg-orange-400'} />
          </div>
        )}

        {/* Use CountdownDisplay component for visuals before game starts */}
        <CountdownDisplay countdown={countdown} colorMap={colorMap} startWord={'🏁 Race!'} />

        {/* Show the question box only when the game has started */}
        {started && questionIndex < questions.length && (
          <QuestionBox
            question={currentQuestion?.question}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            onSubmit={handleAnswerSubmit}
            feedback={<FeedbackMessage message={message} />}
          />
        )}
        {/* Show tracks immediately based on TRACK_LENGTH (even if questions haven't loaded yet) */}
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
