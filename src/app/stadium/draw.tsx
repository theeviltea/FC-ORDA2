import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Icon, NavBar, Notice, PointsPill, ResultButton, ResultRows, ResultScreen, Screen, Text } from '@/components';
import { img } from '@/data/images';
import { match, setStadium, useStadium } from '@/data/stadium';
import { Card, Footer, MatchStrip, Rules, SectionTitle, TimerBar } from '@/features/stadium/parts';
import { colors, shadows } from '@/theme';

type Phase = 'wait' | 'ineligible' | 'live' | 'lost';
const prizes = [
  { title: 'Форма с автографами', sub: '1 победитель', photo: img.jersey },
  { title: 'Мяч ORDA', sub: '2 победителя', photo: null },
  { title: '500 баллов', sub: '5 победителей', photo: img.coin },
];
const sectors = ['Юг', 'Север', 'Запад', 'Восток'];
const rnd = (n: number) => 1 + Math.floor(Math.random() * n);

function Drum({ label, value, done }: { label: string; value: string; done: boolean }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
      <Text size={12} weight={700} upper color="onDark2" style={{ letterSpacing: 1 }}>
        {label}
      </Text>
      <View style={{ alignSelf: 'stretch', height: 72, borderRadius: 16, backgroundColor: done ? colors.surface : 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
        <Text display size={value.length > 3 ? 22 : 34} color={done ? 'navy' : 'surface'}>
          {value}
        </Text>
      </View>
    </View>
  );
}

/**
 * Розыгрыш в перерыве: билет участвует автоматически. Прототип: розыгрыш запускается кнопкой,
 * барабаны крутятся ~3 с, результат случайный (выигрыш → экран приза). `?phase=ineligible` — билет не участвует.
 */
export default function HalftimeDraw() {
  const q = useLocalSearchParams<{ phase?: Phase }>();
  const s = useStadium();
  const [phase, setPhase] = useState<Phase>(q.phase === 'ineligible' ? 'ineligible' : s.drawResult === 'lost' ? 'lost' : 'wait');
  const [drums, setDrums] = useState(['—', '—', '—']);
  const [stopped, setStopped] = useState(0);

  useEffect(() => {
    if (phase !== 'live') return;
    const win = Math.random() < 0.5;
    const final = win ? [match.seat.sector.split(' ')[0], match.seat.row, match.seat.place] : ['Север', '8', '21'];
    let n = 0;
    const t = setInterval(() => {
      n += 1;
      const stop = n > 34 ? 3 : n > 26 ? 2 : n > 18 ? 1 : 0;
      setStopped(stop);
      setDrums((d) => d.map((v, i) => (i < stop ? final[i] : i === 0 ? sectors[rnd(4) - 1] : String(rnd(i === 1 ? 30 : 40)))));
      if (n > 40) {
        clearInterval(t);
        setStadium({ drawResult: win ? 'won' : 'lost' });
        if (win) router.replace('/stadium/draw-win');
        else setPhase('lost');
      }
    }, 80);
    return () => clearInterval(t);
  }, [phase]);

  if (phase === 'lost')
    return (
      <>
        <StatusBar style="light" />
        <ResultScreen
          happy={false}
          title="В этот раз не повезло"
          text="Форму с автографами выиграл болельщик с Северной трибуны. Спасибо, что участвовали!"
          actions={
            <>
              <ResultButton label="К играм" onPress={() => router.dismissTo('/interactive')} />
              <ResultButton label="Отправить фото на табло" icon="camera-01" outline onPress={() => router.replace('/stadium/photo')} />
            </>
          }>
          <PointsPill n="+10 баллов за участие" />
          <ResultRows
            rows={[
              { label: 'Победитель', value: 'Север, ряд 8, место 21' },
              { label: 'Ваше место', value: `${match.seat.sector}, ряд ${match.seat.row}, место ${match.seat.place}` },
            ]}
          />
        </ResultScreen>
      </>
    );

  if (phase === 'live')
    return (
      <Screen gap={16} header={<NavBar title="Розыгрыш" />} bg={colors.navy} headerBg={colors.navy}>
        <StatusBar style="light" />
        <View style={{ alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingTop: 20 }}>
          <Image source={img.jersey} style={{ width: 150, height: 150 }} contentFit="contain" />
          <Text display size={30} lineHeight={32} upper color="surface" align="center">
            Разыгрываем форму
          </Text>
          <Text size={15} color="onDark2" align="center">
            Смотрите на табло — победителя покажут на экране
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 20 }} accessibilityLiveRegion="polite">
          <Drum label="Сектор" value={drums[0]} done={stopped > 0} />
          <Drum label="Ряд" value={drums[1]} done={stopped > 1} />
          <Drum label="Место" value={drums[2]} done={stopped > 2} />
        </View>
        <Text size={14} color="onDark2" align="center" style={{ marginHorizontal: 20 }}>
          {`Ваше место: ${match.seat.sector}, ряд ${match.seat.row}, место ${match.seat.place}`}
        </Text>
      </Screen>
    );

  const ok = phase === 'wait';
  return (
    <Screen
      gap={16}
      header={<NavBar title="Розыгрыш в перерыве" />}
      footer={
        ok ? (
          <Footer>
            <Button label="Начать розыгрыш" icon="gift" height={54} onPress={() => setPhase('live')} />
            <Text size={12} color="text2" align="center">
              В прототипе розыгрыш запускается кнопкой
            </Text>
          </Footer>
        ) : null
      }
      footerHeight={ok ? 110 : 0}>
      <MatchStrip minute="Идёт сейчас · 41′" score="1 : 0">
        <TimerBar label="Розыгрыш в перерыве" left="через 4 мин" pct={0.9} />
      </MatchStrip>

      <Card gap={12}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: ok ? colors.successBg : colors.errorBg, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={ok ? 'ticket-01' : 'cancel-01'} size={24} color={ok ? 'successText' : 'red'} weight={1.8} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text size={16} weight={700}>
              {ok ? 'Ваш билет участвует' : 'Билет не участвует'}
            </Text>
            <Text size={13} lineHeight={18} color="text2">
              {ok ? `${match.seat.sector}, ряд ${match.seat.row}, место ${match.seat.place}` : 'Отметиться нужно было до 45-й минуты'}
            </Text>
          </View>
        </View>
        {ok ? <Notice icon="information-circle" text="Ничего делать не нужно — просто будьте на месте и держите телефон под рукой." /> : <Notice icon="alert-02" tone="warn" text="На следующем матче нажмите «Я на стадионе» заранее — и билет попадёт в розыгрыш." />}
      </Card>

      <SectionTitle>Призы</SectionTitle>
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20 }}>
        {prizes.map((p) => (
          <View key={p.title} style={{ flex: 1, padding: 12, gap: 6, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', ...shadows.card }}>
            {p.photo ? (
              <Image source={p.photo} style={{ width: 64, height: 64 }} contentFit="contain" />
            ) : (
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="football" size={34} color="blue" weight={1.6} />
              </View>
            )}
            <Text size={14} lineHeight={17} weight={700} align="center">
              {p.title}
            </Text>
            <Text size={12} color="text2" align="center">
              {p.sub}
            </Text>
          </View>
        ))}
      </View>

      <Rules
        title="Как это работает"
        items={[
          ['ticket-01', 'Участвуют все, кто отметился на стадионе до 45-й минуты'],
          ['tv-01', 'Победителей покажут на табло и пришлют пуш'],
          ['gift', 'Приз забирают у стойки фан-шопа у входа «Юг», он хранится 7 дней'],
        ]}
      />
    </Screen>
  );
}
