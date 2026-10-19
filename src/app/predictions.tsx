import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Gradient, Icon, NavBar, Pressable, Screen, Star, Text } from '@/components';
import { img } from '@/data/images';
import { colors, shadows } from '@/theme';

const history = [
  { rival: 'Елимай', date: '4 окт', res: '3 : 1', mine: '3 : 1', label: 'Точный счёт', pts: '+50', tone: 'green' as const },
  { rival: 'Жетысу', date: '20 сен', res: '2 : 0', mine: '1 : 0', label: 'Угадан исход', pts: '+10', tone: 'blue' as const },
  { rival: 'Тобыл', date: '30 авг', res: '1 : 1', mine: '2 : 1', label: 'Мимо', pts: '0', tone: 'grey' as const },
];
const tones = { green: [colors.successBg, 'successText'], blue: [colors.blue10, 'blue600'], grey: [colors.surfaceSunken, 'text2'] } as const;
const leaders = [
  ['1', 'Арман К.', '1 240'],
  ['2', 'Динара М.', '1 180'],
  ['3', 'Ержан Т.', '1 110'],
];
const card = { marginHorizontal: 20, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card };

function H2({ children }: { children: string }) {
  return (
    <Text display size={24} lineHeight={28} style={{ marginHorizontal: 20, marginTop: 8, marginBottom: -4 }}>
      {children}
    </Text>
  );
}

