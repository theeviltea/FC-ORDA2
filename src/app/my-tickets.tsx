import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Gradient, Icon, NavBar, Pressable, Screen, SegmentedTabs, Star, Text, TicketQRSheet } from '@/components';
import { img } from '@/data/images';
import { share } from '@/data/share';
import { colors, radius, shadows } from '@/theme';

const past = [
  { rival: 'Елимай', date: '4 октября · Северная', score: '3 : 1', res: 'Победа' },
  { rival: 'Жетысу', date: '20 сентября · Южная · фан', score: '2 : 0', res: 'Победа' },
  { rival: 'Тобыл', date: '30 августа · Западная', score: '1 : 1', res: 'Ничья' },
];

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text size={11} weight={700} upper color="text2" style={{ letterSpacing: 0.7 }}>
        {label}
      </Text>
      <Text size={16} weight={700}>
        {value}
      </Text>
    </View>
  );
}

/** Мои билеты: активный билет с перфорацией и QR, архив прошедших матчей. */
export default function MyTickets() {
  const [tab, setTab] = useState(0);
  const [qr, setQr] = useState(false);
  const notch = (side: 'left' | 'right') => <View style={{ position: 'absolute', [side]: -12, top: -12, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.bg }} />;

  const club = (src: number, name: string, w: number) => (
    <View style={{ alignItems: 'center', gap: 6, width: 80 }}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={src} style={{ width: w, height: 40 }} contentFit="contain" />
      </View>
      <Text size={14} weight={700} color="surface">
        {name}
      </Text>
    </View>
  );

  return (
    <>
      <Screen
        gap={16}
        header={<NavBar title="Мои билеты" action={{ icon: 'qr-code', label: 'QR-код билета', onPress: () => setQr(true) }} />}
        decor={
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
            <Star w={80} style={{ top: 620, right: -20 }} />
          </View>
        }>
        <SegmentedTabs labels={['Активные', 'Прошедшие']} counts={[1]} active={tab} onChange={setTab} label="Билеты" />
        {tab === 0 ? (
          <>
            <View style={{ marginHorizontal: 20, borderRadius: radius.xl, backgroundColor: colors.surface, ...shadows.raised }}>
              <Gradient style={{ padding: 18, gap: 14, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, overflow: 'hidden' }}>
                <Star w={12} fill={colors.sky} style={{ left: 112, top: 66 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.16)', justifyContent: 'center' }}>
                    <Text size={12} lineHeight={14} weight={700} color="surface">
                      Через 7 дней
                    </Text>
                  </View>
                  <Text size={13} color="onDark2">
                    Сб, 25 октября · 25 тур
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  {club(img.crest, 'ORDA', 34)}
                  <Text display size={34} lineHeight={34} color="surface">
                    19:00
                  </Text>
                  {club(img.clubKairat, 'Кайрат', 36)}
                </View>
              </Gradient>
              <View style={{ height: 0, borderTopWidth: 2, borderStyle: 'dashed', borderColor: colors.line, marginHorizontal: 18 }}>
                {notch('left')}
                {notch('right')}
              </View>
              <View style={{ padding: 18, gap: 14 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Cell label="Сектор" value="Юг · фан" />
                  <Cell label="Ряд" value="4" />
                  <Cell label="Места" value="12, 13" />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon name="location-01" size={16} color="text2" />
                  <Text size={13} color="text2" style={{ flex: 1 }}>
                    Стадион им. Кажымукана Мунайтпасова · вход с 17:30
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderColor: colors.surfaceSunken }}>
                  <Text size={13} color="text2">
                    Бекжан Садыков
                  </Text>
                  <Text size={13} color="text2">
                    Заказ № 1264
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Button label="Показать QR-код" icon="qr-code" style={{ flex: 1 }} onPress={() => setQr(true)} />
                  <Pressable accessibilityRole="button" accessibilityLabel="Поделиться билетом" onPress={share('Иду на матч ORDA — Кайрат, 25 октября в 19:00!')} style={{ width: 48, height: 48, borderRadius: radius.m, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="share-08" size={20} color="blue600" weight={1.8} />
                  </Pressable>
                </View>
              </View>
            </View>
            <Card style={{ marginHorizontal: 20, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Icon name="information-circle" size={20} color="blue600" weight={1.8} />
              <Text size={13} lineHeight={18} color="text2" style={{ flex: 1 }}>
                Билеты привязаны к вашему ORDA ID. На входе покажите QR-код — распечатывать не нужно.
              </Text>
            </Card>
            <Button label="Купить ещё билеты" icon="ticket-01" variant="soft" style={{ marginHorizontal: 20 }} onPress={() => router.push('/tickets')} />
          </>
        ) : (
          <View style={{ gap: 10, paddingHorizontal: 20 }}>
            {past.map((m) => (
              <Card key={m.rival} style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="ticket-01" size={22} color="text3" />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text size={16} weight={700}>
                    ORDA — {m.rival}
                  </Text>
                  <Text size={13} color="text2">
                    {m.date}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text display size={20} lineHeight={20}>
                    {m.score}
                  </Text>
                  <View style={{ height: 20, paddingHorizontal: 7, borderRadius: 6, backgroundColor: m.res === 'Победа' ? colors.successBg : colors.surfaceSunken, justifyContent: 'center' }}>
                    <Text size={11} lineHeight={13} weight={700} color={m.res === 'Победа' ? 'successText' : 'text2'}>
                      {m.res}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </Screen>
      <TicketQRSheet visible={qr} onClose={() => setQr(false)} />
    </>
  );
}
