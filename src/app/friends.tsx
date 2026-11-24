import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Share, TextInput, View } from 'react-native';

import { Button, Gradient, Icon, NavBar, Pressable, Screen, SectionHeader, SegmentedTabs, Star, Text } from '@/components';
import { fans, friendsOf, incomingOf, outgoingOf, relOf, setRel, useSocial, type Fan } from '@/data/social';
import { FanAvatar, FanCard, Hint, Points } from '@/features/social/parts';
import { bodyFamily, colors, shadows } from '@/theme';

const tabs = ['friends', 'requests', 'find'] as const;

function Search({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ marginHorizontal: 20, height: 50, paddingLeft: 14, paddingRight: 8, borderRadius: 16, backgroundColor: colors.surface, borderWidth: focus ? 1.5 : 1, borderColor: focus ? colors.blue : colors.line, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Icon name="search-01" size={20} color="text2" />
      <TextInput
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.text3}
        accessibilityLabel={placeholder}
        style={[{ flex: 1, fontFamily: bodyFamily[400], fontSize: 16, color: colors.navy }, { outlineStyle: 'none' } as object]}
      />
      {value ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Очистить" onPress={() => onChange('')} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.line, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="cancel-01" size={16} color="text2" weight={2} />
        </Pressable>
      ) : null}
    </View>
  );
}

function Row({ f, right, sub, last }: { f: Fan; right?: React.ReactNode; sub?: string; last?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 72, paddingVertical: 10, borderBottomWidth: last ? 0 : 1, borderColor: colors.surfaceSunken }}>
      <Pressable accessibilityRole="link" accessibilityLabel={f.name} onPress={() => router.push({ pathname: '/fan/[id]', params: { id: f.id } })} style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <FanAvatar id={f.id} size={48} />
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text size={16} weight={700} numberOfLines={1}>
            {f.name}
          </Text>
          <Text size={13} color="text2" numberOfLines={1}>
            {sub ?? `${f.online ? 'В сети' : f.seen[0].toUpperCase() + f.seen.slice(1)} · ${f.sector}`}
          </Text>
        </View>
      </Pressable>
      {right}
    </View>
  );
}

const card = { marginHorizontal: 20, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.surface, ...shadows.card } as const;

function Request({ f }: { f: Fan }) {
  const s = useSocial();
  const rel = relOf(s, f.id);
  const [declined, setDeclined] = useState(false);
  return (
    <View style={{ marginHorizontal: 20, padding: 14, borderRadius: 20, backgroundColor: colors.surface, gap: 12, ...shadows.card }}>
      <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/fan/[id]', params: { id: f.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <FanAvatar id={f.id} size={56} />
        <View style={{ flex: 1, gap: 3 }}>
          <Text size={17} weight={700}>
            {f.name}
          </Text>
          <Points id={f.id} />
          <Text size={13} color="text2">
            {f.mutual} {f.mutual === 1 ? 'общий друг' : 'общих друга'} · {f.sector}
          </Text>
        </View>
      </Pressable>
      {rel === 'friend' ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 8, paddingLeft: 12, borderRadius: 14, backgroundColor: colors.successBg }}>
          <Icon name="checkmark-circle-02" size={18} color="successText" />
          <Text size={15} weight={700} color="successText" style={{ flex: 1 }}>
            Теперь вы друзья
          </Text>
          <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/chat/[id]', params: { id: f.id } })} style={{ height: 36, paddingHorizontal: 12, borderRadius: 10, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Icon name="message-01" size={16} color="blue600" weight={2} />
            <Text size={14} weight={700} color="blue600">
              Написать
            </Text>
          </Pressable>
        </View>
      ) : declined ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8, paddingLeft: 12, borderRadius: 14, backgroundColor: colors.bg }}>
          <Text size={15} color="text2" style={{ flex: 1 }}>
            Заявка отклонена
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setDeclined(false);
              setRel(f.id, 'incoming');
            }}
            style={{ height: 36, paddingHorizontal: 12, justifyContent: 'center' }}>
            <Text size={14} weight={700} color="blue600">
              Отменить
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button label="Принять" icon="user-round-check" height={44} onPress={() => setRel(f.id, 'friend')} style={{ flex: 1 }} />
          <Button
            label="Отклонить"
            variant="muted"
            height={44}
            onPress={() => {
              setDeclined(true);
              setRel(f.id, 'none');
            }}
            style={{ flex: 1 }}
          />
        </View>
      )}
    </View>
  );
}

