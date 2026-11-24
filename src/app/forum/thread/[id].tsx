import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Share, View } from 'react-native';

import { GameSheet, Icon, NavBar, Pressable, Screen, Text } from '@/components';
import { addReply, bestReplies, findThread, toggleLike, toggleReaction, useSocial, type Reply } from '@/data/social';
import { Composer } from '@/features/social/Composer';
import { AuthorRow, CatChip, FanAvatar, Reactions, nameOf } from '@/features/social/parts';
import { colors, shadows } from '@/theme';

const PICK = ['⚽', '🔥', '👏', '❤️', '😂', '😮', '💯', '🤔', '😢', '🧤', '🏆', '👎'];

function Like({ k, base, size = 'small' }: { k: string; base: number; size?: 'small' | 'big' }) {
  const s = useSocial();
  const on = !!s.likes[k];
  const h = size === 'big' ? 36 : 28;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Нравится" accessibilityState={{ selected: on }} onPress={() => toggleLike(k)} style={{ height: h, paddingHorizontal: size === 'big' ? 12 : 8, borderRadius: h / 2, backgroundColor: on ? colors.errorBg : size === 'big' ? colors.bg : 'transparent', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Icon name="favourite" size={size === 'big' ? 19 : 16} color={on ? 'red' : 'text2'} filled={on} weight={1.8} />
      <Text size={size === 'big' ? 15 : 13} weight={700} color={on ? 'red' : 'text2'}>
        {base + (on ? 1 : 0)}
      </Text>
    </Pressable>
  );
}

