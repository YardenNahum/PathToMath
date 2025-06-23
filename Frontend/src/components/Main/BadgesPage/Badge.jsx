import React from 'react';

/**
 * Badge component renders a badge with a reward, progress, and title.
 * 
 * @param {Object} props - The props for the Badge component
 * @param {Object} props.reward - The reward object
 * @param {boolean} props.isEarned - Whether the badge is earned
 * @param {boolean} props.showProgress - Whether to show the progress
 * @param {number} props.currentProgress - The current progress
 * @returns {React.ReactNode} The rendered Badge component
 */
const Badge = ({ reward, isEarned, showProgress = false, currentProgress = 0 }) => {
  return (
    <div className={`relative transform transition-all duration-500 text-gray-800 hover:rotate-2 ${isEarned ? 'scale-100 opacity-100' : 'scale-75'}`}>
      {/* Badge container */}
      <div className={`relative flex flex-col items-center p-6 rounded-3xl shadow-2xl border-4 transition-all duration-300 cursor-pointer overflow-hidden w-44 h-60
          ${isEarned
          ? `bg-gradient-to-br ${reward.color} border-yellow-300 hover:scale-110 hover:shadow-3xl hover:border-yellow-400`
          : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 hover:scale-105 hover:from-gray-200 hover:to-gray-300'
        }`}>

        {/* Badge icon */}
        {isEarned && (
          <>
            <div className="absolute top-2 right-2 text-xl animate-bounce">✨</div>
            <div className="absolute top-4 left-2 text-xl animate-bounce delay-200">💫</div>
          </>
        )}

        {/* Badge title */}
        <div className={`text-6xl mb-3 transition-transform duration-300 ${isEarned ? 'hover:scale-125 hover:rotate-12' : 'grayscale'}`}>
          {reward.icon}
        </div>
        <h2 className={`text-lg font-bold text-center ${isEarned ? 'text-white drop-shadow-lg' : 'text-gray-500'}`}>
          {reward.title}
        </h2>
        <p className={`text-sm text-center mt-1 mb-2 ${isEarned ? 'text-white/90' : 'text-gray-400'}`}>
          {reward.label ?? reward.description}
        </p>

        {/* Progress bar */}
        {showProgress && (
          <>
            <div className="text-xs text-gray-700 mb-1">{currentProgress} / 30 levels</div>
            <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (currentProgress / 30) * 100)}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Badge;
