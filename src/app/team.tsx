import { router } from 'expo-router';
import { useRef } from 'react';
import { ScrollView, View } from 'react-native';

import { Icon, NavBar, PlayerCard, Pressable, Screen, Text } from '@/components';
import { soon } from '@/data/nav';
import { groups, players } from '@/data/team';
import { colors, shadows } from '@/theme';

const plural = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? 'игрок' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'игрока' : 'игроков');

/** Команда: сезон, быстрые переходы по линиям, карточки игроков, тренерский штаб и персонал. */
export default function Team() {
  const scroll = useRef<ScrollView>(null);
  const offsets = useRef<Record<string, number>>({});
  const jump = (id: string) => scroll.current?.scrollTo({ y: Math.max(0, (offsets.current[id] ?? 0) - 8), animated: true });
  return (
    <Screen gap={16} scrollRef={scroll} header={<NavBar title="Команда" action={{ icon: 'search-01', label: 'Поиск', onPress: soon('Поиск') }} />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <Pressable accessibilityRole="button" onPress={soon('Выбор сезона')} style={{ height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.navy, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text size={14} weight={700} color="surface">
            Сезон 2026
          </Text>
          <Icon name="arrow-down-01" size={18} color="surface" weight={2} />
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.blue }} />
          <Text size={14} color="text2">
            {players.length} {plural(players.length)} в заявке
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityLabel="Разделы команды" contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 4 }}>
        {groups.map((g) => (
          <Pressable key={g.id} accessibilityRole="link" onPress={() => jump(g.id)} style={{ height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 6, ...shadows.card }}>
            <Text size={14} weight={600}>
              {g.title}
            </Text>
            <Text size={12} weight={700} color="blue600">
              {g.people.length}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {groups.map((g) => (
        <View key={g.id} onLayout={(e) => (offsets.current[g.id] = e.nativeEvent.layout.y)} style={{ gap: 12, paddingHorizontal: 20, marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Text display size={24} lineHeight={28}>
              {g.title}
            </Text>
            <Text size={14} color="text2">
              {g.people.length}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {g.people.map((p) => (
              <View key={p.name} style={{ width: '47.5%', flexGrow: 1, maxWidth: '48.5%' }}>
                <PlayerCard person={p} width="100%" onPress={g.staff ? undefined : () => router.push({ pathname: '/player/[num]', params: { num: p.num } })} />
              </View>
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}
