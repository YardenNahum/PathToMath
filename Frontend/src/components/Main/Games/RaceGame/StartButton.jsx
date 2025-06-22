import React from 'react';
import ButtonComponent from '../../../Utils/Button';

/**
 * StartButton component renders a button used to start or retry the race.
 * - Shows a custom message (e.g., retry message) if provided,
 *   otherwise displays a default "Start Race" label.
 * - Styles the button differently depending on whether it is a retry or the initial start.
 *
 * @param {Object} props
 * @param {function} props.onClick - Function to handle button clicks
 * @param {string} [props.message] - Optional message to display on the button (e.g., "Retry")
 * @param {string} props.startMessage - Default label shown on initial start (e.g., "Start Race")
 * @param {string} props.startGameColor - Background color class for initial start button
 * @returns {React.ReactNode} Rendered StartButton component
 */
function StartButton({ onClick, message, startMessage, startGameColor }) {
  // If message exists, treat button as a retry button, otherwise as initial start
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
