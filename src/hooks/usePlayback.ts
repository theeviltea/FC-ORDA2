import { useEffect, useState } from 'react';

const pad = (n: number) => String(n).padStart(2, '0');
export const clock = (t: number) => `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
export const parseClock = (s: string) => {
  const [m, sec] = s.split(':').map(Number);
  return m * 60 + sec;
};

/** Fake playback for the prototype: play / pause, ±10 s, seek; ticks once a second while playing. */
export function usePlayback(duration: number, start = 0) {
  const [t, setT] = useState(start);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((x) => (x >= duration ? x : x + 1)), 1000);
    return () => clearInterval(id);
  }, [playing, duration]);
  const seek = (x: number) => setT(Math.max(0, Math.min(duration, x)));
  return { t, playing, toggle: () => setPlaying(!playing), back: () => seek(t - 10), fwd: () => seek(t + 10), seek, pct: t / duration };
}
