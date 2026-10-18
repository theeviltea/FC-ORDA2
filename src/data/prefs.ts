import { useSyncExternalStore } from 'react';

/** Tiny in-memory store for the demo account: personal data and app language (until the API is connected). */
export type Lang = 'ru' | 'kk' | 'en';
export const languages: { id: Lang; name: string; sub: string }[] = [
  { id: 'ru', name: 'Русский', sub: 'Русский язык' },
  { id: 'kk', name: 'Қазақша', sub: 'Казахский язык' },
  { id: 'en', name: 'English', sub: 'Английский язык' },
];

export type Personal = { first: string; last: string; phone: string; email: string; birth: string };

type State = { lang: Lang; personal: Personal };

let state: State = {
  lang: 'ru',
  personal: { first: 'Бекжан', last: 'Садыков', phone: '+7 707 123 45 67', email: 'bek777@mail.kz', birth: '14.03.1998' },
};
const subs = new Set<() => void>();

export function setPrefs(patch: Partial<State>) {
  state = { ...state, ...patch };
  subs.forEach((f) => f());
}

export function usePrefs() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => state,
    () => state,
  );
}
