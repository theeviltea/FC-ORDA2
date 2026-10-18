import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Share, View } from 'react-native';

import { Card, Gradient, Icon, NavBar, Pressable, Screen, Star, Text } from '@/components';
import { img } from '@/data/images';
import { soon } from '@/data/nav';
import { people } from '@/data/people';
import { findPlayer, players, profiles } from '@/data/team';
import { colors, radius, shadows } from '@/theme';

function Title({ children, action }: { children: string; action?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginHorizontal: 20 }}>
      <Text display size={24} lineHeight={28}>
        {children}
      </Text>
      {action ? (
        <Pressable accessibilityRole="button" onPress={soon('Выбор сезона')} style={{ height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.navy, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text size={14} weight={700} color="surface">
            Сезон 2026
          </Text>
          <Icon name="arrow-down-01" size={18} color="surface" weight={2} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** Профиль игрока: крупная карточка с фото и номером, факты, биография, статистика сезона, награды. */
export default function PlayerScreen() {
  const { num } = useLocalSearchParams<{ num: string }>();
  const p = findPlayer(num ?? '10') ?? players[0];
  const prof = profiles[p.num];
  const photo = people[p.who];
  const ph = 560;
  const [first, ...last] = p.name.split(' ');
  const share = () => {
    Share.share({ message: `${p.name}, №${p.num} — ФК «Ордабасы»` }).catch(() => undefined);
  };
  const facts: [string, string][] = prof?.facts ?? [
    ['Номер', p.num],
    ['Амплуа', p.role],
  ];

  return (
    <Screen gap={16} header={<NavBar title="Профиль игрока" action={{ icon: 'share-08', label: 'Поделиться', onPress: share }} />}>
      <Gradient style={{ marginHorizontal: 20, height: 400, borderRadius: radius.xl, overflow: 'hidden', ...shadows.raised }}>
        <Text display size={150} lineHeight={129} color="rgba(255,255,255,0.08)" style={{ position: 'absolute', left: 12, top: -6 }} aria-hidden>
          {`${p.num}\n${p.num}`}
        </Text>
        <Star w={40} h={66} fill={colors.bg} style={{ left: -20, top: 150 }} />
        <Star w={18} fill={colors.surface} style={{ left: prof?.national ? 200 : 128, top: 26 }} />
        <Star w={12} fill={colors.sky} style={{ right: 24, top: 70 }} />
        <Image source={photo.src} style={{ position: 'absolute', right: -18, top: 22, height: ph, width: ph * photo.ratio }} />
        <Gradient colors={['rgba(23,42,81,0)', 'rgba(23,42,81,0.82)', colors.navy]} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 200 }} />

        <View style={{ position: 'absolute', left: 18, top: 18, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={img.crest} accessibilityLabel="ORDA" style={{ width: 22, height: 27 }} contentFit="contain" />
          </View>
          {prof?.national ? (
            <View style={{ height: 24, paddingHorizontal: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.16)', justifyContent: 'center' }}>
              <Text size={12} lineHeight={14} weight={700} color="surface">
                {prof.national}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={{ position: 'absolute', left: 18, right: 18, bottom: prof ? 96 : 20, gap: 6 }}>
          <Text display size={64} lineHeight={58} color="surface">
            {p.num}
          </Text>
          <Text display size={32} lineHeight={32} upper color="surface" accessibilityRole="header" style={{ maxWidth: 220 }}>
            {`${first}\n${last.join(' ')}`}
          </Text>
          <Text size={15} color="onDark2">
            {prof?.position ?? p.role}
          </Text>
        </View>

        {prof ? (
          <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12, flexDirection: 'row', gap: 6 }}>
            {prof.tiles.map(([v, l]) => (
              <View key={l} style={{ flex: 1, height: 68, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Text display size={26} lineHeight={26} color="surface">
                  {v}
                </Text>
                <Text size={12} color="onDark2">
                  {l}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </Gradient>

      <Card style={{ marginHorizontal: 20, paddingVertical: 6, paddingHorizontal: 18 }}>
        {facts.map(([k, v], i) => (
          <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: i < facts.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken }}>
            <Text size={15} color="text2">
              {k}
            </Text>
            <Text size={15} weight={700}>
              {v}
            </Text>
          </View>
        ))}
      </Card>

      {prof ? (
        <>
          <Title>Биография</Title>
          <Card style={{ marginHorizontal: 20, padding: 18, gap: 10 }}>
            {prof.bio.map((b) => (
              <Text key={b.slice(0, 20)} size={15} lineHeight={22}>
                {b}
              </Text>
            ))}
          </Card>

          <Title action>Статистика игрока</Title>
          <Card style={{ marginHorizontal: 20, padding: 18, gap: 14 }}>
            {prof.stats.map((s) => (
              <View key={s.label} style={{ gap: 6 }}>
                <Text size={14} color="text2">
                  {s.label}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.blue10, overflow: 'hidden' }}>
                    <View style={{ width: `${s.w * 100}%`, height: 10, borderRadius: 5, backgroundColor: colors.blue }} />
                  </View>
                  <Text display size={18} align="right" style={{ minWidth: 52 }}>
                    {s.value}
                  </Text>
                </View>
              </View>
            ))}
          </Card>

          <Title>Награды</Title>
          <Card style={{ marginHorizontal: 20, paddingVertical: 4, paddingHorizontal: 18 }}>
            {prof.awards.map((a, i) => (
              <View key={a.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: i < prof.awards.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="champion" size={22} color="blue" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text size={16} weight={700}>
                    {a.title}
                  </Text>
                  <Text size={13} color="text2">
                    {a.meta}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </>
      ) : (
        <Card style={{ marginHorizontal: 20, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="information-circle" size={22} color="blue600" />
          <Text size={14} lineHeight={20} color="text2" style={{ flex: 1 }}>
            Биография, статистика и награды появятся, когда подключим данные клуба.
          </Text>
        </Card>
      )}
    </Screen>
  );
}
