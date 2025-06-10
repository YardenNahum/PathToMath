import React from 'react';

/**
 * LevelCircle Component
 * ---------------------
 * Props:
 * @param {number} currentLevel - The player's current unlocked level.
 * @param {number} numOfLevels - The total number of levels to display.
 * @param {function} onLevelClick - Callback function called with level number when a level is clicked.
 */
const LevelCircle = ({ currentLevel, numOfLevels, onLevelClick }) => {
  const levels = [];

    // Generate level data including color and playability for each level
    for (let i = 1; i <= numOfLevels; i++) {
        levels.push({
            levelNum: i,
            // Set color based on level status
            color:
            i < currentLevel
                ? 'bg-green-400'    // Completed levels
                : i === currentLevel
                ? 'bg-orange-400'   // Current level
                : 'bg-red-300', // Locked levels
            canPlay: i <= currentLevel, // True if level is playable
        });
    }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 w-full max-w-screen-lg p-1">
        {/* Render a button for each level */}
        {levels.map(({ levelNum, color, canPlay }) => (
            <button
            key={`level-${levelNum}`}
            className={`${color} ${canPlay ? 'cursor-pointer' : ''} text-white text-2xl font-bold py-4 px-4 rounded-4xl shadow-md flex items-center justify-center transition-transform duration-200 ${
                canPlay ? 'hover:scale-105 hover:animate-pulse' : ''
            }`}
            disabled={!canPlay}
            onClick={() => canPlay && onLevelClick(levelNum)}   //If canPlay is true (the level is not locked), the onLevelClick function is executed on the levelNum circle.
            title={!canPlay ? 'Level Locked' : ''}  //If the level is locked (canPlay === false), the title is set to "Level Locked".
                                                    //Otherwise, it's just an empty string '', so nothing is shown.
            >
            {levelNum}
            </button>
        ))}
    </div>
  );
};

export default LevelCircle;
