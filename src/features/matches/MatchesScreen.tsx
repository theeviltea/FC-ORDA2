import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';

import { AppHeader, Card, FilterChips, Gradient, Icon, PageTitle, Pressable, Screen, SegmentedTabs, Star, Text } from '@/components';
import { img } from '@/data/images';
import { soon } from '@/data/nav';
import { useCountdown } from '@/hooks/useCountdown';
import { colors, radius, shadows } from '@/theme';

type Team = { name: string; short: string; logo?: number };

const logos: Record<string, number> = { Ордабасы: img.crest, Тобыл: img.clubTobyl, Кайрат: img.clubKairat, Астана: img.clubAstana };
const team = (name: string, short?: string): Team => ({ name, short: short ?? name.slice(0, 2).toUpperCase(), logo: logos[name] });
const ORDA = team('Ордабасы', 'ОР');

const upcoming = [
  { id: 'm2', month: 'Ноябрь', round: '26 тур', date: 'Сб, 1 ноября', time: '17:00', city: 'Костанай', home: false, h: team('Тобыл'), a: ORDA },
  { id: 'm3', month: 'Ноябрь', round: '27 тур', date: 'Вс, 9 ноября', time: '15:00', city: 'Шымкент', home: true, h: ORDA, a: team('Астана') },
  { id: 'm4', month: 'Ноябрь', round: 'Кубок, 1/2', date: 'Ср, 19 ноября', time: '18:00', city: 'Шымкент', home: true, h: ORDA, a: team('Актобе', 'АК') },
];

type Res = 'Победа' | 'Ничья' | 'Поражение';
const past = [
  { month: 'Октябрь', round: '24 тур', date: '19 октября', home: true, h: ORDA, a: team('Елимай', 'ЕЛ'), score: [3, 1], scorers: 'Э. Астанов 23’, Натель 61’, Мораес 88’' },
  { month: 'Октябрь', round: '23 тур', date: '5 октября', home: false, h: team('Кызылжар', 'КЖ'), a: ORDA, score: [1, 1], scorers: 'Вакулко 47’' },
  { month: 'Сентябрь', round: '22 тур', date: '28 сентября', home: true, h: ORDA, a: team('Жетысу', 'ЖТ'), score: [2, 0], scorers: 'Мораес 12’, 54’' },
  { month: 'Сентябрь', round: '21 тур', date: '21 сентября', home: false, h: team('Кайрат'), a: ORDA, score: [2, 1], scorers: 'Капацина 70’' },
  { month: 'Сентябрь', round: '20 тур', date: '14 сентября', home: true, h: ORDA, a: team('Атырау', 'АТ'), score: [2, 0], scorers: 'Натель 9’, Э. Астанов 34’ (пен.)' },
].map((m) => {
  const me = m.home ? m.score[0] : m.score[1];
  const op = m.home ? m.score[1] : m.score[0];
  const res: Res = me > op ? 'Победа' : me === op ? 'Ничья' : 'Поражение';
  return { ...m, res };
});

const resLook: Record<Res, { short: string; bg: string; fg: string }> = {
  Победа: { short: 'В', bg: colors.blue600, fg: colors.surface },
  Ничья: { short: 'Н', bg: colors.chipBg, fg: colors.navy },
  Поражение: { short: 'П', bg: '#FDECEE', fg: colors.errorText },
};

const rows: [string, string, number, number, number, number][] = [
  ['Ордабасы', 'ОР', 16, 5, 3, 27], ['Кайрат', 'КА', 15, 5, 4, 19], ['Астана', 'АС', 13, 6, 5, 14], ['Тобыл', 'ТО', 12, 6, 6, 9],
  ['Актобе', 'АК', 11, 6, 7, 6], ['Елимай', 'ЕЛ', 10, 7, 7, 3], ['Жетысу', 'ЖТ', 9, 7, 8, 0], ['Кызылжар', 'КЖ', 9, 5, 10, -3],
  ['Атырау', 'АТ', 8, 6, 10, -5], ['Женис', 'ЖН', 7, 7, 10, -6], ['Кайсар', 'КС', 6, 8, 10, -9], ['Улытау', 'УЛ', 6, 5, 13, -14],
  ['Окжетпес', 'ОК', 5, 5, 14, -17], ['Каспий', 'КП', 3, 6, 15, -24],
];

const byMonth = <T extends { month: string }>(list: T[]) =>
  list.reduce<{ name: string; items: T[] }[]>((acc, m) => {
    const g = acc.find((x) => x.name === m.month);
    if (g) g.items.push(m);
    else acc.push({ name: m.month, items: [m] });
    return acc;
  }, []);

