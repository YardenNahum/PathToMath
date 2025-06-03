import React from 'react';

function QuestionBox({ question }) {
    if (!question) return null;

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
