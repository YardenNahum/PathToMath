import React, { useEffect, useState } from 'react';

/**
 * CountdownDisplay component shows a visual countdown for the start of a race/game.
 * Each value is displayed briefly with animation and styled color.
 *
 * @param {Object} props
 * @param {number|string|null} props.countdown - Current countdown value (e.g. 3, 2, 1, "Race!") or null when inactive
 * @param {string[]} props.colorMap - Array of color classes: [3, 2, 1, "Race!"]
 * @param {string} props.startWord - The final word in the countdown (e.g., "Race!")
 * @returns {React.ReactNode|null} The styled countdown element or null when not visible
 */
function CountdownDisplay({ countdown, colorMap, startWord }) {
  // Controls whether the countdown is visible with animation
  const [visible, setVisible] = useState(false);

  // Show and animate the countdown briefly whenever it changes
  useEffect(() => {
    if (countdown !== null) {
      setVisible(true);
      const timeout = setTimeout(() => setVisible(false), 600); // Hide after 600ms
      return () => clearTimeout(timeout); // Clear timeout on countdown change
    }
  }, [countdown]);

  // If countdown is null, do not render anything
  if (countdown === null) return null;

  // Determine which color to apply based on the current countdown value
  const colorClass = {
    3: colorMap[0],
    2: colorMap[1],
    1: colorMap[2],
    [startWord]: colorMap[3],
  }[countdown];

  return (
    <div
      key={countdown} // key helps React animate properly on countdown changes
      className={`transition-all ease-in-out ${visible ? 'opacity-100 scale-150' : 'opacity-0 scale-50'
        }`}
    >
      {/* Display the countdown number or final word */}
      <div className={`text-4xl font-extrabold text-center my-6 ${colorClass} md:text-6xl`}>
        {countdown === startWord ? startWord : countdown}
      </div>
    </div>
  );
}

export default CountdownDisplay;
