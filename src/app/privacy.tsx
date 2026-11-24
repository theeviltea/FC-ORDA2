import { useState } from 'react';
import { View } from 'react-native';

import { ListCard, NavBar, Pressable, Screen, SectionHeader, Star, Switch, Text } from '@/components';
import { colors, shadows } from '@/theme';

const who = [
  { id: 'all', title: 'Все болельщики', sub: '' },
  { id: 'fof', title: 'Друзья друзей', sub: 'Только если есть общие друзья' },
  { id: 'none', title: 'Никто', sub: 'Добавлять буду я сам' },
];

/** Приватность: поиск, статус «в сети», кто может отправлять заявки, чёрный список. Писать могут только друзья. */
export default function Privacy() {
  const [on, setOn] = useState({ search: true, online: true, stats: true });
  const [req, setReq] = useState('all');
  return (
    <Screen gap={12} header={<NavBar title="Приватность" />} decor={<Star w={80} style={{ top: 560, right: -20 }} />}>
      <Text size={15} lineHeight={21} color="text2" style={{ marginHorizontal: 20, marginTop: 4 }}>
        Решите, кто видит ваш профиль и может предлагать дружбу. Писать вам могут только друзья.
      </Text>
      <View style={{ gap: 12, marginTop: 8 }}>
        <SectionHeader title="Профиль" />
        <ListCard
          rows={[
            { title: 'Показывать меня в поиске', sub: 'По имени и ORDA ID', right: <Switch label="Показывать меня в поиске" value={on.search} onChange={(v) => setOn({ ...on, search: v })} /> },
            { title: 'Показывать, что я в сети', sub: 'Друзья видят зелёную точку', right: <Switch label="Показывать, что я в сети" value={on.online} onChange={(v) => setOn({ ...on, online: v })} /> },
            { title: 'Баллы и достижения', sub: 'Видны всем болельщикам', right: <Switch label="Баллы и достижения" value={on.stats} onChange={(v) => setOn({ ...on, stats: v })} /> },
          ]}
        />
      </View>
      <View style={{ gap: 12, marginTop: 8 }}>
        <SectionHeader title="Заявки в друзья" />
        <View accessibilityRole="radiogroup" style={{ marginHorizontal: 20, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.surface, ...shadows.card }}>
          {who.map((w, i) => {
            const sel = req === w.id;
            return (
              <Pressable key={w.id} accessibilityRole="radio" accessibilityState={{ checked: sel }} onPress={() => setReq(w.id)} style={{ minHeight: 56, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: i === who.length - 1 ? 0 : 1, borderColor: colors.surfaceSunken }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: sel ? colors.blue : '#B8C6DA', alignItems: 'center', justifyContent: 'center' }}>{sel ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue }} /> : null}</View>
                <View style={{ flex: 1 }}>
                  <Text size={16} weight={sel ? 700 : 500}>
                    {w.title}
                  </Text>
                  {w.sub ? (
                    <Text size={13} color="text2">
                      {w.sub}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={{ gap: 12, marginTop: 8 }}>
        <SectionHeader title="Чёрный список" />
        <ListCard rows={[{ icon: 'blocked', title: 'Заблокированные · 1', sub: 'Не могут писать, видеть профиль и отвечать вам на форуме' }]} />
      </View>
    </Screen>
  );
}
