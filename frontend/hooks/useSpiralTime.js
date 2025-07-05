import { useState, useEffect } from 'react';

export default function useSpiralTime(date, S) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (S !== undefined) params.set('S', S);
    fetch(`/api/sss/solve?${params.toString()}`)
      .then(res => res.json())
      .then(setTime);
  }, [date, S]);

  return time;
}
