import { useState, useEffect } from "react";

interface Props {
  isRunning: boolean;
  onTimeUpdate?: (time: number) => void;
  className?: string;
}

function Timer({ isRunning, onTimeUpdate, className = "" }: Props) {
  const [seconds, setSeconds] = useState(3600); // 60 perc = 3600 másodperc

  useEffect(() => {
    let intervalId: number;

    if (isRunning && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newTime = prevSeconds - 1;
          onTimeUpdate?.(3600 - newTime); // Az eltelt időt adjuk át
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, seconds, onTimeUpdate]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const isTimeRunningOut = seconds <= 300; // 5 perc vagy kevesebb

  return (
    <div className={`timer ${className}`}>
      <div className="d-flex align-items-center">
        <i className={`bi bi-clock ${isTimeRunningOut ? 'text-danger' : 'text-dark'}`}></i>
        <span className={`fw-bold ${isTimeRunningOut ? 'text-danger' : 'text-dark'}`}>
          {formatTime(seconds)}
        </span>
      </div>
    </div>
  );
}

export default Timer;
