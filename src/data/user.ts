/** Demo fan profile (mock data until the API is connected). */
export const fan = {
  name: 'Бекжан',
  ordaId: '004 217',
  since: 2019,
  points: 2480,
  level: 21,
  levelName: 'Болельщик',
  nextLevel: 'Легенды',
  toNext: 520,
  progress: 0.78,
  unread: 5,
};

export const formatPoints = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
