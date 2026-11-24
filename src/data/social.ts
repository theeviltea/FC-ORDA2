import { useSyncExternalStore } from 'react';

import type { IconName } from '@/components';

/**
 * Сообщество (прототип, в памяти до подключения API): болельщики, дружба, личные сообщения и форум.
 */
export type Rel = 'none' | 'sent' | 'incoming' | 'friend';
export type Fan = {
  id: string;
  name: string;
  short: string;
  initial: string;
  bg: string;
  fg: string;
  level: number;
  points: string;
  sector: string;
  online: boolean;
  seen: string;
  since: number;
  matches: number;
  mutual: number;
  ordaId: string;
};

const f = (id: string, name: string, bg: string, fg: string, level: number, points: string, sector: string, online: boolean, seen: string, since: number, matches: number, mutual: number, ordaId: string): Fan => ({
  id,
  name,
  short: `${name.split(' ')[0]} ${name.split(' ')[1][0]}.`,
  initial: name[0],
  bg,
  fg,
  level,
  points,
  sector,
  online,
  seen,
  since,
  matches,
  mutual,
  ordaId,
});

export const fans: Fan[] = [
  f('aru', 'Аружан Сейткали', '#FDE6E7', '#B0263A', 18, '1 940', 'Фан-сектор «Юг»', true, 'в сети', 2021, 34, 3, '018 552'),
  f('tim', 'Тимур Абдрахманов', '#E3F6EC', '#14804A', 31, '5 870', 'Фан-сектор «Юг»', true, 'в сети', 2015, 142, 7, '001 093'),
  f('erl', 'Ерлан Тулегенов', '#E7F5FB', '#0B7DB0', 24, '3 120', 'Сектор B', false, 'был сегодня в 18:40', 2018, 61, 5, '007 410'),
  f('sab', 'Сабина Ергали', '#EEF3F8', '#5B6B8C', 21, '2 310', 'Фан-сектор «Юг»', false, 'была вчера', 2020, 47, 4, '010 228'),
  f('mad', 'Мадина Жумабаева', '#FFF1D6', '#9A6200', 15, '1 420', 'Сектор A', false, 'была 3 дня назад', 2022, 19, 2, '021 664'),
  f('dan', 'Данияр Касымов', '#172A51', '#FFFFFF', 9, '640', 'Выездной сектор', false, 'был 20 ноября', 2024, 8, 1, '034 117'),
  f('ali', 'Алихан Бекетов', '#DCEEF8', '#172A51', 12, '980', 'Сектор C', false, 'был вчера', 2023, 11, 0, '029 840'),
  f('erb', 'Ерлан Бакытжанов', '#FFF1D6', '#9A6200', 5, '220', 'Сектор A', false, 'был на прошлой неделе', 2025, 2, 0, '041 302'),
  f('nur', 'Нурсултан Оспанов', '#129ED9', '#FFFFFF', 7, '410', 'Сектор D', false, 'был вчера', 2025, 4, 1, '039 551'),
];
export const findFan = (id?: string) => fans.find((x) => x.id === id);

export type ChatMsg = {
  id: string;
  me: boolean;
  text: string;
  time: string;
  photo?: boolean;
  match?: boolean;
  quote?: { who: string; text: string };
  reaction?: string;
  status?: 'sent' | 'read' | 'failed';
};

