import React from 'react';
import ButtonComponent from '../../../Utils/Button.jsx';

/**
 * EndGameScreen component displays a summary screen at the end of the game.
 * It shows an emoji, a feedback message, the player's score, and a button to continue.
 * The content adapts based on whether the user passed a predefined success threshold.
 *
 * @param {Object} props
 * @param {number} props.score - The player's score (number of correct answers).
 * @param {number} props.total - The total number of questions in the game.
 * @param {function} props.onFinish - Callback function triggered when the user clicks the finish button.
 * @returns {JSX.Element} Rendered end game screen.
 */
function EndGameScreen({ score, total, onFinish }) {
    // Determine if the score is a success based on a threshold
    const isSuccess = score >= 4;

    return (
        <div className="flex flex-col items-center justify-center gap-8 p-12 rounded-3xl bg-gradient-to-br from-white via-blue-50 to-indigo-100 shadow-2xl max-w-2xl mx-auto">
            {/* Emoji icon depending on success or failure */}
            <div className="text-8xl">
                {isSuccess ? '🎉' : '🤔'}
            </div>

            {/* Headline feedback message */}
            <h2 className={`text-5xl font-black text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                {isSuccess ? 'Amazing Work!' : 'Keep Trying!'}
            </h2>

            {/* Final score display */}
            <div className="text-3xl font-bold text-gray-700 mb-2">
                Score: {score}/{total}
            </div>

            {/* Continue/Retry button */}
            <ButtonComponent
                label={isSuccess ? '🚀 Next Adventure!' : '🔄 Try Again!'}
                onClick={onFinish}
                bgColor={isSuccess ? 'bg-green-400' : 'bg-red-400'}
                textColor="text-white"
                size="lg"
            />
        </div>
    );
}

export default EndGameScreen;