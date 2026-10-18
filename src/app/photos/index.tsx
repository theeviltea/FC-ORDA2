import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ChipRow, NavBar, PhotoCount, Pressable, Screen, Star, Text } from '@/components';
import { albums, type Album } from '@/data/media';
import { soon } from '@/data/nav';
import { colors, radius, shadows } from '@/theme';

const topics: (Album['topic'] | null)[] = [null, 'match', 'training', 'event', 'club'];
const open = (id: string) => () => router.push({ pathname: '/photos/[id]', params: { id } });

/** Фото: темы, свежий фотоотчёт крупно и сетка всех фотоотчётов. */
export default function Photos() {
  const [c, setC] = useState(0);
  const topic = topics[c];
  const [fresh, ...rest] = albums;
  const list = topic ? albums.filter((a) => a.topic === topic) : rest;
  return (
    <Screen
      gap={12}
      header={<NavBar title="Фото" action={{ icon: 'search-01', label: 'Поиск', onPress: soon('Поиск') }} />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 500, right: -20 }} />
          <Star w={44} style={{ top: 920, left: 12 }} />
        </View>
      }>
      <ChipRow items={['Все', 'Матчи', 'Тренировки', 'События', 'Клуб']} value={c} onChange={setC} />

      {!topic ? (
        <>
          <Text display size={24} lineHeight={28} style={{ marginHorizontal: 20, marginTop: 6 }}>
            Свежий фотоотчёт
          </Text>
          <Pressable accessibilityRole="link" onPress={open(fresh.id)} style={{ marginHorizontal: 20, borderRadius: radius.l, overflow: 'hidden', backgroundColor: colors.surface, ...shadows.card }}>
            <View style={{ height: 210 }}>
              <Image source={fresh.cover} style={{ flex: 1 }} contentFit="cover" contentPosition={fresh.pos} />
              <PhotoCount n={fresh.count} />
              <View style={{ position: 'absolute', left: 10, top: 10, height: 24, paddingHorizontal: 10, borderRadius: 12, backgroundColor: colors.surface, justifyContent: 'center' }}>
                <Text size={12} lineHeight={14} weight={700}>
                  Новое
                </Text>
              </View>
            </View>
            <View style={{ paddingTop: 14, paddingHorizontal: 16, paddingBottom: 16, gap: 6 }}>
              <Text display size={21} lineHeight={24}>
                {fresh.title}
              </Text>
              <Text size={13} color="text2">
                {fresh.date} · {fresh.count} фото
              </Text>
            </View>
          </Pressable>
        </>
      ) : null}

      <Text display size={24} lineHeight={28} style={{ marginHorizontal: 20, marginTop: 10 }}>
        Все фотоотчёты
      </Text>
      <View style={{ marginHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {list.map((a) => (
          <Pressable key={a.id} accessibilityRole="link" onPress={open(a.id)} style={{ width: '47.5%', flexGrow: 1, maxWidth: '48.5%', borderRadius: radius.l, overflow: 'hidden', backgroundColor: colors.surface, ...shadows.card }}>
            <View style={{ height: 120 }}>
              <Image source={a.cover} style={{ flex: 1 }} contentFit="cover" contentPosition={a.pos} />
              <PhotoCount n={a.count} />
            </View>
            <View style={{ paddingTop: 10, paddingHorizontal: 12, paddingBottom: 12, gap: 4 }}>
              <Text size={15} weight={700} lineHeight={18}>
                {a.title}
              </Text>
              <Text size={12} color="text2">
                {a.date}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
