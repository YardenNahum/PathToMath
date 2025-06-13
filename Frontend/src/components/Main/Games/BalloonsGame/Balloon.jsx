import React, { useState } from 'react';
// This component represents a balloon in the game.
// It displays the balloon with a gradient background and handles click events to pop the balloon.
// It uses Tailwind CSS for styling and includes animations for popping and bouncing effects.
function Balloon({ option, onClick }) {
    const [isPopping, setIsPopping] = useState(false);
    // This function handles the click event on the balloon.
    // It sets the popping state to true and triggers the onClick callback after a delay.
    const handleClick = () => {
        setIsPopping(true);
        setTimeout(() => {
            onClick(option.value);
        }, 200);
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
                <div className="absolute top-2 left-3 w-4 h-6 bg-white opacity-30 rounded-full blur-sm"></div>
                <span className="relative z-10 drop-shadow-lg">{option.textValue}</span>
            </div>
            <div className="w-0.5 h-8 bg-gray-600 animate-string-sway"></div>
            <div className="w-2 h-1 bg-gray-700 rounded-full"></div>
        </div>
    );
}

export default Balloon;