import React from 'react';

/**
 * QuestionBox component renders a math or quiz-style question
 * with a text input for the user's answer, a submit button,
 * and optional feedback (e.g. correct/incorrect response).
 *
 * @param {Object} props
 * @param {string} props.question - The current question to be displayed
 * @param {string} props.userAnswer - The current answer typed by the user
 * @param {function} props.setUserAnswer - Function to update the userAnswer state
 * @param {function} props.onSubmit - Function to handle form submission
 * @param {React.ReactNode} [props.feedback] - Optional feedback to show after submission
 * @param {boolean} [props.disabled=false] - Whether inputs should be disabled (e.g., while waiting)
 * @returns {React.ReactNode} Rendered QuestionBox component
 */
function QuestionBox({ question, userAnswer, setUserAnswer, onSubmit, feedback, disabled = false }) {

  /**
   * Handles form submission:
   * Prevents page reload and invokes the onSubmit callback
   */
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form behavior
    onSubmit(); // Trigger the provided submit handler
  };

  return (
    <div className="mb-6 text-center">
      <form onSubmit={handleSubmit}>
        {/* Display the question text */}
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

        {/* Submit answer button */}
        <button type="submit" className={`bg-blue-600 text-white px-4 py-2 rounded ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={disabled}>
          Submit
        </button>
      </form>

      {/* Show feedback message if provided */}
      {feedback && (
        <div className="mt-4">
          {feedback}
        </div>
      )}
    </div>
  );
}

export default QuestionBox;
