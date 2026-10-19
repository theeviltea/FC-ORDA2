import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { Gradient, Icon, Pressable, Star, Text } from '@/components';
import { colors } from '@/theme';

const R = 108;
const C = 2 * Math.PI * R;
const rivals = [
  { name: 'Север', db: 91 },
  { name: 'Запад', db: 84 },
  { name: 'Восток', db: 77 },
];

/** Шумомер: громкость сектора в дБ, рейтинг трибун. Прототип: измерение имитируется, микрофон не используется. */
export default function Noise() {
  const insets = useSafeAreaInsets();
  const [on, setOn] = useState(false);
  const [db, setDb] = useState(92);
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setDb((d) => Math.max(84, Math.min(104, Math.round(d + (Math.random() * 8 - 3.6))))), 450);
    return () => clearInterval(t);
  }, [on]);
  const rows = [{ name: 'Юг · фан', db, me: true }, ...rivals.map((r) => ({ ...r, me: false }))].sort((a, b) => b.db - a.db);
  const lead = rows[0].me;
  const pct = Math.min(1, Math.max(0, (db - 40) / 70));

  return (
    <Gradient colors={[colors.navy, '#0B3A6B']} style={{ flex: 1, overflow: 'hidden' }}>
      <Star w={260} fill="rgba(255,255,255,0.06)" style={{ right: -110, top: 260 }} />
      <View style={{ paddingTop: insets.top + 8, height: insets.top + 56, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Назад" onPress={() => (router.canGoBack() ? router.back() : router.replace('/interactive'))} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow-left-01" size={24} color="surface" weight={2} />
        </Pressable>
        <Text display size={20} upper color="surface">
          Шумомер
        </Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={{ flex: 1, gap: 18, paddingTop: 10 }}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <View style={{ height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: colors.red, justifyContent: 'center' }}>
            <Text size={12} lineHeight={14} weight={700} color="surface">
              Идёт сейчас · 67′
            </Text>
          </View>
          <View style={{ width: 250, height: 250, marginTop: 8 }} accessibilityLabel={`Громкость вашего сектора ${db} децибел`} accessibilityLiveRegion="polite">
            <Svg width={250} height={250} viewBox="0 0 250 250">
              <Circle cx={125} cy={125} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={18} />
              <Circle cx={125} cy={125} r={R} fill="none" stroke={colors.red} strokeWidth={18} strokeLinecap="round" strokeDasharray={`${C * pct} ${C}`} transform="rotate(-90 125 125)" />
            </Svg>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Text display size={80} lineHeight={76} color="surface">
                {String(db)}
              </Text>
              <Text size={15} color="onDark2">
                децибел
              </Text>
            </View>
          </View>
          <Text size={16} weight={700} color="surface">
            {lead ? 'Ваш сектор лидирует!' : 'Громче! Север впереди'}
          </Text>
        </View>
        <View style={{ marginHorizontal: 20, padding: 16, gap: 14, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <Text size={12} weight={700} upper color="onDark2" style={{ letterSpacing: 1 }}>
            Рейтинг трибун
          </Text>
          {rows.map((r) => (
            <View key={r.name} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text size={15} weight={r.me ? 700 : 500} color="surface">
                  {r.name}
                  {r.me ? (
                    <Text size={15} weight={700} color="sky">
                      {' · Ваш сектор'}
                    </Text>
                  ) : null}
                </Text>
                <Text display size={18} lineHeight={20} color="surface">
                  {r.db} дБ
                </Text>
              </View>
              <View style={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                <View style={{ width: `${r.db - 10}%`, height: 10, borderRadius: 5, backgroundColor: r.me ? colors.red : colors.blue }} />
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={{ marginHorizontal: 20, marginBottom: Math.max(insets.bottom, 12) + 16, gap: 10 }}>
        <Pressable accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => setOn(!on)} style={{ height: 52, borderRadius: 16, backgroundColor: on ? 'rgba(255,255,255,0.14)' : colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon name="mic-01" size={20} color={on ? 'surface' : 'text'} weight={1.8} />
          <Text size={17} weight={700} color={on ? 'surface' : 'text'}>
            {on ? 'Остановить' : 'Слушать трибуну'}
          </Text>
        </Pressable>
        <Text size={13} lineHeight={18} color="onDark2" align="center">
          Нужен доступ к микрофону. Мы измеряем только громкость и ничего не записываем. В прототипе значения имитируются.
        </Text>
      </View>
    </Gradient>
  );
}
