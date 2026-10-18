import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Gradient, Icon, NavBar, Screen, SegmentedTabs, Star, Text, type IconName } from '@/components';
import { contests, statusOf, useEntries, type Contest, type Status } from '@/data/contests';
import { img } from '@/data/images';
import { colors, radius, shadows } from '@/theme';

const word = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? 'участник' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'участника' : 'участников');

function meta(c: Contest, s: Status) {
  if (s === 'soon') return `Скоро · старт ${c.startText}`;
  const n = `${c.participants} ${word(c.participants)}`;
  if (s === 'done') return `${c.kind} · ${n}`;
  return `${c.kind} · ${n} · ${s === 'joined' ? `итоги ${c.resultsText}` : `до ${c.deadlineText}`}`;
}

function Pill({ icon, text, tone }: { icon: IconName; text: string; tone: 'blue' | 'green' | 'grey' }) {
  const t = { blue: [colors.blue10, 'blue600'], green: [colors.successBg, 'successText'], grey: [colors.surfaceSunken, 'text2'] }[tone] as [string, 'blue600'];
  return (
    <View style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: t[0], flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Icon name={icon} size={16} color={t[1]} weight={2} />
      <Text size={13} weight={700} color={t[1]} style={{ flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

function Thumb({ c }: { c: Contest }) {
  const t = c.thumb;
  const pic = <Image source={t.src} style={{ width: t.size, height: t.size }} contentFit={t.cover ? 'cover' : 'contain'} />;
  const box = { width: 64, height: 64, borderRadius: 16, overflow: 'hidden' as const, alignItems: 'center' as const, justifyContent: 'center' as const };
  return t.bg === 'gradient' ? <Gradient style={box}>{pic}</Gradient> : <View style={[box, { backgroundColor: t.bg === 'sunken' ? colors.surfaceSunken : colors.blue10 }]}>{pic}</View>;
}

/** Конкурсы: баннер, фильтр Все / Активные / Завершённые, карточки в четырёх состояниях. */
export default function Contests() {
  const entries = useEntries();
  const [tab, setTab] = useState(0);
  const list = contests.map((c) => ({ c, s: statusOf(c, entries) }));
  const active = list.filter((x) => x.s === 'new' || x.s === 'joined');
  const vis = tab === 0 ? list : tab === 1 ? active : list.filter((x) => x.s === 'done');
  const open = (id: string) => router.push({ pathname: '/contest/[id]', params: { id } });

  return (
    <Screen gap={14} header={<NavBar title="Конкурсы" />}>
      <View style={{ marginHorizontal: 20, padding: 16, paddingRight: 116, borderRadius: radius.l, backgroundColor: colors.blue10, overflow: 'hidden', gap: 6 }}>
        <Star w={120} fill="#B8E2F4" style={{ right: -16, top: -10 }} />
        <Image source={img.icon3dContest} style={{ position: 'absolute', right: 12, top: '50%', marginTop: -44, width: 88, height: 88 }} contentFit="contain" />
        <Text size={19} lineHeight={23} weight={700}>
          Твой шанс выиграть с «Ордабасы»!
        </Text>
        <Text size={14} lineHeight={18} color="text2">
          Участвуй в конкурсах и забирай клубные призы.
        </Text>
      </View>
      <SegmentedTabs labels={['Все', 'Активные', 'Завершённые']} counts={[0, active.length, 0]} active={tab} onChange={setTab} label="Фильтр" />
      {vis.map(({ c, s }) => (
        <View key={c.id} style={{ marginHorizontal: 20, padding: 16, gap: 12, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card }}>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
            <Thumb c={c} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text size={19} lineHeight={23} weight={700}>
                {c.title}
              </Text>
              <Text size={13} color="text2">
                {meta(c, s)}
              </Text>
            </View>
          </View>
          {s === 'new' ? (
            <>
              <Pill icon="calendar-03" text="Новый конкурс · Приём заявок открыт" tone="blue" />
              <Button label="Участвовать" height={52} onPress={() => open(c.id)} />
            </>
          ) : s === 'joined' ? (
            <>
              <Pill icon="checkmark-circle-02" text="Ты участвуешь · Заявка принята" tone="green" />
              <Button label="Моя заявка" variant="soft" height={52} onPress={() => router.push({ pathname: '/contest/apply', params: { id: c.id } })} />
            </>
          ) : s === 'done' ? (
            <>
              <Pill icon="champion" text="Завершён · Победители объявлены" tone="grey" />
              <Button label="Посмотреть победителей" variant="soft" height={52} onPress={() => router.push({ pathname: '/contest/winners', params: { id: c.id } })} />
            </>
          ) : (
            <Pill icon="clock-01" text={`Старт ${c.startText}`} tone="grey" />
          )}
        </View>
      ))}
    </Screen>
  );
}