export type ForumCat = { id: string; name: string; icon: IconName; bg: string; fg: string; topics: number; fresh: number; about: string };
export const forumCats: ForumCat[] = [
  { id: 'matches', name: 'Матчи', icon: 'football', bg: '#E7F5FB', fg: '#0B7DB0', topics: 46, fresh: 12, about: 'Игры, составы, тактика и судейство. Матч-центр открывается за час до начала каждой игры.' },
  { id: 'transfers', name: 'Трансферы и состав', icon: 'arrow-data-transfer-horizontal', bg: '#FFF1D6', fg: '#9A6200', topics: 31, fresh: 4, about: 'Слухи, подписания и аренды.' },
  { id: 'stadium', name: 'Стадион и выезды', icon: 'location-01', bg: '#E3F6EC', fg: '#14804A', topics: 22, fresh: 0, about: 'Как добраться, где сидеть, совместные выезды.' },
  { id: 'culture', name: 'Фан-культура', icon: 'fire', bg: '#FDE6E7', fg: '#C8040F', topics: 38, fresh: 7, about: 'Баннеры, кричалки, перфомансы.' },
  { id: 'merch', name: 'Форма и мерч', icon: 't-shirt', bg: '#E3EAF3', fg: '#172A51', topics: 17, fresh: 0, about: 'Новая форма, размеры, обмен.' },
  { id: 'offtop', name: 'Оффтоп', icon: 'bubble-chat', bg: '#EEF3F8', fg: '#5B6B8C', topics: 54, fresh: 3, about: 'Всё, что не про футбол.' },
];
export const club: { id: 'club' } = { id: 'club' };

export type Reaction = { e: string; n: number; mine?: boolean };
export type Reply = { id: string; author: string; time: string; text: string; likes: number; liked?: boolean; reactions?: Reaction[]; badge?: 'club' | 'author'; mention?: string; poll?: boolean; hidden?: boolean; replies?: Reply[] };
export type Thread = { id: string; cat: string; author: string; title: string; text: string; time: string; likes: number; replies: number; reactions: Reaction[]; pinned?: boolean; hot?: boolean; photo?: boolean };

export const threads: Thread[] = [
  { id: 'rules', cat: 'club', author: 'club', title: 'Правила форума и как получить значок «Знаток»', text: 'Коротко: уважаем друг друга, без ставок и спама. За полезные ответы — баллы и значок в профиле.', time: '1 ноября', likes: 310, replies: 64, reactions: [{ e: '👏', n: 41 }, { e: '🔥', n: 12 }], pinned: true },
  { id: 'best', cat: 'matches', author: 'tim', title: 'Кто был лучшим на поле против «Кайрата»?', text: 'Как по мне, Эвертон сделал игру: гол, ассист и ещё отрабатывал в обороне. Но вратарь тоже вытащил два мёртвых мяча в концовке. Кого бы вы назвали игроком матча и почему?', time: '2 ч назад', likes: 112, replies: 48, reactions: [{ e: '⚽', n: 24, mine: true }, { e: '🔥', n: 18 }, { e: '👏', n: 9 }], hot: true },
  { id: 'banner', cat: 'culture', author: 'sab', title: 'Собираем баннер на чемпионский парад — нужны руки', text: 'Ткань и краска есть, нужны 10 человек в субботу с 12:00 у входа «Юг». Пишите в ответах!', time: '5 ч назад', likes: 54, replies: 17, reactions: [{ e: '❤️', n: 21 }, { e: '🙌', n: 8 }], photo: true },
  { id: 'rumors', cat: 'transfers', author: 'erl', title: 'Слухи: кого усилим зимой?', text: 'Собираю всё, что пишут: нападающий из Сербии, левый защитник из «Астаны»… Ваши ставки?', time: 'вчера', likes: 87, replies: 63, reactions: [{ e: '🤔', n: 15 }, { e: '⚽', n: 11 }] },
  { id: 'scheme', cat: 'matches', author: 'mad', title: 'Схема 4-3-3 или 4-2-3-1 на выезде?', text: 'В последних двух выездах мы пропускали со стандартов. Может, стоит вернуть второго опорного?', time: '6 ч назад', likes: 37, replies: 21, reactions: [{ e: '🤔', n: 9 }] },
  { id: 'replay', cat: 'matches', author: 'dan', title: 'Где посмотреть повтор первого тайма?', text: 'Не успел к началу, в ORDA TV есть полный матч?', time: 'вчера', likes: 6, replies: 4, reactions: [{ e: '👍', n: 2 }] },
];

