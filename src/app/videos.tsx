import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ChipRow, Duration, Gradient, Icon, NavBar, PlayBadge, Pressable, Screen, SectionHeader, Text } from '@/components';
import { img } from '@/data/images';
import { continueWatching, findVideo, moments, videos } from '@/data/media';
import { soon } from '@/data/nav';
import { colors, radius, shadows } from '@/theme';

const topics = ['Все', 'Обзоры', 'Интервью', 'Тренировки', 'Клуб'];
const play = (id: string) => () => router.push({ pathname: '/video/[id]', params: { id } });

/** ORDA TV: премьера, темы, «Продолжить просмотр», вертикальные моменты и лента всех видео. */
export default function Videos() {
  const [c, setC] = useState(0);
  const [hero, ...rest] = videos;
  const list = c === 0 ? rest.slice(0, 3) : videos.filter((v) => v.topic === topics[c]);
  return (
    <Screen gap={18} header={<NavBar title="ORDA TV" action={{ icon: 'search-01', label: 'Поиск', onPress: soon('Поиск') }} />}>
      <Pressable accessibilityRole="link" accessibilityLabel={`Смотреть: ${hero.title}`} onPress={play(hero.id)} style={{ marginHorizontal: 20, height: 380, borderRadius: radius.xl, overflow: 'hidden', boxShadow: '0 12px 28px rgba(23, 42, 81, 0.18)' }}>
        <Image source={hero.cover} style={{ flex: 1 }} contentFit="cover" contentPosition={hero.pos} />
        <Gradient colors={['rgba(15,29,58,0.1)', 'rgba(15,29,58,0.2)', 'rgba(15,29,58,0.95)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View style={{ position: 'absolute', left: 14, top: 14, height: 24, paddingHorizontal: 10, borderRadius: 6, backgroundColor: colors.red, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.surface }} />
          <Text size={12} lineHeight={14} weight={700} color="surface">
            Премьера
          </Text>
        </View>
        <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16, gap: 10 }}>
          <Text size={13} color="onDark2">
            Обзор матча · {hero.meta.replace(' 2026', '')} · {hero.views}
          </Text>
          <Text display size={28} lineHeight={30} color="surface">
            {hero.title}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ height: 48, paddingHorizontal: 20, borderRadius: 14, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="play" size={18} filled />
              <Text size={16} weight={700}>
                Смотреть · {hero.duration}
              </Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Смотреть позже" onPress={soon('Смотреть позже')} style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="add-01" size={22} color="surface" weight={1.8} />
            </Pressable>
          </View>
        </View>
      </Pressable>

      <ChipRow items={topics} value={c} onChange={setC} tone="grey" />

      {c === 0 ? (
        <>
          <SectionHeader title="Продолжить просмотр" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {continueWatching.map((w) => {
              const v = findVideo(w.id);
              return (
                <Pressable key={w.id} accessibilityRole="link" onPress={play(v.id)} style={{ width: 220, gap: 8 }}>
                  <View style={{ height: 124, borderRadius: 14, overflow: 'hidden', ...shadows.card }}>
                    <Image source={v.cover} style={{ flex: 1 }} contentFit="cover" contentPosition={v.pos} />
                    <PlayBadge size={38} />
                    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, backgroundColor: 'rgba(255,255,255,0.25)' }}>
                      <View style={{ width: `${w.progress * 100}%`, height: 4, backgroundColor: colors.blue }} />
                    </View>
                    <Duration bottom={12}>{w.left}</Duration>
                  </View>
                  <Text size={14} weight={700} lineHeight={17}>
                    {v.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <SectionHeader title="Моменты" link="Все" onPress={() => router.push({ pathname: '/moments', params: { i: '0' } })} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
            {moments.map((m, i) => (
              <Pressable key={m.title} accessibilityRole="link" accessibilityLabel={m.title} onPress={() => router.push({ pathname: '/moments', params: { i: String(i) } })} style={{ width: 132, height: 234, borderRadius: 16, overflow: 'hidden' }}>
                <Image source={m.cover} style={{ flex: 1 }} contentFit="cover" contentPosition={{ top: '30%' }} />
                <Gradient colors={['rgba(15,29,58,0)', 'rgba(15,29,58,0.9)']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 110 }} />
                <View style={{ position: 'absolute', left: 10, top: 10, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="play" size={12} color="surface" />
                  <Text size={12} lineHeight={14} weight={700} color="surface">
                    {m.views}
                  </Text>
                </View>
                <Text size={13} lineHeight={16} weight={700} color="surface" style={{ position: 'absolute', left: 10, right: 10, bottom: 10 }}>
                  {m.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : null}

      <SectionHeader title={c === 0 ? 'Все видео' : topics[c]} />
      <View style={{ marginHorizontal: 20, gap: 22 }}>
        {list.length ? (
          list.map((v) => (
            <Pressable key={v.id} accessibilityRole="link" onPress={play(v.id)} style={{ gap: 10 }}>
              <View style={{ height: 196, borderRadius: 18, overflow: 'hidden' }}>
                <Image source={v.cover} style={{ flex: 1 }} contentFit="cover" contentPosition={v.pos} />
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.12)' }} />
                <PlayBadge />
                <Duration>{v.duration}</Duration>
              </View>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.avatar }}>
                  <Image source={img.crest} style={{ width: 21, height: 26 }} contentFit="contain" />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <Text size={16} weight={700} lineHeight={20}>
                    {v.title}
                  </Text>
                  <Text size={13} color="text2">
                    {v.topic} · {v.meta} · {v.views}
                  </Text>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel="Ещё" onPress={soon('Действия с видео')} style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="more-vertical" size={20} color="text2" weight={1.8} />
                </Pressable>
              </View>
            </Pressable>
          ))
        ) : (
          <Text size={15} color="text2" align="center" style={{ paddingVertical: 20 }}>
            В этой теме пока нет видео
          </Text>
        )}
      </View>
    </Screen>
  );
}
