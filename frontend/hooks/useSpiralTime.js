import { useState, useEffect } from 'react';

export default function useSpiralTime(date, S) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    fetch('/solve_time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, S }),
    })
      .then(res => res.json())
      .then(setTime);
  }, [date, S]);

  return time;
}
