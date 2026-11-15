import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { Appear, PointsPill, ResultButton, ResultRows, ResultScreen, Text } from '@/components';
import { judge, match, useStadium } from '@/data/stadium';

/** Итог прогноза в перерыве: точный счёт (+20), угадан исход (+5) или мимо. */
export default function ScoreResult() {
  const { prediction: p } = useStadium();
  const r = judge(p);
  const h = match.halftime;
  const copy = {
    exact: ['Точно в цель!', 'Вы угадали точный счёт первого тайма.', '+20 баллов'],
    outcome: ['Почти!', 'Счёт другой, но исход вы угадали.', '+5 баллов'],
    miss: ['Не в этот раз', 'Прогноз не сыграл. Во втором тайме ещё есть розыгрыш!', null],
  }[r];
  return (
    <>
      <StatusBar style="light" />
      <ResultScreen
        happy={r !== 'miss'}
        top={
          <Appear kind="pop" delay={100}>
            <View style={{ paddingHorizontal: 22, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center' }}>
              <Text size={13} color="onDark2">
                Перерыв
              </Text>
              <Text display size={48} lineHeight={50} color="surface">
                {`${h.o} : ${h.k}`}
              </Text>
            </View>
          </Appear>
        }
        title={copy[0]!}
        text={copy[1]!}
        actions={
          <>
            <ResultButton label="К розыгрышу" icon="gift" onPress={() => router.replace('/stadium/draw')} />
            <ResultButton label="К играм" outline onPress={() => router.dismissTo('/interactive')} />
          </>
        }>
        {copy[2] ? <PointsPill n={copy[2]} /> : null}
        <ResultRows
          rows={[
            { label: 'Ваш прогноз', value: p ? `${p.o} : ${p.k}` : '—' },
            { label: 'Точный счёт', value: r === 'exact' ? '+20' : '—', mark: r === 'exact' ? 'yes' : 'no' },
            { label: 'Исход', value: r === 'outcome' ? '+5' : r === 'exact' ? 'угадан' : '—', mark: r === 'miss' ? 'no' : 'yes' },
          ]}
        />
      </ResultScreen>
    </>
  );
}
