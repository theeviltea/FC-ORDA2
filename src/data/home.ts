import type { Person, Product } from '@/components';

import { aspect, img } from './images';

/** Mock content for the home screen (mirrors Main on the design canvas). */
export const stories = [
  { label: 'VS Елімай', cover: img.storyElimai, fresh: true, live: true },
  { label: 'VS Тобыл', cover: img.storyTobyl, fresh: true, live: false },
  { label: 'VS Жеңіс', cover: img.storyZhenis, fresh: false, live: false },
  { label: 'VS Қызылжар', cover: img.storyKyzylzhar, fresh: false, live: false },
];

export const nextTicket = { match: 'ORDA — Тобыл', meta: '12 АВГ · СЕКТОР A · РЯД 8' };

export const nextMatch = {
  league: 'Премьер-Лига 2026, 20 тур',
  when: '24 авг 2026, 19:00 · Шымкент',
  home: { name: 'ОРДАБАСЫ', logo: img.crest },
  away: { name: 'ТОБЫЛ', logo: img.clubTobyl },
  /** Seconds left at the moment the screen opens (design value 2 д 05:18:36). */
  startsIn: 191916,
};

export const products: Product[] = [
  { name: 'Футболка ORDA', price: '24 990 ₸', badge: 'Новое', tone: 'new', photo: img.jersey },
  { name: 'Кружка «Ордабасы»', price: '6 990 ₸', badge: 'Хит продаж', tone: 'hit', photo: img.mug },
  { name: 'Спортивное худи (синее)', price: '18 990 ₸', photo: img.hoodie },
];

export const videos = [
  { title: 'Ордабасы — Кайрат', meta: 'Чемпионат · Полный матч', cover: img.videoGoal, live: true },
  { title: 'Тренировка команды', meta: 'Тренировки', cover: img.videoTraining, live: false },
];

export const playerOfMatch = {
  num: '10',
  name: 'Эльхан Астанов',
  role: 'Полузащитник',
  rating: 0.68,
  stats: [
    { label: 'Сыграно минут', value: '8 712', w: 0.9 },
    { label: 'Матчи', value: '115', w: 0.7 },
    { label: 'Стартовый состав', value: '96', w: 0.6 },
    { label: 'Голы', value: '8', w: 0.34 },
    { label: 'Голевые передачи', value: '8', w: 0.34 },
  ],
};

export const squad: Person[] = [
  { num: '10', name: 'Эльхан Астанов', role: 'Полузащитник', photo: img.playerAstanov, aspect: aspect.playerAstanov },
  { num: '15', name: 'Жасулан Әмір', role: 'Защитник', photo: img.playerAmir, aspect: aspect.playerAmir },
  { num: '1', name: 'Бекхан Шайзада', role: 'Вратарь', photo: img.playerShaizada, aspect: aspect.playerShaizada },
  { num: '9', name: 'Эвертон Мораес', role: 'Нападающий', photo: img.playerMoraes, aspect: aspect.playerMoraes },
];

export const table = [
  { pos: 1, club: 'Ордабасы', logo: img.crest, p: 22, w: 16, d: 4, l: 2, gd: '+27', pts: 52, us: true },
  { pos: 2, club: 'Кайрат', logo: img.clubKairat, p: 22, w: 14, d: 5, l: 3, gd: '+19', pts: 47, us: false },
  { pos: 3, club: 'Астана', logo: img.clubAstana, p: 22, w: 12, d: 5, l: 5, gd: '+12', pts: 41, us: false },
];

export const news = [
  { title: 'Состав на матч с «Кайратом» объявлен', meta: 'Сегодня · Команда', img: img.newsLineup },
  { title: 'Новая домашняя форма представлена', meta: 'Вчера · Клуб', img: img.newsTrio },
  { title: 'Новый нападающий подписал контракт с клубом', meta: '31 июля · Клуб', img: img.newsShout },
];

/** Club partners. Integra goes first (wide tile); new partners are appended to the grid. */
export const sponsors = [
  { name: 'Integra Construction', logo: img.sponsorIntegra, h: 40, ratio: 3.316 },
  { name: 'ERG', logo: img.sponsorErg, h: 56, ratio: 1.305 },
  { name: 'Евразия — страхование жизни', logo: img.sponsorEurasia, h: 40, ratio: 3.566 },
];
