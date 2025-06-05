import React from 'react';
import Track from './Track';

/**
 * TrackSection component displays two tracks:
 * one for the user and one for the opponent (bot).
 * Each track shows progress based on current positions.
 * 
 * @param {Object} props
 * @param {number} props.userPos - Current position of the user on the track
 * @param {number} props.botPos - Current position of the bot on the track
 * @param {number} props.trackLength - Total length of the track
 * @returns {React.ReactNode} The rendered TrackSection component
 */
function TrackSection({ userPos, botPos, trackLength }) {
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
      />
    </div>
  );
}

export default TrackSection;
