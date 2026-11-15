import { router, useLocalSearchParams, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { Appear, GlowRing, Icon, PointsPill, ResultButton, ResultRows, ResultScreen } from '@/components';
import { match } from '@/data/stadium';
import { colors } from '@/theme';

/** Отметка на стадионе прошла: +50 баллов, все игры открыты. `?next=` — игра, ради которой отмечались. */
export default function CheckedIn() {
  const { next } = useLocalSearchParams<{ next?: string }>();
  return (
    <>
      <StatusBar style="light" />
      <ResultScreen
        top={
          <Appear kind="pop" delay={100}>
            <GlowRing radius={48} delay={900} />
            <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="location-01" size={46} color="blue" weight={1.8} />
            </View>
          </Appear>
        }
        title="Вы на стадионе!"
        text="Отметка принята — все игры матча открыты."
        actions={<ResultButton label={next ? 'Продолжить' : 'К играм'} onPress={() => (next ? router.replace(next as Href) : router.back())} />}>
        <PointsPill n="+50 баллов" />
        <ResultRows
          delay={1200}
          rows={[
            { label: 'Матч', value: match.title },
            { label: 'Место', value: `${match.seat.sector}, ряд ${match.seat.row}, место ${match.seat.place}` },
          ]}
        />
      </ResultScreen>
    </>
  );
}
