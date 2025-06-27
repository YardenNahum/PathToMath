import React from 'react';
import OptionButton from './OptionButton.jsx';

/**
 * MultipleChoiceCard component renders a multiple-choice question card with options.
 * It highlights options based on selection and whether the correct answer is revealed.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.question - The question object, including options and correct answer
 * @param {Array} props.question.options - Array of option objects { value, textValue }
 * @param {Object} props.question.answer - Correct answer object with a `value` property
 * @param {function} props.onOptionClick - Callback fired when an option is clicked, passes the selected option
 * @param {Object|null} props.selectedOption - Currently selected option object or null if none selected
 * @param {string} props.subject - Subject name, affects option label formatting (e.g., add % sign for "Percentage")
 * @param {boolean} props.isAnswerVisible - Whether the correct answer should be revealed/styled accordingly
 * @param {boolean} props.disableButtons - If true, disables all option buttons (e.g., after selection)
 * 
 * @returns {JSX.Element} Rendered multiple choice question card
 */
export default function MultipleChoiceCard({
    question,
    onOptionClick,
    selectedOption,
    subject,
    isAnswerVisible,
    disableButtons,
}) {

    /**
     * Determines the background color class for each option button based on selection and correctness.
     * @param {Object} option - Option object
     * @returns {string} Tailwind CSS classes for background and styling
     */
    const optionBgColor = (option) => {
        if (!selectedOption)
            return "bg-orange-900 border-4 border-amber-700 shadow-inner shadow-black hover:brightness-110";

        if (!isAnswerVisible) {
            // Answer not revealed yet, show default styling for all options
            return "bg-orange-900 border-4 border-amber-700 shadow-inner shadow-black hover:brightness-110";
        }

        const correct = question.answer.value;
        const selected = option.value;

        if (selected === correct) return "bg-green-400 shadow-md";  // Correct option highlighted green
        if (selected === selectedOption.value) return "bg-red-400 shadow-md";   // Incorrect selected option highlighted red

        // Other options stay default orange style
        return "bg-orange-900 border-4 border-amber-700 shadow-inner shadow-black hover:brightness-110";
    };

    /**
     * Determines the text color class for each option based on selection and correctness.
     * @param {Object} option - Option object
     * @returns {string} Tailwind CSS classes for text color
     */
    const getOptionTextColor = (option) => {
        if (!selectedOption) return "text-amber-400";

        if (!isAnswerVisible) {
            // Before answer reveal, all options have the default text color
            return "text-amber-400";
        }
        const isCorrect = option.value === question.answer.value;
        const isSelected = option.value === selectedOption.value;
        return isCorrect || isSelected ? "text-black" : "text-amber-400";
    };

    return (
        <div className="flex flex-col flex-wrap md:grid md:grid-cols-2 gap-10 mb-10 gap-x-30 gap-y-10">
            {question.options.map((option, index) => (
                <OptionButton
                    key={index}
                    label={subject === "Percentage" ? `${option.textValue}%` : option.textValue}
                    onClick={() => onOptionClick(option)}
                    bgColor={optionBgColor(option)}
                    textColor={getOptionTextColor(option)}
                    disabled={disableButtons}
                />
            ))}
        </div>
    );
}
