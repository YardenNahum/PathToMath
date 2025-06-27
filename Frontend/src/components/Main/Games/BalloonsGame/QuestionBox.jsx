import React from 'react';

/**
 * QuestionBox component displays the current question in a styled container.
 * It uses a gradient background and centered, large text for visual emphasis.
 *
 * @param {Object} props
 * @param {string} props.question - The question text to display.
 * @returns {JSX.Element|null} A styled box with the question, or null if no question is provided.
 */
function QuestionBox({ question }) {
    // If no question is provided, return null to avoid rendering anything
    if (!question) return null;

    return (
        <div className="mb-12 flex justify-center">
            {/* Outer container */}
            <div className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl shadow-2xl px-8 py-6 mx-4">
                {/* Styled question text */}
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-center">
                    {question}
                </div>
            </div>
        </div>
    );
}

export default QuestionBox;