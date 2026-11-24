import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Gradient, Icon, NavBar, Pressable, Screen, SectionHeader, Star, Text } from '@/components';
import { allThreads, forumCats, useSocial } from '@/data/social';
import { NewTopicButton, ThreadCard } from '@/features/social/ThreadCard';
import { Chip, FanAvatar } from '@/features/social/parts';
import { colors, shadows } from '@/theme';

const sorts = ['Горячее', 'Новые', 'Мои темы'] as const;

/** Форум болельщиков: разделы, матч-центр и обсуждения. */
export default function Forum() {
  const s = useSocial();
  const [sort, setSort] = useState<(typeof sorts)[number]>('Горячее');
  const all = allThreads(s);
  const list = sort === 'Мои темы' ? all.filter((t) => t.author === 'me') : sort === 'Новые' ? all.filter((t) => !t.pinned) : all.slice(0, 4);
  return (
    <View style={{ flex: 1 }}>
      <Screen gap={14} header={<NavBar title="Форум" />} footerHeight={70}>
        <View style={{ marginHorizontal: 20, borderRadius: 24, overflow: 'hidden' }}>
          <Gradient colors={[colors.navy, '#0B3A6B', colors.blue600]} style={{ paddingVertical: 20, paddingHorizontal: 18, gap: 10 }}>
            <Star w={150} fill="rgba(18,158,217,0.22)" style={{ right: -50, top: -40 }} />
            <Star w={18} fill="#FFFFFF" style={{ right: 90, top: 24 }} />
            <Text display size={30} lineHeight={30} upper color="surface" style={{ maxWidth: 240 }}>
              Трибуна онлайн
            </Text>
            <Text size={15} lineHeight={21} color="onDark2" style={{ maxWidth: 280 }}>
              Обсуждаем матчи, трансферы и всё, чем живёт фан-сектор
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <View style={{ flexDirection: 'row' }}>
                {['tim', 'aru', 'erl', 'sab'].map((id, i) => (
                  <View key={id} style={{ marginLeft: i ? -8 : 0, borderRadius: 16, borderWidth: 2, borderColor: colors.navy }}>
                    <FanAvatar id={id} size={28} online={false} />
                  </View>
                ))}
              </View>
              <Text size={13} color="onDark2">
                3 420 болельщиков · 128 онлайн
              </Text>
            </View>
          </Gradient>
        </View>

        <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/forum/thread/[id]', params: { id: 'best' } })} style={{ marginHorizontal: 20, borderRadius: 20, overflow: 'hidden' }}>
          <Gradient colors={[colors.navy, '#0B3A6B']} style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="live-streaming-01" size={24} color="surface" />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ height: 20, paddingHorizontal: 7, borderRadius: 6, backgroundColor: colors.red, justifyContent: 'center' }}>
                  <Text size={11} lineHeight={13} weight={700} color="surface">
                    LIVE 67′
                  </Text>
                </View>
                <Text size={12} color="#A9C6E3">
                  Матч-центр
                </Text>
              </View>
              <Text size={17} weight={700} color="surface">
                ORDA 1 : 0 Кайрат — обсуждаем
              </Text>
              <Text size={13} color="onDark2">
                236 сообщений · 128 онлайн
              </Text>
            </View>
            <Icon name="arrow-right-01" size={22} color="surface" />
          </Gradient>
        </Pressable>

        <SectionHeader title="Темы" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 }}>
          {forumCats.map((c) => (
            <Pressable key={c.id} accessibilityRole="link" onPress={() => router.push({ pathname: '/forum/[cat]', params: { cat: c.id } })} style={{ flexBasis: '46%', flexGrow: 1, padding: 14, borderRadius: 20, backgroundColor: colors.surface, gap: 10, ...shadows.card }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={c.icon} size={22} color={c.fg} />
                </View>
                {c.fresh ? (
                  <View style={{ height: 22, paddingHorizontal: 7, borderRadius: 11, backgroundColor: colors.blue, justifyContent: 'center' }}>
                    <Text size={12} lineHeight={14} weight={700} color="surface">
                      +{c.fresh}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={{ gap: 2 }}>
                <Text size={16} weight={700} lineHeight={20}>
                  {c.name}
                </Text>
                <Text size={13} color="text2">
                  {c.topics} тем
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <SectionHeader title="Обсуждения" />
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20 }}>
          {sorts.map((x) => (
            <Chip key={x} label={x} on={sort === x} onPress={() => setSort(x)} />
          ))}
        </View>
        <View style={{ gap: 12, paddingHorizontal: 20 }}>
          {list.length ? (
            list.map((t) => <ThreadCard key={t.id} t={t} />)
          ) : (
            <Text size={15} color="text2" align="center" style={{ paddingVertical: 20 }}>
              Вы ещё не создавали тем
            </Text>
          )}
        </View>
      </Screen>
      <NewTopicButton />
    </View>
  );
}
