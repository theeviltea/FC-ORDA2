import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Icon, NavBar, Pressable, Screen, Star, Text, type IconName } from '@/components';
import { findBroadcast } from '@/data/broadcasts';
import { img } from '@/data/images';
import { findFan, relOf, setRel, useSocial } from '@/data/social';
import { FanAvatar } from '@/features/social/parts';
import { colors, radius, shadows } from '@/theme';

type Kind = 'match' | 'club' | 'shop' | 'social';
type Note = { id: string; today: boolean; kind: Kind; icon?: IconName; coin?: boolean; crest?: boolean; title: string; text: string; meta: string; to: Href; live?: boolean; readInit?: boolean; fan?: string };

/** Рассылка клуба без привязки к разделу → экран сообщения. */
const message = (id: string, today: boolean, meta: string, readInit?: boolean): Note => {
  const b = findBroadcast(id)!;
  return { id, today, kind: 'club', crest: true, title: b.title, text: b.preview, meta: `${meta} · ФК «Ордабасы»`, to: { pathname: '/message/[id]', params: { id } }, readInit };
};

const all: Note[] = [
  message('champions', true, '2 мин назад'),
  { id: 'msg', today: true, kind: 'social', fan: 'tim', title: 'Тимур Абдрахманов', text: 'Встречаемся у входа «Юг» в 18:00?', meta: '10 мин назад · Сообщения', to: { pathname: '/chat/[id]', params: { id: 'tim' } } },
  { id: 'forum', today: true, kind: 'social', icon: 'bubble-chat', title: 'Ерлан ответил в вашей теме', text: '«Кто был лучшим на поле…»: Эвертон, без вариантов. Гол и ассист…', meta: '1 час назад · Форум', to: { pathname: '/forum/thread/[id]', params: { id: 'best' } } },
  { id: 'live', today: true, kind: 'match', icon: 'live-streaming-01', title: 'Трансляция уже началась', text: 'Кубок страны, 1/4 финала. Смотрите матч в ORDA TV', meta: 'Сейчас · Матчи', to: { pathname: '/video/[id]', params: { id: 'kairat' } }, live: true },
  { id: 'goal', today: true, kind: 'match', icon: 'football', title: 'Гол! ORDA 1 : 0', text: '23′ — открываем счёт ударом с линии штрафной', meta: '12 мин назад · Матчи', to: '/matches' },
  { id: 'tickets', today: true, kind: 'match', icon: 'ticket-01', title: 'Продажа билетов открыта', text: 'Матч с «Кайратом», 25 октября. Фан-сектор уже доступен', meta: '18 мин назад · Билеты', to: '/tickets' },
  { id: 'points', today: true, kind: 'club', coin: true, title: '+80 баллов за викторину', text: '«Чемпионский сезон»: 8 из 10 правильных ответов', meta: '1 час назад · Фан-зона', to: '/achievements' },
  { id: 'interview', today: true, kind: 'club', icon: 'news-01', title: 'Большое интервью с капитаном', text: 'О первом круге, болельщиках и целях сезона', meta: '2 часа назад · Статьи и интервью', to: { pathname: '/story/[id]', params: { id: 'captain' } } },
  { id: 'order', today: false, kind: 'shop', icon: 'delivery-truck-01', title: 'Заказ № 1048 в пути', text: 'Курьер привезёт домашнюю джерси завтра с 10:00 до 14:00', meta: 'Вчера, 19:42 · Магазин', to: '/orders', readInit: true },
  { id: 'promo', today: false, kind: 'shop', icon: 'discount-tag-01', title: 'Скидка 15% на форму', text: 'Промокод ORDA15 действует до 31 октября', meta: '22 октября · Для вас', to: { pathname: '/offer/[id]', params: { id: 'kit' } }, readInit: true },
  { id: 'accepted', today: false, kind: 'social', fan: 'sab', title: 'Сабина Ергали приняла заявку', text: 'Теперь вы друзья — напишите первым', meta: 'Вчера, 21:10 · Друзья', to: { pathname: '/chat/[id]', params: { id: 'sab' } }, readInit: true },
  message('stadium-closed', false, 'Вчера, 17:05', true),
  { id: 'contest', today: false, kind: 'club', icon: 'champion', title: 'Итоги конкурса плакатов', text: 'Победитель объявлен — посмотрите лучшие работы', meta: '20 октября · Конкурсы', to: { pathname: '/contest/winners', params: { id: 'poster' } }, readInit: true },
];

const chips: { id: 'all' | Kind; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'social', label: 'Друзья' },
  { id: 'match', label: 'Матчи' },
  { id: 'club', label: 'Клуб' },
  { id: 'shop', label: 'Магазин' },
];

