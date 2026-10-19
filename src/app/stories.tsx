import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Gradient, Icon, NavBar, Pressable, Screen, Star, Text } from '@/components';
import { soon } from '@/data/nav';
import { kindLabel, rubrics, stories, type Kind, type Story } from '@/data/stories';
import { colors, radius, shadows } from '@/theme';

const chips: { id: 'all' | Kind; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'int', label: 'Интервью' },
  { id: 'long', label: 'Лонгриды' },
  { id: 'col', label: 'Колонки' },
];
const kindColor = { int: 'blue600', long: 'errorText', col: 'successText' } as const;
const open = (s: Story) => router.push({ pathname: '/story/[id]', params: { id: s.id } });

/** Статьи и интервью: формат, главное интервью, рубрики, свежие материалы. */
export default function Stories() {
  const [chip, setChip] = useState<'all' | Kind>('all');
  const [rubric, setRubric] = useState<Story['rubric'] | null>(null);
  const hero = stories[0];
  const list = stories.slice(1).filter((s) => (chip === 'all' || s.kind === chip) && (!rubric || s.rubric === rubric));

  return (
    <Screen gap={16} header={<NavBar title="Статьи и интервью" action={{ icon: 'search-01', label: 'Поиск', onPress: soon('Поиск') }} />}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityRole="tablist" accessibilityLabel="Формат" contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {chips.map((c) => {
          const on = c.id === chip;
          return (
            <Pressable key={c.id} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setChip(c.id)} style={{ height: 44, paddingHorizontal: 18, borderRadius: 22, backgroundColor: on ? colors.navy : colors.chipBg, justifyContent: 'center' }}>
              <Text size={15} weight={on ? 700 : 500} color={on ? 'surface' : 'text'}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {(chip === 'all' || chip === 'int') && !rubric ? (
        <Pressable accessibilityRole="link" accessibilityLabel={`Большое интервью. ${hero.title}`} onPress={() => open(hero)} style={{ marginHorizontal: 20, height: 440, borderRadius: 24, overflow: 'hidden', backgroundColor: colors.navy }}>
          <Image source={hero.photo} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" contentPosition={hero.pos} />
          <Gradient colors={['rgba(23,42,81,0.1)', 'rgba(23,42,81,0.35)', colors.navy]} locations={[0, 0.4, 0.88] as const} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <View style={{ position: 'absolute', left: 16, top: 16, height: 26, paddingHorizontal: 11, borderRadius: 13, backgroundColor: colors.red, justifyContent: 'center' }}>
            <Text size={12} lineHeight={14} weight={700} upper color="surface" style={{ letterSpacing: 0.7 }}>
              Большое интервью
            </Text>
          </View>
          <View style={{ position: 'absolute', left: 20, right: 20, bottom: 20, gap: 12 }}>
            <Text display size={72} lineHeight={40} color="blue" style={{ height: 30 }} aria-hidden>
              “
            </Text>
            <Text display size={26} lineHeight={29} upper color="surface">
              {hero.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 28, height: 2, backgroundColor: colors.blue }} />
              <Text size={14} color="onDark2" style={{ flex: 1 }}>
                {hero.sub}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="clock-01" size={16} color="#A9BCD6" />
              <Text size={13} color="#A9BCD6">
                {hero.read} чтения · {hero.ago}
              </Text>
            </View>
          </View>
        </Pressable>
      ) : null}

      <Text display size={24} lineHeight={28} style={{ marginHorizontal: 20, marginTop: 4, marginBottom: -6 }}>
        Рубрики
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
        {rubrics.map((r) => {
          const on = rubric === r.title;
          const bg = r.tone === 'navy' ? colors.navy : r.tone === 'blue' ? colors.blue : colors.surface;
          const fg = r.tone === 'white' ? 'text' : 'surface';
          return (
            <Pressable key={r.title} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => setRubric(on ? null : r.title)} style={{ width: 150, height: 104, padding: 14, borderRadius: 20, overflow: 'hidden', backgroundColor: bg, justifyContent: 'space-between', borderWidth: 2, borderColor: on ? colors.red : 'transparent', ...(r.tone === 'white' ? shadows.card : null) }}>
              <Star w={54} fill={r.tone === 'navy' ? colors.blue : r.tone === 'blue' ? colors.sky : '#DCEEF8'} style={{ right: -14, top: -14 }} />
              <Text display size={19} lineHeight={20} upper color={fg}>
                {r.title}
              </Text>
              <Text size={13} color={fg} style={{ opacity: 0.85 }}>
                {on ? 'Показать все ×' : r.count}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text display size={24} lineHeight={28} style={{ marginHorizontal: 20, marginTop: 8, marginBottom: -4 }}>
        {rubric ?? 'Свежие материалы'}
      </Text>
      <View style={{ gap: 12, paddingHorizontal: 20 }}>
        {list.map((s) => (
          <Pressable key={s.id} accessibilityRole="link" onPress={() => open(s)} style={{ flexDirection: 'row', borderRadius: radius.l, overflow: 'hidden', backgroundColor: colors.surface, ...shadows.card }}>
            <Image source={s.photo} style={{ width: 112, minHeight: 140, backgroundColor: colors.surfaceSunken }} contentFit="cover" contentPosition={s.pos} />
            <View style={{ flex: 1, paddingTop: 14, paddingHorizontal: 14, paddingBottom: 12, gap: 6 }}>
              <Text size={12} weight={700} upper color={kindColor[s.kind]} style={{ letterSpacing: 0.7 }}>
                {kindLabel[s.kind]}
              </Text>
              <Text size={16} lineHeight={20} weight={700}>
                {s.title}
              </Text>
              <View style={{ marginTop: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="clock-01" size={15} color="text2" />
                <Text size={13} color="text2">
                  {s.read} · {s.ago}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
        {!list.length ? (
          <Text size={15} color="text2" align="center" style={{ marginTop: 12 }}>
            В этой подборке пока нет материалов такого формата
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}
