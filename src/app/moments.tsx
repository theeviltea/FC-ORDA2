import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ActionPill, Gradient, Icon, NavBar, Pressable, Screen, Text } from '@/components';
import { moments } from '@/data/media';
import { share } from '@/data/share';
import { colors, radius } from '@/theme';

const STEP = 50; // ms
const LENGTH = 6000; // each moment plays 6 s in the prototype

/** Моменты: вертикальные ролики как сторис — сегменты прогресса, тап слева/справа, лайк, переход к обзору. */
export default function Moments() {
  const params = useLocalSearchParams<{ i?: string }>();
  const [pos, setPos] = useState({ i: Number(params.i ?? 0) || 0, elapsed: 0 });
  const { i, elapsed } = pos;
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const n = moments.length;
  const m = moments[i];
  const go = (k: number) => setPos({ i: ((k % n) + n) % n, elapsed: 0 });
  useEffect(() => {
    const t = setInterval(() => setPos((p) => (p.elapsed + STEP >= LENGTH ? { i: (p.i + 1) % n, elapsed: 0 } : { ...p, elapsed: p.elapsed + STEP })), STEP);
    return () => clearInterval(t);
  }, [n]);
  const on = !!liked[i];
  const views = Number(m.views.replace('K', ''));
  return (
    <Screen gap={12} header={<NavBar title="Моменты" action={{ icon: 'share-08', label: 'Поделиться', onPress: share(`${m.title} — моменты ORDA TV`) }} />}>
      <View style={{ marginHorizontal: 16, flexDirection: 'row', gap: 4 }}>
        {moments.map((x, k) => (
          <View key={x.title} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line, overflow: 'hidden' }}>
            <View style={{ width: `${k < i ? 100 : k === i ? Math.min(100, (elapsed / LENGTH) * 100) : 0}%`, height: 4, backgroundColor: colors.blue }} />
          </View>
        ))}
      </View>
      <View style={{ marginHorizontal: 16, height: 520, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.navy, boxShadow: '0 12px 28px rgba(23, 42, 81, 0.18)' }}>
        <Image source={m.cover} accessibilityLabel={m.title} style={{ flex: 1 }} contentFit="cover" transition={150} />
        <Gradient colors={['rgba(23,42,81,0)', 'rgba(23,42,81,0.85)']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 200 }} />
        <Pressable accessibilityRole="button" accessibilityLabel="Предыдущий момент" onPress={() => go(Math.max(0, i - 1))} style={{ position: 'absolute', left: 0, top: 0, bottom: 140, width: '45%', cursor: 'default' } as object} />
        <Pressable accessibilityRole="button" accessibilityLabel="Следующий момент" onPress={() => go(i + 1)} style={{ position: 'absolute', right: 0, top: 0, bottom: 140, width: '45%', cursor: 'default' } as object} />
        <View style={{ position: 'absolute', left: 12, top: 12, height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: colors.red, justifyContent: 'center' }}>
          <Text size={12} lineHeight={14} weight={700} color="surface">
            Ордабасы — Кайрат
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 12, top: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(23,42,81,0.55)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="volume-up" size={18} color="surface" weight={1.8} />
        </View>
        <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16, gap: 6 }} pointerEvents="none">
          <Text display size={26} lineHeight={27} upper color="surface">
            {m.title}
          </Text>
          <Text size={13} color="onDark2">
            {m.views} просмотров · {m.length}
          </Text>
        </View>
      </View>
      <View style={{ marginHorizontal: 16, flexDirection: 'row', gap: 8 }}>
        <ActionPill grow icon="favourite" label={on ? `${(views + 0.1).toFixed(1)}K` : m.views} active={on} onPress={() => setLiked({ ...liked, [i]: !on })} />
        <ActionPill grow icon="message-01" label="214" />
        <ActionPill grow icon="share-08" label="Поделиться" onPress={share(`${m.title} — моменты ORDA TV`)} />
      </View>
      <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/video/[id]', params: { id: 'kairat' } })} style={{ marginHorizontal: 16, height: 52, borderRadius: 16, backgroundColor: colors.blue10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Icon name="play" size={18} color="blue600" filled />
        <Text size={16} weight={700} color="blue600">
          Смотреть обзор матча
        </Text>
      </Pressable>
    </Screen>
  );
}