/** Лента уведомлений: фильтры с числом непрочитанных, «Прочитать все», группы «Сегодня / Ранее». */
export default function Inbox() {
  const [chip, setChip] = useState<'all' | Kind>('all');
  const [read, setRead] = useState<Record<string, boolean>>({});
  const isRead = (n: Note) => read[n.id] ?? !!n.readInit;
  const unreadIn = (k: 'all' | Kind) => all.filter((n) => (k === 'all' || n.kind === k) && !isRead(n)).length;
  const vis = all.filter((n) => chip === 'all' || n.kind === chip);
  const unread = unreadIn('all');

  const card = (n: Note) => {
    const r = isRead(n);
    return (
      <Pressable
        key={n.id}
        accessibilityRole="link"
        accessibilityLabel={`${r ? '' : 'Новое. '}${n.title}`}
        onPress={() => {
          setRead({ ...read, [n.id]: true });
          router.push(n.to);
        }}
        style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 14, paddingRight: 14, paddingLeft: 16, borderRadius: radius.l, overflow: 'hidden', backgroundColor: colors.surface, ...shadows.card }}>
        {!r ? <View style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: colors.blue }} /> : null}
        <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: n.crest ? colors.surface : n.live ? colors.errorBg : r ? colors.bg : colors.blue10, borderWidth: n.crest ? 1 : 0, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }}>
          {n.fan ? <FanAvatar id={n.fan} size={44} online={false} /> : n.crest ? <Image source={img.crest} style={{ width: 25, height: 30 }} contentFit="contain" /> : n.coin ? <Image source={img.coin} style={{ width: 30, height: 30 }} contentFit="contain" /> : <Icon name={n.icon!} size={22} color={n.live ? colors.red : r ? 'text2' : 'blue'} weight={1.7} />}
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <Text size={16} weight={r ? 500 : 700} lineHeight={20} style={{ flex: 1 }}>
              {n.title}
            </Text>
            {n.live ? (
              <View style={{ height: 20, paddingHorizontal: 7, borderRadius: 6, backgroundColor: colors.red, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.surface }} />
                <Text size={11} lineHeight={13} weight={700} color="surface">
                  LIVE
                </Text>
              </View>
            ) : !r ? (
              <View style={{ width: 8, height: 8, marginTop: 6, borderRadius: 4, backgroundColor: colors.blue }} />
            ) : null}
          </View>
          <Text size={14} lineHeight={19} color="text2">
            {n.text}
          </Text>
          <Text size={12} color="text3">
            {n.meta}
          </Text>
        </View>
      </Pressable>
    );
  };

  const group = (title: string, list: Note[]) =>
    list.length ? (
      <>
        <Text display size={22} style={{ marginHorizontal: 20, marginTop: 6, marginBottom: -4 }}>
          {title}
        </Text>
        <View style={{ gap: 10, paddingHorizontal: 20 }}>{list.map(card)}</View>
      </>
    ) : null;

  const today = vis.filter((n) => n.today);
  const earlier = vis.filter((n) => !n.today);

  return (
    <Screen
      gap={14}
      header={<NavBar title="Уведомления" action={{ icon: 'settings-01', label: 'Настройки уведомлений', onPress: () => router.push('/notification-settings') }} />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 560, right: -20 }} />
        </View>
      }>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityRole="tablist" contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {chips.map((c) => {
          const on = c.id === chip;
          const u = unreadIn(c.id);
          return (
            <Pressable key={c.id} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setChip(c.id)} style={{ height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: on ? colors.navy : colors.chipBg, justifyContent: 'center' }}>
              <Text size={14} weight={on ? 700 : 500} color={on ? 'surface' : 'text'}>
                {c.label + (u ? ` · ${u}` : '')}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <Text size={14} color="text2">
          {unread ? `${unread} непрочитанных` : 'Все прочитано'}
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={!unread}
          onPress={() => setRead(Object.fromEntries(all.map((n) => [n.id, true])))}
          style={{ minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="tick-02" size={16} color={unread ? 'blue600' : 'text3'} weight={2.2} />
          <Text size={14} weight={700} color={unread ? 'blue600' : 'text3'}>
            Прочитать все
          </Text>
        </Pressable>
      </View>
      {chip === 'all' || chip === 'social' ? <FriendRequest /> : null}
      {group('Сегодня', today)}
      {group('Ранее', earlier)}
      {!vis.length ? (
        <View style={{ marginTop: 30, marginHorizontal: 20, alignItems: 'center', gap: 12 }}>
          <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(23, 42, 81, 0.08)' }}>
            <Icon name="notification-01" size={36} color="text3" />
          </View>
          <Text size={17} weight={700}>
            Здесь пока пусто
          </Text>
          <Text size={14} color="text2">
            В этой категории нет уведомлений
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}

/** Заявка в друзья прямо в ленте: принять или отклонить без перехода. */
function FriendRequest() {
  const s = useSocial();
  const f = findFan('nur')!;
  const rel = relOf(s, f.id);
  const [done, setDone] = useState<'ok' | 'no' | null>(rel === 'friend' ? 'ok' : null);
  return (
    <View style={{ marginHorizontal: 20, padding: 14, borderRadius: radius.l, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: '#B8E2F4', gap: 12, ...shadows.card }}>
      <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/fan/[id]', params: { id: f.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <FanAvatar id={f.id} size={48} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text size={16} weight={700} lineHeight={20}>
            {f.name} хочет добавить вас в друзья
          </Text>
          <Text size={13} color="text2">
            {f.mutual} общий друг · 5 мин назад
          </Text>
        </View>
      </Pressable>
      {done === 'ok' ? (
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
      ) : done === 'no' ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8, paddingLeft: 12, borderRadius: 14, backgroundColor: colors.bg }}>
          <Text size={15} color="text2" style={{ flex: 1 }}>
            Заявка отклонена
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setDone(null);
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
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setRel(f.id, 'friend');
              setDone('ok');
            }}
            style={{ flex: 1, height: 44, borderRadius: 14, backgroundColor: colors.blue600, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icon name="user-round-check" size={18} color="surface" weight={2} />
            <Text size={15} weight={700} color="surface">
              Принять
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setRel(f.id, 'none');
              setDone('no');
            }}
            style={{ flex: 1, height: 44, borderRadius: 14, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }}>
            <Text size={15} weight={700}>
              Отклонить
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
