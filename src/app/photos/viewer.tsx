import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { DownloadShare, Icon, NavBar, Pressable, Screen, Text } from '@/components';
import { albumPhotos, findAlbum, photographer, PHOTO_OFFSET } from '@/data/media';
import { soon } from '@/data/nav';
import { share } from '@/data/share';
import { colors, radius, shadows } from '@/theme';

/** Просмотр фото: фото целиком (contain), стрелки по краям, подпись, лайк, лента превью. */
export default function PhotoViewer() {
  const params = useLocalSearchParams<{ album?: string; i?: string }>();
  const a = findAlbum(params.album ?? '');
  const [i, setI] = useState(Number(params.i ?? 0) || 0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const n = albumPhotos.length;
  const p = albumPhotos[i];
  const zone = (side: 'left' | 'right') => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={side === 'left' ? 'Предыдущее фото' : 'Следующее фото'}
      onPress={() => setI(side === 'left' ? (i - 1 + n) % n : (i + 1) % n)}
      style={{ position: 'absolute', top: 0, bottom: 0, [side]: 0, width: '30%', paddingHorizontal: 10, justifyContent: 'center', alignItems: side === 'left' ? 'flex-start' : 'flex-end' }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(23, 42, 81, 0.18)' }}>
        <Icon name={side === 'left' ? 'arrow-left-01' : 'arrow-right-01'} size={22} weight={2} />
      </View>
    </Pressable>
  );
  const on = !!liked[i];
  return (
    <Screen gap={14} header={<NavBar title={`${PHOTO_OFFSET + i} / ${a.count}`} action={{ icon: 'share-08', label: 'Поделиться', onPress: share(`${p.caption} — ${a.title}`) }} />}>
      <View style={{ marginHorizontal: 16, height: 440, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.surface, ...shadows.card }}>
        <Image source={p.src} accessibilityLabel={p.caption} style={{ flex: 1 }} contentFit="contain" transition={150} />
        {zone('left')}
        {zone('right')}
      </View>
      <View style={{ marginHorizontal: 20, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text size={17} weight={700} lineHeight={21}>
            {p.caption}
          </Text>
          <Text size={13} color="text2">
            {a.short} · {a.date.replace(' 2026', '')} · фото: {photographer}
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Нравится" accessibilityState={{ selected: on }} onPress={() => setLiked({ ...liked, [i]: !on })} style={{ height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: on ? colors.errorBg : colors.surface, flexDirection: 'row', alignItems: 'center', gap: 6, ...shadows.card }}>
          <Icon name="favourite" size={18} color={on ? colors.red : 'text'} filled={on} weight={1.8} />
          <Text size={14} weight={700}>
            {on ? 313 : 312}
          </Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {albumPhotos.map((x, k) => (
          <Pressable key={k} accessibilityRole="button" accessibilityLabel={`Фото ${k + 1}`} onPress={() => setI(k)} style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: k === i ? colors.blue : 'transparent', opacity: k === i ? 1 : 0.7, backgroundColor: colors.line }}>
            <Image source={x.src} style={{ flex: 1 }} contentFit="cover" />
          </Pressable>
        ))}
        <Pressable accessibilityRole="link" accessibilityLabel="Весь альбом" onPress={() => router.back()} style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: colors.chipBg, alignItems: 'center', justifyContent: 'center' }}>
          <Text size={13} weight={700}>
            +{a.count - n}
          </Text>
        </Pressable>
      </ScrollView>
      <DownloadShare onDownload={soon('Скачивание фото')} onShare={share(`${p.caption} — ${a.title}`)} />
    </Screen>
  );
}
