import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { DownloadShare, Gradient, Icon, NavBar, PhotoCount, Pressable, Screen, SectionHeader, Star, Text } from '@/components';
import { albumPhotos, albums, findAlbum, photographer, PHOTO_OFFSET } from '@/data/media';
import { soon } from '@/data/nav';
import { share } from '@/data/share';
import { colors, radius, shadows } from '@/theme';

/** Фотоальбом: заголовок, большое фото со стрелками, превью, «Скачать / Поделиться», другие фотоотчёты. */
export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = findAlbum(id ?? '');
  const [i, setI] = useState(0);
  const n = albumPhotos.length;
  const p = albumPhotos[i];
  const round = { position: 'absolute', top: '50%', marginTop: -22, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(23,42,81,0.6)', alignItems: 'center', justifyContent: 'center' } as const;
  const others = albums.filter((x) => x.id !== a.id).slice(0, 4);
  return (
    <Screen
      gap={14}
      header={<NavBar title="Фотоальбом" action={{ icon: 'share-08', label: 'Поделиться', onPress: share(`${a.title} — фотоотчёт ФК «Ордабасы»`) }} />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 500, right: -20 }} />
        </View>
      }>
      <View style={{ marginHorizontal: 20, marginTop: 4, gap: 6 }}>
        <Text display size={26} lineHeight={29} accessibilityRole="header">
          {a.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Text size={13} color="text2">
            {a.date} ·
          </Text>
          <Icon name="camera-01" size={14} color="text2" weight={1.6} />
          <Text size={13} color="text2">
            {a.count} фото · фотограф {photographer}
          </Text>
        </View>
      </View>

      <View style={{ marginHorizontal: 20, height: 420, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.navy }}>
        <Image source={p.src} accessibilityLabel={p.caption} style={{ flex: 1 }} contentFit="cover" contentPosition={{ left: '60%' }} transition={150} />
        <Gradient colors={['rgba(23,42,81,0)', 'rgba(23,42,81,0.8)']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 110 }} />
        <PhotoCount n={`${PHOTO_OFFSET + i} / ${a.count}`} style={{ left: 12, top: 12, right: undefined, bottom: undefined, height: 28, paddingHorizontal: 10, borderRadius: 14 }} />
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="На весь экран"
          onPress={() => router.push({ pathname: '/photos/viewer', params: { album: a.id, i: String(i) } })}
          style={{ position: 'absolute', right: 12, top: 12, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(23,42,81,0.72)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow-expand-01" size={18} color="surface" weight={1.8} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Предыдущее фото" onPress={() => setI((i - 1 + n) % n)} style={[round, { left: 12 }]}>
          <Icon name="arrow-left-01" size={22} color="surface" weight={2} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Следующее фото" onPress={() => setI((i + 1) % n)} style={[round, { right: 12 }]}>
          <Icon name="arrow-right-01" size={22} color="surface" weight={2} />
        </Pressable>
        <Text size={15} weight={600} color="surface" style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
          {p.caption}
        </Text>
      </View>

      <View style={{ marginHorizontal: 20, flexDirection: 'row', gap: 8 }}>
        {albumPhotos.map((x, k) => (
          <Pressable key={k} accessibilityRole="button" accessibilityLabel={`Фото ${k + 1}`} onPress={() => setI(k)} style={{ flex: 1, height: 60, borderRadius: 12, overflow: 'hidden', borderWidth: 2.5, borderColor: k === i ? colors.blue : 'transparent', backgroundColor: colors.navy }}>
            <Image source={x.src} style={{ flex: 1 }} contentFit="cover" contentPosition={{ left: '60%' }} />
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: 4 }}>
        <DownloadShare onDownload={soon('Скачивание фото')} onShare={share(`${p.caption} — ${a.title}`)} />
      </View>

      <View style={{ marginTop: 8 }}>
        <SectionHeader title="Другие фотоотчёты" link="Все" onPress={() => router.push('/photos')} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 4 }}>
        {others.map((o) => (
          <Pressable key={o.id} accessibilityRole="link" onPress={() => router.replace({ pathname: '/photos/[id]', params: { id: o.id } })} style={{ width: 160, borderRadius: radius.l, overflow: 'hidden', backgroundColor: colors.surface, ...shadows.card }}>
            <View style={{ height: 100 }}>
              <Image source={o.cover} style={{ flex: 1 }} contentFit="cover" contentPosition={o.pos} />
              <PhotoCount n={o.count} />
            </View>
            <Text size={14} weight={700} lineHeight={17} style={{ paddingTop: 8, paddingHorizontal: 10, paddingBottom: 10 }}>
              {o.short}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}
