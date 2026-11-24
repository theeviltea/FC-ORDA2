import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Icon, NavBar, Pressable, Screen, Text } from '@/components';
import { allThreads, catOf, toggleSubscribe, useSocial } from '@/data/social';
import { NewTopicButton, ThreadCard } from '@/features/social/ThreadCard';
import { Chip } from '@/features/social/parts';
import { colors, shadows } from '@/theme';

const sorts = ['Новые', 'Популярные', 'Без ответа'] as const;

/** Раздел форума: описание, подписка и темы. */
export default function ForumCategory() {
  const { cat } = useLocalSearchParams<{ cat: string }>();
  const s = useSocial();
  const c = catOf(cat ?? '') ?? catOf('matches')!;
  const [sort, setSort] = useState<(typeof sorts)[number]>('Новые');
  const sub = !!s.subscribed[c.id];
  let list = allThreads(s).filter((t) => t.cat === c.id);
  if (sort === 'Популярные') list = [...list].sort((a, b) => b.likes - a.likes);
  if (sort === 'Без ответа') list = list.filter((t) => t.replies < 5);
  return (
    <View style={{ flex: 1 }}>
      <Screen gap={14} header={<NavBar title={c.name} />} footerHeight={70}>
        <View style={{ marginHorizontal: 20, padding: 16, borderRadius: 22, backgroundColor: colors.surface, gap: 12, ...shadows.card }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={c.icon} size={26} color={c.fg} />
            </View>
            <View style={{ flex: 1 }}>
              <Text display size={24} upper>
                {c.name}
              </Text>
              <Text size={13} color="text2">
                {c.topics} тем
              </Text>
            </View>
          </View>
          <Text size={15} lineHeight={21} color="#33415F">
            {c.about}
          </Text>
          <Pressable accessibilityRole="button" accessibilityState={{ selected: sub }} onPress={() => toggleSubscribe(c.id)} style={{ height: 44, borderRadius: 14, borderWidth: sub ? 0 : 1.5, borderColor: colors.line, backgroundColor: sub ? colors.blue10 : colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icon name="notification-01" size={18} color={sub ? 'blue600' : 'text'} weight={1.9} />
            <Text size={15} weight={700} color={sub ? 'blue600' : 'text'}>
              {sub ? 'Вы подписаны на новые темы' : 'Подписаться на раздел'}
            </Text>
          </Pressable>
        </View>
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
              Здесь пока нет тем — начните первую
            </Text>
          )}
        </View>
      </Screen>
      <NewTopicButton cat={c.id} />
    </View>
  );
}
