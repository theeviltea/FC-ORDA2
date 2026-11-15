import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, GameSheet, NavBar, Notice, Screen, Text } from '@/components';
import { img } from '@/data/images';
import { cooldownLeft, setStadium, useStadium } from '@/data/stadium';
import { Card, Chip, Footer, MatchStrip, Points, Timeline, type StepState } from '@/features/stadium/parts';
import { colors } from '@/theme';

type Stage = 'moderation' | 'queue' | 'rejected' | 'missed';

/**
 * Статус фото: модерация → очередь → показ. Прототип: этапы сменяются сами, затем открывается «Вы на табло».
 * `?stage=rejected|missed` показывает отказ модерации и «не успели показать».
 */
export default function PhotoStatus() {
  const p = useLocalSearchParams<{ stage?: Stage }>();
  const s = useStadium();
  const [stage, setStage] = useState<Stage>(p.stage ?? 'moderation');
  const [sheet, setSheet] = useState(false);
  const wait = cooldownLeft(s.photoSentAt);

  useEffect(() => {
    if (stage === 'moderation') {
      const t = setTimeout(() => setStage('queue'), 2600);
      return () => clearTimeout(t);
    }
    if (stage === 'queue') {
      const t = setTimeout(() => router.replace('/stadium/photo-shown'), 3200);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const look: Record<Stage, [StepState, StepState, StepState]> = {
    moderation: ['now', 'next', 'next'],
    queue: ['done', 'now', 'next'],
    rejected: ['fail', 'off', 'off'],
    missed: ['done', 'done', 'fail'],
  };
  const [a, b, c] = look[stage];
  const chip = { moderation: ['На модерации', colors.blue10, colors.blue600], queue: ['В очереди · 3-я', colors.blue10, colors.blue600], rejected: ['Не прошло модерацию', colors.errorBg, '#B0040E'], missed: ['Не успели показать', '#FFF4DC', '#8A5A00'] }[stage];

  const again = () => {
    if (stage === 'rejected') setStadium({ photoSentAt: null });
    if (stage !== 'rejected' && wait) return setSheet(true);
    router.replace('/stadium/photo');
  };

  return (
    <Screen
      gap={16}
      header={<NavBar title="Моё фото" />}
      footer={
        <Footer>
          <Button label={stage === 'rejected' ? 'Отправить другое фото' : 'Отправить ещё фото'} icon="camera-01" height={54} variant={stage === 'rejected' ? 'primary' : 'soft'} onPress={again} />
        </Footer>
      }
      footerHeight={90}>
      <MatchStrip minute="Идёт сейчас · 33′" score="1 : 0" />
      <Card gap={14}>
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <View style={{ width: 84, height: 104, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.navy, borderWidth: 3, borderColor: colors.blue }}>
            <Image source={img.photoFans} accessibilityLabel="Ваше фото" style={{ width: '100%', height: '100%', opacity: stage === 'rejected' ? 0.5 : 1 }} contentFit="cover" contentPosition={{ top: '20%', left: '35%' }} />
          </View>
          <View style={{ flex: 1, gap: 8 }}>
            <Chip label={chip[0]} bg={chip[1]} fg={chip[2]} icon={stage === 'rejected' ? 'cancel-01' : 'clock-01'} />
            <Text size={16} lineHeight={21} weight={700}>
              {stage === 'moderation' ? 'Проверяем фото' : stage === 'queue' ? 'Скоро на табло' : stage === 'rejected' ? 'Фото не покажут' : 'Матч закончился раньше'}
            </Text>
            <Text size={13} lineHeight={18} color="text2">
              {stage === 'moderation' ? 'Обычно 1–2 минуты' : stage === 'queue' ? 'Смотрите на экран над Северной трибуной' : stage === 'rejected' ? 'Можно отправить другое фото сразу' : 'Ваше фото было в очереди'}
            </Text>
          </View>
        </View>
        {stage === 'rejected' ? <Notice icon="alert-02" tone="err" text="Причина: на фото не видно лица. Попробуйте селфи поближе и при хорошем свете." /> : null}
        {stage === 'missed' ? <Notice icon="gift" tone="ok" text="Спасибо за участие — начислили +10 баллов." /> : null}
      </Card>

      <Card padding={18} gap={0}>
        <Timeline
          steps={[
            { state: a, title: 'Модерация', sub: a === 'fail' ? 'Фото не прошло проверку' : a === 'done' ? 'Фото одобрено' : 'Модератор проверяет фото' },
            { state: b, title: 'Очередь на табло', sub: b === 'done' ? 'Дошла ваша очередь' : stage === 'queue' ? 'Перед вами 2 фото' : 'После модерации' },
            { state: c, title: 'Показ на табло', sub: c === 'fail' ? 'Не успели до конца матча' : '+30 баллов после показа', icon: c === 'fail' ? 'cancel-01' : 'tv-01' },
          ]}
        />
      </Card>
      {stage === 'moderation' || stage === 'queue' ? (
        <View style={{ marginHorizontal: 20 }}>
          <Points n="+30 баллов после показа" />
        </View>
      ) : null}

      <GameSheet visible={sheet} onClose={() => setSheet(false)} icon="clock-01" tone="warn" title={`Следующее фото через ${wait} мин`} text="Одно фото раз в 10 минут — так на табло попадёт больше болельщиков.">
        <Button label="Понятно" height={54} onPress={() => setSheet(false)} />
      </GameSheet>
    </Screen>
  );
}
