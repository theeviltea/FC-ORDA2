import { useSyncExternalStore } from 'react';

import { img } from './images';

/** Tiny in-memory store for the demo account: personal data and app language (until the API is connected). */
export type Lang = 'ru' | 'kk' | 'en';
export const languages: { id: Lang; name: string; sub: string }[] = [
  { id: 'ru', name: 'Русский', sub: 'Русский язык' },
  { id: 'kk', name: 'Қазақша', sub: 'Казахский язык' },
  { id: 'en', name: 'English', sub: 'Английский язык' },
];

export type Personal = { first: string; last: string; phone: string; email: string; birth: string };

type State = {
  lang: Lang;
  personal: Personal;
  passwordChanged: string;
  /** Prototype flow: signed in by default; «Выйти из аккаунта» switches to the guest zone. */
  authed: boolean;
  /** Profile photo: the demo picture, a picked uri, or none (new account without a photo). */
  avatar: number | string | null;
  /** One-off banner for the login screen (e.g. after a password reset). */
  notice: string | null;
};

let state: State = {
  lang: 'ru',
  authed: true,
  avatar: img.avatar,
  notice: null,
  passwordChanged: 'Изменён 2 месяца назад',
  personal: { first: 'Бекжан', last: 'Садыков', phone: '+7 707 123 45 67', email: 'bek777@mail.kz', birth: '14.03.1998' },
};
const subs = new Set<() => void>();

/** «7071234567» → «707 123 45 67» (as typed after the +7 prefix). */
export const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, '').slice(0, 10);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean).join(' ');
};

/** Masked phone for SMS screens: +7 (707) ***-**-67. */
export const maskPhone = (p: string) => {
  const d = p.replace(/\D/g, '');
  return `+7 (${d.slice(1, 4)}) ***-**-${d.slice(-2)}`;
};

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
