import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../../Utils/UserContext";
import { useGrade } from "../../../Utils/GradeComponent";
import generateQuestions from "../GamesUtils/GameLogic.jsx";
import WordProblemsCreator from "./WordProblemsCreator";
import QuestionBox from "../RaceGame/QuestionBox";
import GameContainer from "../GamesUtils/GameContainer";
import TitleIcon from "../../../../assets/Images/wordGame/StoriesIcon.png";
import ButtonComponent from "../../../Utils/Button";
import StoriesBg from '../../../../assets/Images/wordGame/StoriesBg.png'
import { useLocation } from 'react-router-dom';
import { useUpdateQuiz } from '../../PopQuizPage/UpdateQuiz.jsx';
import updateUserProgress from '../GamesUtils/UpdateUserProgress.jsx';
import useGameSounds from '../GamesUtils/Sounds.jsx'
import MagicWand from '../../../../assets/sounds/WordGame/magicWand.mp3';
import useSound from "use-sound";
import EndGameComponent from "../GamesUtils/EndGameComponent.jsx";
import successImage from '../../../../assets/Images/wordGame/successWitch.png';
import failureImage from '../../../../assets/Images/wordGame/failureWitch.png';

/**
 * WordProblem component - Interactive game where children solve fairy-tale themed word problems.
 * Users answer 3 questions, and if they get at least 2 correct, they progress to the next level.
 * @returns {JSX.Element} - The rendered component.
 */
