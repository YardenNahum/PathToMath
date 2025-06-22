import React, { useEffect, useState } from 'react';

const slogans = [
  "Every problem has a solution waiting to be discovered — dive in, explore, and find it with confidence!",
  "Every problem you solve not only sharpens your mind but also strengthens your skills for the challenges ahead.",
  "Challenge accepted: let's face each problem head-on and turn obstacles into opportunities for growth!",
  "Mistakes are valuable lessons that help us grow smarter and more resilient — keep pushing forward and solving!",
  "Practice makes perfect — with every step and every problem, you’re one step closer to mastery and success!",
  "Mistakes are proof that you’re trying and learning — never stop exploring new ideas and expanding your knowledge!",
];

/**
 * RotatingSlogan component displays an array of motivational slogans
 * that rotate automatically every 8 seconds with a fade in/out transition.
 *
 * Uses local state for current slogan index and fade effect.
 * 
 * @returns {React.ReactNode} The rendered rotating slogan paragraph
 */
function RotatingSlogan() {
  const [currentIndex, setCurrentIndex] = useState(0);  // Index of the current slogan
  const [fade, setFade] = useState(true); // Controls fade in/out effect for smooth transitions

  useEffect(() => {
    // Interval to rotate slogans every 8 seconds
    const interval = setInterval(() => {
      setFade(false); // Start fade out
      setTimeout(() => {
        // Update to next slogan index and fade in
        setCurrentIndex((prev) => (prev + 1) % slogans.length);
        setFade(true);
      }, 500);  // 500ms fade transition duration
    }, 8000);

    // Clear interval on component unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, []);

  return (
    <p className={`text-xl px-6 flex items-center justify-center gap-4 transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
      {/* Light bulb icon with styling */}
      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/70 text-yellow-500 shadow-md text-lg">
        💡
      </span>
      {/* Current slogan text */}
      {slogans[currentIndex]}
    </p>
  );
}

export default RotatingSlogan;
