import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { Glass, GlassButton, Icon, Pressable, Text, type IconName } from '@/components';
import { img } from '@/data/images';
import { markAiSeen } from '@/data/social';
import { ChatLayout } from '@/features/social/ChatLayout';
import { Composer, TypingDots } from '@/features/social/Composer';
import { AiBadgeBall, AiBall, Chip } from '@/features/social/parts';
import { colors, shadows } from '@/theme';

type Msg = { me: boolean; text: string; match?: boolean; error?: boolean };

const SUGGEST: [IconName, string][] = [
  ['calendar-03', 'Когда следующий матч?'],
  ['ticket-01', 'Как купить билет в фан-сектор?'],
  ['football', 'Кто лучший бомбардир сезона?'],
  ['star-award-01', 'Как заработать больше баллов?'],
];

/** Прототип: заготовленные ответы. ChatGPT подключим через бэкенд клуба. */
function answer(q: string): Msg {
  const t = q.toLowerCase();
  if (t.includes('матч') || t.includes('билет')) return { me: false, text: 'Следующий домашний матч — ORDA — Кайрат, 25 октября в 19:00. В фан-секторе «Юг» осталось 46 мест 🔥', match: true };
  if (t.includes('балл')) return { me: false, text: 'Баллы дают за викторины, прогнозы, задания и отметку на стадионе. Больше всего — за игры в матч-день: до +150 за один матч.' };
  if (t.includes('бомбардир')) return { me: false, text: 'Лучший бомбардир сезона — Эвертон Мораес: 14 голов и 6 передач в чемпионате.' };
  if (t.includes('взять')) return { me: false, text: 'Возьмите билет в приложении (QR откроется и без интернета), документ с фото и шарф ORDA — в фан-шопе у входа «Юг» скидка 10% по билету.' };
  return { me: false, text: 'Пока я отвечаю на вопросы о матчах, билетах, игроках и баллах. Попробуйте спросить по-другому — или загляните в нужный раздел приложения.' };
}

