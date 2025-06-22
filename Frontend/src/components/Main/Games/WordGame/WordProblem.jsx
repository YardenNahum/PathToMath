import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../../Utils/UserContext";
import { useGrade } from "../../../Utils/GradeComponent";
import generateQuestions from "../GamesUtils/GameLogic.jsx";
import WordProblemsCreator from "./WordProblemsCreator";
import QuestionBox from "../RaceGame/QuestionBox";
import GameContainer from "../GamesUtils/GameContainer";
import TitleIcon from "../../../../assets/Images/wordGame/StoriesIcon.png";
import successImage from "../../../../assets/Images/Games/success.png";
import failureImage from "../../../../assets/Images/Games/failure.png";
import ButtonComponent from "../../../Utils/Button";
import StoriesBg from '../../../../assets/Images/wordGame/StoriesBg.png'
import { useLocation } from 'react-router-dom';
import { useUpdateQuiz } from '../../PopQuizPage/UpdateQuiz.jsx';
import updateUserProgress from '../GamesUtils/UpdateUserProgress.jsx';

/**
 * WordProblem component
 * @returns {JSX.Element} - The rendered component.
 */
const WordProblem = () => {
  // Get the subject and level from the URL parameters
  const { subjectGame, level } = useParams();
  // Define the game subject and level
  const gameSubject = subjectGame;
  const gameLevel = parseInt(level);
  const navigate = useNavigate();
  const updateQuiz = useUpdateQuiz();

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
  // Function to reset the game state
  const resetGame = () => {
    setCurrentQuestion(null);
    setFeedback(null);
    setUserAnswer("");
    setIsAnswerVisible(false)
    setEndGame(false);
    setEndGameObject(null);
  };
  // Function to load a new game level
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
  // Function to handle the submission of the user's answer
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
    } else {
      setFeedback(<p className="text-red-600">Wrong! The correct answer was {correct}</p>);
    }
  };
  /**
   * Function to handle the next question click
   * It updates the questions array, sets the next question as current,
   */
  // Function to handle the next question click
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
      bgColor: isSuccess ? "bg-green-200" : "bg-red-200",
      text: `${isSuccess ? 'Great!' : 'Oh no!'} You answered ${correctAnswers} / ${numOfQuestions} Correct Answers.`,
      color: isSuccess ? "green" : "red",
      imgURL: isSuccess ? successImage : failureImage,
      headerText: isSuccess ? "Continue to the next level!" : "Try Again?",
      handleClick: () => {
        if (isSuccess) {
          if (location.state?.fromQuiz) {
            navigate("/");
          } else {
            navigate(`/subjects/${gameSubject}`, { state: { fromGame: true } });
          }
        } else {
          // Retry current level
          resetGame();
          loadGameLevel();
        }
      },
      buttonText: isSuccess ? (location.state?.fromQuiz ? "Finish quiz" : "Next Level") : "Try Again!",
      containerColor: isSuccess ? "bg-green-100" : "bg-red-100"
    });
    setEndGame(true);
  };


  /**
   * End Game Component
   * @returns {JSX.Element} - The end game component with an image and button.
   */
  const endGameComponent = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <img
          className="h-60 w-auto max-w-full object-contain"
          src={endGameObject?.imgURL}
          alt={endGameObject?.color === "green" ? "Success" : "Failure"}
        />
        <ButtonComponent
          label={endGameObject?.buttonText}
          onClick={endGameObject?.handleClick}
          textColor="text-black"
          bgColor={endGameObject?.bgColor}
        />
      </div>
    )
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
        <div >

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
              <div className="m-5">{endGameObject?.text}

                {endGameComponent()}
              </div>
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
