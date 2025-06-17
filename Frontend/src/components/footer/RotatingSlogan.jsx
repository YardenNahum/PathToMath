import React, { useEffect, useState } from 'react';

const slogans = [
  "Every problem has a solution waiting to be discovered — dive in, explore, and find it with confidence!",
  "Every problem you solve not only sharpens your mind but also strengthens your skills for the challenges ahead.",
  "Challenge accepted: let's face each problem head-on and turn obstacles into opportunities for growth!",
  "Mistakes are valuable lessons that help us grow smarter and more resilient — keep pushing forward and solving!",
  "Practice makes perfect — with every step and every problem, you’re one step closer to mastery and success!",
  "Mistakes are proof that you’re trying and learning — never stop exploring new ideas and expanding your knowledge!",
];

function RotatingSlogan() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slogans.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className={`text-xl px-6 flex items-center justify-center gap-4 transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/70 text-yellow-500 shadow-md text-lg">
        💡
      </span>
      {slogans[currentIndex]}
    </p>
  );
}

export default RotatingSlogan;
