import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, View, type LayoutChangeEvent } from 'react-native';

import { Gradient, Icon, NavBar, Pressable, Screen, Star, Text } from '@/components';
import { img } from '@/data/images';
import { share } from '@/data/share';
import { findStory, kindLabel, stories, type Block, type Story } from '@/data/stories';
import { colors, radius, shadows } from '@/theme';

const kindColor = { int: 'blue600', long: 'errorText', col: 'successText' } as const;
const body = { size: 16, lineHeight: 26 } as const;

function Lead({ s }: { s: Story }) {
  return (
    <Text size={19} lineHeight={28} weight={500}>
      {s.lead}
    </Text>
  );
}

function Likes({ s }: { s: Story }) {
  const [liked, setLiked] = useState(false);
  return (
    <View style={{ marginHorizontal: 20, marginTop: 16, paddingVertical: 14, paddingHorizontal: 16, borderRadius: radius.l, backgroundColor: colors.bg, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Text size={15} weight={700} style={{ flex: 1 }}>
        {s.kind === 'int' ? 'Понравилось интервью?' : 'Понравился материал?'}
      </Text>
      <Pressable accessibilityRole="button" accessibilityState={{ selected: liked }} accessibilityLabel={`Нравится, ${s.likes + (liked ? 1 : 0)}`} onPress={() => setLiked(!liked)} style={{ height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: liked ? colors.errorBg : colors.surface, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="favourite" size={18} color={liked ? 'errorText' : 'text'} weight={2} filled={liked} />
        <Text size={15} weight={700} color={liked ? 'errorText' : 'text'}>
          {String(s.likes + (liked ? 1 : 0))}
        </Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Поделиться" onPress={share(`${s.title} — ORDA`)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="share-08" size={18} />
      </Pressable>
    </View>
  );
}

function Related({ s }: { s: Story }) {
  const rel = stories.filter((x) => x.id !== s.id && (s.kind === 'int' ? x.kind === 'int' : x.kind !== 'int' || x.id === 'keeper')).slice(0, 2);
  const open = (x: Story) => router.push({ pathname: '/story/[id]', params: { id: x.id } });
  return (
    <>
      <Text display size={24} lineHeight={28} style={{ marginHorizontal: 20, marginTop: 28, marginBottom: 12 }}>
        {s.kind === 'int' ? 'Другие интервью' : 'Читайте также'}
      </Text>
      {s.kind === 'int' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 6 }}>
          {rel.map((x) => (
            <Pressable key={x.id} accessibilityRole="link" onPress={() => open(x)} style={{ width: 220, borderRadius: radius.l, overflow: 'hidden', backgroundColor: colors.surface, ...shadows.card }}>
              <Image source={x.photo} style={{ height: 130, backgroundColor: colors.surfaceSunken }} contentFit="cover" contentPosition={x.pos} />
              <View style={{ paddingTop: 12, paddingHorizontal: 14, paddingBottom: 14, gap: 4 }}>
                <Text size={12} weight={700} upper color="blue600" style={{ letterSpacing: 0.7 }}>
                  {x.rubric}
                </Text>
                <Text size={15} lineHeight={19} weight={700}>
                  {x.title}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {rel.map((x) => (
            <Pressable key={x.id} accessibilityRole="link" onPress={() => open(x)} style={{ flexDirection: 'row', borderRadius: radius.l, overflow: 'hidden', backgroundColor: colors.surface, ...shadows.card }}>
              <Image source={x.photo} style={{ width: 96, minHeight: 112, backgroundColor: colors.surfaceSunken }} contentFit="cover" contentPosition={x.pos} />
              <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 14, gap: 4 }}>
                <Text size={12} weight={700} upper color={kindColor[x.kind]} style={{ letterSpacing: 0.7 }}>
                  {kindLabel[x.kind]}
                </Text>
                <Text size={15} lineHeight={19} weight={700}>
                  {x.title}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </>
  );
}

function Blocks({ blocks, onHeading }: { blocks: Block[]; onHeading?: (i: number, e: LayoutChangeEvent) => void }) {
  let h = 0;
  return (
    <>
      {blocks.map((b, k) => {
        switch (b.t) {
          case 'p':
            return (
              <Text key={k} {...body}>
                {b.text}
              </Text>
            );
          case 'h': {
            const n = ++h;
            return (
              <Text key={k} display size={22} lineHeight={25} upper accessibilityRole="header" style={{ marginTop: 8 }} onLayout={(e) => onHeading?.(n - 1, e)}>
                <Text display size={22} lineHeight={25} color="blue">
                  {String(n).padStart(2, '0')} ·{' '}
                </Text>
                {b.text}
              </Text>
            );
          }
          case 'q':
            return (
              <View key={k} style={{ alignSelf: 'flex-start', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 18, borderTopLeftRadius: 4, backgroundColor: colors.blue10 }}>
                <Text size={16} lineHeight={22} weight={700} color="blue600">
                  {b.text}
                </Text>
              </View>
            );
          case 'quote':
            return (
              <View key={k} style={{ marginVertical: 4, paddingVertical: 4, paddingLeft: 16, borderLeftWidth: 4, borderColor: colors.blue, gap: 8 }}>
                <Text display size={22} lineHeight={25} upper>
                  {b.text}
                </Text>
                <Text size={14} color="text2">
                  — {b.by}
                </Text>
              </View>
            );
          case 'pull':
            return (
              <View key={k} style={{ marginHorizontal: -20, marginVertical: 4, paddingVertical: 24, paddingHorizontal: 20, backgroundColor: colors.navy, gap: 10, overflow: 'hidden' }}>
                <Star w={90} fill="rgba(18,158,217,0.35)" style={{ right: -24, top: -20 }} />
                <Text display size={24} lineHeight={27} upper color="surface">
                  {b.text}
                </Text>
                <Text size={14} color="#A9BCD6">
                  — {b.by}
                </Text>
              </View>
            );
          case 'figure':
            return (
              <View key={k} style={{ marginVertical: 4, gap: 6 }}>
                <Image source={b.src} style={{ height: 210, borderRadius: 16 }} contentFit="cover" />
                <Text size={13} color="text2">
                  {b.caption}
                </Text>
              </View>
            );
          case 'blitz':
            return (
              <View key={k} accessibilityLabel="Блиц" style={{ padding: 16, borderRadius: radius.l, backgroundColor: colors.bg, gap: 12 }}>
                <Text display size={22} lineHeight={24} upper>
                  Блиц
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {b.items.map(([q, a]) => (
                    <View key={q} style={{ width: '48.5%', padding: 12, borderRadius: 14, backgroundColor: colors.surface, gap: 4 }}>
                      <Text size={12} color="text2">
                        {q}
                      </Text>
                      <Text size={15} weight={700}>
                        {a}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
        }
      })}
    </>
  );
}

/** Карточка материала: интервью (вопрос-ответ, цитата, блиц) или лонгрид / колонка (содержание, главы, цитаты, фото). */
export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = findStory(id ?? '') ?? stories[0];
  const isInt = s.kind === 'int';
  const scrollRef = useRef<ScrollView>(null);
  const article = useRef(0);
  const heads = useRef<number[]>([]);
  const chapters = s.blocks.filter((b): b is Extract<Block, { t: 'h' }> => b.t === 'h');

  const meta = (
    <View style={{ paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderColor: colors.surfaceSunken }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isInt ? colors.blue10 : colors.surface, alignItems: 'center', justifyContent: 'center', ...(isInt ? null : shadows.avatar) }}>
        {isInt ? <Icon name="mic-01" size={20} color="blue600" /> : <Image source={img.crest} style={{ width: 24, height: 30 }} contentFit="contain" />}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text size={15} weight={700}>
          {s.author}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Icon name="clock-01" size={14} color="text2" />
          <Text size={13} color="text2">
            {s.read} чтения · {s.ago}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Screen gap={0} bg={colors.surface} readingProgress={!isInt} scrollRef={scrollRef} header={<NavBar title={isInt ? 'Интервью' : 'Статьи и интервью'} action={{ icon: 'share-08', label: 'Поделиться', onPress: share(`${s.title} — ORDA`) }} />}>
      {isInt ? (
        <View style={{ marginHorizontal: 20, marginTop: 8, height: 420, borderRadius: 24, overflow: 'hidden', backgroundColor: colors.navy }}>
          <Image source={s.hero} accessibilityLabel="Игроки «Ордабасы»" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" contentPosition={s.heroPos} />
          <Gradient colors={['rgba(23,42,81,0.15)', 'rgba(23,42,81,0.35)', colors.navy]} locations={[0, 0.38, 0.86] as const} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <View style={{ position: 'absolute', left: 16, top: 16, height: 26, paddingHorizontal: 11, borderRadius: 13, backgroundColor: colors.red, justifyContent: 'center' }}>
            <Text size={12} lineHeight={14} weight={700} upper color="surface" style={{ letterSpacing: 0.7 }}>
              {s.rubric}
            </Text>
          </View>
          <View style={{ position: 'absolute', left: 20, right: 20, bottom: 20, gap: 12 }}>
            <Text display size={72} lineHeight={40} color="blue" style={{ height: 30 }} aria-hidden>
              “
            </Text>
            <Text display size={26} lineHeight={29} upper color="surface" accessibilityRole="header">
              {s.title}
            </Text>
            {s.sub ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 28, height: 2, backgroundColor: colors.blue }} />
                <Text size={14} color="onDark2" style={{ flex: 1 }}>
                  {s.sub}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : (
        <View style={{ height: 360, backgroundColor: colors.navy, overflow: 'hidden' }}>
          <Image source={s.hero} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" contentPosition={s.heroPos} />
          <Gradient colors={['rgba(23,42,81,0)', 'rgba(23,42,81,0.75)', colors.navy]} locations={[0.3, 0.62, 1] as const} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <Star w={16} fill={colors.sky} style={{ right: 26, top: 196 }} />
          <View style={{ position: 'absolute', left: 20, right: 20, bottom: 20, gap: 10 }}>
            <View style={{ alignSelf: 'flex-start', height: 26, paddingHorizontal: 11, borderRadius: 13, backgroundColor: s.kind === 'long' ? colors.red : '#137040', justifyContent: 'center' }}>
              <Text size={12} lineHeight={14} weight={700} upper color="surface" style={{ letterSpacing: 0.7 }}>
                {kindLabel[s.kind]}
              </Text>
            </View>
            <Text display size={28} lineHeight={30} upper color="surface" accessibilityRole="header">
              {s.title}
            </Text>
          </View>
        </View>
      )}
      {meta}

      <View onLayout={(e) => (article.current = e.nativeEvent.layout.y)} style={{ paddingTop: 20, paddingHorizontal: 20, paddingBottom: 8, gap: isInt ? 18 : 16 }}>
        <Lead s={s} />
        {chapters.length > 1 ? (
          <View accessibilityLabel="В материале" style={{ padding: 16, borderRadius: radius.l, backgroundColor: colors.bg, gap: 12 }}>
            <Text size={12} weight={700} upper color="text2" style={{ letterSpacing: 1 }}>
              В материале
            </Text>
            {chapters.map((c, i) => (
              <Pressable key={c.text} accessibilityRole="link" onPress={() => scrollRef.current?.scrollTo({ y: article.current + (heads.current[i] ?? 0) - 12, animated: true })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 32 }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: i ? colors.surface : colors.blue, borderWidth: 1.5, borderColor: colors.blue, alignItems: 'center', justifyContent: 'center' }}>
                  <Text display size={15} lineHeight={17} color={i ? 'blue600' : 'surface'}>
                    {String(i + 1)}
                  </Text>
                </View>
                <Text size={16} weight={600} style={{ flex: 1 }}>
                  {c.text}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <Blocks blocks={s.blocks} onHeading={(i, e) => (heads.current[i] = e.nativeEvent.layout.y)} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {s.tags.map((t) => (
            <View key={t} style={{ height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: colors.blue10, justifyContent: 'center' }}>
              <Text size={13} weight={700} color="blue600">
                #{t}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.surfaceSunken }}>
          <Text size={13} lineHeight={18} color="text2">
            Текст материала — демо-заглушка для прототипа.
          </Text>
        </View>
      </View>
      <Likes s={s} />
      <Related s={s} />
    </Screen>
  );
}
