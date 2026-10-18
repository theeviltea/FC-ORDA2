import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, NavBar, Pressable, Screen, Text } from '@/components';
import { img } from '@/data/images';
import { answer, findQuiz, finish, quizzes, useQuizzes } from '@/data/quizzes';
import { colors, radius, shadows } from '@/theme';

const GREEN = '#1E9E5A';

/** Вопрос викторины: прогресс, баллы, варианты (радио), «Ответить» → верно / не совсем → «Следующий вопрос». */
export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const quiz = findQuiz(id ?? '') ?? quizzes[0];
  const progress = useQuizzes()[quiz.id] ?? { answers: [] };
  const insets = useSafeAreaInsets();
  const [pick, setPick] = useState<number | null>(null);
  const [shown, setShown] = useState(false);

  const total = quiz.questions.length;
  // While feedback is shown the answer is already stored, so the current question is the last answered one.
  const i = shown ? progress.answers.length - 1 : progress.answers.length;
  const Q = quiz.questions[Math.min(i, total - 1)];
  const score = progress.answers.filter((a, k) => a === quiz.questions[k].right).length * quiz.perAnswer;
  const ok = shown && pick === Q.right;
  const last = i >= total - 1;

  const onAnswer = () => {
    if (pick === null) return;
    answer(quiz.id, pick);
    setShown(true);
  };
  const onNext = () => {
    if (last) {
      finish(quiz.id);
      router.replace({ pathname: '/quiz/result', params: { id: quiz.id } });
      return;
    }
    setPick(null);
    setShown(false);
  };

  const footer = (
    <View style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(insets.bottom, 12) + 16, gap: 10, alignItems: 'center' }}>
      {shown ? (
        <Pressable accessibilityRole="button" onPress={onNext} style={{ alignSelf: 'stretch', height: 54, borderRadius: 16, backgroundColor: colors.blue600, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Text size={17} weight={700} color="surface">
            {last ? 'Завершить викторину' : 'Следующий вопрос'}
          </Text>
          <Icon name="arrow-right-01" size={20} color="surface" weight={2} />
        </Pressable>
      ) : (
        <Button label="Ответить" height={54} disabled={pick === null} onPress={onAnswer} style={{ alignSelf: 'stretch' }} />
      )}
      <Text size={13} color="text2">
        {shown ? (last ? 'Это был последний вопрос' : `Вопрос ${i + 2} из ${total} — дальше`) : `+${quiz.perAnswer} баллов за правильный ответ`}
      </Text>
    </View>
  );

  return (
    <Screen gap={14} header={<NavBar title="Викторина" />} footer={footer} footerHeight={96}>
      <View style={{ marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text size={15} weight={700} accessibilityLiveRegion="polite">
          Вопрос {i + 1} из {total}
        </Text>
        <View style={{ height: 30, paddingLeft: 4, paddingRight: 10, borderRadius: 15, borderWidth: 1.5, borderColor: colors.blue, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Image source={img.coin} style={{ width: 22, height: 22 }} contentFit="contain" />
          <Text size={15} weight={700}>
            {score} баллов
          </Text>
        </View>
      </View>
      <View style={{ marginHorizontal: 20, flexDirection: 'row', gap: 4 }} aria-hidden>
        {quiz.questions.map((x, k) => {
          const a = progress.answers[k];
          const c = a === undefined ? (k === i ? colors.blue : colors.line) : a === x.right ? GREEN : colors.red;
          return <View key={k} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: c }} />;
        })}
      </View>

      <View style={{ marginHorizontal: 20, padding: 18, gap: 10, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card }}>
        <View style={{ alignSelf: 'flex-start', height: 24, paddingHorizontal: 10, borderRadius: 12, backgroundColor: colors.blue10, justifyContent: 'center' }}>
          <Text size={12} lineHeight={14} weight={700} color="blue600">
            {Q.tag}
          </Text>
        </View>
        <Text display size={23} lineHeight={28} accessibilityRole="header">
          {Q.q}
        </Text>
        <Text size={14} color="text2">
          {shown ? (ok ? 'Отличный ответ!' : 'Ответ засчитан') : 'Выбери один вариант ответа'}
        </Text>
        <View accessibilityRole="radiogroup" accessibilityLabel="Варианты ответа" style={{ gap: 10, marginTop: 6 }}>
          {Q.options.map((o, k) => {
            const isPick = k === pick;
            const isRight = k === Q.right;
            let border = 'transparent';
            let bg: string = colors.bg;
            let mark: 'empty' | 'dot' | 'ok' | 'bad' = 'empty';
            let tag = '';
            if (!shown && isPick) {
              border = colors.blue;
              bg = colors.blue10;
              mark = 'dot';
            }
            if (shown && isRight) {
              border = GREEN;
              bg = colors.successBg;
              mark = 'ok';
              tag = isPick ? `+${quiz.perAnswer}` : 'Верный ответ';
            }
            if (shown && isPick && !isRight) {
              border = colors.red;
              bg = colors.errorBg;
              mark = 'bad';
              tag = 'Ваш ответ';
            }
            const strong = mark !== 'empty';
            return (
              <Pressable
                key={o}
                accessibilityRole="radio"
                accessibilityState={{ checked: isPick, disabled: shown }}
                disabled={shown}
                onPress={() => setPick(k)}
                style={{ minHeight: 56, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, borderWidth: 2, borderColor: border, backgroundColor: bg, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {mark === 'empty' ? <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#8391AD' }} /> : null}
                {mark === 'dot' ? (
                  <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.blue, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue }} />
                  </View>
                ) : null}
                {mark === 'ok' || mark === 'bad' ? (
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: mark === 'ok' ? GREEN : colors.red, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={mark === 'ok' ? 'tick-02' : 'cancel-01'} size={14} color="surface" weight={2.8} />
                  </View>
                ) : null}
                <Text size={17} weight={strong ? 700 : 500} style={{ flex: 1 }}>
                  {o}
                </Text>
                {tag ? (
                  <Text size={13} weight={700} color={mark === 'bad' ? 'errorText' : 'successText'}>
                    {tag}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {shown ? (
        <View accessibilityLiveRegion="polite" style={{ marginHorizontal: 20, paddingVertical: 14, paddingHorizontal: 16, borderRadius: radius.l, backgroundColor: ok ? colors.successBg : colors.errorBg, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {ok ? (
            <Image source={img.coin} style={{ width: 48, height: 48 }} contentFit="contain" />
          ) : (
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="cancel-01" size={24} color="errorText" weight={2.4} />
            </View>
          )}
          <View style={{ flex: 1, gap: 2 }}>
            <Text display size={22} lineHeight={24} upper color={ok ? 'successText' : 'errorText'}>
              {ok ? `Верно! +${quiz.perAnswer} баллов` : 'Не совсем'}
            </Text>
            <Text size={14} lineHeight={19} color={ok ? 'successText' : 'errorText'}>
              {ok ? Q.note : `Правильный ответ — ${Q.options[Q.right]}. Баллы не начислены.`}
            </Text>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}