function MatchCard() {
  return (
    <Pressable accessibilityRole="link" onPress={() => router.push('/tickets')} style={{ padding: 12, borderRadius: 16, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text size={12} weight={700} color="text2" style={{ letterSpacing: 0.6 }}>
          ПРЕМЬЕР-ЛИГА · 26 ТУР
        </Text>
        <Text size={12} weight={700} color="blue600" style={{ letterSpacing: 0.6 }}>
          ДОМА
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image source={img.crest} style={{ width: 30, height: 36 }} contentFit="contain" />
        <Text display size={20} upper style={{ flex: 1 }}>
          ORDA — Кайрат
        </Text>
        <Image source={img.clubKairat} style={{ width: 30, height: 36 }} contentFit="contain" />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="calendar-03" size={16} color="text2" />
        <Text size={14} color="text2" style={{ flex: 1 }}>
          25 октября, 19:00 · Стадион им. Х. Мунайтпасова
        </Text>
      </View>
      <View style={{ height: 40, borderRadius: 12, backgroundColor: colors.blue600, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Icon name="ticket-01" size={18} color="surface" />
        <Text size={15} weight={700} color="surface">
          Купить билет · от 2 500 ₸
        </Text>
      </View>
    </Pressable>
  );
}

/** ИИ-помощник ORDA: открывается мячом в углу главных экранов. `?state=error` — показать ошибку сети. */
export default function AiChat() {
  const { state } = useLocalSearchParams<{ state?: string }>();
  const [msgs, setMsgs] = useState<Msg[]>(state === 'error' ? [{ me: true, text: 'Когда следующий матч и есть ли билеты в фан-сектор?' }, { me: false, text: '', error: true }] : []);
  const [busy, setBusy] = useState(false);
  const [liked, setLiked] = useState<Record<number, 'up' | 'down'>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    markAiSeen();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const ask = (q: string) => {
    if (busy) return;
    setMsgs((m) => [...m.filter((x) => !x.error), { me: true, text: q }]);
    setBusy(true);
    timer.current = setTimeout(() => {
      setMsgs((m) => [...m, answer(q)]);
      setBusy(false);
    }, 1400);
  };
  const retry = () => {
    const last = [...msgs].reverse().find((m) => m.me);
    setMsgs((m) => m.filter((x) => !x.error));
    if (last) {
      setBusy(true);
      timer.current = setTimeout(() => {
        setMsgs((m) => [...m, answer(last.text)]);
        setBusy(false);
      }, 1400);
    }
  };
  const offline = msgs.some((m) => m.error);
  const status = busy ? { t: 'Печатает…', c: colors.blue600 } : offline ? { t: 'Нет связи', c: colors.errorText } : { t: 'Онлайн · на базе ChatGPT', c: '#1DB45A' };

  const header = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <GlassButton icon="cancel-01" label="Закрыть" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      <Glass radius={26} style={{ flex: 1, height: 52, paddingLeft: 6, paddingRight: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <AiBall size={40} />
        <View style={{ flex: 1 }}>
          <Text display size={19} upper>
            ORDA AI
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: status.c }} />
            <Text size={12} color={status.c}>
              {status.t}
            </Text>
          </View>
        </View>
      </Glass>
      <GlassButton icon="message-add-01" label="Новый чат" onPress={() => setMsgs([])} />
    </View>
  );

  return (
    <ChatLayout
      header={header}
      scrollKey={msgs.length + (busy ? 1 : 0)}
      composer={
        <Composer
          placeholder="Спросите что-нибудь…"
          idleIcon="mic-01"
          busy={busy}
          onStop={() => {
            if (timer.current) clearTimeout(timer.current);
            setBusy(false);
          }}
          onSend={ask}
          footnote={
            <Text size={12} color="text3" align="center">
              Отвечает ИИ на базе ChatGPT и может ошибаться. Важное проверяйте в разделах приложения
            </Text>
          }
        />
      }>
      {msgs.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'flex-start', gap: 14 }}>
          <View style={{ alignItems: 'center', gap: 12, paddingTop: 18, paddingHorizontal: 8 }}>
            <AiBadgeBall size={96} />
            <Text display size={32} upper align="center" style={{ marginTop: 8 }}>
              Салем, Бекжан!
            </Text>
            <Text size={16} lineHeight={23} color="text2" align="center" style={{ maxWidth: 300 }}>
              Я ИИ-помощник ORDA. Спросите про матчи, билеты, игроков или баллы — отвечу за пару секунд.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {SUGGEST.map(([ic, q]) => (
              <Pressable key={q} accessibilityRole="button" onPress={() => ask(q)} style={{ flexBasis: '47%', flexGrow: 1, minHeight: 92, padding: 12, borderRadius: 18, backgroundColor: colors.surface, gap: 8, ...shadows.card }}>
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={ic} size={18} color="blue" />
                </View>
                <Text size={15} weight={700} lineHeight={19}>
                  {q}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text size={13} weight={700} color="text3" style={{ letterSpacing: 0.8, marginTop: 6 }}>
            ЧАСТО СПРАШИВАЮТ
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['Где забрать заказ?', 'Правила фан-сектора', 'Состав на матч'].map((q) => (
              <Chip key={q} label={q} outline onPress={() => ask(q)} />
            ))}
          </View>
        </View>
      ) : null}
      {msgs.map((m, i) =>
        m.me ? (
          <View key={i} style={{ alignSelf: 'flex-end', maxWidth: 290, paddingVertical: 11, paddingHorizontal: 14, borderRadius: 20, borderBottomRightRadius: 6, backgroundColor: colors.blue600, marginTop: 6 }}>
            <Text size={16} lineHeight={22} color="surface">
              {m.text}
            </Text>
          </View>
        ) : m.error ? (
          <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            <View style={{ opacity: 0.55, marginTop: 2 }}>
              <AiBall size={32} />
            </View>
            <View style={{ flex: 1, padding: 14, borderRadius: 20, borderTopLeftRadius: 6, backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#F6C9CC', gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="wifi-disconnected-01" size={20} color="errorText" />
                <Text size={16} weight={700} color="errorText">
                  Не получилось ответить
                </Text>
              </View>
              <Text size={15} lineHeight={21} color="#33415F">
                Нет связи с сервером. Проверьте интернет — вопрос сохранён, отправим его ещё раз.
              </Text>
              <Pressable accessibilityRole="button" onPress={retry} style={{ alignSelf: 'flex-start', height: 40, paddingHorizontal: 16, borderRadius: 12, backgroundColor: colors.navy, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="refresh" size={18} color="surface" />
                <Text size={15} weight={700} color="surface">
                  Повторить
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            <View style={{ marginTop: 2 }}>
              <AiBall size={32} />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <View style={{ padding: 14, borderRadius: 20, borderTopLeftRadius: 6, backgroundColor: colors.surface, gap: 10, ...shadows.card }}>
                <Text size={16} lineHeight={23}>
                  {m.text}
                </Text>
                {m.match ? <MatchCard /> : null}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Pressable accessibilityRole="button" accessibilityLabel="Полезно" accessibilityState={{ selected: liked[i] === 'up' }} onPress={() => setLiked({ ...liked, [i]: 'up' })} style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: liked[i] === 'up' ? colors.blue10 : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="thumbs-up" size={18} color={liked[i] === 'up' ? 'blue600' : 'text3'} />
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="Не помогло" accessibilityState={{ selected: liked[i] === 'down' }} onPress={() => setLiked({ ...liked, [i]: 'down' })} style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: liked[i] === 'down' ? colors.blue10 : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="thumbs-down" size={18} color={liked[i] === 'down' ? 'blue600' : 'text3'} />
                </Pressable>
              </View>
              {i === msgs.length - 1 && m.match ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {['Что взять с собой?', 'Как добраться до стадиона?'].map((q) => (
                    <Chip key={q} label={q} outline onPress={() => ask(q)} />
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        ),
      )}
      {busy ? (
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          <AiBall size={32} />
          <View style={{ gap: 6 }}>
            <View style={{ height: 46, paddingHorizontal: 18, borderRadius: 20, borderTopLeftRadius: 6, backgroundColor: colors.surface, justifyContent: 'center', ...shadows.card }}>
              <TypingDots color={colors.blue} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 4 }}>
              <Icon name="search-01" size={14} color="text2" />
              <Text size={13} color="text2">
                Ищу ответ…
              </Text>
            </View>
          </View>
        </View>
      ) : null}
    </ChatLayout>
  );
}
