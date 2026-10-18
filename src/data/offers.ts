import type { Href } from 'expo-router';

import type { IconName, Offer as Art } from '@/components';

export type OfferKind = 'sale' | 'excl' | 'bonus';
export type Offer = {
  id: Art;
  kind: OfferKind;
  title: string;
  sub: string;
  until: string;
  urgent?: boolean;
  /** End of the offer, Shymkent time; drives «Осталось N дней». */
  ends?: Date;
  section: string;
  text: string;
  action: { type: 'promo'; code: string; off: string; to: Href } | { type: 'question' } | { type: 'progress'; done: number; of: number; next: string } | { type: 'remind'; label: string };
  terms: { icon: IconName; title: string; text: string }[];
};

/** «Для вас»: demo offers from the canvas (until the API is connected). */
export const offers: Offer[] = [
  {
    id: 'kit',
    kind: 'sale',
    title: 'Форма любимой команды',
    sub: 'Скидка 15% на игровую форму по промокоду',
    until: 'до 31 окт',
    urgent: true,
    ends: new Date('2026-10-31T23:59:00+05:00'),
    section: 'Магазин',
    text: 'Поддерживайте «Ордабасы» в цветах клуба! Для вас — скидка 15% на игровую форму сезона. Скопируйте промокод и примените его при оформлении заказа.',
    action: { type: 'promo', code: 'ORDA15', off: '−15%', to: { pathname: '/product/[id]', params: { id: 'jersey', promo: 'ORDA15' } } },
    terms: [
      { icon: 'calendar-03', title: 'Срок действия', text: 'До 31 октября включительно' },
      { icon: 't-shirt', title: 'На что действует', text: 'Игровая форма сезона: домашняя и выездная' },
      { icon: 'user-circle', title: 'Один раз на аккаунт', text: 'Не суммируется с другими скидками магазина' },
    ],
  },
  {
    id: 'live',
    kind: 'excl',
    title: 'Прямой эфир с командой',
    sub: 'Задайте вопрос игрокам перед домашним матчем',
    until: 'пт, 19:00',
    section: 'ORDA TV',
    text: 'Перед домашним матчем игроки выходят в прямой эфир и отвечают болельщикам. Задайте вопрос заранее — лучшие прозвучат в эфире.',
    action: { type: 'question' },
    terms: [
      { icon: 'calendar-03', title: 'Когда', text: 'В пятницу в 19:00, перед домашним матчем' },
      { icon: 'live-streaming-01', title: 'Где смотреть', text: 'ORDA TV в приложении, раздел «Видео»' },
      { icon: 'user-circle', title: 'Один вопрос от болельщика', text: 'Вопросы проходят модерацию' },
    ],
  },
  {
    id: 'bonus',
    kind: 'bonus',
    title: 'Бонусы и награды',
    sub: '+500 баллов за посещение трёх матчей подряд',
    until: 'весь сезон',
    section: 'Баллы',
    text: 'Приходите на домашние матчи «Ордабасы» три раза подряд — и получите 500 баллов. Их можно обменять на клубные призы.',
    action: { type: 'progress', done: 2, of: 3, next: 'Следующий домашний матч — 25 октября с «Кайратом»' },
    terms: [
      { icon: 'ticket-01', title: 'Что засчитывается', text: 'Домашние матчи по билету из приложения' },
      { icon: 'calendar-03', title: 'Срок', text: 'Весь сезон, серию можно начать заново' },
      { icon: 'gift', title: 'Начисление', text: 'Баллы придут в течение суток после третьего матча' },
    ],
  },
  {
    id: 'tickets',
    kind: 'excl',
    title: 'Билеты и доступ',
    sub: 'Ранняя продажа и быстрый вход для владельцев карты болельщика',
    until: 'с 1 ноя',
    section: 'Билеты',
    text: 'Владельцы карты болельщика первыми покупают билеты на домашние матчи и проходят на стадион через отдельный вход.',
    action: { type: 'remind', label: 'Напомнить о старте' },
    terms: [
      { icon: 'calendar-03', title: 'Старт', text: 'С 1 ноября' },
      { icon: 'ticket-01', title: 'Ранняя продажа', text: 'Билеты открываются раньше общей продажи' },
      { icon: 'user-circle', title: 'Для кого', text: 'Для владельцев карты болельщика ORDA' },
    ],
  },
];

export const findOffer = (id: string) => offers.find((o) => o.id === id);
