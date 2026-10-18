import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ActionPill, Comment, CommentInput, Duration, Gradient, Icon, NavBar, PlayCluster, Pressable, Progress, Screen, SectionHeader, Text } from '@/components';
import { findVideo, videos } from '@/data/media';
import { soon } from '@/data/nav';
import { sampleComments, type CommentItem } from '@/data/news';
import { share } from '@/data/share';
import { fan } from '@/data/user';
import { clock, parseClock, usePlayback } from '@/hooks/usePlayback';
import { colors, shadows } from '@/theme';

/** Просмотр видео: плеер, заголовок и действия, описание, «Далее», комментарии и поле ввода. */
export default function VideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const v = findVideo(id ?? '');
  const dur = parseClock(v.duration);
  const pb = usePlayback(dur, Math.min(107, Math.floor(dur / 4)));
  const [liked, setLiked] = useState(false);
  const [mine, setMine] = useState<CommentItem[]>([]);
  const next = videos.filter((x) => x.id !== v.id).slice(0, 2);
  const shareIt = share(`${v.title} — ORDA TV`);
  return (
    <Screen
      gap={0}
      header={<NavBar title="ORDA TV" action={{ icon: 'share-08', label: 'Поделиться', onPress: shareIt }} />}
      footer={<CommentInput onSend={(text) => setMine([{ id: `m${mine.length}`, author: fan.name, initial: fan.name[0], time: 'Только что', text, likes: 0 }, ...mine])} />}
      footerHeight={60}>
      <View style={{ marginHorizontal: 16, height: 206, borderRadius: 20, overflow: 'hidden', backgroundColor: '#000', boxShadow: '0 12px 28px rgba(23, 42, 81, 0.18)' }}>
        <Image source={v.cover} style={{ flex: 1 }} contentFit="cover" contentPosition={v.pos} />
        <Gradient colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <Pressable accessibilityRole="button" accessibilityLabel="Настройки видео" onPress={soon('Настройки видео')} style={{ position: 'absolute', right: 10, top: 10, padding: 6 }}>
          <Icon name="settings-01" size={20} color="surface" weight={1.8} />
        </Pressable>
        <PlayCluster playing={pb.playing} onToggle={pb.toggle} onBack={pb.back} onFwd={pb.fwd} />
        <View style={{ position: 'absolute', left: 14, right: 14, bottom: 10, gap: 8 }}>
          <Progress pct={pb.pct} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text size={12} weight={600} color="surface" style={{ fontVariant: ['tabular-nums'] }}>
              {clock(pb.t)} / {v.duration}
            </Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Icon name="volume-up" size={18} color="surface" weight={1.8} />
              <Pressable accessibilityRole="link" accessibilityLabel="На весь экран" onPress={() => router.push({ pathname: '/video/fullscreen', params: { id: v.id, t: String(pb.t) } })}>
                <Icon name="arrow-expand-01" size={18} color="surface" weight={1.8} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <View style={{ paddingTop: 18, paddingHorizontal: 20, gap: 16 }}>
        <View style={{ gap: 8 }}>
          <View style={{ alignSelf: 'flex-start', height: 24, paddingHorizontal: 10, borderRadius: 12, backgroundColor: colors.blue10, justifyContent: 'center' }}>
            <Text size={12} lineHeight={14} weight={700} color="blue600">
              {v.topic === 'Обзоры' ? 'Обзор матча' : v.topic}
            </Text>
          </View>
          <Text display size={26} lineHeight={29} accessibilityRole="header">
            {v.title}
          </Text>
          <Text size={13} color="text2">
            {v.meta} · {v.views}
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 6 }}>
          <ActionPill icon="favourite" label={liked ? '1 241' : '1 240'} active={liked} onPress={() => setLiked(!liked)} />
          <ActionPill icon="message-01" label={String(12 + mine.length)} />
          <ActionPill icon="share-08" label="Поделиться" onPress={shareIt} />
          <ActionPill icon="download-04" label="Скачать" onPress={soon('Скачивание видео')} />
        </ScrollView>
        <View style={{ paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, backgroundColor: colors.surface, ...shadows.card }}>
          <Text size={15} lineHeight={22}>
            {v.description ?? `${v.title}. Смотрите в ORDA TV.`}
          </Text>
        </View>
      </View>

      <View style={{ paddingTop: 22, gap: 14 }}>
        <SectionHeader title="Далее" link="Все" onPress={() => router.push('/videos')} />
        {next.map((x) => (
          <Pressable key={x.id} accessibilityRole="link" onPress={() => router.replace({ pathname: '/video/[id]', params: { id: x.id } })} style={{ marginHorizontal: 20, flexDirection: 'row', gap: 12 }}>
            <View style={{ width: 150, height: 86, borderRadius: 12, overflow: 'hidden', ...shadows.card }}>
              <Image source={x.cover} style={{ flex: 1 }} contentFit="cover" contentPosition={x.pos} />
              <Duration>{x.duration}</Duration>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text size={15} weight={700} lineHeight={19}>
                {x.title}
              </Text>
              <Text size={12} color="text2">
                {x.meta} · {x.views.replace(' просмотров', '')}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View accessibilityLabel="Комментарии" style={{ paddingTop: 22, paddingHorizontal: 20, paddingBottom: 12, gap: 10 }}>
        <Text display size={24} lineHeight={28} style={{ marginBottom: 4 }}>
          Комментарии ({12 + mine.length})
        </Text>
        {[...mine, ...sampleComments.slice(0, 3)].map((c) => (
          <Comment key={c.id} c={c} />
        ))}
      </View>
    </Screen>
  );
}
