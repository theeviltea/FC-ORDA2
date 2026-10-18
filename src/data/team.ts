import type { PersonKey } from './people';

export type Member = { num: string; name: string; role: string; who: PersonKey };
export type Group = { id: string; title: string; staff?: boolean; people: Member[] };

const pl = (num: string, name: string, role: string, who: PersonKey): Member => ({ num, name, role, who });
const sf = (name: string, role: string, who: PersonKey): Member => ({ num: '', name, role, who });

/** Squad and staff, season 2026 (from the design canvas). */
export const groups: Group[] = [
  { id: 'gk', title: 'Вратари', people: [pl('1', 'Бекхан Шайзада', 'Вратарь', 'shaizada'), pl('13', 'Кажымукан Толепберген', 'Вратарь', 'tolepbergen'), pl('24', 'Аян Абдухалык', 'Вратарь', 'abdukhalyk')] },
  {
    id: 'df',
    title: 'Защитники',
    people: [
      pl('3', 'Ги-Марселин Килама', 'Защитник', 'kilama'),
      pl('5', 'Никола Антич', 'Защитник', 'antich'),
      pl('8', 'Улар Жаксыбаев', 'Защитник', 'zhaksybaev'),
      pl('14', 'Али Турганов', 'Защитник', 'turganov'),
      pl('15', 'Жасулан Әмір', 'Защитник', 'amir'),
      pl('22', 'Султанбек Астанов', 'Защитник', 'sAstanov'),
      pl('25', 'Сергей Малый', 'Защитник', 'maly'),
      pl('55', 'Алекса Аманович', 'Защитник', 'amanovich'),
    ],
  },
  {
    id: 'mf',
    title: 'Полузащитники',
    people: [
      pl('10', 'Эльхан Астанов', 'Полузащитник', 'astanov'),
      pl('11', 'Юрий Вакулко', 'Полузащитник', 'vakulko'),
      pl('16', 'Кристиан-Михай Капацина', 'Полузащитник', 'kapacina'),
      pl('17', 'Зикрилло Султаниязов', 'Полузащитник', 'sultaniyazov'),
      pl('21', 'Биржан Токтыбай', 'Полузащитник', 'bToktybay'),
      pl('23', 'Муроджон Халматов', 'Полузащитник', 'khalmatov'),
      pl('77', 'Давид Абагна', 'Полузащитник', 'abagna'),
    ],
  },
  {
    id: 'fw',
    title: 'Нападающие',
    people: [
      pl('7', 'Владислав Наумец', 'Нападающий', 'naumets'),
      pl('9', 'Эвертон Мораес', 'Нападающий', 'moraes'),
      pl('19', 'Леонардо Натель', 'Нападающий', 'natel'),
      pl('20', 'Магжан Токтыбай', 'Нападающий', 'mToktybay'),
      pl('45', 'Димитар Митков', 'Нападающий', 'mitkov'),
    ],
  },
  {
    id: 'coaches',
    title: 'Тренерский штаб',
    staff: true,
    people: [
      sf('Андрей Мартин', 'Главный тренер', 'martin'),
      sf('Марчел Решитка', 'Ассистент главного тренера', 'reshitka'),
      sf('Фархад Жанибеков', 'Ассистент главного тренера', 'zhanibekov'),
      sf('Игорь Зайцев', 'Ассистент главного тренера', 'zaitsev'),
      sf('Денис Романенко', 'Тренер вратарей', 'romanenko'),
      sf('Луиш Альберту да Силва', 'Тренер по физподготовке', 'silva'),
    ],
  },
  {
    id: 'staff',
    title: 'Административный персонал',
    staff: true,
    people: [
      sf('Николай Нота', 'Врач', 'nota'),
      sf('Ербол Сабденов', 'Врач', 'sabdenov'),
      sf('Кайратали Кунходжаев', 'Массажист', 'kunkhodzhaev'),
      sf('Досхан Сматулла', 'Массажист', 'smatulla'),
      sf('Самат Дербисбаев', 'Администратор', 'derbisbaev'),
      sf('Ерлан Ергебеков', 'Администратор', 'ergebekov'),
    ],
  },
];

export const players = groups.filter((g) => !g.staff).flatMap((g) => g.people);
export const findPlayer = (num: string) => players.find((p) => p.num === num);

/** Full profile exists for the player of the match (others show the hero and basic facts). */
export const profiles: Record<string, { position: string; facts: [string, string][]; bio: string[]; tiles: [string, string][]; stats: { label: string; value: string; w: number }[]; awards: { title: string; meta: string }[]; national?: string }> = {
  '10': {
    position: 'Полузащитник · левый вингер',
    national: 'Сборная Казахстана',
    tiles: [
      ['115', 'матчей'],
      ['8', 'голов'],
      ['8', 'передач'],
    ],
    facts: [
      ['Возраст', '26'],
      ['Рост', '186 см'],
      ['Гражданство', 'Казахстан'],
      ['Нога', 'Правая'],
      ['Амплуа', 'Левый вингер'],
      ['Игрок сборной', 'Казахстан'],
    ],
    bio: [
      'Эльхан Астанов — казахстанский футболист, полузащитник и левый вингер «Ордабасы». Под 10-м номером он действует на фланге, помогает развивать атаки и создаёт моменты для партнёров.',
      'Астанов также выступает за сборную Казахстана. Его игру отличают скорость, техника и уверенная работа с мячом.',
    ],
    stats: [
      { label: 'Сыграно минут', value: '8 712', w: 0.9 },
      { label: 'Матчи', value: '115', w: 0.7 },
      { label: 'Стартовый состав', value: '96', w: 0.6 },
      { label: 'Голы', value: '8', w: 0.34 },
      { label: 'Голевые передачи', value: '8', w: 0.34 },
    ],
    awards: [
      { title: 'Чемпион Казахстана', meta: '22/23 · FC Ordabasy' },
      { title: 'Обладатель Кубка Казахстана', meta: '21/22 · FC Ordabasy' },
      { title: 'Обладатель Кубка Лиги Казахстана', meta: '23/24 · FC Astana' },
    ],
  },
};
