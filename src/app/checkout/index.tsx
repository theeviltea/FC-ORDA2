import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Icon, NavBar, PaymentLogos, Pressable, Screen, SectionHeader, Text } from '@/components';
import { img } from '@/data/images';
import { delivery, feeNote, pickup, vatNote } from '@/data/legal';
import { findItem, tenge } from '@/data/shop';
import { colors, radius } from '@/theme';

type Params = { kind?: 'shop' | 'tickets'; id?: string; title?: string; meta?: string; amount?: string };

const doc = (id: string) => () => router.push({ pathname: '/legal/[doc]', params: { doc: id } });

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <Text size={strong ? 17 : 15} weight={strong ? 700 : 400} color={strong ? 'text' : 'text2'}>
        {label}
      </Text>
      <Text size={strong ? 17 : 15} weight={700}>
        {value}
      </Text>
    </View>
  );
}

/**
 * Оформление заказа (товары и билеты): состав, способ получения со стоимостью доставки, итог в тенге с НДС,
 * способ оплаты с информерами Visa / Mastercard / Halyk ePay, согласие с офертой → защищённая страница банка.
 */
export default function Checkout() {
  const p = useLocalSearchParams<Params>();
  const insets = useSafeAreaInsets();
  const tickets = p.kind === 'tickets';
  const item = tickets ? null : findItem(p.id ?? 'jersey');
  const amount = Number(p.amount ?? item?.base ?? 0);
  const [ship, setShip] = useState<(typeof delivery)[number]['id']>('pickup');
  const [agree, setAgree] = useState(false);
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const fee = tickets ? 0 : (delivery.find((d) => d.id === ship)?.price ?? 0);
  const total = amount + fee;

  const pay = () => {
    if (!agree) return setTried(true);
    setBusy(true);
    // Prototype: the real flow opens the Halyk ePay payment page and waits for its callback.
    setTimeout(() => {
      setBusy(false);
      router.replace({ pathname: '/checkout/paid', params: { kind: tickets ? 'tickets' : 'shop', total: String(total) } });
    }, 1400);
  };

  const footer = (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 14, paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 12) + 16, backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 8, boxShadow: '0 -8px 28px rgba(23, 42, 81, 0.1)' }}>
      <Button label={busy ? 'Переходим к оплате…' : `Оплатить ${tenge(total)}`} icon={busy ? undefined : 'credit-card'} height={54} disabled={busy} onPress={pay} />
      {busy ? <ActivityIndicator style={{ position: 'absolute', top: 31, left: 44 }} color={colors.surface} /> : null}
      <Text size={12} lineHeight={16} color={tried && !agree ? 'errorText' : 'text2'} align="center" accessibilityLiveRegion="polite">
        {tried && !agree ? 'Отметьте согласие с офертой, чтобы перейти к оплате' : 'Оплата на защищённой странице Halyk Bank'}
      </Text>
    </View>
  );

  return (
    <Screen gap={12} header={<NavBar title="Оформление" />} footer={footer} footerHeight={110}>
      <SectionHeader title={tickets ? 'Билеты' : 'Ваш заказ'} />
      <Card style={{ marginHorizontal: 20, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 64, height: 64, borderRadius: 14, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {tickets ? <Icon name="ticket-01" size={30} color="blue" weight={1.6} /> : item?.photo ? <Image source={item.photo} style={{ width: 56, height: 56 }} contentFit="contain" /> : <Image source={img.crest} style={{ width: 30, height: 36 }} contentFit="contain" />}
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
          <Text size={16} lineHeight={20} weight={700} numberOfLines={2}>
            {p.title ?? item?.name}
          </Text>
          <Text size={13} color="text2">
            {p.meta}
          </Text>
        </View>
        <Text size={16} weight={700}>
          {tenge(amount)}
        </Text>
      </Card>

      {tickets ? (
        <Card style={{ marginHorizontal: 20, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Icon name="smart-phone-01" size={22} color="blue" weight={1.6} />
          <Text size={14} lineHeight={20} color="text2" style={{ flex: 1 }}>
            Электронные билеты появятся в разделе «Мои билеты» сразу после оплаты — печатать не нужно.
          </Text>
        </Card>
      ) : (
        <>
          <SectionHeader title="Получение" />
          <View accessibilityRole="radiogroup" accessibilityLabel="Способ получения" style={{ marginHorizontal: 20, gap: 10 }}>
            {delivery.map((d) => {
              const on = d.id === ship;
              return (
                <Pressable key={d.id} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => setShip(d.id)} style={{ padding: 14, borderRadius: radius.l, borderWidth: 1.5, borderColor: on ? colors.blue : colors.surface, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: on ? colors.blue : '#8391AD', alignItems: 'center', justifyContent: 'center' }}>{on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue }} /> : null}</View>
                  <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                    <Text size={16} weight={700}>
                      {d.title}
                    </Text>
                    <Text size={13} color="text2">
                      {d.sub}
                    </Text>
                  </View>
                  <Text size={15} weight={700} color={d.price ? 'text' : 'successText'}>
                    {d.price ? tenge(d.price) : 'Бесплатно'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {ship === 'pickup' ? (
            <Text size={13} lineHeight={18} color="text2" style={{ marginHorizontal: 24 }}>
              {pickup.title}: г. {pickup.city}, {pickup.address} · {pickup.schedule}
            </Text>
          ) : null}
        </>
      )}

      <SectionHeader title="Итого" />
      <Card style={{ marginHorizontal: 20, padding: 16, gap: 10 }}>
        <Row label={tickets ? 'Билеты' : 'Товары'} value={tenge(amount)} />
        {tickets ? null : <Row label="Доставка" value={fee ? tenge(fee) : 'Бесплатно'} />}
        <View style={{ height: 1, backgroundColor: colors.surfaceSunken }} />
        <Row label="К оплате" value={tenge(total)} strong />
        <Text size={12} lineHeight={16} color="text2">
          {vatNote} {feeNote}
        </Text>
      </Card>

      <SectionHeader title="Оплата" />
      <Card style={{ marginHorizontal: 20, padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="credit-card" size={22} color="blue" weight={1.6} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text size={16} weight={700}>
              Банковская карта
            </Text>
            <Text size={13} color="text2">
              Visa, Mastercard · через Halyk ePay
            </Text>
          </View>
          <Icon name="checkmark-circle-02" size={22} color="blue" weight={1.8} />
        </View>
        <PaymentLogos />
        <Text size={13} lineHeight={18} color="blue600" weight={600} onPress={doc('payment')} accessibilityRole="link">
          Как мы защищаем платежи
        </Text>
      </Card>

      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: agree }} onPress={() => setAgree(!agree)} style={{ marginHorizontal: 20, marginTop: 4, flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 4 }}>
        <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: agree ? colors.blue600 : tried ? colors.red : '#8391AD', backgroundColor: agree ? colors.blue600 : colors.surface, alignItems: 'center', justifyContent: 'center' }}>
          {agree ? <Icon name="tick-02" size={14} color="surface" weight={2.8} /> : null}
        </View>
        <Text size={14} lineHeight={20} color={tried && !agree ? 'errorText' : 'text2'} style={{ flex: 1 }}>
          Я ознакомился и согласен с{' '}
          <Text size={14} lineHeight={20} weight={600} color="blue600" onPress={doc('offer')}>
            публичной офертой
          </Text>
          ,{' '}
          <Text size={14} lineHeight={20} weight={600} color="blue600" onPress={doc('returns')}>
            условиями возврата
          </Text>{' '}
          и{' '}
          <Text size={14} lineHeight={20} weight={600} color="blue600" onPress={doc('privacy')}>
            политикой конфиденциальности
          </Text>
        </Text>
      </Pressable>
      {tried && !agree ? (
        <Text size={13} color="errorText" style={{ marginHorizontal: 56, marginTop: -6 }} accessibilityLiveRegion="polite">
          Отметьте согласие, чтобы перейти к оплате
        </Text>
      ) : null}
    </Screen>
  );
}
