import React from 'react';
import Track from './Track';

/**
 * TrackSection component renders two parallel tracks:
 * one for the user and one for the opponent (bot),
 * each with their current positions highlighted.
 *
 * @param {Object} props
 * @param {number} props.userPos - Current position of the user on the track
 * @param {number} props.botPos - Current position of the opponent (bot) on the track
 * @param {number} props.trackLength - Total length (number of blocks) of the track
 * @param {React.ReactNode} props.startIcon - Icon to display on the start block
 * @param {React.ReactNode} props.finishIcon - Icon to display on the finish block
 * @returns {React.ReactNode} Rendered track section showing user and opponent progress
 */
function TrackSection({ userPos, botPos, trackLength, startIcon, finishIcon }) {
  return (
    <div className="my-6">
      {/* Label for the user's track */}
      <div className="font-bold text-lg text-black">Your Track:</div>

      {/* User's track with green highlight for current position */}
      <Track
        position={userPos}
        length={trackLength}
        color="bg-green-600"
        startLabel="Start"
        endLabel="Finish"
        startIcon={startIcon}
        finishIcon={finishIcon}
      />

      {/* Label for the opponent's track */}
      <div className="font-bold mt-6 text-lg text-black">Opponent Track:</div>

      {/* Opponent's track with red highlight for current position */}
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
