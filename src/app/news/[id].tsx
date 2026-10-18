import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Share, View } from 'react-native';

import { Comment, CommentInput, NavBar, Pressable, Screen, Text } from '@/components';
import { findArticle, sampleComments, type CommentItem } from '@/data/news';
import { fan } from '@/data/user';
import { colors } from '@/theme';

const TOTAL = 12;

/** Статья: обложка, теги, заголовок, текст с фото, комментарии и закреплённое поле ввода. */
export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = findArticle(id ?? '');
  const [mine, setMine] = useState<CommentItem[]>([]);
  const [all, setAll] = useState(false);
  const shown = [...mine, ...(all ? sampleComments : sampleComments.slice(0, 3))];
  const share = () => {
    Share.share({ message: `${a.title} — ФК «Ордабасы»` }).catch(() => undefined);
  };
  return (
    <Screen
      gap={0}
      headerBg={colors.surface}
      header={<NavBar title="Новости" action={{ icon: 'share-08', label: 'Поделиться', onPress: share }} />}
      footer={<CommentInput onSend={(text) => setMine([{ id: `m${mine.length}`, author: fan.name, initial: fan.name[0], time: 'Только что', text, likes: 0 }, ...mine])} />}
      footerHeight={60}>
      <View style={{ backgroundColor: colors.surface, marginTop: -8, paddingBottom: 24 }}>
      <Image source={a.img} accessibilityLabel={a.title} style={{ width: '100%', height: 230 }} contentFit="cover" contentPosition={a.pos} />
      <View style={{ paddingTop: 18, paddingHorizontal: 20, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {a.tags.map((t) => (
            <View key={t} style={{ height: 24, paddingHorizontal: 10, borderRadius: 12, backgroundColor: colors.blue10, justifyContent: 'center' }}>
              <Text size={12} lineHeight={14} weight={700} color="blue600">
                {t}
              </Text>
            </View>
          ))}
        </View>
        <Text display size={25} lineHeight={29} accessibilityRole="header">
          {a.title}
        </Text>
        <Text size={13} color="text2">
          {a.date}
        </Text>
        {a.body.map((b, i) =>
          typeof b === 'string' ? (
            <Text key={i} size={16} lineHeight={25}>
              {b}
            </Text>
          ) : (
            <View key={i} style={{ marginVertical: 4, gap: 6 }}>
              <Image source={b.img} style={{ width: '100%', height: 200, borderRadius: 16 }} contentFit="cover" />
              <Text size={13} color="text2">
                {b.caption}
              </Text>
            </View>
          ),
        )}
      </View>
      </View>

      <View accessibilityLabel="Комментарии" style={{ paddingTop: 20, paddingHorizontal: 20, paddingBottom: 28, backgroundColor: colors.bg, gap: 10 }}>
        <Text display size={24} lineHeight={28} style={{ marginBottom: 4 }}>
          Комментарии ({TOTAL + mine.length})
        </Text>
        {shown.map((c) => (
          <Comment key={c.id} c={c} />
        ))}
        {!all ? (
          <Pressable accessibilityRole="button" onPress={() => setAll(true)} style={{ marginTop: 4, height: 48, borderRadius: 14, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
            <Text size={16} weight={700} color="blue600">
              Показать все {TOTAL + mine.length} комментариев
            </Text>
          </Pressable>
        ) : null}
      </View>
    </Screen>
  );
}
