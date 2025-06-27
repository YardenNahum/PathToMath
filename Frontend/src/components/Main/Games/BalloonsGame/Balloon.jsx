import React, { useState } from 'react';

/**
 * Balloon component represents a single clickable balloon in the game.
 * Each balloon has a unique color gradient, floating animation, and popping effect on click.
 *
 * @param {Object} props
 * @param {{ textValue: string, value: any }} props.option - The answer option to be displayed in the balloon.
 * @param {function} props.onClick - Callback function triggered with the option value when the balloon is clicked.
 * @returns {JSX.Element} Rendered balloon element with animations and effects.
 */
function Balloon({ option, onClick }) {
    // Track whether the balloon is currently popping (for animation)
    const [isPopping, setIsPopping] = useState(false);

    /**
     * Handle click on the balloon.
     * Triggers the popping animation and calls the provided onClick callback with the option value.
     */
    const handleClick = () => {
        setIsPopping(true);
        setTimeout(() => {
            onClick(option.value);
        }, 200);    // Delay to allow pop animation to play
    };

    // Define a set of gradient backgrounds for the balloons
    const balloonGradients = [
        'bg-gradient-to-br from-red-400 via-red-500 to-red-600',
        'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500',
        'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500',
        'bg-gradient-to-br from-green-400 via-green-500 to-green-600',
        'bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500',
        'bg-gradient-to-br from-purple-300 via-purple-400 to-purple-500',
        'bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500',
        'bg-gradient-to-br from-teal-300 via-teal-400 to-teal-500'
    ];

    // Randomly select a gradient for the balloon
    // This ensures each balloon has a unique appearance
    const randomGradient = balloonGradients[Math.floor(Math.random() * balloonGradients.length)];

    return (
        <div className="flex flex-col items-center animate-floating">
            <div
                onClick={handleClick}
                className={`
                    relative flex justify-center items-center rounded-full shadow-2xl
                    text-white font-black text-2xl cursor-pointer w-28 h-32
                    ${randomGradient}
                    ${isPopping ? 'animate-pop' : 'animate-gentle-bounce'}
                    balloon-glow
                `}
            >
                {/* Light reflection effect on the balloon */}
                <div className="absolute top-2 left-3 w-4 h-6 bg-white opacity-30 rounded-full blur-sm"></div>

                {/* The text inside the balloon */}
                <span className="relative z-10 drop-shadow-lg">{option.textValue}</span>
            </div>

            {/* Balloon string and knot */}
            <div className="w-0.5 h-8 bg-gray-600 animate-string-sway"></div>
            <div className="w-2 h-1 bg-gray-700 rounded-full"></div>
        </div>
    );
}

export default Balloon;