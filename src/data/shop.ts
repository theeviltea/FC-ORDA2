import type { Product } from '@/components';

import { img } from './images';

export type ShopItem = Product & { id: string; base: number; lead: string };

/** Shop catalogue (mock). `base` is the price in tenge; `price` is the formatted label for cards. */
export const catalogue: ShopItem[] = [
  {
    id: 'jersey',
    name: 'Домашняя джерси 2024/25',
    price: '24 990 ₸',
    base: 24990,
    badge: 'Новое',
    tone: 'new',
    photo: img.jersey,
    lead: 'Официальная игровая форма футбольного клуба «Ордабасы» для сезона 2024/25. Технология Dri-FIT эффективно отводит влагу, обеспечивая сухость и комфорт на протяжении всей игры или тренировки.',
  },
  { id: 'mug', name: 'Кружка «Ордабасы»', price: '6 990 ₸', base: 6990, badge: 'Хит продаж', tone: 'hit', photo: img.mug, lead: 'Керамическая кружка с гербом клуба, 350 мл. Можно мыть в посудомоечной машине.' },
  { id: 'hoodie', name: 'Спортивное худи (синее)', price: '18 990 ₸', base: 18990, photo: img.hoodie, lead: 'Тёплое худи с капюшоном и вышитым логотипом ORDA для прохладных вечеров на трибуне.' },
  { id: 'scarf', name: 'Шарф болельщика ORDA', price: '7 990 ₸', base: 7990, lead: 'Вязаный шарф в цветах клуба с гербом «Ордабасы». Тёплый, двусторонний — для трибуны в любую погоду.' },
  { id: 'training', name: 'Тренировочный комплект', price: '21 990 ₸', base: 21990, photo: img.trainingKit, lead: 'Футболка и шорты из лёгкой дышащей ткани — в такой форме тренируется команда.' },
  { id: 'jacket', name: 'Зимняя куртка клуба', price: '34 990 ₸', base: 34990, photo: img.jacket, lead: 'Утеплённая куртка с капюшоном и гербом клуба на груди.' },
  { id: 'backpack', name: 'Рюкзак с логотипом', price: '14 990 ₸', base: 14990, photo: img.backpack, lead: 'Городской рюкзак с отделением для ноутбука и светоотражающими вставками.' },
  { id: 'flag', name: 'Флаг болельщика 1,5 м', price: '4 990 ₸', base: 4990, photo: img.flag, lead: 'Флаг 150 × 90 см с гербом клуба и люверсами для крепления на трибуне.' },
];

export const findItem = (id: string) => catalogue.find((p) => p.id === id) ?? catalogue[0];

export const tenge = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₸`;

/** Promo codes accepted by the prototype: code → discount share. */
export const promoCodes: Record<string, number> = { ORDA15: 0.15 };
