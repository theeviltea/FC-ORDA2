import { useEffect, useState } from 'react';

const pad = (n: number) => String(n).padStart(2, '0');

/** Live countdown cells (дн / час / мин / сек) to a target time or for N seconds from mount. */
export function useCountdown(target: number | Date, units: [string, string, string, string] = ['дн', 'час', 'мин', 'сек']) {
  const end = typeof target === 'number' ? null : target.getTime();
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = Math.max(0, Math.floor(end !== null ? (end - now) / 1000 : (target as number) - (now - start) / 1000));
  return [
    { v: pad(Math.floor(left / 86400)), u: units[0] },
    { v: pad(Math.floor((left % 86400) / 3600)), u: units[1] },
    { v: pad(Math.floor((left % 3600) / 60)), u: units[2] },
    { v: pad(left % 60), u: units[3] },
  ];
}
