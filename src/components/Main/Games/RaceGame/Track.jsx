import React from 'react';

/**
 * Track component renders a horizontal race track composed of blocks.
 * It highlights the current position of a player and displays start/end labels with icons.
 * 
 * @param {Object} props
 * @param {number} props.position - Current position on the track (0-based index)
 * @param {number} props.length - Total number of blocks on the track
 * @param {string} props.color - Tailwind CSS color class for highlighting the current block
 * @param {string} [props.startLabel=''] - Label for the start block (e.g., "Start")
 * @param {string} [props.endLabel=''] - Label for the end block (e.g., "Finish")
 * @returns {React.ReactNode} The rendered Track component
 */
function Track({ position, length, color, startLabel = '', endLabel = '' }) {
  const startIcon = '🚦';
  const finishIcon = '🏁';

  // Create an array of blocks based on the length of the track
  const blocks = Array.from({ length }).map((_, i) => {

    // Determine if this block is the current player position
    const isCurrent = i === position;

    // Assign a label: startLabel if at the first block, endLabel if at the last block, otherwise, no label
    const label = i === 0 ? startLabel : i === length - 1 ? endLabel : '';

    return (
      // Render each track block with styling that highlights the current position
      <div
        key={i}
        className={`relative w-14 h-14 rounded-sm border-2 border-gray-700 bg-gray-800 flex items-center justify-center mx-0.5 select-none
          ${isCurrent ? `border-yellow-400 shadow-lg ${color} text-white` : 'text-gray-300'}
          transition-transform duration-300
          ${isCurrent ? 'scale-110' : ''}
        `}
      >
        {/* Render dashed lane marking except on start, finish, or current block */}
        {!isCurrent && i !== 0 && i !== length - 1 && (
          <div className="absolute left-1/2 top-2 bottom-2 border-l-2 border-dashed border-gray-500 pointer-events-none -translate-x-1/2 z-0"></div>
        )}

        {/* Show start or finish icon if labeled, otherwise show block number */}
        <span className="relative z-10 text-center">
          {label === 'Start' ? (
            <span className="text-2xl">{startIcon}</span>
          ) : label === 'Finish' ? (
            <span className="text-2xl">{finishIcon}</span>
          ) : (
            i + 1
          )}
        </span>
      </div>
    );
});

// Render the full track of blocks
return <div className="flex justify-center mt-6">{blocks}</div>;
}

export default Track;
