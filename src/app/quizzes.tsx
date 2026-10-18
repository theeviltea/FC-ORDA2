import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Icon, NavBar, Screen, SegmentedTabs, Star, Text } from '@/components';
import { img } from '@/data/images';
import { quizzes, status, useQuizzes } from '@/data/quizzes';
import { colors, radius, shadows } from '@/theme';

const plural = (n: number, a: string, b: string, c: string) => (n % 10 === 1 && n % 100 !== 11 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? b : c);

/** Викторины: баннер, фильтр Все / Доступные / Пройденные, карточки в четырёх состояниях. */
export default function Quizzes() {
  const progress = useQuizzes();
  const [tab, setTab] = useState(0);
  const list = quizzes.map((q) => ({ q, s: status(q, progress[q.id]), p: progress[q.id] }));
  const open = list.filter((x) => x.s === 'new' || x.s === 'progress');
  const done = list.filter((x) => x.s === 'done');
  const vis = tab === 0 ? list : tab === 1 ? open : done;
  const go = (id: string) => router.push({ pathname: '/quiz/[id]', params: { id } });

  return (
    <Screen gap={14} header={<NavBar title="Викторины" />}>
      <View style={{ marginHorizontal: 20, padding: 16, paddingRight: 110, borderRadius: radius.l, backgroundColor: colors.blue10, overflow: 'hidden', gap: 6 }}>
        <Star w={120} fill="#B8E2F4" style={{ right: -16, top: -10 }} />
        <Image source={img.icon3dQuiz} style={{ position: 'absolute', right: 12, top: '50%', marginTop: -44, width: 88, height: 88 }} contentFit="contain" />
        <Text size={19} lineHeight={23} weight={700}>
          Знаешь всё об «Ордабасы»?
        </Text>
        <Text size={14} lineHeight={18} color="text2">
          Проверь себя и получи баллы за правильные ответы.
        </Text>
      </View>
      <SegmentedTabs labels={['Все', 'Доступные', 'Пройденные']} counts={[0, open.length, 0]} active={tab} onChange={setTab} label="Фильтр" />
      {vis.map(({ q, s, p }) => {
        const n = q.questions.length || 10;
        const meta = s === 'soon' ? 'Скоро' : `${n} ${plural(n, 'вопрос', 'вопроса', 'вопросов')} · ${q.minutes} ${plural(q.minutes, 'минута', 'минуты', 'минут')}${s === 'done' ? '' : ` · +${n * q.perAnswer} баллов`}`;
        return (
          <View key={q.id} style={{ marginHorizontal: 20, padding: 16, gap: 12, borderRadius: radius.l, backgroundColor: colors.surface, ...shadows.card }}>
            <View style={{ gap: 4 }}>
              <Text size={19} lineHeight={23} weight={700}>
                {q.title}
              </Text>
              <Text size={13} color="text2">
                {meta}
              </Text>
            </View>
            {s === 'new' ? (
              <>
                <View style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.blue10 }}>
                  <Text size={13} weight={700} color="blue600">
                    Новая викторина
                  </Text>
                </View>
                <Button label="Начать викторину" onPress={() => go(q.id)} />
              </>
            ) : s === 'progress' ? (
              <>
                <View style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.blue10, gap: 8 }}>
                  <Text size={13} weight={700} color="blue600">
                    В процессе · {p!.answers.length} из {n} вопросов
                  </Text>
                  <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: n, now: p!.answers.length }} style={{ height: 6, borderRadius: 3, backgroundColor: '#B8E2F4', overflow: 'hidden' }}>
                    <View style={{ width: `${(p!.answers.length / n) * 100}%`, height: 6, borderRadius: 3, backgroundColor: colors.blue }} />
                  </View>
                </View>
                <Button label="Продолжить" onPress={() => go(q.id)} />
              </>
            ) : s === 'done' ? (
              <>
                <View style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.surfaceSunken, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon name="checkmark-circle-02" size={18} color="blue" weight={1.8} />
                  <Text size={13} weight={700}>
                    Пройдена · {p!.result!.right} из {p!.result!.total} верно · +{p!.result!.points} баллов
                  </Text>
                </View>
                <Button label="Посмотреть результат" variant="soft" onPress={() => router.push({ pathname: '/quiz/result', params: { id: q.id } })} />
              </>
            ) : (
              <View style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.surfaceSunken, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="clock-01" size={16} color="text2" weight={1.8} />
                <Text size={13} weight={700} color="text2">
                  Откроется {q.opensAt}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </Screen>
  );
}