function Crest({ t, size = 40 }: { t: Team; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {t.logo ? (
        <Image source={t.logo} style={{ width: size * 0.6, height: size * 0.72 }} contentFit="contain" />
      ) : (
        <Text display size={size > 36 ? 13 : 12} color="text2">
          {t.short}
        </Text>
      )}
    </View>
  );
}

function MonthTitle({ children }: { children: string }) {
  return (
    <Text display size={24} lineHeight={28} style={{ marginTop: 8, marginBottom: 2 }}>
      {children}
    </Text>
  );
}

function Hero() {
  const countdown = useCountdown(new Date('2026-10-25T19:00:00+05:00'), ['дн', 'ч', 'мин', 'сек']);
  const club = (t: Team) => (
    <View style={{ flex: 1, alignItems: 'center', gap: 8 }}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={t.logo} style={{ width: 36, height: 42 }} contentFit="contain" />
      </View>
      <Text display size={16} upper color="surface" style={{ letterSpacing: 0.5 }}>
        {t.name}
      </Text>
    </View>
  );
  return (
    <Gradient style={{ marginHorizontal: 20, borderRadius: radius.xl, overflow: 'hidden', paddingTop: 18, paddingHorizontal: 16, paddingBottom: 16, gap: 16, ...shadows.raised }}>
      <Text display size={88} lineHeight={77} color="rgba(255,255,255,0.08)" style={{ position: 'absolute', left: 10, top: -4 }} aria-hidden>
        {'MATCH\nDAY\nMATCH'}
      </Text>
      <Star w={40} h={66} fill={colors.bg} style={{ left: -20, top: 96 }} />
      <Star w={40} h={66} fill={colors.bg} style={{ right: -20, top: 96 }} />
      <Star w={14} fill={colors.sky} style={{ right: 40, top: 22 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ height: 24, paddingHorizontal: 10, borderRadius: 12, backgroundColor: colors.surface, justifyContent: 'center' }}>
          <Text size={12} lineHeight={14} weight={700}>
            Ближайший · дома
          </Text>
        </View>
        <Text size={13} color="onDark2">
          25 тур
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {club(ORDA)}
        <View style={{ alignItems: 'center', gap: 2 }}>
          <Text display size={30} lineHeight={30} color="surface">
            19:00
          </Text>
          <Text size={13} color="onDark2">
            Сб, 25 окт
          </Text>
        </View>
        {club(team('Кайрат'))}
      </View>
      <View accessibilityRole="timer" accessibilityLabel="До начала матча" style={{ flexDirection: 'row', gap: 6 }}>
        {countdown.map((c) => (
          <View key={c.u} style={{ flex: 1, height: 52, borderRadius: 10, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
            <Text display size={22} lineHeight={24} color="surface" style={{ fontVariant: ['tabular-nums'] }}>
              {c.v}
            </Text>
            <Text size={11} lineHeight={13} color="onDark2" upper style={{ letterSpacing: 0.7 }}>
              {c.u}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable accessibilityRole="button" onPress={() => router.push('/tickets')} style={{ flex: 1, height: 52, borderRadius: radius.m, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon name="ticket-01" size={20} weight={1.8} />
          <Text size={17} weight={700}>
            Купить билеты
          </Text>
        </Pressable>
        <Pressable accessibilityRole="link" accessibilityLabel="Состав команды" onPress={() => router.push('/lineup')} style={{ width: 52, height: 52, borderRadius: radius.m, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="football-pitch" size={22} color="surface" weight={1.8} />
        </Pressable>
      </View>
    </Gradient>
  );
}

type Venue = 'all' | 'home' | 'away';

function Schedule() {
  const [filter, setFilter] = useState<Venue>('all');
  const [rem, setRem] = useState<Record<string, boolean>>({ m2: true });
  const list = upcoming.filter((m) => filter === 'all' || (filter === 'home' ? m.home : !m.home));
  return (
    <>
      <FilterChips
        value={filter}
        onChange={setFilter}
        items={[
          { id: 'all', label: 'Все' },
          { id: 'home', label: 'Дома' },
          { id: 'away', label: 'В гостях' },
        ]}
      />
      {filter !== 'away' ? <Hero /> : null}
      {byMonth(list).map((g) => (
        <View key={g.name} style={{ gap: 10, paddingHorizontal: 20 }}>
          <MonthTitle>{g.name}</MonthTitle>
          {g.items.map((m) => {
            const on = !!rem[m.id];
            return (
              <Card key={m.id} style={{ paddingTop: 14, paddingHorizontal: 14, paddingBottom: 12, gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text size={13} color="text2">
                    {m.round} · {m.date}
                  </Text>
                  <View style={{ height: 22, paddingHorizontal: 9, borderRadius: 11, backgroundColor: m.home ? colors.blue10 : colors.bg, justifyContent: 'center' }}>
                    <Text size={11} lineHeight={13} weight={700} color={m.home ? 'blue600' : 'text2'}>
                      {m.home ? 'Дома' : 'В гостях'}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <Crest t={m.h} />
                    <Text size={15} weight={700} numberOfLines={1} style={{ flexShrink: 1 }}>
                      {m.h.name}
                    </Text>
                  </View>
                  <View style={{ width: 92, alignItems: 'center' }}>
                    <Text display size={24} lineHeight={24}>
                      {m.time}
                    </Text>
                    <Text size={12} color="text2">
                      {m.city}
                    </Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, minWidth: 0 }}>
                    <Text size={15} weight={700} numberOfLines={1} style={{ flexShrink: 1 }}>
                      {m.a.name}
                    </Text>
                    <Crest t={m.a} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {m.home ? (
                    <Pressable accessibilityRole="button" onPress={() => router.push('/tickets')} style={{ flex: 1, height: 44, borderRadius: radius.m, backgroundColor: colors.blue600, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Icon name="ticket-01" size={18} color="surface" weight={1.8} />
                      <Text size={15} weight={700} color="surface">
                        Билеты
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable accessibilityRole="button" onPress={soon('Трансляция')} style={{ flex: 1, height: 44, borderRadius: radius.m, backgroundColor: colors.blue10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Icon name="live-streaming-01" size={18} color="blue600" weight={1.8} />
                      <Text size={15} weight={700} color="blue600">
                        Трансляция
                      </Text>
                    </Pressable>
                  )}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    onPress={() => setRem({ ...rem, [m.id]: !on })}
                    style={{ flex: 1, height: 44, borderRadius: radius.m, borderWidth: 1.5, borderColor: on ? colors.blue10 : colors.line, backgroundColor: on ? colors.blue10 : colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Icon name={on ? 'tick-02' : 'notification-01'} size={18} color={on ? 'blue600' : 'text'} weight={1.8} />
                    <Text size={15} weight={700} color={on ? 'blue600' : 'text'}>
                      {on ? 'Напомним' : 'Напомнить'}
                    </Text>
                  </Pressable>
                </View>
              </Card>
            );
          })}
        </View>
      ))}
    </>
  );
}

function Results() {
  const season = [
    { v: '24', l: 'матча', c: 'text' },
    { v: '16', l: 'побед', c: 'blue600' },
    { v: '5', l: 'ничьих', c: 'text' },
    { v: '3', l: 'поражения', c: 'errorText' },
  ] as const;
  return (
    <>
      <Card style={{ marginHorizontal: 20, padding: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {season.map((s) => (
            <View key={s.l} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <Text display size={26} lineHeight={26} color={s.c}>
                {s.v}
              </Text>
              <Text size={12} color="text2">
                {s.l}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ height: 1, backgroundColor: colors.line }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text size={14} color="text2">
            Последние 5 матчей
          </Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {past
              .slice()
              .reverse()
              .map((m) => {
                const l = resLook[m.res];
                return (
                  <View key={m.round} style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: l.bg, alignItems: 'center', justifyContent: 'center' }}>
                    <Text size={13} lineHeight={15} weight={700} color={l.fg}>
                      {l.short}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>
      </Card>
      {byMonth(past).map((g) => (
        <View key={g.name} style={{ gap: 10, paddingHorizontal: 20 }}>
          <MonthTitle>{g.name}</MonthTitle>
          {g.items.map((m) => {
            const l = resLook[m.res];
            const side = (t: Team, right?: boolean) => (
              <View style={{ flex: 1, flexDirection: right ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <Crest t={t} size={36} />
                <Text size={15} weight={t === ORDA ? 700 : 500} numberOfLines={1} style={{ flexShrink: 1 }}>
                  {t.name}
                </Text>
              </View>
            );
            return (
              <Pressable key={m.round} accessibilityRole="link" onPress={() => router.push({ pathname: '/news/[id]', params: { id: 'leaders' } })} style={{ padding: 14, borderRadius: radius.l, backgroundColor: colors.surface, gap: 10, ...shadows.card }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text size={13} color="text2">
                    {m.round} · {m.date}
                  </Text>
                  <View style={{ height: 22, paddingHorizontal: 9, borderRadius: 11, backgroundColor: l.bg, justifyContent: 'center' }}>
                    <Text size={11} lineHeight={13} weight={700} color={l.fg}>
                      {m.res}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {side(m.h)}
                  <View style={{ minWidth: 72, height: 40, paddingHorizontal: 10, borderRadius: 12, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                    <Text display size={24} lineHeight={26} style={{ letterSpacing: 1, fontVariant: ['tabular-nums'] }}>
                      {`${m.score[0]} : ${m.score[1]}`}
                    </Text>
                  </View>
                  {side(m.a, true)}
                </View>
                <Text size={13} color="text2">
                  {m.scorers}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </>
  );
}

const cols = ['И', 'В', 'Н', 'П', 'РМ'];

function Table() {
  const zones = [
    { c: colors.blue, l: 'Лига чемпионов, 1-й квалификационный раунд' },
    { c: colors.sky, l: 'Лига конференций, квалификация' },
    { c: colors.red, l: 'Выбывание в Первую лигу' },
  ];
  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <Text display size={22}>
          Премьер-Лига 2026
        </Text>
        <Text size={13} color="text2">
          после 24 тура
        </Text>
      </View>
      <Card style={{ marginHorizontal: 20, padding: 6 }}>
        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
          <Text size={12} weight={500} color="text2" style={{ width: 32, paddingLeft: 10 }}>
            #
          </Text>
          <Text size={12} weight={500} color="text2" style={{ flex: 1, paddingLeft: 4 }}>
            Команда
          </Text>
          {cols.map((c) => (
            <Text key={c} size={12} weight={500} color="text2" align="center" style={{ width: 28 }}>
              {c}
            </Text>
          ))}
          <Text size={12} weight={500} color="text2" align="center" style={{ width: 34 }}>
            О
          </Text>
        </View>
        {rows.map((r, i) => {
          const me = r[0] === 'Ордабасы';
          const t = team(r[0], r[1]);
          const zone = i === 0 ? colors.blue : i < 3 ? colors.sky : i >= 12 ? colors.red : 'transparent';
          const w = me ? 700 : 400;
          const vals = [r[2] + r[3] + r[4], r[2], r[3], r[4]];
          return (
            <View key={r[0]} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderRadius: radius.m, backgroundColor: me ? colors.blue10 : 'transparent' }}>
              <View style={{ width: 32, flexDirection: 'row', alignItems: 'center', gap: 5, paddingLeft: 6 }}>
                <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: zone }} />
                <Text size={14} weight={w} color={me ? 'text' : 'text2'} style={{ fontVariant: ['tabular-nums'] }}>
                  {i + 1}
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 4, minWidth: 0 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: t.logo ? colors.surface : colors.surfaceSunken, alignItems: 'center', justifyContent: 'center' }}>
                  {t.logo ? (
                    <Image source={t.logo} style={{ width: 16, height: 20 }} contentFit="contain" />
                  ) : (
                    <Text display size={9} lineHeight={10} color="text2">
                      {t.short}
                    </Text>
                  )}
                </View>
                <Text size={14} weight={w} numberOfLines={1} style={{ flexShrink: 1 }}>
                  {r[0]}
                </Text>
              </View>
              {vals.map((v, k) => (
                <Text key={k} size={14} weight={w} align="center" style={{ width: 28, fontVariant: ['tabular-nums'] }}>
                  {v}
                </Text>
              ))}
              <Text size={14} weight={w} color="text2" align="center" style={{ width: 28, fontVariant: ['tabular-nums'] }}>
                {(r[5] > 0 ? '+' : '') + r[5]}
              </Text>
              <Text size={14} weight={700} color={me ? 'blue600' : 'text'} align="center" style={{ width: 34, fontVariant: ['tabular-nums'] }}>
                {r[2] * 3 + r[3]}
              </Text>
            </View>
          );
        })}
      </Card>
      <View style={{ paddingHorizontal: 20, gap: 8 }}>
        {zones.map((z) => (
          <View key={z.l} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 3, height: 14, borderRadius: 2, backgroundColor: z.c }} />
            <Text size={13} color="text2">
              {z.l}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/** Матчи: расписание с обратным отсчётом, результаты сезона и турнирная таблица. */
export function MatchesScreen() {
  const [tab, setTab] = useState(0);
  return (
    <Screen
      tabs
      gap={16}
      header={<AppHeader />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={90} style={{ top: 236, left: 290 }} />
          <Star w={44} style={{ top: 1116, left: 10 }} />
        </View>
      }>
      <PageTitle>Матчи</PageTitle>
      <SegmentedTabs label="Разделы матчей" labels={['Расписание', 'Результаты', 'Таблица']} active={tab} onChange={setTab} />
      {tab === 0 ? <Schedule /> : tab === 1 ? <Results /> : <Table />}
    </Screen>
  );
}