function Stepper({ value, onChange, label, disabled }: { value: number; onChange: (v: number) => void; label: string; disabled: boolean }) {
  const b = (dir: 1 | -1) => {
    const off = disabled || (dir < 0 ? value <= 0 : value >= 9);
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${dir > 0 ? 'больше' : 'меньше'}`} disabled={off} onPress={() => onChange(value + dir)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: off ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={dir > 0 ? 'add-01' : 'remove-01'} size={18} color={off ? 'rgba(255,255,255,0.35)' : 'surface'} weight={2.4} />
      </Pressable>
    );
  };
  return (
    <View accessibilityLabel={`${label}: ${value}`} style={{ alignItems: 'center', gap: 6 }}>
      {b(1)}
      <Text display size={48} lineHeight={50} color="surface">
        {String(value)}
      </Text>
      {b(-1)}
    </View>
  );
}

function Club({ src, name, w }: { src: number; name: string; w: number }) {
  return (
    <View style={{ width: 80, alignItems: 'center', gap: 6 }}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={src} style={{ width: w, height: 40 }} contentFit="contain" />
      </View>
      <Text size={14} weight={700} color="surface">
        {name}
      </Text>
    </View>
  );
}

/** Результаты матчей: рейтинг прогнозиста, прогноз на ближайший матч (+50 за точный счёт, +10 за исход), итоги туров, лидеры. */
export default function Predictions() {
  const [h, setH] = useState(2);
  const [a, setA] = useState(1);
  const [saved, setSaved] = useState(false);
  const outcome = h > a ? 0 : h === a ? 1 : 2;
  const outcomes = ['Победа ORDA', 'Ничья', 'Победа гостей'];

  return (
    <Screen gap={16} header={<NavBar title="Результаты матчей" />}>
      <Gradient style={{ marginHorizontal: 20, padding: 18, gap: 14, borderRadius: 24, overflow: 'hidden' }}>
        <Text display size={96} lineHeight={83} align="right" color="rgba(255,255,255,0.08)" style={{ position: 'absolute', right: -6, top: -8 }} aria-hidden>
          {'PRO\nGNOZ'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Image source={img.icon3dResults} style={{ width: 52, height: 52 }} contentFit="contain" />
          <View style={{ gap: 2 }}>
            <Text size={13} color="onDark2">
              Ваши прогнозы · сезон 2026
            </Text>
            <Text display size={26} lineHeight={28} color="surface">
              128 место из 4 120
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {[
            ['12', 'прогнозов'],
            ['4', 'точных'],
            ['260', 'баллов'],
          ].map(([v, l]) => (
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

      <H2>Ваш прогноз</H2>
      <View style={[card, { overflow: 'hidden' }]}>
        <Gradient colors={[colors.navy, colors.blue600]} style={{ padding: 16, gap: 14, overflow: 'hidden' }}>
          <Star w={14} fill={colors.sky} style={{ right: 22, top: 18 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text size={13} color="onDark2">
              Сб, 25 октября · 19:00
            </Text>
            <Text size={13} color="onDark2">
              Приём до начала матча
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Club src={img.crest} name="ORDA" w={34} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Stepper value={h} onChange={setH} label="Голы ORDA" disabled={saved} />
              <Text display size={32} lineHeight={34} color="surface">
                :
              </Text>
              <Stepper value={a} onChange={setA} label="Голы «Кайрата»" disabled={saved} />
            </View>
            <Club src={img.clubKairat} name="Кайрат" w={36} />
          </View>
        </Gradient>
        <View style={{ padding: 16, gap: 12 }}>
          <View accessibilityRole="radiogroup" accessibilityLabel="Исход" style={{ flexDirection: 'row', gap: 6 }}>
            {outcomes.map((o, i) => (
              <View key={o} accessibilityRole="radio" accessibilityState={{ checked: i === outcome }} style={{ flex: 1, height: 40, borderRadius: 12, backgroundColor: i === outcome ? colors.navy : colors.surfaceSunken, alignItems: 'center', justifyContent: 'center' }}>
                <Text size={14} weight={i === outcome ? 700 : 600} color={i === outcome ? 'surface' : 'text2'}>
                  {o}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            {['Точный счёт +50', 'Исход +10'].map((t) => (
              <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Image source={img.coin} style={{ width: 18, height: 18 }} contentFit="contain" />
                <Text size={13} color="text2">
                  {t}
                </Text>
              </View>
            ))}
          </View>
          {saved ? (
            <View style={{ gap: 8 }}>
              <View accessibilityLiveRegion="polite" style={{ paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.successBg, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="checkmark-circle-02" size={20} color="successText" weight={2} />
                <Text size={15} lineHeight={20} weight={700} color="successText" style={{ flex: 1 }}>
                  Прогноз {h} : {a} принят. Изменить можно до начала матча
                </Text>
              </View>
              <Pressable accessibilityRole="button" onPress={() => setSaved(false)} style={{ minHeight: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Text size={15} weight={700} color="blue600">
                  Изменить прогноз
                </Text>
              </Pressable>
            </View>
          ) : (
            <Button label="Сохранить прогноз" height={52} onPress={() => setSaved(true)} />
          )}
        </View>
      </View>

      <H2>Итоги туров</H2>
      <View style={[card, { paddingHorizontal: 16 }]}>
        {history.map((m) => {
          const [bg, fg] = tones[m.tone];
          return (
            <View key={m.rival} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.surfaceSunken }}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text size={16} weight={700}>
                  ORDA — {m.rival}
                </Text>
                <Text size={13} color="text2">
                  {m.date} · счёт {m.res} · ваш {m.mine}
                </Text>
              </View>
              <View style={{ height: 28, paddingHorizontal: 10, borderRadius: 14, backgroundColor: bg, justifyContent: 'center' }}>
                <Text size={13} lineHeight={15} weight={700} color={fg}>
                  {m.label} · {m.pts}
                </Text>
              </View>
            </View>
          );
        })}
        <Pressable accessibilityRole="link" onPress={() => router.push('/matches')} style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <Text size={15} weight={700} color="blue600">
            Все результаты
          </Text>
          <Icon name="arrow-right-01" size={18} color="blue600" weight={2} />
        </Pressable>
      </View>

      <H2>Лучшие прогнозисты</H2>
      <View style={[card, { paddingHorizontal: 16, paddingBottom: 4 }]}>
        {leaders.map(([n, name, pts]) => (
          <View key={n} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.surfaceSunken }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: n === '1' ? colors.blue : colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
              <Text display size={16} lineHeight={18} color={n === '1' ? 'surface' : 'blue600'}>
                {n}
              </Text>
            </View>
            <Text size={16} weight={600} style={{ flex: 1 }}>
              {name}
            </Text>
            <Text size={15} weight={700}>
              {pts}
            </Text>
          </View>
        ))}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8, marginHorizontal: -8, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 14, backgroundColor: colors.blue10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Text display size={14} lineHeight={16} color="blue600">
              128
            </Text>
          </View>
          <Text size={16} weight={700} style={{ flex: 1 }}>
            Вы
          </Text>
          <Text size={15} weight={700}>
            260
          </Text>
        </View>
      </View>
    </Screen>
  );
}