function ReplyView({ r, nested, onReply, onReact }: { r: Reply; nested?: boolean; onReply: (r: Reply) => void; onReact: (key: string) => void }) {
  const s = useSocial();
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  if (r.hidden)
    return (
      <View style={{ paddingVertical: 14, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Icon name="comment-block-01" size={20} color="text3" />
        <Text size={14} color="text3" style={{ flex: 1, fontStyle: 'italic' }}>
          Ответ скрыт модератором: нарушение правил форума
        </Text>
      </View>
    );
  const long = r.text.length > 180;
  const key = `reply-${r.id}`;
  return (
    <View style={[{ gap: 8 }, nested ? {} : { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.surface, ...shadows.card }]}>
      <AuthorRow id={r.author} time={r.time} size={nested ? 32 : 40} badge={r.badge} />
      <Text size={15} lineHeight={22} color="#33415F" numberOfLines={long && !more ? 3 : undefined}>
        {r.mention ? (
          <Text size={15} weight={700} color="blue600">
            @{r.mention}{' '}
          </Text>
        ) : null}
        {r.text}
      </Text>
      {long ? (
        <Pressable accessibilityRole="button" onPress={() => setMore(!more)} style={{ alignSelf: 'flex-start' }}>
          <Text size={14} weight={700} color="blue600">
            {more ? 'Свернуть' : 'Показать полностью'}
          </Text>
        </Pressable>
      ) : null}
      {r.poll ? (
        <Pressable accessibilityRole="link" onPress={() => router.push('/polls')} style={{ padding: 10, borderRadius: 14, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check-list" size={20} color="blue" />
          </View>
          <View style={{ flex: 1 }}>
            <Text size={15} weight={700}>
              Опрос «Игрок матча»
            </Text>
            <Text size={12} color="text2">
              Голосование до 23:59 · 1 204 голоса
            </Text>
          </View>
          <Icon name="arrow-right-01" size={18} color="text3" />
        </Pressable>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap', marginLeft: -8 }}>
        <Like k={key} base={r.likes} />
        <Reactions items={r.reactions ?? []} mine={s.myReactions[key]} small onPress={(e) => toggleReaction(key, e)} />
        <Pressable accessibilityRole="button" accessibilityLabel="Добавить реакцию" onPress={() => onReact(key)} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="smile-plus" size={16} color="text2" />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable accessibilityRole="button" onPress={() => onReply(r)} style={{ height: 28, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="mail-reply-01" size={16} color="blue600" />
          <Text size={13} weight={700} color="blue600">
            Ответить
          </Text>
        </Pressable>
      </View>
      {r.replies?.length ? (
        <View style={{ marginTop: 4, paddingLeft: 14, borderLeftWidth: 2, borderColor: colors.line, gap: 14 }}>
          {(open ? r.replies : r.replies.slice(0, 2)).map((x) => (
            <ReplyView key={x.id} r={x} nested onReply={onReply} onReact={onReact} />
          ))}
          <Pressable accessibilityRole="button" onPress={() => setOpen(!open)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name={open ? 'arrow-up-01' : 'arrow-down-01'} size={16} color="blue600" weight={2} />
            <Text size={14} weight={700} color="blue600">
              {open ? 'Свернуть ответы' : 'Ещё 3 ответа'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

/** Обсуждение: тема, лайки и реакции, ответы с вложенными ветками, поле ответа. */
export default function ThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = useSocial();
  const t = findThread(s, id);
  const [to, setTo] = useState<Reply | null>(null);
  const [react, setReact] = useState<string | null>(null);
  if (!t) return <Screen header={<NavBar title="Форум" />}>{null}</Screen>;
  const mine = s.myReplies[t.id] ?? [];
  const replies = t.id === 'best' ? bestReplies : [];
  const total = t.replies + mine.length;
  const key = t.id;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1 }}>
        <Screen gap={14} header={<NavBar title={t.cat === 'club' ? 'Форум' : 'Обсуждение'} action={{ icon: 'share-08', label: 'Поделиться', onPress: () => Share.share({ message: `${t.title} — форум ORDA` }).catch(() => undefined) }} />}>
          <View style={{ marginHorizontal: 20, paddingTop: 18, paddingHorizontal: 16, paddingBottom: 14, borderRadius: 24, backgroundColor: colors.surface, gap: 12, ...shadows.card }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <CatChip cat={t.cat} />
              {t.author === 'me' ? (
                <Text size={12} weight={700} color="#8A5A00">
                  На проверке у модератора
                </Text>
              ) : null}
            </View>
            <Text size={24} weight={700} lineHeight={29}>
              {t.title}
            </Text>
            <AuthorRow id={t.author} time={t.time} badge={t.author === 'me' ? 'author' : undefined} />
            <Text size={16} lineHeight={24} color="#33415F">
              {t.text}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', paddingTop: 12, borderTopWidth: 1, borderColor: colors.surfaceSunken }}>
              <Like k={key} base={t.likes} size="big" />
              <Reactions items={t.reactions} mine={s.myReactions[key]} onPress={(e) => toggleReaction(key, e)} />
              <Pressable accessibilityRole="button" accessibilityLabel="Добавить реакцию" onPress={() => setReact(key)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="smile-plus" size={19} color="text2" />
              </Pressable>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
            <Text display size={24}>
              Ответы · {total}
            </Text>
            <View style={{ height: 36, paddingHorizontal: 12, borderRadius: 18, backgroundColor: colors.chipBg, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text size={14} weight={700}>
                Лучшие
              </Text>
              <Icon name="arrow-down-01" size={16} weight={2} />
            </View>
          </View>
          <View style={{ gap: 12, paddingHorizontal: 20 }}>
            {replies.map((r) => (
              <ReplyView key={r.id} r={r} onReply={setTo} onReact={setReact} />
            ))}
            {mine.map((r) => (
              <ReplyView key={r.id} r={r} onReply={setTo} onReact={setReact} />
            ))}
            {!replies.length && !mine.length ? (
              <View style={{ paddingVertical: 26, paddingHorizontal: 20, borderRadius: 22, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.line, alignItems: 'center', gap: 10 }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.card }}>
                  <Icon name="bubble-chat" size={30} color="text3" />
                </View>
                <Text size={18} weight={700}>
                  Пока нет ответов
                </Text>
                <Text size={14} color="text2" align="center">
                  Будьте первым — за полезный ответ начисляем +5 баллов
                </Text>
              </View>
            ) : null}
          </View>
        </Screen>
      </View>
      <Composer
        key={to?.id ?? 'plain'}
        placeholder="Ваш ответ…"
        onSend={(text) => {
          addReply(t.id, text, to ? nameOf(to.author).split(' ')[0] : undefined);
          setTo(null);
        }}
        left={
          <View style={{ marginBottom: 6 }}>
            <FanAvatar id="me" size={40} />
          </View>
        }
        top={
          to ? (
            <View style={{ height: 40, paddingLeft: 12, borderRadius: 12, borderLeftWidth: 3, borderColor: colors.blue, backgroundColor: colors.blue10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="mail-reply-01" size={16} color="blue600" />
              <Text size={14} color="text2" style={{ flex: 1 }}>
                Ответ для{' '}
                <Text size={14} weight={700} color="blue600">
                  {nameOf(to.author)}
                </Text>
              </Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Отменить ответ" onPress={() => setTo(null)} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="cancel-01" size={16} color="text2" weight={2} />
              </Pressable>
            </View>
          ) : undefined
        }
      />
      <GameSheet visible={!!react} onClose={() => setReact(null)} title="Ваша реакция" text="Можно поставить до трёх реакций. Лайк ❤ считается отдельно — он поднимает тему в «Горячее».">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {PICK.map((e) => {
            const on = !!react && (s.myReactions[react] ?? []).includes(e);
            return (
              <Pressable
                key={e}
                accessibilityRole="button"
                accessibilityLabel={`Реакция ${e}`}
                accessibilityState={{ selected: on }}
                onPress={() => {
                  if (react) toggleReaction(react, e);
                  setReact(null);
                }}
                style={{ flexBasis: '15%', flexGrow: 1, height: 48, borderRadius: 14, borderWidth: on ? 2 : 0, borderColor: colors.sky, backgroundColor: on ? colors.blue10 : colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Text size={26}>{e}</Text>
              </Pressable>
            );
          })}
        </View>
      </GameSheet>
    </KeyboardAvoidingView>
  );
}