export const bestReplies: Reply[] = [
  { id: 'r1', author: 'club', time: '1 ч назад', text: 'Спасибо за обсуждение! Голосуйте в опросе «Игрок матча» — победитель получит приз от клуба на следующей домашней игре 🏆', likes: 86, badge: 'club', poll: true },
  {
    id: 'r2',
    author: 'erl',
    time: '1 ч назад',
    text: 'Эвертон, без вариантов. Гол и ассист, плюс отработал в обороне. Таких матчей у него в сезоне было три, и все мы выиграли.',
    likes: 34,
    liked: true,
    reactions: [{ e: '⚽', n: 5, mine: true }, { e: '💯', n: 3 }],
    replies: [
      { id: 'r2a', author: 'aru', time: '1 ч назад', mention: 'Ерлан', text: 'согласна! Но и Шайзада вытащил минимум два мёртвых — без него было бы 1:1', likes: 12, reactions: [{ e: '🧤', n: 4 }] },
      { id: 'r2b', author: 'tim', time: '40 мин назад', mention: 'Аружан', text: 'справедливо, давайте в опросе «Игрок матча» обоих поддержим 😄', likes: 7, badge: 'author' },
    ],
  },
  { id: 'r3', author: 'dan', time: '50 мин назад', text: 'Спорно. Эвертон забил, но первые полчаса вообще терял мяч. Я бы отдал игрока матча центральному защитнику: три перехвата, ни одного проигранного верхового. Плюс он начинал почти все атаки длинным пасом на фланг — посмотрите повтор, это было красиво.', likes: 9, reactions: [{ e: '🤔', n: 2 }] },
  { id: 'r4', author: 'ali', time: '30 мин назад', text: '', likes: 0, hidden: true },
];

const initialChats: Record<string, ChatMsg[]> = {
  aru: [
    { id: 'a1', me: false, text: 'Привет! Ты на «Кайрата» идёшь?', time: '12:31' },
    { id: 'a2', me: true, text: 'Конечно! Уже взял в фан-сектор 🔥', time: '12:32', status: 'read' },
    { id: 'a3', me: true, text: 'Идём вместе? ⚽', time: '12:32', match: true, status: 'read' },
    { id: 'a4', me: false, text: 'Поймала момент с трибуны 😍', time: '12:40', photo: true, reaction: '❤️' },
    { id: 'a5', me: false, text: 'Возьму рядом с тобой, какой ряд?', time: '12:43', quote: { who: 'Вы', text: 'Уже взял в фан-сектор 🔥' } },
    { id: 'a6', me: true, text: '4 ряд, место 12 😉', time: '12:44', status: 'read' },
  ],
  tim: [
    { id: 't1', me: false, text: 'Как тебе вчерашний матч?', time: '11:02' },
    { id: 't2', me: true, text: 'Огонь! Эвертон — лучший', time: '11:10', status: 'read' },
    { id: 't3', me: false, text: 'Встречаемся у входа «Юг» в 18:00?', time: '11:20' },
  ],
  erl: [{ id: 'e1', me: false, text: 'Выезд в Алматы был огонь', time: 'вчера', photo: true }],
  sab: [{ id: 's1', me: true, text: '🔥🔥🔥', time: 'вчера', status: 'read' }],
  mad: [{ id: 'm1', me: false, text: 'Спасибо за шарф! Ношу на каждый матч', time: 'пн' }],
  dan: [{ id: 'd1', me: false, text: 'Ок, до субботы', time: '20 нояб' }],
};

type State = {
  rel: Record<string, Rel>;
  chats: Record<string, ChatMsg[]>;
  unread: Record<string, number>;
  likes: Record<string, boolean>;
  myReactions: Record<string, string[]>;
  myThreads: Thread[];
  myReplies: Record<string, Reply[]>;
  subscribed: Record<string, boolean>;
  aiSeen: boolean;
};

