'use client';

import { FunctionComponent, useEffect, useState } from 'react';

interface CountdownTimerProps {
  timeInMinutes?: number;
}

const CountdownTimer: FunctionComponent<CountdownTimerProps> = ({
  timeInMinutes,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (timeInMinutes) {
      setTimeLeft(timeInMinutes * 60);
    } else {
      setTimeLeft(0);
    }
  }, [timeInMinutes]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return <span className="font-bold">{formatTime(timeLeft)}</span>;
};

export default CountdownTimer;
