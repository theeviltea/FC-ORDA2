import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, GameSheet, Icon, NavBar, Pressable, Screen, SectionHeader, Text } from '@/components';
import { fans, friendsOf, useSocial, type ChatMsg } from '@/data/social';
import { AiBadgeBall, FanAvatar, Hint } from '@/features/social/parts';
import { colors, shadows } from '@/theme';

const preview = (m?: ChatMsg) => (!m ? 'Напишите первым' : m.photo ? `📷 ${m.text || 'Фото'}` : m.match ? `⚽ Матч · ${m.text}` : m.text);

/** Сообщения: ИИ-помощник сверху, ниже переписки с друзьями. `?view=empty` — пустой список. */
export default function Chats() {
  const s = useSocial();
  const { view } = useLocalSearchParams<{ view?: string }>();
  const [pick, setPick] = useState(false);
  const friends = friendsOf(s);
  const list = view === 'empty' ? [] : fans.filter((f) => s.chats[f.id]?.length && friends.some((x) => x.id === f.id));
  const order = ['aru', 'tim', 'erl', 'sab', 'mad', 'dan'];
  list.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  return (
    <Screen gap={14} header={<NavBar title="Сообщения" action={{ icon: 'message-add-01', label: 'Новое сообщение', onPress: () => setPick(true) }} />}>
      <Pressable accessibilityRole="link" onPress={() => router.push('/ai')} style={{ marginHorizontal: 20, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.blue10, borderWidth: 1, borderColor: '#CDE9F6', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <AiBadgeBall size={52} />
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text size={16} weight={700}>
              ORDA AI
            </Text>
            <View style={{ height: 18, paddingHorizontal: 6, borderRadius: 5, backgroundColor: colors.blue600, justifyContent: 'center' }}>
              <Text size={10} lineHeight={12} weight={700} color="surface">
                ИИ
              </Text>
            </View>
          </View>
          <Text size={14} color="text2" numberOfLines={1}>
            Спросите про матч с «Кайратом» 👋
          </Text>
        </View>
        <Icon name="pin" size={18} color="text3" />
      </Pressable>

      {list.length ? (
        <>
          <SectionHeader title="Друзья" />
          <View style={{ marginHorizontal: 20, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.surface, ...shadows.card }}>
            {list.map((f, i) => {
              const msgs = s.chats[f.id];
              const last = msgs[msgs.length - 1];
              const unread = s.unread[f.id] ?? 0;
              const typing = f.id === 'aru' && last && last.me && last.status !== 'read';
              return (
                <Pressable key={f.id} accessibilityRole="link" accessibilityLabel={`${f.name}${unread ? `, ${unread} непрочитанных` : ''}`} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: f.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 76, paddingVertical: 10, borderBottomWidth: i === list.length - 1 ? 0 : 1, borderColor: colors.surfaceSunken }}>
                  <FanAvatar id={f.id} size={52} />
                  <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                    <Text size={16} weight={unread ? 700 : 600} numberOfLines={1}>
                      {f.name}
                    </Text>
                    <Text size={14} color={typing ? 'blue600' : unread ? 'text' : 'text2'} weight={typing ? 700 : 400} numberOfLines={1}>
                      {typing ? 'печатает…' : `${last?.me ? 'Вы: ' : ''}${preview(last)}`}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      {last?.me && last.status === 'read' ? <Icon name="tick-double-02" size={16} color="blue" weight={2} /> : null}
                      <Text size={12} color={unread ? 'blue' : 'text3'}>
                        {last?.time}
                      </Text>
                    </View>
                    {unread ? (
                      <View style={{ minWidth: 22, height: 22, paddingHorizontal: 6, borderRadius: 11, backgroundColor: f.id === 'dan' ? colors.text3 : colors.blue, alignItems: 'center', justifyContent: 'center' }}>
                        <Text size={12} lineHeight={14} weight={700} color="surface">
                          {unread}
                        </Text>
                      </View>
                    ) : (
                      <View style={{ height: 22 }} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Hint icon="square-lock-01" text="Переписка видна только вам и другу. Пожаловаться можно из меню чата." />
        </>
      ) : (
        <View style={{ marginTop: 30, marginHorizontal: 28, alignItems: 'center', gap: 12 }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.card }}>
            <Icon name="bubble-chat" size={42} color="text3" weight={1.6} />
          </View>
          <Text display size={24} upper>
            Пока тихо
          </Text>
          <Text size={15} lineHeight={22} color="text2" align="center">
            Здесь будут переписки с друзьями. Добавьте знакомых болельщиков — и договаривайтесь о матчах прямо в ORDA.
          </Text>
          <Button label="Найти друзей" icon="user-round-search" onPress={() => router.push({ pathname: '/friends', params: { tab: 'find' } })} style={{ paddingHorizontal: 22 }} />
        </View>
      )}

      <GameSheet visible={pick} onClose={() => setPick(false)} title="Новое сообщение" text={`Друзья · ${friends.length}`}>
        <View>
          {friends.slice(0, 5).map((f, i) => (
            <Pressable
              key={f.id}
              accessibilityRole="link"
              onPress={() => {
                setPick(false);
                router.push({ pathname: '/chat/[id]', params: { id: f.id } });
              }}
              style={{ minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: i === Math.min(5, friends.length) - 1 ? 0 : 1, borderColor: colors.surfaceSunken }}>
              <FanAvatar id={f.id} size={44} />
              <View>
                <Text size={16} weight={700}>
                  {f.name}
                </Text>
                <Text size={13} color="text2">
                  {f.seen}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Icon name="information-circle" size={18} color="text3" />
          <Text size={13} lineHeight={18} color="text2" style={{ flex: 1 }}>
            Писать можно только друзьям. Других болельщиков добавьте через «Друзья → Поиск».
          </Text>
        </View>
      </GameSheet>
    </Screen>
  );
}
