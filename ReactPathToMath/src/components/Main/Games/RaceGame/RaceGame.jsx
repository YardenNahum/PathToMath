import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useGrade } from '../../../Utils/GradeComponent';
import { getUserByMail } from '../../../../services/UserService';
import GameContainer from '../GameContainer';
import QuestionBox from './QuestionBox';
import generateQuestions from '../GameLogic';
import FeedbackMessage from './FeedbackMessage';
import CountdownDisplay from './CountdownDisplay';
import StartButton from './StartButton';
import TrackSection from './TrackSection';

const NUM_QUESTIONS = 10; // Number of questions in the race

function RaceGame({ userEmail }) {
  // Game state flags and data
  const { grade } = useGrade();
  const { subjectName: gameSubject } = useParams();
  const [started, setStarted] = useState(false); // Is the game currently running?
  const [userPos, setUserPos] = useState(0); // User's current position on the track
  const [botPos, setBotPos] = useState(0); // Opponent bot position on the track
  const [questionIndex, setQuestionIndex] = useState(0); // Index of the current question the user is answering
  const [message, setMessage] = useState(''); // Message shown to the user (win/loss, correct/incorrect)
  const [userAnswer, setUserAnswer] = useState(''); // User's answer input
  const [questions, setQuestions] = useState([]); // Array of generated math questions for the race
  const botTimer = useRef(null); // Opponent bot's interval timer
  const [countdown, setCountdown] = useState(null); // Countdown before game starts

  // Fetch user data when component mounts or when userEmail or gameSubject changes
  useEffect(() => {
    if (!userEmail) return;

    getUserByMail(userEmail)
      .then((data) => {
        // Determine the user's level for the current subject and grade
        const level = data.gradeLevel?.[data.grade - 1]?.[gameSubject];

        // Generate questions dynamically based on subject, level, number, and difficulty (1)
        const generated = generateQuestions(gameSubject, level, NUM_QUESTIONS, 1);
        setQuestions(generated);
      })
      .catch((error) => {
        console.error('Failed to fetch user data:', error);
      });
  }, [userEmail, gameSubject]);

  // The total length of the track is number of questions + a "Finish" block
  // Show full length (NUM_QUESTIONS + 1) even if questions haven't loaded yet
  const TRACK_LENGTH = questions.length > 0 ? questions.length + 1 : NUM_QUESTIONS + 1;

  // Effect that controls the bot's automatic movement during the race
  useEffect(() => {
    if (started && TRACK_LENGTH > 1) {
      // Set bot to move forward every 5 seconds
      botTimer.current = setInterval(() => {
        setBotPos((prev) => {
          const next = prev + 1;

          // If bot reaches the finish line, end the game and declare bot winner
          if (next >= TRACK_LENGTH - 1) {
            clearInterval(botTimer.current);
            setStarted(false);
            setMessage('Opponent wins! Try Again?');
            return TRACK_LENGTH - 1;
          }
          return next;
        });
      }, 5000);
    }

    // Clear the interval when component unmounts or dependencies change
    return () => clearInterval(botTimer.current);
  }, [started, TRACK_LENGTH]);

  // Starts the countdown before the game and resets positions and states
  const startCountdown = () => {
    setUserPos(0);
    setBotPos(0);
    setQuestionIndex(0);
    setMessage('');
    setUserAnswer('');
    setCountdown(3);

    // Countdown from 3 to "Race!" then start the game
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCountdown('Race!');
          setTimeout(() => {
            setCountdown(null);
            setStarted(true); // Game actually starts
          }, 1000);
          return 'Race!';
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
        setMessage('You Win! Race Again?');
        setStarted(false);
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
    <GameContainer gameName="Math Race" gameSubject={gameSubject} gameLevel={`Grade ${grade}`}>
      {/* Show start race button (for first race) or try again message (for next races)
          when the game is not running (before clicking start race or after a race finished and try again needs to be clicked) */}
      {!started && countdown === null && (
        <div className="flex justify-center">
          <StartButton onClick={startCountdown} message={message} />
        </div>
      )}

      {/* Use CountdownDisplay component for visuals before game starts */}
      <CountdownDisplay countdown={countdown} />

      {/* Show the question box only when the game has started */}
      {started && (
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
        <TrackSection userPos={userPos} botPos={botPos} trackLength={TRACK_LENGTH} />
      )}
    </GameContainer>
  );
}

export default RaceGame;
