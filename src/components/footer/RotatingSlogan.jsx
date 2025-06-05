import React, { useEffect, useState } from 'react';

const slogans = [
  "Every problem has a solution — find it!",
  "Every problem you solve makes you stronger.",
  "Challenge accepted: let's solve it!",
  "Mistakes help us grow — keep solving!",
  "Practice makes Perfect - keep at it!",
  "Mistakes are proof you're trying — never stop learning!",
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
