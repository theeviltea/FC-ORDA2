import type { Product } from '@/components';

import { img } from './images';

export type ShopItem = Product & { id: string; base: number; lead: string; spec?: string; kit?: string; warranty?: string };

/** Characteristics, contents and warranty per item (bank requirement: clear product identification). [..] = fill in. */
const details: Record<string, { spec: string; kit: string; warranty: string }> = {
  jersey: { spec: 'Состав: [100% полиэстер]. Технология отвода влаги, посадка Regular fit. Размеры XS–XXL. Производитель: [бренд, страна].', kit: 'В комплекте: джерси, фирменная бирка.', warranty: 'Гарантия на швы и нанесение — [30 дней].' },
  mug: { spec: 'Керамика, объём 350 мл, высота 9,5 см. Подходит для посудомоечной машины и микроволновки.', kit: 'В комплекте: кружка в подарочной коробке.', warranty: 'Гарантия — [14 дней] на заводской брак.' },
  hoodie: { spec: 'Состав: [80% хлопок, 20% полиэстер], флис внутри. Вышитый логотип ORDA. Размеры XS–XXL.', kit: 'В комплекте: худи.', warranty: 'Гарантия на швы и вышивку — [30 дней].' },
  scarf: { spec: 'Вязаный двусторонний шарф, [100% акрил], 140 × 18 см.', kit: 'В комплекте: шарф.', warranty: 'Гарантия — [14 дней] на заводской брак.' },
  training: { spec: 'Футболка и шорты, [100% полиэстер], лёгкая дышащая ткань. Размеры XS–XXL.', kit: 'В комплекте: футболка и шорты.', warranty: 'Гарантия на швы — [30 дней].' },
  jacket: { spec: 'Утеплённая куртка с капюшоном, верх [100% полиэстер], утеплитель [синтепон 150 г/м²]. Размеры S–XXL.', kit: 'В комплекте: куртка.', warranty: 'Гарантия на фурнитуру и швы — [60 дней].' },
  backpack: { spec: 'Объём 22 л, отделение для ноутбука до 15,6″, светоотражающие вставки, ткань [полиэстер 600D].', kit: 'В комплекте: рюкзак.', warranty: 'Гарантия на фурнитуру и швы — [60 дней].' },
  flag: { spec: 'Размер 150 × 90 см, [полиэстер], печать с двух сторон, металлические люверсы.', kit: 'В комплекте: флаг.', warranty: 'Гарантия — [14 дней] на заводской брак.' },
};

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

export const findItem = (id: string): ShopItem & { spec: string; kit: string; warranty: string } => {
  const it = catalogue.find((p) => p.id === id) ?? catalogue[0];
  return { ...it, ...(details[it.id] ?? { spec: '[Характеристики]', kit: '[Комплектация]', warranty: '[Гарантийные условия]' }) };
};

export const tenge = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₸`;

/** Promo codes accepted by the prototype: code → discount share. */
export const promoCodes: Record<string, number> = { ORDA15: 0.15 };
