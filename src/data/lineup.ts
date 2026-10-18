import type { PersonKey } from './people';

export type Player = { num: string; short: string; name: string; role: string; who: PersonKey; x: number; y: number; cap?: boolean };

/** Expected XI vs Kairat, 4-3-3. x / y are pitch positions in % (attack at the top). */
export const startingXI: Player[] = [
  { num: '19', short: 'Натель', name: 'Леонардо Натель', role: 'Нападающий', who: 'natel', x: 20, y: 6 },
  { num: '9', short: 'Мораес', name: 'Эвертон Мораес', role: 'Нападающий', who: 'moraes', x: 50, y: 3 },
  { num: '11', short: 'Вакулко', name: 'Юрий Вакулко', role: 'Полузащитник', who: 'vakulko', x: 80, y: 6 },
  { num: '17', short: 'Султаниязов', name: 'Зикрилло Султаниязов', role: 'Полузащитник', who: 'sultaniyazov', x: 22, y: 31 },
  { num: '10', short: 'Э. Астанов', name: 'Эльхан Астанов', role: 'Полузащитник', who: 'astanov', x: 50, y: 27, cap: true },
  { num: '16', short: 'Капацина', name: 'Кристиан-Михай Капацина', role: 'Полузащитник', who: 'kapacina', x: 78, y: 31 },
  { num: '15', short: 'Әмір', name: 'Жасулан Әмір', role: 'Защитник', who: 'amir', x: 14, y: 55 },
  { num: '5', short: 'Антич', name: 'Никола Антич', role: 'Защитник', who: 'antich', x: 38, y: 59 },
  { num: '3', short: 'Килама', name: 'Ги-Марселин Килама', role: 'Защитник', who: 'kilama', x: 62, y: 59 },
  { num: '22', short: 'С. Астанов', name: 'Султанбек Астанов', role: 'Защитник', who: 'sAstanov', x: 86, y: 55 },
  { num: '1', short: 'Шайзада', name: 'Бекхан Шайзада', role: 'Вратарь', who: 'shaizada', x: 50, y: 80 },
];

export const bench: { num: string; short: string; who: PersonKey }[] = [
  { num: '13', short: 'Толепберген', who: 'tolepbergen' },
  { num: '14', short: 'Турганов', who: 'turganov' },
  { num: '8', short: 'Жаксыбаев', who: 'zhaksybaev' },
  { num: '23', short: 'Халматов', who: 'khalmatov' },
  { num: '21', short: 'Б. Токтыбай', who: 'bToktybay' },
  { num: '20', short: 'М. Токтыбай', who: 'mToktybay' },
  { num: '7', short: 'Наумец', who: 'naumets' },
  { num: '77', short: 'Абагна', who: 'abagna' },
];
