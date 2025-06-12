import { useEffect, useRef } from 'react';

function useBotInterval({ started, onMove, grade, level }) {
  const botTimer = useRef(null);
  const intervalTime = useRef(null);

  const computeIntervalTime = () => {
    const gradeBaseTimes = {
      1: 10000,
      2: 10000,
      3: 15000,
      4: 15000,
      5: 20000,
      6: 20000,
    };

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
    if (started) {
      if (intervalTime.current === null) {
        intervalTime.current = computeIntervalTime();
      }

      botTimer.current = setInterval(() => {
        onMove();
      }, intervalTime.current);
    }

    return () => {
      clearInterval(botTimer.current);
      intervalTime.current = null;
    };
  }, [started, onMove]);

  return botTimer;
}

export default useBotInterval;
