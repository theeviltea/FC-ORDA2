import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Icon, Pressable, Text } from '@/components';
import { img } from '@/data/images';
import { findFan, useSocial, type Thread } from '@/data/social';
import { colors, shadows } from '@/theme';

import { CatChip, FanAvatar, Reactions } from './parts';

/** Карточка темы форума в списке. */
export function ThreadCard({ t }: { t: Thread }) {
  const s = useSocial();
  const liked = !!s.likes[t.id];
  const who = t.author === 'club' ? 'ФК «Ордабасы»' : t.author === 'me' ? 'Вы' : (findFan(t.author)?.short ?? '');
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => router.push({ pathname: '/forum/thread/[id]', params: { id: t.id } })}
      style={{ paddingVertical: 14, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.surface, borderWidth: t.pinned ? 1.5 : 0, borderColor: '#B8E2F4', gap: 10, ...shadows.card }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <CatChip cat={t.cat} />
        <View style={{ flex: 1 }} />
        {t.pinned ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="pin" size={14} color="text2" />
            <Text size={12} weight={700} color="text2">
              Закреплено
            </Text>
          </View>
        ) : t.hot ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Icon name="fire" size={14} color="errorText" weight={2} />
            <Text size={12} weight={700} color="errorText">
              Горячее
            </Text>
          </View>
        ) : t.author === 'me' ? (
          <Text size={12} weight={700} color="#8A5A00">
            На проверке
          </Text>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text size={17} weight={700} lineHeight={22}>
            {t.title}
          </Text>
          <Text size={14} lineHeight={19} color="text2" numberOfLines={2}>
            {t.text}
          </Text>
        </View>
        {t.photo ? <Image source={img.newsHuddle} style={{ width: 72, height: 72, borderRadius: 14 }} contentFit="cover" /> : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <FanAvatar id={t.author} size={22} online={false} />
        <Text size={13} color="text2">
          {who} · {t.time}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 10, borderTopWidth: 1, borderColor: colors.surfaceSunken }}>
        <Reactions items={t.reactions} mine={s.myReactions[t.id]} small />
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="favourite" size={16} color={liked ? 'red' : 'text2'} filled={liked} />
          <Text size={13} weight={700} color="text2">
            {t.likes + (liked ? 1 : 0)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 8 }}>
          <Icon name="bubble-chat" size={16} color="text2" />
          <Text size={13} weight={700} color="text2">
            {t.replies + (s.myReplies[t.id]?.length ?? 0)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/** Кнопка «Новая тема» внизу экрана. */
export function NewTopicButton({ cat }: { cat?: string }) {
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 28, alignItems: 'center' }}>
      <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/forum/new', params: cat ? { cat } : {} })} style={{ height: 52, paddingHorizontal: 22, borderRadius: 26, backgroundColor: colors.blue600, flexDirection: 'row', alignItems: 'center', gap: 8, boxShadow: '0 10px 24px rgba(11, 125, 176, 0.4)' }}>
        <Icon name="edit-02" size={20} color="surface" weight={2} />
        <Text size={16} weight={700} color="surface">
          Новая тема
        </Text>
      </Pressable>
    </View>
  );
}
