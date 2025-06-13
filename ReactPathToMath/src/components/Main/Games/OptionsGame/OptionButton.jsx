import React from 'react';
import ButtonComponent from '../../../Utils/Button.jsx';

/**
 * OptionButton component acts as a wrapper around the generic ButtonComponent
 * to provide consistent styling and behavior for option buttons in quiz/game UI.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - The text to display on the button
 * @param {function} props.onClick - Click handler function when the button is pressed
 * @param {string} props.bgColor - Tailwind CSS classes for the button background color
 * @param {string} props.textColor - Tailwind CSS classes for the button text color
 * @param {boolean} props.disabled - Whether the button is disabled or not
 * 
 * @returns {JSX.Element} Rendered OptionButton component
 */
export default function OptionButton({ label, onClick, bgColor, textColor, disabled }) {
  return (
    <ButtonComponent
      label={label}
      onClick={onClick}
      bgColor={bgColor}
      textColor={textColor}
      size="lg"
      disabled={disabled}
    />
  );
}
