import { useSyncExternalStore } from 'react';

/**
 * Match-day state for «Игры на стадионе» (prototype, in memory until the API is connected):
 * check-in, the photo for the scoreboard, the half-time prediction and the half-time draw.
 */
export type Prediction = { o: number; k: number };
type State = {
  /** Ticket for today's match found in «Мои билеты». */
  hasTicket: boolean;
  checkedIn: boolean;
  /** Prototype: the first photo upload fails (bad stadium network) to show the retry flow. */
  uploadFailedOnce: boolean;
  /** When the last photo was sent — one photo per 10 minutes. */
  photoSentAt: number | null;
  prediction: Prediction | null;
  drawResult: 'won' | 'lost' | null;
  prizeClaimed: boolean;
};

let state: State = { hasTicket: true, checkedIn: false, uploadFailedOnce: false, photoSentAt: null, prediction: null, drawResult: null, prizeClaimed: false };
const subs = new Set<() => void>();

export function setStadium(patch: Partial<State>) {
  state = { ...state, ...patch };
  subs.forEach((f) => f());
}

export function useStadium() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => state,
    () => state,
  );
}

/** Today's match as the games see it. */
export const match = {
  home: 'ORDA',
  away: 'КАЙРАТ',
  title: 'ORDA — Кайрат',
  round: 'Премьер-Лига · 25 тур',
  seat: { sector: 'Юг · фан', row: '4', place: '12' },
  /** First-half score the prototype resolves predictions against. */
  halftime: { o: 1, k: 0 },
};

export const PHOTO_COOLDOWN_MS = 10 * 60 * 1000;

/** Minutes left until the next photo can be sent (0 = can send now). */
export function cooldownLeft(sentAt: number | null) {
  return sentAt ? Math.max(0, Math.ceil((sentAt + PHOTO_COOLDOWN_MS - Date.now()) / 60000)) : 0;
}

export const photoRules: [string, string][] = [
  ['user', 'Лицо должно быть хорошо видно, можно с друзьями'],
  ['shield-01', 'Без рекламы, политики и оскорблений — такие фото не пройдут модерацию'],
  ['clock-01', 'Одно фото раз в 10 минут'],
  ['star', 'Если фото покажут на табло — +30 баллов'],
];

/** exact = точный счёт (+20), outcome = угадан лидер (+5), miss = 0. */
export function judge(p: Prediction | null): 'exact' | 'outcome' | 'miss' {
  if (!p) return 'miss';
  const h = match.halftime;
  if (p.o === h.o && p.k === h.k) return 'exact';
  return Math.sign(p.o - p.k) === Math.sign(h.o - h.k) ? 'outcome' : 'miss';
}
