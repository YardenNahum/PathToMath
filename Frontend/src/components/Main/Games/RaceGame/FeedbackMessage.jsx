import React from 'react';

/**
 * FeedbackMessage component displays a colored message for user feedback.
 * It hides the message if it is empty or specific race outcome prompts.
 * 
 * @param {Object} props
 * @param {string} props.message - The feedback message to display
 * @returns {React.ReactNode|null} The feedback message element or null if hidden
 */
function FeedbackMessage({ message }) {

  // Hide message if empty or specific end-of-race prompts
  if (!message || message === 'You Win! Race Again?' || message === 'Opponent wins! Try Again?') return null;

  // Determine if the message indicates a correct answer
  const isCorrect = message === 'Correct!';

  // Choose background color based on correctness: if correct green, otherwise red
  const bgColor = isCorrect ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`py-2 px-4 rounded-lg text-white text-lg inline-block ${bgColor}`}>
      {message}
    </div>
  );
}

export default FeedbackMessage;
