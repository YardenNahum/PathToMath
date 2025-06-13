import React from 'react';
// This component displays the question in a styled box with a gradient background.
// It uses Tailwind CSS for styling and ensures the question is centered and visually appealing.

function QuestionBox({ question }) {
    // If no question is provided, return null to avoid rendering anything
    if (!question) return null;
    // Render the question inside a styled box
    // The box has a gradient background and rounded corners for a modern look
    return (
        <div className="mb-12 flex justify-center">
            <div className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl shadow-2xl px-8 py-6 mx-4">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-center">
                    {question}
                </div>
            </div>
        </div>
    );
}

export default QuestionBox;