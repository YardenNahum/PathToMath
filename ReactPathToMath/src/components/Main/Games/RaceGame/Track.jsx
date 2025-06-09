import React from 'react';
import Rocket from '../../../../assets/Images/SpaceGame/rocket.gif'

function Track({ position, length, color = '#0000000000', startLabel = '', endLabel = '', startIcon, finishIcon, direction = 'horizontal', type = 'cubes' }) {
  switch (type) {
    case 'cubes':
      if (direction === 'horizontal') {
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

    case 'climb':
      if (direction === 'vertical') {
        // Map position 0 to 0% and max position (length - 1) to 90%
        const maxPercent = 70; // max height rocket can climb before finish icon
        const percent = (position / (length - 1)) * maxPercent;

        return (
          <div className="flex flex-col items-center">
            {/* Finish icon at the very top */}
            <div  className="w-24 relative rounded-lg overflow-hidden h-96 shadow-lg mx-4 flex flex-col items-center"
              style={{
                background: 'linear-gradient(to top, #7f8fff 20%, #3f3ca8 55%, #000000 100%)',
                  boxShadow: '0 0 15px 5px rgba(123, 104, 238, 0.7)',
              }}
            >
              <div className="absolute top-2 text-yellow-400 text-xl">{finishIcon}</div>

              {/* Rocket position from bottom */}
              <div
                className="absolute w-full flex justify-center transition-all duration-600"
                style={{ bottom: `${percent}%` }}
              >
                <div className="flex justify-center items-center h-12">
                  <img
                    src={Rocket}
                    alt="rocket"
                    className="h-12 w-auto -rotate-[45deg]
                              filter contrast-150 brightness-85
                              drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 w-full h-1 bg-gray-700"></div>
            </div>

            {/* Start label UNDER the track */}
            <div className="mt-2 text-white text-lg font-bold">{startLabel}</div>
          </div>
        );
      }

    default:
      return null;
  }
}

export default Track;
