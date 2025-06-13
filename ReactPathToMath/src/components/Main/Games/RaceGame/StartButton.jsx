import React from 'react';
import ButtonComponent from '../../../Utils/Button';

/**
 * StartButton component renders a button to start or retry the race.
 * It displays a custom message if provided, otherwise a default "Start Race" label.
 * The button style changes based on whether it's a retry (message present) or initial start.
 * 
 * @param {Object} props
 * @param {function} props.onClick - Callback function to handle button click
 * @param {string} [props.message] - Optional message to display on the button (e.g., "Retry")
 * @returns {React.ReactNode} The rendered StartButton component
 */
function StartButton({ onClick, message, startMessage, startGameColor }) {
  
  // Determine if button is for retry or for winning based on message presence
  const isRetry = Boolean(message);

  return (
    <ButtonComponent
      onClick={onClick}
      label={message || startMessage}
      bgColor={isRetry ? 'bg-yellow-300' : startGameColor}
      textColor={isRetry ? 'text-black' : 'text-white'}
      size="xl"
    />
  );
}

export default StartButton;