const WordProblem = () => {
  const { subjectGame, level } = useParams(); // Get the subject and level from the URL parameters
  // Define the game subject and level
  const gameSubject = subjectGame;
  const gameLevel = parseInt(level);
  const navigate = useNavigate();
  const updateQuiz = useUpdateQuiz();

  // Sound effects
  const { loseSound, wrongAnswerSound, correctQuestionSound } = useGameSounds();
  const [playMagicWand] = useSound(MagicWand, { volume: 0.5 });

  // State to handle return from pop quiz
  const location = useLocation();
  // Get the user from the UserContext
  const { user, update } = useUser();
  // Get the current grade from the GradeContext
  const { grade } = useGrade();
  // State to track correct answers
  const [correctAnswers, setCorrectAnswers] = useState(0);
  // State for the current question
  const [currentQuestion, setCurrentQuestion] = useState(null);
  // State to hold the questions for the game
  const [questions, setQuestions] = useState([]);
  // State for the user's answer
  const [userAnswer, setUserAnswer] = useState("");
  //answer is visible
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  // State for feedback to the user
  const [feedback, setFeedback] = useState(null);
  // Flag for ending the game
  const [endGame, setEndGame] = useState(false);
  // Object to hold end game details
  const [endGameObject, setEndGameObject] = useState(null);
  // State to track loading state
  const [isLoading, setIsLoading] = useState(true);

  const numOfQuestions = 3;
  const numOfOptions = 1;

  /**
   * Resets the game to initial state, for retrying the level.
   */
  const resetGame = () => {
    setCurrentQuestion(null);
    setFeedback(null);
    setUserAnswer("");
    setIsAnswerVisible(false)
    setEndGame(false);
    setEndGameObject(null);
  };

  /**
   * Loads a new set of word problems based on subject, grade and level.
   */
  const loadGameLevel = () => {
    // Generate new questions based on the subject, grade, level, number of questions and options
    const newQuestions = generateQuestions(gameSubject, parseInt(grade), gameLevel, numOfQuestions, numOfOptions);
    // Set the questions for the game
    setQuestions(newQuestions);
    //  Set the current question as the first in the array
    setCurrentQuestion(newQuestions[0]);
    // Reset the correct answers and user answer
    setCorrectAnswers(0);
    // Reset user answer
    setUserAnswer("");
    // Reset feedback
    setFeedback(null);
    setIsLoading(false);
  };

  // Load the game level when the component mounts
  useEffect(() => {
    loadGameLevel();
  }, []);

  /**
   * Handles the submission of the user's answer and gives feedback.
   */
  const handleSubmit = () => {
    // Check if the user has entered an answer
    if (!userAnswer) {
      setFeedback(<p className="text-red-600">Please enter an answer!</p>);
      return;
    }

    setIsAnswerVisible(true)
    const userNumericAnswer = parseInt(userAnswer);
    // Check if the answer is correct
    let correct = currentQuestion?.answer?.value;
    correct = Math.abs(correct);

    // If the answer is correct, provide positive feedback
    if (userNumericAnswer === correct) {
      setFeedback(<p className="text-green-600">Correct!</p>);
      setCorrectAnswers((prev) => prev + 1);
      correctQuestionSound(); // Play correct answer sound
    } else {
      setFeedback(<p className="text-red-600">Wrong! The correct answer was {correct}</p>);
      wrongAnswerSound(); // Play wrong answer sound
    }
  };

  /**
   * Proceeds to the next question or ends the game if finished.
   */
  const nextQuestionClicked = () => {
    setUserAnswer("");
    const updatedQuestions = [...questions];
    updatedQuestions.shift();

    //check if its not the last question
    if (updatedQuestions.length >= 1) {
      setQuestions(updatedQuestions);
      setCurrentQuestion(updatedQuestions[0]);
      setIsAnswerVisible(false);
      setFeedback(null);
    } else {
      generateEnd();
    }
  };

  /**
   * Function to generate the end game object
   * It checks the number of correct answers and updates the user progress accordingly.
   */
  const generateEnd = () => {
    const isSuccess = correctAnswers >= 2;

    // Play win or lose sound based on performance
    if (isSuccess) {
      playMagicWand(); // Play win sound for passing score (2+ correct)
    } else {
      loseSound(); // Play lose sound for failing score (<2 correct)
    }

    //update user progress based on success
    updateUserProgress({
      isSuccess: isSuccess,
      location,
      user,
      update,
      updateQuiz,
      gameLevel: parseInt(level),
      gameSubject: subjectGame
    });

    // Set the end game object based on success or failure
    // If the user has answered at least 2 questions correctly, they win
    setEndGameObject({
      isSuccess: isSuccess,
      text: `${isSuccess ? 'Great!' : 'Oh no!'} You answered ${correctAnswers} / ${numOfQuestions} Correct Answers.`,
      customImage: isSuccess ? successImage : failureImage,
      buttonText: isSuccess ? (location.state?.fromQuiz ? "Finish quiz" : "Continue to the next level!") : "Try Again!",
      bgColor: isSuccess ? "bg-green-200" : "bg-red-200",
      containerColor: isSuccess ? "bg-green-100" : "bg-red-100",
      handleClick: () => {
        if (isSuccess) {
          if (location.state?.fromQuiz) {
            navigate("/");
          } else {
            navigate(`/subjects/${gameSubject}`, { state: { fromGame: true } });
          }
        } else {
          resetGame();
          loadGameLevel();
        }
      }
    });

    setEndGame(true);
  };

  return (
    <GameContainer
      gameName="Math Tales"
      gameSubject={gameSubject}
      grade={grade}
      level={gameLevel}
      icon={TitleIcon}
      backgroundImage={StoriesBg}
      howToPlay={"Read the math tale carefully and type your answer in the box. Get at least 2 out of 3 correct to win!"}
    >
      <div className={`inline-block max-w-[800px] mb-5 align-middle justify-center border-5 border-red-300 rounded-3xl shadow-lg ${endGame ? endGameObject?.containerColor : 'bg-white'}`}>
        <div>
          {isLoading ? (
            <div className="text-center max-w-3xl text-xl font-semibold mt-8">Loading your question...</div>
          ) : (
            currentQuestion && !endGame && (
              <div className="w-full max-w-sm md:max-w-2xl align-middle mx-auto p-6 ">
                <WordProblemsCreator
                  var1={currentQuestion.var1.value}
                  var2={currentQuestion.var2.value}
                  answer={currentQuestion.answer.value}
                  subject={gameSubject}
                />
                <QuestionBox
                  question={"What is the answer?"}
                  userAnswer={userAnswer}
                  setUserAnswer={setUserAnswer}
                  onSubmit={handleSubmit}
                  feedback={feedback}
                  disabled={isAnswerVisible}
                />
              </div>
            )
          )}

          {endGame && (
            <>
              <div className="text-center text-xl font-medium mt-4 mb-6 px-4">
                {endGameObject?.text}
              </div>
              <EndGameComponent
                isSuccess={endGameObject?.isSuccess}
                customImage={endGameObject?.customImage}
                buttonText={endGameObject?.buttonText}
                handleClick={endGameObject?.handleClick}
                bgColor={endGameObject?.bgColor}
              />
            </>
          )}

          {!endGame && isAnswerVisible && (
            <div className="flex justify-center gap-10 mb-4">
              <ButtonComponent
                label="Next Question"
                onClick={nextQuestionClicked}
                bgColor="bg-yellow-400"
                textColor="text-black"
                size="lg"
              />
            </div>
          )}
        </div>
      </div>
    </GameContainer>
  );
};

export default WordProblem;
