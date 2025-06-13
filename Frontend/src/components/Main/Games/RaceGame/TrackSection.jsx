import React from 'react';
import Track from './Track';


function TrackSection({ userPos, botPos, trackLength, startIcon, finishIcon }) {
  return (
    <div className="my-6">
      {/* User track label */}
      <div className="font-bold text-lg text-black">Your Track:</div>

      {/* User Track component with green progress */}
      <Track
        position={userPos}
        length={trackLength}
        color="bg-green-600"
        startLabel="Start"
        endLabel="Finish"
        startIcon={startIcon}
        finishIcon={finishIcon}
      />

      {/* Opponent track label */}
      <div className="font-bold mt-6 text-lg text-black">Opponent Track:</div>

      {/* Opponent Track component with red progress */}
      <Track
        position={botPos}
        length={trackLength}
        color="bg-red-600"
        startLabel="Start"
        endLabel="Finish"
        startIcon={startIcon}
        finishIcon={finishIcon}
      />
    </div>
  );
}

export default TrackSection;
