import { useSyncExternalStore } from 'react';

import { players } from './team';

export type Question = { tag: string; q: string; options: string[]; right: number; note: string };
export type Quiz = { id: string; title: string; minutes: number; perAnswer: number; questions: Question[]; opensAt?: string };

const q = (tag: string, text: string, options: string[], right: number, note: string): Question => ({ tag, q: text, options, right, note });

/** «Узнай игрока по фактам»: built from the squad list, so the answers always match the Team screen. */
function playerQuestions(): Question[] {
  const pick = ['1', '10', '9', '22', '77', '7', '21', '5'];
  const nums = players.map((p) => p.num);
  return pick.map((n, i) => {
    const p = players.find((x) => x.num === n)!;
    if (i % 2) {
      const roles = ['Вратарь', 'Защитник', 'Полузащитник', 'Нападающий'];
      return q('Амплуа', `Кто по амплуа ${p.name}?`, roles, roles.indexOf(p.role), `${p.name} — ${p.role.toLowerCase()}, номер ${p.num}.`);
    }
    const others = nums.filter((x) => x !== n);
    const opts = [n, others[(i * 3 + 1) % others.length], others[(i * 5 + 4) % others.length], others[(i * 7 + 9) % others.length]];
    const order = [opts[(i + 1) % 4], opts[(i + 2) % 4], opts[(i + 3) % 4], opts[i % 4]];
    return q('Номер', `Под каким номером играет ${p.name}?`, order.map((o) => `№ ${o}`), order.indexOf(n), `${p.name} играет под номером ${p.num}.`);
  });
}

export const quizzes: Quiz[] = [
  {
    id: 'club',
    title: 'Как хорошо ты знаешь «Ордабасы»?',
    minutes: 5,
    perAnswer: 10,
    questions: [
      q('О клубе', 'В каком городе базируется «Ордабасы»?', ['Алматы', 'Шымкент', 'Тараз', 'Туркестан'], 1, '«Ордабасы» — клуб из Шымкента.'),
      q('О клубе', 'Как называется домашний стадион клуба?', ['Астана Арена', 'Центральный стадион', 'Им. Кажымукана Мунайтпасова', '«Туран»'], 2, 'Домашний стадион — имени Кажымукана Мунайтпасова в Шымкенте.'),
      q('Трофеи', 'В каком году клуб впервые выиграл Кубок Казахстана?', ['2008', '2011', '2015', '2019'], 1, 'Первый Кубок Казахстана «Ордабасы» взял в 2011 году.'),
      q('Трофеи', 'Какой трофей «Ордабасы» выиграл в 2012 году?', ['Суперкубок Казахстана', 'Чемпионат Казахстана', 'Кубок лиги', 'Кубок Содружества'], 0, 'В 2012 году клуб выиграл Суперкубок Казахстана.'),
      q('Правила игры', 'Сколько игроков одной команды на поле?', ['9', '10', '11', '12'], 2, 'У каждой команды на поле 11 игроков, включая вратаря.'),
      q('Правила игры', 'Сколько длится один тайм?', ['30 минут', '40 минут', '45 минут', '50 минут'], 2, 'Тайм — 45 минут плюс добавленное время.'),
      q('Правила игры', 'Сколько замен можно сделать за матч?', ['3', '4', '5', '6'], 2, 'По действующим правилам — до 5 замен.'),
      q('Правила игры', 'С какого расстояния бьют пенальти?', ['9 метров', '11 метров', '16 метров', '20 метров'], 1, 'Точка пенальти — в 11 метрах от ворот.'),
      q('Правила игры', 'Сколько жёлтых карточек в одном матче дают удаление?', ['1', '2', '3', '4'], 1, 'Вторая жёлтая в матче — красная карточка.'),
      q('Правила игры', 'Сколько очков команда получает за победу?', ['1', '2', '3', '4'], 2, 'За победу — 3 очка, за ничью — 1.'),
    ],
  },
  { id: 'players', title: 'Узнай игрока по фактам', minutes: 4, perAnswer: 10, questions: playerQuestions() },
  { id: 'season', title: 'Чемпионский сезон — 2023', minutes: 5, perAnswer: 10, questions: [] },
  { id: 'legends', title: 'Легенды нашего клуба', minutes: 5, perAnswer: 10, questions: [], opensAt: '1 ноября' },
];

export const findQuiz = (id: string) => quizzes.find((x) => x.id === id);

/** Progress per quiz: picked option per answered question; `result` once finished. */
export type Progress = { answers: number[]; result?: { right: number; total: number; points: number } };

let state: Record<string, Progress> = {
  players: { answers: [] },
  season: { answers: [], result: { right: 8, total: 10, points: 80 } },
};
// «Узнай игрока» starts at question 4: the first three answered correctly.
state.players.answers = quizzes[1].questions.slice(0, 3).map((x) => x.right);

const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export function answer(id: string, picked: number) {
  const p = state[id] ?? { answers: [] };
  state = { ...state, [id]: { ...p, answers: [...p.answers, picked] } };
  emit();
}

export function finish(id: string) {
  const quiz = findQuiz(id)!;
  const p = state[id];
  const right = p.answers.filter((a, i) => a === quiz.questions[i].right).length;
  state = { ...state, [id]: { ...p, result: { right, total: quiz.questions.length, points: right * quiz.perAnswer } } };
  emit();
}

export function restart(id: string) {
  state = { ...state, [id]: { answers: [] } };
  emit();
}

export function useQuizzes() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => state,
    () => state,
  );
}

export const status = (quiz: Quiz, p?: Progress) => (quiz.opensAt || !quiz.questions.length && !p?.result ? 'soon' : p?.result ? 'done' : p?.answers.length ? 'progress' : 'new');
