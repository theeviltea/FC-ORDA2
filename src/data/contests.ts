import { useSyncExternalStore } from 'react';

import { img } from './images';

export type Contest = {
  id: string;
  title: string;
  kind: string;
  prize: { title: string; sub: string; photo: number; winners: number };
  watermark: string;
  participants: number;
  deadline?: Date;
  deadlineText?: string;
  resultsText?: string;
  startText?: string;
  thumb: { src: number; bg: 'gradient' | 'sunken' | 'blue10'; size: number; cover?: boolean };
  steps: { t: string; d: string }[];
};

const photoSteps = (until: string) => [
  { t: 'Сделай фото с матча', d: 'Покажи, как ты поддерживаешь «Ордабасы» на стадионе.' },
  { t: 'Отправь снимок', d: `Нажми «Участвовать» и загрузи одно фото до ${until}.` },
  { t: 'Дождись итогов', d: 'Победителя выберем случайным образом среди принятых заявок.' },
];

/** Demo contests (until the API is connected). Deadlines are Shymkent time (UTC+5). */
export const contests: Contest[] = [
  {
    id: 'kit',
    title: 'Выиграй форму с автографами',
    kind: 'Фото с матча',
    watermark: 'WIN\nKIT',
    participants: 186,
    deadline: new Date('2026-10-20T23:59:00+05:00'),
    deadlineText: '20 октября',
    resultsText: '21 октября',
    prize: { title: 'Форма с автографами игроков', sub: 'Игровая джерси сезона с подписями основного состава', photo: img.jersey, winners: 1 },
    thumb: { src: img.jersey, bg: 'gradient', size: 56 },
    steps: photoSteps('20 октября'),
  },
  {
    id: 'family',
    title: 'На матч всей семьёй',
    kind: '4 билета',
    watermark: 'FAM\nILY',
    participants: 342,
    deadline: new Date('2026-10-23T23:59:00+05:00'),
    deadlineText: '23 октября',
    resultsText: '24 октября',
    prize: { title: '4 билета на домашний матч', sub: 'Для вас и ещё трёх человек', photo: img.photoFans, winners: 3 },
    thumb: { src: img.photoFans, bg: 'sunken', size: 64, cover: true },
    steps: photoSteps('23 октября'),
  },
  {
    id: 'poster',
    title: 'Лучший фанатский плакат',
    kind: 'Клубный шарф',
    watermark: 'WIN\nNER',
    participants: 128,
    prize: { title: 'Клубный шарф', sub: 'Шарф ORDA в клубных цветах', photo: img.trophy, winners: 1 },
    thumb: { src: img.trophy, bg: 'blue10', size: 50 },
    steps: [],
  },
  {
    id: 'meet',
    title: 'Встреча с любимым игроком',
    kind: 'Скоро',
    watermark: 'MEET',
    participants: 0,
    startText: '25 октября',
    prize: { title: 'Встреча с игроком', sub: '', photo: img.icon3dContest, winners: 1 },
    thumb: { src: img.icon3dContest, bg: 'blue10', size: 50 },
    steps: [],
  },
];

export const findContest = (id: string) => contests.find((c) => c.id === id);

export type Entry = { photo: string | number; number: string; status: 'review' };

/** «На матч всей семьёй» already has the fan's entry, as on the canvas. */
let state: Record<string, Entry> = { family: { photo: img.newsShout, number: '0342', status: 'review' } };
const subs = new Set<() => void>();

export function submitEntry(id: string, photo: string | number) {
  const c = findContest(id)!;
  state = { ...state, [id]: { photo, number: String(c.participants + 1).padStart(4, '0'), status: 'review' } };
  subs.forEach((f) => f());
}

export function useEntries() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => state,
    () => state,
  );
}

export type Status = 'new' | 'joined' | 'done' | 'soon';
export const statusOf = (c: Contest, entries: Record<string, Entry>): Status => (c.startText ? 'soon' : !c.deadline ? 'done' : entries[c.id] ? 'joined' : 'new');
