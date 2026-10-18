import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Gradient, Icon, PlayCluster, Pressable, Progress, Text } from '@/components';
import { findVideo } from '@/data/media';
import { soon } from '@/data/nav';
import { share } from '@/data/share';
import { clock, parseClock, usePlayback } from '@/hooks/usePlayback';
import { colors } from '@/theme';

const chapters = [
  { label: 'Гол 1:0', at: 96 },
  { label: 'Гол 2:0', at: 318 },
  { label: 'Трибуны', at: 452 },
];

/** Видео на весь экран: тёмный плеер, верхняя панель (CC, качество, поделиться), главы, прогресс. */
export default function VideoFullscreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const portrait = height > width; // phone held upright: show the whole 16:9 frame instead of cropping
  const params = useLocalSearchParams<{ id?: string; t?: string }>();
  const v = findVideo(params.id ?? '');
  const dur = parseClock(v.duration);
  const pb = usePlayback(dur, Number(params.t ?? 214) || 0);
  const close = () => (router.canGoBack() ? router.back() : router.replace({ pathname: '/video/[id]', params: { id: v.id } }));
  const chip = (h: string, onPress: () => void, outline?: boolean) => (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ height: 32, paddingHorizontal: 10, borderRadius: 8, borderWidth: outline ? 1.5 : 0, borderColor: 'rgba(255,255,255,0.7)', backgroundColor: outline ? 'transparent' : 'rgba(255,255,255,0.14)', justifyContent: 'center' }}>
      <Text size={13} weight={700} color="surface">
        {h}
      </Text>
    </Pressable>
  );
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar style="light" />
      <Image source={v.cover} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentFit={portrait ? 'contain' : 'cover'} contentPosition={v.pos} />
      <Gradient colors={['rgba(10,18,36,0.75)', 'rgba(10,18,36,0)', 'rgba(10,18,36,0)', 'rgba(10,18,36,0.85)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

      <View style={{ position: 'absolute', left: 20, right: 20, top: insets.top + 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Выйти из полноэкранного режима" onPress={close} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow-down-01" size={22} color="surface" weight={2} />
        </Pressable>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text display size={20} upper color="surface" numberOfLines={1}>
            {v.title}
          </Text>
          <Text size={12} color="onDark2">
            ORDA TV · {v.topic === 'Обзоры' ? 'Обзор матча' : v.topic}
          </Text>
        </View>
        {chip('CC', soon('Субтитры'), true)}
        {chip('1080p', soon('Качество видео'))}
        <Pressable accessibilityRole="button" accessibilityLabel="Поделиться" onPress={share(`${v.title} — ORDA TV`)} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="share-08" size={20} color="surface" weight={1.8} />
        </Pressable>
      </View>

      <PlayCluster big playing={pb.playing} onToggle={pb.toggle} onBack={pb.back} onFwd={pb.fwd} />

      <View style={{ position: 'absolute', left: 20, right: 20, bottom: insets.bottom + 18, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {chapters.map((c, i) => {
            const cur = pb.t >= c.at && (i === chapters.length - 1 || pb.t < chapters[i + 1].at);
            return (
              <Pressable key={c.label} accessibilityRole="button" onPress={() => pb.seek(c.at)} style={{ height: 28, paddingHorizontal: 10, borderRadius: 14, backgroundColor: cur ? colors.blue : 'rgba(10,18,36,0.55)', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: cur ? colors.surface : colors.sky }} />
                <Text size={12} lineHeight={14} weight={700} color="surface">
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Progress pct={pb.pct} height={5} buffered={0.72} ticks={chapters.map((c) => c.at / dur)} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text size={13} weight={600} color="surface" style={{ fontVariant: ['tabular-nums'] }}>
            {clock(pb.t)} / {v.duration}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
            <Icon name="volume-up" size={20} color="surface" weight={1.8} />
            <Pressable accessibilityRole="button" accessibilityLabel="Настройки видео" onPress={soon('Настройки видео')}>
              <Icon name="settings-01" size={20} color="surface" weight={1.8} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Свернуть" onPress={close}>
              <Icon name="arrow-expand-01" size={20} color="surface" weight={1.8} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
