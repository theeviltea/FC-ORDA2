import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appear, Confetti, GlowRing, Gradient, Pressable, Text, TwinkleStar } from '@/components';
import { img } from '@/data/images';
import { findQuiz, restart, useQuizzes } from '@/data/quizzes';
import { colors } from '@/theme';

/** Итог викторины: кубок, «8 из 10», начисленные баллы, «Закрыть». Анимация — как на борде «Итог викторины». */
export default function QuizResult() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const quiz = findQuiz(id ?? '');
  const r = useQuizzes()[id ?? '']?.result ?? { right: 0, total: 0, points: 0 };
  const canRetry = !!quiz?.questions.length;
  return (
    <Gradient style={{ flex: 1, overflow: 'hidden' }}>
      <TwinkleStar w={90} duration={3000} style={{ right: 30, top: 110 }} />
      <TwinkleStar w={70} duration={4000} delay={800} style={{ left: 18, top: 420 }} />
      <TwinkleStar w={260} duration={6000} delay={300} style={{ right: -110, top: 300 }} />
      <View style={{ paddingTop: insets.top + 90, paddingHorizontal: 28, alignItems: 'center', gap: 22 }}>
        <Appear>
          <Text display size={30} lineHeight={35} upper color="surface" align="center" accessibilityRole="header">
            {'Поздравляем!\nВы завершили викторину'}
          </Text>
        </Appear>
        <Appear kind="pop" delay={200} duration={900} float>
          <Image source={img.trophy} accessibilityLabel="Кубок" style={{ width: 210, height: 186, filter: 'drop-shadow(0 18px 28px rgba(10, 18, 36, 0.4))' } as object} contentFit="contain" />
        </Appear>
        <Appear delay={600} style={{ alignItems: 'center', gap: 2 }}>
          <Text size={17} color="blue10">
            Ваш результат
          </Text>
          <Appear kind="pop" delay={900} duration={700}>
            <Text display size={44} lineHeight={48} color="surface">
              {r.right} из {r.total}
            </Text>
          </Appear>
        </Appear>
        <Appear kind="pop" delay={1300} duration={600}>
          <GlowRing radius={22} />
          <View style={{ height: 44, paddingLeft: 8, paddingRight: 18, borderRadius: 22, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Image source={img.coin} style={{ width: 30, height: 30 }} contentFit="contain" />
            <Text size={18} weight={700}>
              +{r.points} баллов
            </Text>
          </View>
        </Appear>
      </View>
      <Confetti />
      <Appear delay={1600} duration={600} style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(insets.bottom, 12) + 20, gap: 8 }}>
        {canRetry ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              restart(quiz!.id);
              router.replace({ pathname: '/quiz/[id]', params: { id: quiz!.id } });
            }}
            style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
            <Text size={16} weight={700} color="surface">
              Пройти ещё раз
            </Text>
          </Pressable>
        ) : null}
        <Pressable accessibilityRole="button" onPress={() => router.dismissTo('/quizzes')} style={{ height: 54, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Text size={17} weight={700}>
            Закрыть
          </Text>
        </Pressable>
      </Appear>
    </Gradient>
  );
}
