import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Card, NavBar, Pressable, Screen, Text } from '@/components';
import { soon } from '@/data/nav';
import { articles, type Topic } from '@/data/news';
import { colors, radius, shadows } from '@/theme';

const chips: { id: 'all' | Topic; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'match', label: 'Матчи' },
  { id: 'club', label: 'Клуб' },
  { id: 'team', label: 'Игроки' },
  { id: 'transfer', label: 'Трансферы' },
];

const open = (id: string) => () => router.push({ pathname: '/news/[id]', params: { id } });

/** Новости: темы, главная новость крупно и лента остальных. */
export default function News() {
  const [chip, setChip] = useState<'all' | Topic>('all');
  const [top, ...rest] = articles;
  const list = chip === 'all' ? rest : articles.filter((a) => a.topic === chip);
  return (
    <Screen gap={16} header={<NavBar title="Новости" action={{ icon: 'search-01', label: 'Поиск', onPress: soon('Поиск') }} />}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityRole="tablist" accessibilityLabel="Темы" contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {chips.map((c) => {
          const on = c.id === chip;
          return (
            <Pressable key={c.id} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setChip(c.id)} style={{ height: 44, paddingHorizontal: 18, borderRadius: 22, backgroundColor: on ? colors.navy : colors.chipBg, justifyContent: 'center' }}>
              <Text size={15} weight={on ? 700 : 500} color={on ? 'surface' : 'text'}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {chip === 'all' ? (
        <>
          <Text display size={24} lineHeight={28} style={{ marginHorizontal: 20, marginTop: 4 }}>
            Главное
          </Text>
          <Pressable accessibilityRole="link" onPress={open(top.id)} style={{ marginHorizontal: 20, borderRadius: 22, overflow: 'hidden', backgroundColor: colors.surface, ...shadows.card }}>
            <View style={{ height: 190, backgroundColor: colors.navy }}>
              <Image source={top.img} style={{ flex: 1 }} contentFit="cover" contentPosition={top.pos} />
              <View style={{ position: 'absolute', left: 12, top: 12, height: 22, paddingHorizontal: 9, borderRadius: 11, backgroundColor: colors.surface, justifyContent: 'center' }}>
                <Text size={12} lineHeight={14} weight={700}>
                  {top.tags[0]}
                </Text>
              </View>
            </View>
            <View style={{ paddingTop: 14, paddingHorizontal: 16, paddingBottom: 16, gap: 6 }}>
              <Text size={19} weight={700} lineHeight={23}>
                {top.title}
              </Text>
              <Text size={13} color="text2">
                {top.date}
              </Text>
            </View>
          </Pressable>
        </>
      ) : null}

      <Text display size={24} lineHeight={28} style={{ marginHorizontal: 20, marginTop: 8 }}>
        {chip === 'all' ? 'Все новости' : chips.find((c) => c.id === chip)?.label}
      </Text>
      <View style={{ gap: 10, paddingHorizontal: 20 }}>
        {list.length ? (
          list.map((n) => (
            <Pressable key={n.id} accessibilityRole="link" onPress={open(n.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 10, borderRadius: radius.l, backgroundColor: colors.surface, ...shadows.card }}>
              <Image source={n.img} style={{ width: 76, height: 76, borderRadius: 14 }} contentFit="cover" contentPosition={n.pos} />
              <View style={{ flex: 1, gap: 4 }}>
                <Text size={16} weight={700} lineHeight={20}>
                  {n.title}
                </Text>
                <Text size={13} color="text2">
                  {n.meta}
                </Text>
              </View>
            </Pressable>
          ))
        ) : (
          <Card style={{ padding: 20, alignItems: 'center' }}>
            <Text size={15} color="text2">
              В этой теме пока нет новостей
            </Text>
          </Card>
        )}
      </View>
    </Screen>
  );
}
