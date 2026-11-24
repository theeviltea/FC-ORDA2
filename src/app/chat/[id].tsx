import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, GameSheet, Glass, GlassButton, Icon, Pressable, Text, type IconName } from '@/components';
import { img } from '@/data/images';
import { findFan, markRead, receiveMessage, relOf, sendMessage, setRel, updateMessage, useSocial, type ChatMsg } from '@/data/social';
import { ChatLayout } from '@/features/social/ChatLayout';
import { Composer, TypingDots } from '@/features/social/Composer';
import { Chip, FanAvatar } from '@/features/social/parts';
import { colors, shadows } from '@/theme';

const REACTIONS = ['⚽', '🔥', '❤️', '😂', '👏', '😮'];
const REPLIES = ['Договорились! ⚽', 'Огонь 🔥', 'Увидимся у входа «Юг»', 'Ха, точно 😄'];

function Ticks({ m }: { m: ChatMsg }) {
  if (m.status === 'read') return <Icon name="tick-double-02" size={16} color="#BFE6F7" weight={2} />;
  if (m.status === 'sent') return <Icon name="tick-02" size={16} color="rgba(255,255,255,0.75)" weight={2} />;
  return null;
}

function Bubble({ m, onLong, onRetry }: { m: ChatMsg; onLong: () => void; onRetry: () => void }) {
  const failed = m.status === 'failed';
  const body = (
    <Pressable accessibilityRole="button" accessibilityHint="Долгое нажатие — реакции и действия" onLongPress={onLong} delayLongPress={350} style={{ maxWidth: 290, padding: m.photo || m.match ? 8 : 0, paddingTop: m.photo || m.match ? 8 : 0, borderRadius: 20, borderBottomRightRadius: m.me ? 6 : 20, borderBottomLeftRadius: m.me ? 20 : 6, backgroundColor: m.me ? colors.blue600 : colors.surface, opacity: failed ? 0.7 : 1, ...(m.me ? {} : shadows.card) }}>
      {m.photo ? <Image source={img.videoGoal} accessibilityLabel="Фото с трибуны" style={{ width: 260, height: 170, borderRadius: 14 }} contentFit="cover" /> : null}
      {m.match ? (
        <Pressable accessibilityRole="link" onPress={() => router.push('/tickets')} style={{ width: 250, padding: 12, borderRadius: 14, backgroundColor: colors.surface, gap: 8 }}>
          <Text size={11} weight={700} color="text2" style={{ letterSpacing: 0.6 }}>
            МАТЧ · ПРЕМЬЕР-ЛИГА
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Image source={img.crest} style={{ width: 24, height: 29 }} contentFit="contain" />
            <Text display size={18} upper style={{ flex: 1 }}>
              ORDA — Кайрат
            </Text>
            <Image source={img.clubKairat} style={{ width: 24, height: 29 }} contentFit="contain" />
          </View>
          <Text size={13} color="text2">
            25 октября, 19:00 · Фан-сектор «Юг»
          </Text>
          <View style={{ height: 34, borderRadius: 10, backgroundColor: colors.blue10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Icon name="ticket-01" size={16} color="blue600" />
            <Text size={14} weight={700} color="blue600">
              Купить билет рядом
            </Text>
          </View>
        </Pressable>
      ) : null}
      <View style={{ paddingTop: m.photo || m.match ? 8 : 9, paddingBottom: m.photo || m.match ? 2 : 7, paddingHorizontal: m.photo || m.match ? 6 : 14 }}>
        {m.quote ? (
          <View style={{ marginBottom: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, borderLeftWidth: 3, borderColor: m.me ? '#BFE6F7' : colors.blue, backgroundColor: m.me ? 'rgba(255,255,255,0.16)' : colors.blue10 }}>
            <Text size={13} weight={700} color={m.me ? '#BFE6F7' : 'blue'}>
              {m.quote.who}
            </Text>
            <Text size={13} color={m.me ? 'surface' : 'text'} numberOfLines={2}>
              {m.quote.text}
            </Text>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', columnGap: 10 }}>
          {m.text ? (
            <Text size={16} lineHeight={22} color={m.me ? 'surface' : 'text'} style={{ flexShrink: 1 }}>
              {m.text}
            </Text>
          ) : null}
          <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 3, paddingBottom: 1 }}>
            <Text size={11} color={m.me ? 'rgba(255,255,255,0.75)' : 'text3'}>
              {m.time}
            </Text>
            {m.me ? m.status === 'failed' ? <Icon name="clock-01" size={14} color="rgba(255,255,255,0.75)" /> : <Ticks m={m} /> : null}
          </View>
        </View>
      </View>
      {m.reaction ? (
        <View style={{ position: 'absolute', left: m.me ? undefined : 10, right: m.me ? 10 : undefined, bottom: -14, height: 26, paddingHorizontal: 8, borderRadius: 13, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text size={13}>{m.reaction}</Text>
          <Text size={13} weight={700}>
            1
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
  return (
    <View style={{ alignSelf: m.me ? 'flex-end' : 'flex-start', marginBottom: m.reaction ? 14 : 0, alignItems: m.me ? 'flex-end' : 'flex-start', gap: 4 }}>
      {failed ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Повторить отправку" onPress={onRetry} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.errorText, alignItems: 'center', justifyContent: 'center' }}>
            <Text size={16} weight={700} color="surface">
              !
            </Text>
          </Pressable>
          {body}
        </View>
      ) : (
        body
      )}
      {failed ? (
        <Text size={12} weight={700} color="errorText">
          Не отправлено · Нажмите «!», чтобы повторить
        </Text>
      ) : null}
    </View>
  );
}

/** Личный чат с другом. `?state=offline` — показать отправку без сети. */
export default function Chat() {
  const { id, state } = useLocalSearchParams<{ id: string; state?: string }>();
  const s = useSocial();
  const f = findFan(id);
  const [offline, setOffline] = useState(state === 'offline');
  const [typing, setTyping] = useState(false);
  const [attach, setAttach] = useState(false);
  const [menu, setMenu] = useState<ChatMsg | null>(null);
  const [quote, setQuote] = useState<ChatMsg | null>(null);
  const [timers] = useState<ReturnType<typeof setTimeout>[]>(() => []);
  useEffect(() => {
    if (id) markRead(id);
    const t = timers;
    return () => t.forEach(clearTimeout);
  }, [id, timers]);
  if (!f) return null;
  const msgs = s.chats[f.id] ?? [];
  const rel = relOf(s, f.id);
  const locked = rel !== 'friend';
  const first = f.name.split(' ')[0];

  const send = (text: string, opts: { photo?: boolean; match?: boolean } = {}) => {
    const q = quote ? { who: quote.me ? 'Вы' : first, text: quote.text } : undefined;
    setQuote(null);
    const mid = sendMessage(f.id, text, { ...opts, quote: q, offline });
    if (offline) return;
    timers.push(setTimeout(() => setTyping(true), 900));
    timers.push(
      setTimeout(() => {
        setTyping(false);
        updateMessage(f.id, mid, { status: 'read' });
        receiveMessage(f.id, REPLIES[msgs.length % REPLIES.length]);
      }, 2600),
    );
  };
  const retry = (m: ChatMsg) => {
    setOffline(false);
    updateMessage(f.id, m.id, { status: 'sent' });
    timers.push(setTimeout(() => updateMessage(f.id, m.id, { status: 'read' }), 1200));
  };

  const header = (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <GlassButton icon="arrow-left-01" label="Назад" onPress={() => (router.canGoBack() ? router.back() : router.replace('/chats'))} />
        <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/fan/[id]', params: { id: f.id } })} style={{ flex: 1 }}>
          <Glass radius={26} style={{ height: 52, paddingLeft: 6, paddingRight: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <FanAvatar id={f.id} size={40} online={!offline && f.online} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text size={17} weight={700} numberOfLines={1}>
                {f.name}
              </Text>
              <Text size={13} color={offline ? '#8A5A00' : typing ? 'blue600' : locked ? 'text3' : f.online ? '#1DB45A' : 'text2'}>
                {offline ? 'ожидание сети…' : typing ? 'печатает…' : locked ? 'не в друзьях' : f.seen}
              </Text>
            </View>
          </Glass>
        </Pressable>
        <GlassButton icon="more-vertical" label="Ещё" onPress={() => router.push({ pathname: '/fan/[id]', params: { id: f.id } })} />
      </View>
      {offline ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Сеть появилась — повторить" onPress={() => setOffline(false)} style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#FFF4D6', borderWidth: 1, borderColor: '#F2D58A', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="wifi-disconnected-01" size={18} color="#8A5A00" />
          <Text size={14} weight={700} color="#8A5A00" style={{ flex: 1 }}>
            Нет соединения. Отправим, когда появится сеть
          </Text>
        </Pressable>
      ) : null}
    </View>
  );

  const composer = locked ? (
    <View style={{ paddingTop: 16, paddingHorizontal: 20, paddingBottom: 34, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.surface, alignItems: 'center', gap: 10, boxShadow: '0 -6px 24px rgba(23, 42, 81, 0.1)' }}>
      <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="square-lock-01" size={22} color="text2" />
      </View>
      <Text size={17} weight={700}>
        Переписка доступна только друзьям
      </Text>
      <Text size={14} lineHeight={20} color="text2" align="center">
        {rel === 'sent' ? `Заявка отправлена — когда ${first} её примет, сможете писать.` : `Вы больше не в друзьях с ${first}. Отправьте заявку — когда её примут, сможете снова писать.`}
      </Text>
      {rel === 'sent' ? null : <Button label={rel === 'incoming' ? 'Принять заявку' : 'Добавить в друзья'} icon="user-round-plus" height={50} onPress={() => setRel(f.id, rel === 'incoming' ? 'friend' : 'sent')} style={{ alignSelf: 'stretch' }} />}
    </View>
  ) : (
    <Composer
      placeholder="Сообщение"
      idleIcon="mic-01"
      onSend={(t) => send(t)}
      left={
        <Pressable accessibilityRole="button" accessibilityLabel="Прикрепить" onPress={() => setAttach(true)} style={{ width: 44, height: 44, marginBottom: 4, borderRadius: 22, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="add-01" size={22} color="blue600" weight={2} />
        </Pressable>
      }
      top={
        quote ? (
          <View style={{ height: 40, paddingLeft: 12, borderRadius: 12, borderLeftWidth: 3, borderColor: colors.blue, backgroundColor: colors.blue10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="mail-reply-01" size={16} color="blue600" />
            <Text size={14} color="text2" numberOfLines={1} style={{ flex: 1 }}>
              Ответ: {quote.text || 'Фото'}
            </Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Отменить ответ" onPress={() => setQuote(null)} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="cancel-01" size={16} color="text2" weight={2} />
            </Pressable>
          </View>
        ) : undefined
      }
    />
  );

  return (
    <ChatLayout header={header} composer={composer} scrollKey={msgs.length + (typing ? 1 : 0)}>
      {msgs.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
          <FanAvatar id={f.id} size={88} ring={colors.bg} />
          <Text display size={26} upper align="center">
            {f.name}
          </Text>
          <View style={{ height: 28, paddingHorizontal: 12, borderRadius: 14, backgroundColor: colors.successBg, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Icon name="user-round-check" size={15} color="successText" weight={2} />
            <Text size={13} weight={700} color="successText">
              Теперь вы друзья
            </Text>
          </View>
          <Text size={15} lineHeight={21} color="text2" align="center" style={{ maxWidth: 290 }}>
            Напишите первым — например, договоритесь встретиться на матче
          </Text>
          <View style={{ gap: 8, alignItems: 'center', marginTop: 6 }}>
            {['Привет! 👋', 'Идёшь на матч в субботу? ⚽', 'Го в фан-сектор вместе!'].map((t) => (
              <Chip key={t} label={t} outline onPress={() => send(t)} />
            ))}
          </View>
        </View>
      ) : (
        <View style={{ alignSelf: 'center', height: 26, paddingHorizontal: 12, borderRadius: 13, backgroundColor: 'rgba(23,42,81,0.08)', justifyContent: 'center' }}>
          <Text size={12} weight={700} color="text2">
            Сегодня
          </Text>
        </View>
      )}
      <View style={{ gap: 8, opacity: locked ? 0.5 : 1 }}>
        {msgs.map((m) => (
          <Bubble key={m.id} m={m} onLong={() => !locked && setMenu(m)} onRetry={() => retry(m)} />
        ))}
      </View>
      {typing ? (
        <View style={{ alignSelf: 'flex-start', height: 40, paddingHorizontal: 16, borderRadius: 20, borderBottomLeftRadius: 6, backgroundColor: colors.surface, justifyContent: 'center', ...shadows.card }}>
          <TypingDots />
        </View>
      ) : null}

      <GameSheet visible={attach} onClose={() => setAttach(false)} title="Прикрепить">
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(
            [
              ['image-01', 'Галерея', colors.blue10, colors.blue600, () => send('', { photo: true })],
              ['camera-01', 'Камера', colors.navy, colors.surface, () => send('', { photo: true })],
              ['ticket-01', 'Матч', colors.errorBg, colors.errorText, () => send('Идём вместе? ⚽', { match: true })],
              ['location-01', 'Где я', '#E3F6EC', '#14804A', () => send('📍 Фан-сектор «Юг», ряд 4')],
            ] as [IconName, string, string, string, () => void][]
          ).map(([ic, t, bg, fg, fn]) => (
            <Pressable
              key={t}
              accessibilityRole="button"
              onPress={() => {
                setAttach(false);
                fn();
              }}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 16, backgroundColor: colors.bg, alignItems: 'center', gap: 6 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={ic} size={22} color={fg} />
              </View>
              <Text size={13} weight={700}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      </GameSheet>

      <GameSheet visible={!!menu} onClose={() => setMenu(null)} title="Сообщение" text={menu?.text || 'Фото'}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 6, borderRadius: 26, backgroundColor: colors.bg }}>
          {REACTIONS.map((e) => (
            <Pressable
              key={e}
              accessibilityRole="button"
              accessibilityLabel={`Реакция ${e}`}
              onPress={() => {
                if (menu) updateMessage(f.id, menu.id, { reaction: menu.reaction === e ? undefined : e });
                setMenu(null);
              }}
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: menu?.reaction === e ? colors.blue10 : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              <Text size={24}>{e}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ borderRadius: 18, backgroundColor: colors.bg }}>
          {(
            [
              [
                'mail-reply-01',
                'Ответить',
                colors.navy,
                () => {
                  setQuote(menu);
                  setMenu(null);
                },
              ],
              ['copy', 'Копировать', colors.navy, () => setMenu(null)],
              ['flag-01', 'Пожаловаться', colors.navy, () => setMenu(null)],
            ] as [IconName, string, string, () => void][]
          ).map(([ic, t, c, fn], i) => (
            <Pressable key={t} accessibilityRole="button" onPress={fn} style={{ minHeight: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: i === 2 ? 0 : 1, borderColor: colors.line }}>
              <Text size={16} weight={600} color={c}>
                {t}
              </Text>
              <Icon name={ic} size={20} color={c} />
            </Pressable>
          ))}
        </View>
      </GameSheet>
    </ChatLayout>
  );
}
