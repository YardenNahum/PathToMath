import React from 'react';
import ButtonComponent from '../../../Utils/Button.jsx';
// This component displays the end game screen with the score and a button to finish the game.
// It uses Tailwind CSS for styling and provides feedback based on the player's performance.

function EndGameScreen({ score, total, onFinish }) {
    // Determine if the score is a success based on a threshold
    const isSuccess = score >= 4; 

    return (
        <div className="flex flex-col items-center justify-center gap-8 p-12 rounded-3xl bg-gradient-to-br from-white via-blue-50 to-indigo-100 shadow-2xl max-w-2xl mx-auto">
            <div className="text-8xl">
                {isSuccess ? '🎉' : '🤔'}       
            </div>

            <h2 className={`text-5xl font-black text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                {isSuccess ? 'Amazing Work!' : 'Keep Trying!'}
            </h2>

            <div className="text-3xl font-bold text-gray-700 mb-2">
                Score: {score}/{total}      
            </div>

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