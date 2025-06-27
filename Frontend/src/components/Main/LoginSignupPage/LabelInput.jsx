import React from 'react';

/**
 * LabeledInput component renders a styled input field with an icon and label.
 * It supports different input types and provides interactive hover effects.
 *
 * @param {Object} props
 * @param {string} props.label - Placeholder text for the input field.
 * @param {string} [props.type="text"] - Input type (e.g., text, email, password).
 * @param {string} props.icon - Source URL/path of the icon to display next to the input.
 * @param {string} props.value - Current value of the input field.
 * @param {function} props.onChange - Callback function to update the input value on user input.
 * @returns {JSX.Element} A stylized labeled input component.
 */
const LabeledInput = ({ label, type = "text", icon, value, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-white shadow-lg border border-transparent hover:border-gray-400 hover:shadow-xl duration-300 group mb-3">
      {/* Icon next to the input field with rotation animation on hover */}
      <img
        src={icon}
        alt={`${label} icon`}
        className="w-6 h-6 group-hover:rotate-[360deg] duration-300"
      />

      {/* Text input field with placeholder and styling */}
      <input
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none text-sm text-gray-800"
        required
      />
    </div>
  );
};

export default LabeledInput;
