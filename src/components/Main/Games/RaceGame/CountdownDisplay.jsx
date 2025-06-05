import React, { useEffect, useState } from 'react';

/**
 * CountdownDisplay component shows a visual countdown for the start of a race.
 * It animates visibility when the countdown value changes.
 *
 * @param {Object} props
 * @param {number|string|null} props.countdown - Current countdown number or "Race!", null if inactive
 * @returns {React.ReactNode|null} The countdown display or null if countdown is null
 */
function CountdownDisplay({ countdown }) {
  
  // State to control the visibility and animation of the countdown display
  const [visible, setVisible] = useState(false);

  // Effect to show each countdown value briefly and then hide it whenever countdown changes
  useEffect(() => {
    if (countdown !== null) {
      setVisible(true);
      const timeout = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [countdown]);

  // Return nothing if no countdown active
  if (countdown === null) return null;

  // Map countdown values to color classes for styling
  const colorClass = {
    3: 'text-red-700',
    2: 'text-yellow-500',
    1: 'text-green-700',
    'Race!': 'text-black',
  }[countdown] || 'text-black';

  return (
    <div
      key={countdown} // key helps React animate properly on countdown changes
      className={`transition-all ease-in-out ${
        visible ? 'opacity-100 scale-150' : 'opacity-0 scale-50'
      }`}
    >
      <div className={`text-6xl font-extrabold text-center my-6 ${colorClass}`}>
        {countdown === 'Race!' ? '🏁 Race!' : countdown}
      </div>
    </div>
  );
}

export default CountdownDisplay;
