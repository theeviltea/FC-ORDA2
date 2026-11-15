import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, GameSheet, Icon, NavBar, Notice, Pressable, Screen, Text } from '@/components';
import { match, setStadium, useStadium } from '@/data/stadium';
import { Card, Footer, MatchStrip, Points, Rules, SectionTitle, TimerBar } from '@/features/stadium/parts';
import { colors } from '@/theme';

type Mode = 'locked' | 'edit' | 'saved' | 'closed';
const crowd = [
  { label: 'Победа ORDA', pct: 64, color: colors.blue },
  { label: 'Ничья', pct: 22, color: colors.sky },
  { label: 'Победа Кайрата', pct: 14, color: colors.text3 },
];

function Stepper({ team, value, onChange }: { team: string; value: number; onChange: (v: number) => void }) {
  const btn = (icon: 'minus-sign' | 'add-01', d: number, off: boolean) => (
    <Pressable accessibilityRole="button" accessibilityLabel={`${team}: ${d > 0 ? 'больше' : 'меньше'}`} disabled={off} onPress={() => onChange(value + d)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: off ? colors.surfaceSunken : colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={20} color={off ? 'text3' : 'blue'} weight={2.4} />
    </Pressable>
  );
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 10 }}>
      <Text size={14} weight={700} color="text2" upper>
        {team}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {btn('minus-sign', -1, value <= 0)}
        <Text display size={52} lineHeight={56} style={{ minWidth: 40 }} align="center" accessibilityLiveRegion="polite">
          {String(value)}
        </Text>
        {btn('add-01', 1, value >= 9)}
      </View>
    </View>
  );
}

/**
 * Счёт перерыва: прогноз до 30′. `?mode=locked|closed` показывает состояния до начала и после закрытия приёма.
 * После сохранения прогноз не меняется; результат — после 45′ (в прототипе — кнопкой).
 */
export default function HalftimeScore() {
  const p = useLocalSearchParams<{ mode?: Mode }>();
  const s = useStadium();
  const mode: Mode = p.mode === 'locked' || p.mode === 'closed' ? p.mode : s.prediction ? 'saved' : 'edit';
  const [o, setO] = useState(1);
  const [k, setK] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const pr = s.prediction;

  const footer =
    mode === 'edit' ? (
      <Footer>
        <Button label={`Сохранить прогноз ${o} : ${k}`} icon="tick-02" height={54} onPress={() => setConfirm(true)} />
      </Footer>
    ) : mode === 'saved' ? (
      <Footer>
        <Button label="Перерыв: узнать результат" icon="football" height={54} onPress={() => router.push('/stadium/score-result')} />
        <Text size={12} color="text2" align="center">
          В прототипе результат открывается сразу
        </Text>
      </Footer>
    ) : null;

  return (
    <Screen gap={16} header={<NavBar title="Счёт перерыва" />} footer={footer} footerHeight={footer ? 110 : 0}>
      <MatchStrip minute={mode === 'locked' ? 'Начало в 19:00' : mode === 'closed' ? 'Идёт сейчас · 38′' : 'Идёт сейчас · 18′'} score={mode === 'locked' ? '– : –' : mode === 'closed' ? '1 : 0' : '0 : 0'} live={mode !== 'locked'}>
        {mode === 'edit' ? <TimerBar label="Приём прогнозов до 30′" left="осталось 12 мин" pct={0.6} /> : null}
        {mode === 'saved' ? <TimerBar label="Прогноз принят" left="итог после 45′" pct={1} color="#7FD3A2" /> : null}
      </MatchStrip>

      {mode === 'locked' ? (
        <Card>
          <Notice icon="square-lock-01" text="Прогнозы откроются со стартовым свистком и принимаются до 30-й минуты." />
        </Card>
      ) : null}

      {mode === 'edit' ? (
        <Card gap={16}>
          <Text display size={20} lineHeight={22} align="center">
            Какой будет счёт к перерыву?
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Stepper team={match.home} value={o} onChange={setO} />
            <Text display size={36} color="text3">
              :
            </Text>
            <Stepper team="Кайрат" value={k} onChange={setK} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Points n="Точный счёт +20" />
            <Points n="Исход +5" />
          </View>
        </Card>
      ) : null}

      {mode === 'saved' && pr ? (
        <Card gap={12}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.successBg, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="tick-02" size={22} color="successText" weight={2.4} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text size={13} color="text2">
                Ваш прогноз
              </Text>
              <Text display size={28} lineHeight={30}>
                {`ORDA ${pr.o} : ${pr.k} Кайрат`}
              </Text>
            </View>
          </View>
          <Notice icon="clock-01" text="Итог подведём в перерыве — пришлём пуш с результатом." />
        </Card>
      ) : null}

      {mode === 'closed' ? (
        <Card>
          <Notice icon="square-lock-01" tone="warn" text={pr ? `Приём закрыт. Ваш прогноз ${pr.o} : ${pr.k} — итог после 45′.` : 'Приём прогнозов закрыт на 30-й минуте. Попробуйте на следующем матче!'} />
        </Card>
      ) : null}

      {mode === 'saved' || mode === 'closed' ? (
        <>
          <SectionTitle>Что думают трибуны</SectionTitle>
          <Card gap={12}>
            {crowd.map((c) => (
              <View key={c.label} style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text size={15}>{c.label}</Text>
                  <Text size={15} weight={700}>{`${c.pct}%`}</Text>
                </View>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.surfaceSunken, overflow: 'hidden' }}>
                  <View style={{ width: `${c.pct}%`, height: 8, borderRadius: 4, backgroundColor: c.color }} />
                </View>
              </View>
            ))}
            <Text size={13} color="text2">
              Самый частый прогноз — 1 : 0 · 2 341 болельщик
            </Text>
          </Card>
        </>
      ) : null}

      <Rules
        title="Правила"
        items={[
          ['clock-01', 'Прогноз принимается до 30-й минуты, изменить его нельзя'],
          ['star', 'Точный счёт первого тайма — +20 баллов'],
          ['football', 'Угадали, кто ведёт, или ничью — +5 баллов'],
        ]}
      />

      <GameSheet visible={confirm} onClose={() => setConfirm(false)} icon="football" title={`Прогноз ${o} : ${k}?`} text="После сохранения прогноз изменить нельзя. Итог — в перерыве.">
        <Button label="Сохранить" height={54} onPress={() => (setStadium({ prediction: { o, k } }), setConfirm(false))} />
        <Button label="Изменить" variant="muted" height={50} onPress={() => setConfirm(false)} />
      </GameSheet>
    </Screen>
  );
}
