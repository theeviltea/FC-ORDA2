import { Image } from 'expo-image';
import { View } from 'react-native';

import { Button, Card, Gradient, Icon, NavBar, Screen, SectionHeader, Star, Text, type IconName } from '@/components';
import { img } from '@/data/images';
import { soon } from '@/data/nav';
import { fan, formatPoints } from '@/data/user';
import { colors, radius, shadows } from '@/theme';

type Item = { icon: IconName; title: string; sub: string; done?: number; of?: number };

const got: Item[] = [
  { icon: 'whistle', title: 'Первый свисток', sub: 'Первый матч на стадионе' },
  { icon: 'star', title: 'Прогнозист', sub: '5 точных прогнозов на счёт' },
  { icon: 'medal-01', title: 'Квиз-мастер', sub: '10 викторин без ошибок' },
];
const doing: Item[] = [
  { icon: 'ticket-01', title: 'Верный болельщик', sub: 'Посетите 5 домашних матчей', done: 3, of: 5 },
  { icon: 'fire', title: 'Серия', sub: 'Заходите в приложение 7 дней подряд', done: 5, of: 7 },
];
const locked: Item[] = [
  { icon: 'crown', title: 'Легенда трибуны', sub: 'Достигните уровня «Легенда»' },
  { icon: 'lock', title: 'Железная серия', sub: '20 матчей сезона подряд' },
];
const badges: { icon: IconName; label: string; off?: boolean }[] = [
  { icon: 'ticket-01', label: '10 матчей' },
  { icon: 'star', label: 'Прогнозист' },
  { icon: 'medal-01', label: 'Квиз-мастер' },
  { icon: 'crown', label: 'Легенда', off: true },
];

function List({ title, items, state }: { title: string; items: Item[]; state: 'got' | 'doing' | 'locked' }) {
  return (
    <View style={{ gap: 12, marginTop: 8 }}>
      <SectionHeader title={title} />
      <Card style={{ marginHorizontal: 20, paddingHorizontal: 16 }}>
        {items.map((a, i) => (
          <View key={a.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 68, paddingVertical: 12, borderBottomWidth: i < items.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken, opacity: state === 'locked' ? 0.6 : 1 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: state === 'got' ? colors.blue : state === 'doing' ? colors.blue10 : colors.surfaceSunken, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={a.icon} size={22} color={state === 'got' ? 'surface' : state === 'doing' ? 'blue' : 'text3'} weight={1.7} />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text size={16} weight={700}>
                {a.title}
              </Text>
              <Text size={13} color="text2">
                {a.sub}
              </Text>
              {a.of ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 }}>
                  <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: a.of, now: a.done }} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.blue10, overflow: 'hidden' }}>
                    <View style={{ width: `${(a.done! / a.of) * 100}%`, height: 6, borderRadius: 3, backgroundColor: colors.blue }} />
                  </View>
                  <Text size={12} weight={700} color="blue600">
                    {a.done}/{a.of}
                  </Text>
                </View>
              ) : null}
            </View>
            {state === 'got' ? <Icon name="tick-02" size={20} color="successText" weight={2.2} /> : state === 'locked' ? <Icon name="lock" size={18} color="text3" /> : null}
          </View>
        ))}
      </Card>
    </View>
  );
}

/** Мои достижения: прогресс уровня, значки, получено / в процессе / закрыто. */
export default function Achievements() {
  const tiles: [number, string][] = [
    [got.length, 'получено'],
    [doing.length, 'в процессе'],
    [locked.length + 2, 'закрыто'],
  ];
  return (
    <Screen gap={16} header={<NavBar title="Мои достижения" />}>
      <Gradient style={{ marginHorizontal: 20, padding: 18, gap: 14, borderRadius: radius.xl, overflow: 'hidden', ...shadows.raised }}>
        <Text display size={120} lineHeight={104} color="rgba(255,255,255,0.07)" style={{ position: 'absolute', right: -6, top: -10 }} aria-hidden>
          {`LVL\n${fan.level}`}
        </Text>
        <Star w={14} fill={colors.sky} style={{ right: 30, top: 24 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Image source={img.coin} style={{ width: 52, height: 52 }} contentFit="contain" />
          <View style={{ gap: 2 }}>
            <Text size={13} color="onDark2">
              Ваш прогресс · уровень {fan.level}
            </Text>
            <Text display size={34} lineHeight={34} color="surface">
              {formatPoints(fan.points)}
              <Text size={16} weight={600} color="onDark2">
                {' баллов'}
              </Text>
            </Text>
          </View>
        </View>
        <View style={{ gap: 6 }}>
          <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(fan.progress * 100) }} style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
            <View style={{ width: `${fan.progress * 100}%`, height: 8, borderRadius: 4, backgroundColor: colors.sky }} />
          </View>
          <Text size={13} color="onDark2">
            {Math.round(fan.progress * 100)}% · ещё {fan.toNext} до «{fan.nextLevel}»
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {tiles.map(([v, l]) => (
            <View key={l} style={{ flex: 1, height: 64, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Text display size={24} lineHeight={24} color="surface">
                {v}
              </Text>
              <Text size={12} color="onDark2">
                {l}
              </Text>
            </View>
          ))}
        </View>
      </Gradient>

      <Card style={{ marginHorizontal: 20, padding: 16, gap: 14 }}>
        <Text display size={22}>
          Мои значки
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {badges.map((b) => (
            <View key={b.label} style={{ width: 72, alignItems: 'center', gap: 6, opacity: b.off ? 0.45 : 1 }}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: b.off ? colors.surfaceSunken : colors.blue10, borderWidth: 2, borderColor: b.off ? colors.line : colors.blue, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={b.off ? 'lock' : b.icon} size={26} color={b.off ? 'text3' : 'blue'} weight={1.7} />
              </View>
              <Text size={12} weight={600} align="center" numberOfLines={1}>
                {b.label}
              </Text>
            </View>
          ))}
        </View>
        <Button label="Обменять баллы" icon="gift" variant="soft" onPress={soon('Обмен баллов')} />
      </Card>

      <List title="Получено" items={got} state="got" />
      <List title="В процессе" items={doing} state="doing" />
      <List title="Закрыто" items={locked} state="locked" />
    </Screen>
  );
}
