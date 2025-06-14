import React from 'react';

/**
 * QuestionBox component renders a question with an input field for the user's answer,
 * a submit button, and optional feedback after submission.
 * 
 * @param {Object} props
 * @param {string} props.question - The current question to display
 * @param {string} props.userAnswer - The user's current input answer
 * @param {function} props.setUserAnswer - Setter function to update the user's answer
 * @param {function} props.onSubmit - Callback function triggered on form submission
 * @param {React.ReactNode} [props.feedback] - Feedback message to display below the input
 * @returns {React.ReactNode} The rendered QuestionBox component
 */
function QuestionBox({ question, userAnswer, setUserAnswer, onSubmit, feedback, disabled = false }) {

  // Handle form submission: prevent default and call onSubmit callback
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="mb-6 text-center">
      <form onSubmit={handleSubmit}>
        {/* Display the current question */}
        <div className="text-lg font-medium mb-5 mt-3 md:text-4xl">{question}</div>

        {/* Input field for the user's answer */}
        <input
          type="text"
          value={userAnswer}
          onChange={(event) => setUserAnswer(event.target.value)}
          className={`border p-2 mb-2 rounded mr-2 w-24 text-center ${disabled ? "cursor-not-allowed" : "cursor-normal"}`}
          autoFocus
          disabled={disabled}
        />

        {/* Submit button */}
        <button type="submit" className={`bg-blue-600 text-white px-4 py-2 rounded ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={disabled}>
          Submit
        </button>
      </form>

      {/* Feedback message below input */}
      {feedback && (
        <div className="mt-4">
          {feedback}
        </div>
      )}
    </div>
  );
}

export default QuestionBox;
