import { useEffect, useRef } from 'react';

function useBotInterval({ started, trackLength, onMove, grade, level }) {
  const botTimer = useRef(null);

  const getIntervalTime = () => {
    // Define base times per grade (1st to 6th)
    const gradeBaseTimes = {
      1: 10000,
      2: 9000,
      3: 8000,
      4: 7000,
      5: 6000,
      6: 5000,
    };

    // Determine reduction based on level range
    let levelReduction = 0;
    if (level >= 11 && level <= 20) {
      levelReduction = 500;
    } else if (level >= 21 && level <= 30) {
      levelReduction = 1000;
    }

    const baseTime = gradeBaseTimes[grade] || 8000;
    return Math.max(2000, baseTime - levelReduction);
  };

  useEffect(() => {
    if (started && trackLength > 1) {
      botTimer.current = setInterval(() => {
        onMove();
      }, getIntervalTime());
    }

    return () => clearInterval(botTimer.current);
  }, [started, trackLength, grade, level, onMove]);

  return botTimer;
}

export default useBotInterval;
