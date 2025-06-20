import { useState } from 'react';
import help_icon from '../../../../assets/Images/cube_game/how_to_play.png';
import React from 'react';
function how_to_play({ howToPlay }) {
  const [showTooltip, setShowTooltip] = useState(false);
  // Function to toggle the tooltip visibility
  const toggleTooltip = () => setShowTooltip(prev => !prev);

  return (
    // How to Play Component
    // Displays a button that toggles a tooltip with instructions on how to play the game
    <div className='text-sm flex align-left justify-start items-center gap-2 mb-4 relative'>
      <button
        onClick={toggleTooltip}
        className="flex justify-center items-center w-1/5 gap-2 bg-purple-200 shadow-2xl px-4 py-2 rounded-lg hover:bg-purple-300 transition-colors cursor-pointer"
      >
        <img src={help_icon} alt="How to play" className="h-3 w-fit text-sm md:h-5" />
        <>How to <br/>play</>
      </button>
        {/* Tooltip that shows how to play the game */}
      {showTooltip && (
        <div className="p-2 rounded shadow-md bg-white transition-all duration-300 z-10 w-fit">
          {howToPlay}
        </div>
      )}
    </div>
  );
}

export default how_to_play;