let state: State = {
  rel: { aru: 'friend', tim: 'friend', erl: 'friend', sab: 'friend', mad: 'friend', dan: 'friend', ali: 'none', erb: 'none', nur: 'incoming' },
  chats: initialChats,
  unread: { tim: 2, erl: 1, dan: 3 },
  likes: {},
  myReactions: {},
  myThreads: [],
  myReplies: {},
  subscribed: {},
  aiSeen: false,
};
const subs = new Set<() => void>();
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  subs.forEach((fn) => fn());
};

export function useSocial() {
  return useSyncExternalStore(
    (fn) => {
      subs.add(fn);
      return () => subs.delete(fn);
    },
    () => state,
    () => state,
  );
}

export const relOf = (s: State, id: string): Rel => s.rel[id] ?? 'none';
export const setRel = (id: string, rel: Rel) => set({ rel: { ...state.rel, [id]: rel } });
export const friendsOf = (s: State) => fans.filter((x) => relOf(s, x.id) === 'friend');
export const incomingOf = (s: State) => fans.filter((x) => relOf(s, x.id) === 'incoming');
export const outgoingOf = (s: State) => fans.filter((x) => relOf(s, x.id) === 'sent');

const now = () => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export function sendMessage(id: string, text: string, opts: { quote?: ChatMsg['quote']; photo?: boolean; match?: boolean; offline?: boolean } = {}) {
  const msg: ChatMsg = { id: `${id}-${Date.now()}`, me: true, text, time: now(), status: opts.offline ? 'failed' : 'sent', quote: opts.quote, photo: opts.photo, match: opts.match };
  set({ chats: { ...state.chats, [id]: [...(state.chats[id] ?? []), msg] } });
  return msg.id;
}
export function updateMessage(id: string, msgId: string, patch: Partial<ChatMsg>) {
  set({ chats: { ...state.chats, [id]: (state.chats[id] ?? []).map((m) => (m.id === msgId ? { ...m, ...patch } : m)) } });
}
export function receiveMessage(id: string, text: string) {
  const list = (state.chats[id] ?? []).map((m) => (m.me && m.status === 'sent' ? { ...m, status: 'read' as const } : m));
  set({ chats: { ...state.chats, [id]: [...list, { id: `${id}-in-${Date.now()}`, me: false, text, time: now() }] } });
}
export const markRead = (id: string) => state.unread[id] && set({ unread: { ...state.unread, [id]: 0 } });

export const toggleLike = (key: string) => set({ likes: { ...state.likes, [key]: !state.likes[key] } });
export function toggleReaction(key: string, e: string) {
  const cur = state.myReactions[key] ?? [];
  const next = cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e].slice(-3);
  set({ myReactions: { ...state.myReactions, [key]: next } });
}
export function addReply(threadId: string, text: string, mention?: string) {
  const r: Reply = { id: `my-${Date.now()}`, author: 'me', time: 'только что', text, likes: 0, mention };
  set({ myReplies: { ...state.myReplies, [threadId]: [...(state.myReplies[threadId] ?? []), r] } });
}
export function addThread(cat: string, title: string, text: string) {
  const t: Thread = { id: `my-${Date.now()}`, cat, author: 'me', title, text, time: 'только что', likes: 0, replies: 0, reactions: [] };
  set({ myThreads: [t, ...state.myThreads] });
  return t.id;
}
export const toggleSubscribe = (cat: string) => set({ subscribed: { ...state.subscribed, [cat]: !state.subscribed[cat] } });
export const markAiSeen = () => !state.aiSeen && set({ aiSeen: true });

export const allThreads = (s: State) => [...s.myThreads, ...threads];
export const findThread = (s: State, id?: string) => allThreads(s).find((t) => t.id === id);
export const catOf = (id: string) => forumCats.find((c) => c.id === id);

/** 1 заявка, 2 заявки, 5 заявок. */
export const plural = (n: number, [one, few, many]: [string, string, string]) => {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  return a > 10 && a < 20 ? many : b === 1 ? one : b >= 2 && b <= 4 ? few : many;
};
