import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Gradient, Icon, NavBar, Pressable, Screen, SegmentedTabs, Text, type IconName } from '@/components';
import { img } from '@/data/images';
import { colors, shadows } from '@/theme';

type Task = { id: string; icon: IconName; title: string; sub: string; reward: number; done?: number; of?: number; to?: Href; claimed?: boolean };

const today: Task[] = [
  { id: 'open', icon: 'smart-phone-01', title: 'Зайти в приложение', sub: 'ежедневно', reward: 5, done: 1, of: 1, claimed: true },
  { id: 'news', icon: 'news-01', title: 'Прочитать новость', sub: '1 из 1', reward: 10, done: 1, of: 1 },
  { id: 'quiz', icon: 'star', title: 'Пройти викторину', sub: '«Узнай игрока по фактам»', reward: 20, done: 0, of: 1, to: { pathname: '/quiz/[id]', params: { id: 'players' } } },
  { id: 'poll', icon: 'checkmark-circle-02', title: 'Проголосовать в опросе', sub: 'Игрок матча', reward: 10, done: 0, of: 1, to: '/polls' },
];
const week: Task[] = [
  { id: 'video', icon: 'play', title: 'Посмотреть 3 видео', sub: 'ORDA TV', reward: 30, done: 2, of: 3, to: '/videos' },
  { id: 'ticket', icon: 'ticket-01', title: 'Купить билет на матч', sub: 'с «Кайратом»', reward: 100, done: 0, of: 1, to: '/tickets' },
  { id: 'predict', icon: 'football', title: 'Сделать прогноз', sub: 'на 25 тур', reward: 20, done: 0, of: 1, to: '/predictions' },
];
const season: Task[] = [
  { id: 'home', icon: 'ticket-01', title: 'Посетить 5 домашних матчей', sub: 'Верный болельщик', reward: 300, done: 3, of: 5, to: '/tickets' },
  { id: 'quiz10', icon: 'star', title: 'Пройти 10 викторин', sub: 'Квиз-мастер', reward: 200, done: 4, of: 10, to: '/quizzes' },
  { id: 'contest', icon: 'champion', title: 'Участвовать в 3 конкурсах', sub: 'Сезон 2026', reward: 150, done: 1, of: 3, to: '/contests' },
];

const pad = (n: number) => String(n).padStart(2, '0');
function untilMidnight(now: number) {
  const d = new Date(now);
  const s = Math.max(0, Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime() - now) / 1000));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

function Row({ t, claimed, onClaim, last }: { t: Task; claimed: boolean; onClaim: () => void; last: boolean }) {
  const ready = (t.done ?? 0) >= (t.of ?? 1);
  const state = claimed ? 'done' : ready ? 'claim' : 'go';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: last ? 0 : 1, borderColor: colors.surfaceSunken, opacity: state === 'done' ? 0.7 : 1 }}>
      <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: state === 'done' ? colors.surfaceSunken : colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={t.icon} size={22} color={state === 'done' ? 'text3' : 'blue'} weight={1.7} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text size={16} weight={700}>
          {t.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Image source={img.coin} style={{ width: 16, height: 16 }} contentFit="contain" />
          <Text size={13} color="text2" style={{ flex: 1 }} numberOfLines={1}>
            +{t.reward} · {t.sub}
          </Text>
        </View>
        {(t.of ?? 1) > 1 || (state === 'go' && t.of) ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: t.of, now: t.done }}>
            <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.blue10, overflow: 'hidden' }}>
              <View style={{ width: `${((t.done ?? 0) / (t.of ?? 1)) * 100}%`, height: 6, borderRadius: 3, backgroundColor: colors.blue }} />
            </View>
            <Text size={12} weight={700} color="blue600">
              {t.done}/{t.of}
            </Text>
          </View>
        ) : null}
      </View>
      {state === 'done' ? (
        <View style={{ height: 36, paddingHorizontal: 12, borderRadius: 18, backgroundColor: colors.successBg, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="tick-02" size={16} color="successText" weight={2.4} />
          <Text size={14} weight={700} color="successText">
            Получено
          </Text>
        </View>
      ) : state === 'claim' ? (
        <Pressable accessibilityRole="button" accessibilityLabel={`Забрать ${t.reward} баллов`} onPress={onClaim} style={{ height: 36, paddingHorizontal: 14, borderRadius: 18, backgroundColor: colors.blue600, justifyContent: 'center' }}>
          <Text size={14} weight={700} color="surface">
            Забрать
          </Text>
        </Pressable>
      ) : (
        <Pressable accessibilityRole="link" accessibilityLabel={`${t.title}: перейти`} onPress={() => t.to && router.push(t.to)} style={{ height: 36, paddingHorizontal: 14, borderRadius: 18, backgroundColor: colors.blue10, justifyContent: 'center' }}>
          <Text size={14} weight={700} color="blue600">
            Перейти
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/** Задания: серия дней, задания на сегодня / неделю / сезон с прогрессом, «Забрать» начисляет баллы. */
export default function Tasks() {
  const [tab, setTab] = useState(0);
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});
  const [earned, setEarned] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const list = [today, week, season][tab];
  const isClaimed = (t: Task) => claimed[t.id] ?? !!t.claimed;
  const toClaim = (l: Task[]) => l.filter((t) => !isClaimed(t) && (t.done ?? 0) >= (t.of ?? 1)).length;

  return (
    <Screen gap={16} header={<NavBar title="Задания" />}>
      <Gradient style={{ marginHorizontal: 20, padding: 18, gap: 14, borderRadius: 24, overflow: 'hidden' }}>
        <Text display size={96} lineHeight={83} align="right" color="rgba(255,255,255,0.08)" style={{ position: 'absolute', right: -6, top: -8 }} aria-hidden>
          5/7
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Image source={img.icon3dTasks} style={{ width: 56, height: 56 }} contentFit="contain" />
          <View style={{ gap: 2, flex: 1 }}>
            <Text display size={26} lineHeight={28} color="surface">
              Серия 5 дней
            </Text>
            <Text size={14} color="onDark2">
              {earned ? `+${earned} баллов сегодня · ` : ''}Ещё 2 дня — и +100 баллов за неделю
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} accessibilityLabel="Серия: 5 дней из 7">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d, i) => (
            <View key={d} style={{ alignItems: 'center', gap: 6 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: i < 5 ? colors.surface : 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' }}>
                {i < 5 ? <Icon name="fire" size={18} color="red" weight={2} /> : i === 6 ? <Image source={img.coin} style={{ width: 22, height: 22 }} contentFit="contain" /> : null}
              </View>
              <Text size={12} color="onDark2">
                {d}
              </Text>
            </View>
          ))}
        </View>
      </Gradient>

      <SegmentedTabs labels={['Сегодня', 'Неделя', 'Сезон']} counts={[toClaim(today), toClaim(week), toClaim(season)]} active={tab} onChange={setTab} label="Период" />

      <View style={{ marginHorizontal: 20, paddingHorizontal: 16, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card }}>
        {list.map((t, i) => (
          <Row
            key={t.id}
            t={t}
            claimed={isClaimed(t)}
            last={i === list.length - 1 && tab !== 0}
            onClaim={() => {
              setClaimed({ ...claimed, [t.id]: true });
              setEarned(earned + t.reward);
            }}
          />
        ))}
        {tab === 0 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14 }}>
            <Icon name="clock-01" size={16} color="text2" />
            <Text size={13} color="text2" style={{ fontVariant: ['tabular-nums'] }}>
              Новые задания через {untilMidnight(now)}
            </Text>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