/** Друзья: список, заявки и поиск болельщиков. */
export default function Friends() {
  const s = useSocial();
  const { tab: initial } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState(Math.max(0, tabs.indexOf((initial ?? 'friends') as (typeof tabs)[number])));
  const [q, setQ] = useState('');
  const [find, setFind] = useState('');
  const friends = friendsOf(s);
  const incoming = incomingOf(s);
  const [handled] = useState(() => new Set(incoming.map((f) => f.id)));
  const requests = fans.filter((f) => handled.has(f.id) || relOf(s, f.id) === 'incoming');
  const outgoing = outgoingOf(s);
  const shown = friends.filter((f) => f.name.toLowerCase().includes(q.trim().toLowerCase()));
  const online = friends.filter((f) => f.online);
  const found = find.trim() ? fans.filter((f) => f.name.toLowerCase().includes(find.trim().toLowerCase()) || f.ordaId.replace(' ', '').includes(find.replace(/\s/g, ''))) : [];
  const suggest = fans.filter((f) => relOf(s, f.id) !== 'friend').slice(0, 4);

  return (
    <Screen gap={14} header={<NavBar title="Друзья" />} decor={<Star w={80} fill={colors.star} style={{ top: 620, right: -20 }} />}>
      <SegmentedTabs labels={['Друзья', 'Заявки', 'Поиск']} counts={[0, incoming.length, 0]} active={tab} onChange={setTab} label="Раздел друзей" />

      {tab === 0 ? (
        <>
          <Search value={q} onChange={setQ} placeholder="Поиск среди друзей" />
          {!q && online.length ? (
            <>
              <SectionHeader title={`Сейчас в сети · ${online.length}`} />
              <View style={{ flexDirection: 'row', gap: 14, paddingHorizontal: 20 }}>
                {online.map((f) => (
                  <Pressable key={f.id} accessibilityRole="link" onPress={() => router.push({ pathname: '/chat/[id]', params: { id: f.id } })} style={{ width: 64, alignItems: 'center', gap: 6 }}>
                    <FanAvatar id={f.id} size={60} ring={colors.bg} />
                    <Text size={13} weight={600} numberOfLines={1}>
                      {f.name.split(' ')[0]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}
          <SectionHeader title={`Все друзья · ${friends.length}`} />
          {shown.length ? (
            <View style={card}>
              {shown.map((f, i) => (
                <Row
                  key={f.id}
                  f={f}
                  last={i === shown.length - 1}
                  right={
                    <Pressable accessibilityRole="link" accessibilityLabel={`Написать ${f.name}`} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: f.id } })} style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="message-01" size={20} color="blue600" />
                    </Pressable>
                  }
                />
              ))}
            </View>
          ) : (
            <Text size={15} color="text2" align="center" style={{ marginHorizontal: 20 }}>
              Среди друзей никого с таким именем
            </Text>
          )}
          <View style={{ marginHorizontal: 20, borderRadius: 22, overflow: 'hidden' }}>
            <Gradient colors={[colors.navy, '#0B3A6B', colors.blue600]} style={{ padding: 18, gap: 8 }}>
              <Star w={120} fill="rgba(18,158,217,0.25)" style={{ right: -36, top: -30 }} />
              <Text display size={24} upper color="surface">
                Болеть вместе веселее
              </Text>
              <Text size={15} lineHeight={21} color="onDark2" style={{ maxWidth: 270 }}>
                Позовите друга в ORDA — получите +100 баллов, когда он зарегистрируется
              </Text>
              <Pressable accessibilityRole="button" onPress={() => Share.share({ message: 'Болеем за ORDA вместе! Скачай приложение клуба: https://ordabasy.kz/app' }).catch(() => undefined)} style={{ alignSelf: 'flex-start', marginTop: 4, height: 44, paddingHorizontal: 16, borderRadius: 14, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="share-08" size={18} />
                <Text size={15} weight={700}>
                  Пригласить друга
                </Text>
              </Pressable>
            </Gradient>
          </View>
        </>
      ) : null}

      {tab === 1 ? (
        <>
          <SectionHeader title={`Входящие · ${incoming.length}`} />
          {requests.length ? (
            requests.map((f) => <Request key={f.id} f={f} />)
          ) : (
            <Text size={15} color="text2" style={{ marginHorizontal: 20 }}>
              Новых заявок нет
            </Text>
          )}
          {outgoing.length ? (
            <>
              <SectionHeader title={`Исходящие · ${outgoing.length}`} />
              <View style={card}>
                {outgoing.map((f, i) => (
                  <Row
                    key={f.id}
                    f={f}
                    sub="Заявка отправлена"
                    last={i === outgoing.length - 1}
                    right={
                      <Pressable accessibilityRole="button" onPress={() => setRel(f.id, 'none')} style={{ height: 36, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, borderColor: colors.line, justifyContent: 'center' }}>
                        <Text size={14} weight={700} color="text2">
                          Отменить
                        </Text>
                      </Pressable>
                    }
                  />
                ))}
              </View>
            </>
          ) : null}
          <Hint text="Заявка ждёт ответа 30 дней. Писать друг другу можно после того, как её примут." />
        </>
      ) : null}

      {tab === 2 ? (
        <>
          <Search value={find} onChange={setFind} placeholder="Имя, фамилия или ORDA ID" />
          {find.trim() ? (
            found.length ? (
              <>
                <Text size={14} color="text2" style={{ marginHorizontal: 20 }}>
                  Найдено: {found.length}
                </Text>
                <View style={card}>
                  {found.map((f, i) => {
                    const rel = relOf(s, f.id);
                    return (
                      <Row
                        key={f.id}
                        f={f}
                        sub={`Ур. ${f.level} · ${f.mutual ? `${f.mutual} общ. друзей` : f.sector}`}
                        last={i === found.length - 1}
                        right={
                          rel === 'friend' ? (
                            <View style={{ height: 32, paddingHorizontal: 10, borderRadius: 10, backgroundColor: colors.successBg, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <Icon name="tick-02" size={14} color="successText" weight={2.4} />
                              <Text size={13} weight={700} color="successText">
                                Друг
                              </Text>
                            </View>
                          ) : rel === 'sent' ? (
                            <Icon name="clock-01" size={20} color="text3" />
                          ) : (
                            <Pressable accessibilityRole="button" accessibilityLabel="Добавить в друзья" onPress={() => setRel(f.id, rel === 'incoming' ? 'friend' : 'sent')} style={{ height: 40, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.blue600, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                              <Icon name="user-round-plus" size={17} color="surface" weight={2} />
                              <Text size={14} weight={700} color="surface">
                                {rel === 'incoming' ? 'Принять' : 'Добавить'}
                              </Text>
                            </Pressable>
                          )
                        }
                      />
                    );
                  })}
                </View>
                <Hint text="Ищем по имени, фамилии и ORDA ID. Болельщики, скрывшие профиль из поиска, здесь не показываются." />
              </>
            ) : (
              <View style={{ marginTop: 30, marginHorizontal: 28, alignItems: 'center', gap: 12 }}>
                <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.card }}>
                  <Icon name="user-round-search" size={42} color="text3" weight={1.6} />
                </View>
                <Text display size={24} upper>
                  Никого не нашли
                </Text>
                <Text size={15} lineHeight={22} color="text2" align="center">
                  Проверьте имя или поищите по ORDA ID — он есть в профиле друга. Может, друга ещё нет в приложении?
                </Text>
                <Button label="Пригласить в ORDA" icon="share-08" onPress={() => Share.share({ message: 'Болеем за ORDA вместе! https://ordabasy.kz/app' }).catch(() => undefined)} style={{ paddingHorizontal: 22 }} />
              </View>
            )
          ) : (
            <>
              <SectionHeader title="Возможно, вы знакомы" />
              <Text size={14} color="text2" style={{ marginHorizontal: 20, marginTop: -10 }}>
                Общие друзья и ваш сектор на стадионе
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 }}>
                {suggest.map((f) => (
                  <FanCard key={f.id} id={f.id} />
                ))}
              </View>
              <SectionHeader title="Топ болельщиков недели" />
              <View style={card}>
                {(['tim', 'erl', 'sab'] as const).map((id, i) => {
                  const f = fans.find((x) => x.id === id)!;
                  return (
                    <Row
                      key={id}
                      f={f}
                      sub={`${i + 1} место · ур. ${f.level} · ${f.sector}`}
                      last={i === 2}
                      right={
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text display size={20}>
                            +{[420, 365, 310][i]}
                          </Text>
                          <Text size={12} color="text3">
                            за неделю
                          </Text>
                        </View>
                      }
                    />
                  );
                })}
              </View>
            </>
          )}
        </>
      ) : null}
    </Screen>
  );
}
