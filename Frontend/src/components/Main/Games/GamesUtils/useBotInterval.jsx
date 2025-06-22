import { useEffect, useRef } from 'react';

/**
 * useBotInterval Hook
 * Controls a bot's movement in timed intervals based on user's grade and level.
 * Starts when `started` is true and triggers `onMove` at calculated intervals.
 *
 * @param {Object} params
 * @param {boolean} params.started - Whether the bot should start moving
 * @param {Function} params.onMove - Callback to trigger bot movement
 * @param {number} params.grade - The current user grade (1-6)
 * @param {number} params.level - The current level (used to reduce bot time)
 * @returns {object} botTimer - A ref to the interval timer (can be used to clear externally)
 */
function useBotInterval({ started, onMove, grade, level }) {
  const botTimer = useRef(null);
  const intervalTime = useRef(null);

  /**
   * Calculates the bot's move interval time based on grade and level.
   * Higher levels result in faster bot movement (lower interval).
   */
  const computeIntervalTime = () => {
    const gradeBaseTimes = {
      1: 10000,
      2: 10000,
      3: 15000,
      4: 15000,
      5: 20000,
      6: 20000,
    };

    // Determine how much to reduce the interval based on level
    let levelReduction = 0;
    if (level >= 11 && level <= 20) {
      levelReduction = 500;
    } else if (level >= 21 && level <= 30) {
      levelReduction = 1000;
    }

    // Get the base time for the grade or fallback to 8 seconds
    const baseTime = gradeBaseTimes[grade] || 8000;
    // Ensure the interval doesn't go below 2000ms
    return Math.max(2000, baseTime - levelReduction);
  };

  useEffect(() => {
    // Start interval only if the game has started
    if (started) {
      if (intervalTime.current === null) {
        intervalTime.current = computeIntervalTime();
      }
      // Start the bot movement interval
      botTimer.current = setInterval(() => {
        onMove(); // Trigger bot movement
      }, intervalTime.current);
    }

    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => {
      clearInterval(botTimer.current);
      intervalTime.current = null;
    };
  }, [started, onMove]);

  return botTimer;
}

export default useBotInterval;
