import { img } from './images';

type Pos = { top?: `${number}%`; left?: `${number}%` };

export type Album = { id: string; title: string; short: string; date: string; count: number; cover: number; pos?: Pos; topic: 'match' | 'training' | 'event' | 'club' };

/** Photo reports (mock). The first one is the fresh report on top of the list. */
export const albums: Album[] = [
  { id: 'kairat', title: 'Ордабасы — Кайрат: эмоции победного матча', short: 'Ордабасы — Кайрат', date: '24 сентября 2026', count: 48, cover: img.videoGoal, pos: { top: '30%' }, topic: 'match' },
  { id: 'training', title: 'Тренировка перед выездом в Астану', short: 'Тренировка перед выездом', date: '20 сентября 2026', count: 36, cover: img.videoTraining, pos: { top: '30%' }, topic: 'training' },
  { id: 'tobyl', title: 'Ордабасы — Тобыл: лучшие моменты', short: 'Ордабасы — Тобыл', date: '14 сентября 2026', count: 52, cover: img.newsHuddle, topic: 'match' },
  { id: 'kids', title: 'Встреча команды с юными болельщиками', short: 'Встреча с болельщиками', date: '8 сентября 2026', count: 28, cover: img.photoFans, pos: { top: '30%' }, topic: 'event' },
  { id: 'cup', title: 'Кубковый вечер на стадионе', short: 'Кубковый вечер', date: '1 сентября 2026', count: 64, cover: img.photoSmoke, topic: 'event' },
  { id: 'kit', title: 'За кадром: новая форма команды', short: 'За кадром: новая форма', date: '27 августа 2026', count: 31, cover: img.newsTrio, topic: 'club' },
  { id: 'youth', title: 'Победа молодёжной команды', short: 'Победа молодёжки', date: '21 августа 2026', count: 44, cover: img.photoSolo, pos: { top: '25%' }, topic: 'match' },
];

export const findAlbum = (id: string) => albums.find((a) => a.id === id) ?? albums[0];

/** Photos shown in an album (the prototype reuses one set; numbering starts at 12 of 48). */
export const albumPhotos = [
  { src: img.videoGoal, caption: 'Победный гол и эмоции трибун' },
  { src: img.newsShout, caption: 'Эмоции после гола' },
  { src: img.newsTrio, caption: 'Радость после гола' },
  { src: img.newsHuddle, caption: 'Команда празднует победу' },
  { src: img.photoFans, caption: 'Фан-сектор поддерживает команду' },
];
export const PHOTO_OFFSET = 12;
export const photographer = 'Ерлан Сапаров';

export type Video = { id: string; title: string; topic: string; meta: string; views: string; duration: string; cover: number; pos?: Pos; description?: string };

export const videos: Video[] = [
  {
    id: 'kairat',
    title: 'Ордабасы — Кайрат: лучшие моменты победы',
    topic: 'Обзоры',
    meta: '24 сентября 2026',
    views: '12,4 тыс. просмотров',
    duration: '08:24',
    cover: img.videoGoal,
    pos: { left: '40%' },
    description: 'Лучшие моменты победы над «Кайратом»: опасные атаки, голы Натела и Мораеса и эмоции фан-сектора. Вспоминаем яркий матч вместе с болельщиками «Ордабасы».',
  },
  { id: 'kids', title: 'Команда встретилась с юными болельщиками', topic: 'Клуб', meta: 'сегодня', views: '3,1 тыс. просмотров', duration: '04:06', cover: img.newsTeamphoto },
  { id: 'tobyl', title: 'Ордабасы — Тобыл: лучшие моменты', topic: 'Обзоры', meta: '14 сентября', views: '9,8 тыс.', duration: '07:42', cover: img.newsHuddle },
  { id: 'kit', title: 'За кадром: презентация новой формы', topic: 'Клуб', meta: '27 августа', views: '15 тыс.', duration: '02:47', cover: img.newsTrio },
  { id: 'training', title: 'Тренировка перед выездом в Астану', topic: 'Тренировки', meta: 'Сегодня', views: '4,2 тыс.', duration: '03:18', cover: img.videoTraining, pos: { top: '30%' } },
  { id: 'cup', title: 'Кубковый вечер: голы и эмоции', topic: 'Обзоры', meta: '1 сентября', views: '7,5 тыс.', duration: '06:30', cover: img.photoSmoke, pos: { top: '30%' } },
];

export const findVideo = (id: string) => videos.find((v) => v.id === id) ?? videos[0];

export const continueWatching = [
  { id: 'training', left: 'ещё 1:12', progress: 0.62 },
  { id: 'cup', left: 'ещё 4:48', progress: 0.3 },
];

export const moments = [
  { title: 'Гол и посвящение трибунам', views: '48K', length: '0:24', cover: img.photoSolo },
  { title: 'Обыгрыш у бровки', views: '31K', length: '0:18', cover: img.photoAction },
  { title: 'Фан-сектор поёт гимн', views: '27K', length: '0:41', cover: img.photoFans },
  { title: 'Празднование под файеры', views: '19K', length: '0:15', cover: img.photoSmoke },
];
