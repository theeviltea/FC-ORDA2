import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Appear, Button, GameSheet, Icon, Notice, ResultButton, ResultRows, ResultScreen, Text } from '@/components';
import { img } from '@/data/images';
import { match, setStadium, useStadium } from '@/data/stadium';
import { FakeQR } from '@/features/stadium/parts';
import { colors } from '@/theme';

/**
 * Выигрыш в розыгрыше: форма с автографами. QR-код показывают у стойки фан-шопа.
 * Прототип: через 3 с после открытия QR приз отмечается как полученный (имитация сканирования).
 */
export default function DrawWin() {
  const { prizeClaimed } = useStadium();
  const [qr, setQr] = useState(false);

  useEffect(() => {
    if (!qr || prizeClaimed) return;
    const t = setTimeout(() => setStadium({ prizeClaimed: true }), 3000);
    return () => clearTimeout(t);
  }, [qr, prizeClaimed]);

  return (
    <>
      <StatusBar style="light" />
      <ResultScreen
        top={
          <Appear kind="pop" delay={100} float>
            <Image source={img.jersey} accessibilityLabel="Форма с автографами" style={{ width: 180, height: 180 }} contentFit="contain" />
          </Appear>
        }
        title={prizeClaimed ? 'Приз у вас!' : 'Вы выиграли!'}
        text={prizeClaimed ? 'Форма с автографами игроков — ваша. Носите с гордостью!' : 'Форма с автографами игроков. Заберите приз у стойки фан-шопа у входа «Юг».'}
        actions={
          prizeClaimed ? (
            <ResultButton label="К играм" onPress={() => router.dismissTo('/interactive')} />
          ) : (
            <>
              <ResultButton label="Показать QR-код" icon="qr-code" onPress={() => setQr(true)} />
              <ResultButton label="Позже" outline onPress={() => router.dismissTo('/interactive')} />
            </>
          )
        }>
        <ResultRows
          rows={[
            { label: 'Билет', value: `${match.seat.sector}, ряд ${match.seat.row}, место ${match.seat.place}` },
            prizeClaimed ? { label: 'Статус', value: 'Получен', mark: 'yes' } : { label: 'Где забрать', value: 'Фан-шоп, вход «Юг»' },
            { label: 'Хранится', value: '7 дней' },
          ]}
        />
      </ResultScreen>

      <GameSheet visible={qr} onClose={() => setQr(false)} icon={prizeClaimed ? 'tick-02' : undefined} title={prizeClaimed ? 'Приз выдан' : 'Покажите код'} text={prizeClaimed ? 'Код отсканирован. Спасибо, что болеете за ORDA!' : 'Покажите QR-код сотруднику фан-шопа у входа «Юг». Возьмите документ с фото.'}>
        {prizeClaimed ? (
          <Button label="Готово" height={54} onPress={() => setQr(false)} />
        ) : (
          <>
            <View style={{ alignSelf: 'center', padding: 14, borderRadius: 20, borderWidth: 1.5, borderColor: colors.line }}>
              <FakeQR size={190} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Icon name="gift" size={18} color="text2" weight={1.8} />
              <Text size={14} color="text2">
                Код приза: ORD-25-0412
              </Text>
            </View>
            <Notice icon="information-circle" text="Ждём сканирования… Яркость экрана лучше прибавить." />
          </>
        )}
      </GameSheet>
    </>
  );
}
