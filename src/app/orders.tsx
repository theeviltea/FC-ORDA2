import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Card, FilterChips, Gradient, Icon, NavBar, Pressable, Screen, Star, Text, type IconName } from '@/components';
import { img } from '@/data/images';
import { soon } from '@/data/nav';
import { colors, radius } from '@/theme';

type Kind = 'shop' | 'tickets';
type Order = {
  id: string;
  kind: Kind;
  date: string;
  status: { label: string; bg: string; fg: string };
  items: { name: string; meta: string; photo?: number; badge?: string; product?: string }[];
  note: { icon: IconName; text: string };
  total: string;
};

const orders: Order[] = [
  {
    id: '0973',
    kind: 'shop',
    date: '1 октября 2026, 14:08',
    status: { label: 'В обработке', bg: colors.chipBg, fg: colors.text2 },
    items: [
      { name: 'Кружка ORDA, синяя', meta: '1 шт. · 4 990 ₸', photo: img.mug, badge: 'Хит', product: 'mug' },
      { name: 'Флаг клуба', meta: '1 шт. · 1 500 ₸', photo: img.flag, product: 'flag' },
    ],
    note: { icon: 'store-01', text: 'Самовывоз из фан-шопа на стадионе' },
    total: '6 490',
  },
  {
    id: '1264',
    kind: 'tickets',
    date: '20 сентября 2026, 19:42',
    status: { label: 'Оплачен', bg: colors.blue10, fg: colors.blue600 },
    items: [{ name: 'ORDA — Кайрат', meta: '25 окт · Фан-сектор Юг · ряд 4 · 2 билета' }],
    note: { icon: 'qr-code', text: 'Билеты в разделе «Мои билеты»' },
    total: '4 000',
  },
  {
    id: '1048',
    kind: 'shop',
    date: '18 сентября 2026, 19:42',
    status: { label: 'Доставлен', bg: colors.successBg, fg: colors.successText },
    items: [{ name: 'Домашняя джерси 2026', meta: 'Размер L · 1 шт.', photo: img.jersey, product: 'jersey' }],
    note: { icon: 'delivery-truck-01', text: 'Доставлено курьером 21 сентября' },
    total: '24 990',
  },
];

type Filter = 'all' | Kind;

/** История покупок: заказы из магазина и билеты, фильтр по типу. */
export default function Orders() {
  const [f, setF] = useState<Filter>('all');
  const line = <View style={{ height: 1, backgroundColor: colors.surfaceSunken }} />;
  return (
    <Screen
      gap={14}
      header={<NavBar title="История покупок" action={{ icon: 'filter', label: 'Фильтры', onPress: soon('Фильтры') }} />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 500, right: -20 }} />
          <Star w={44} style={{ top: 920, left: 12 }} />
        </View>
      }>
      <View style={{ marginTop: 4 }}>
        <FilterChips
          value={f}
          onChange={setF}
          items={[
            { id: 'all', label: 'Все' },
            { id: 'shop', label: 'Магазин' },
            { id: 'tickets', label: 'Билеты' },
          ]}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 6 }}>
        <Text display size={24} lineHeight={28}>
          Ваши заказы
        </Text>
        <Text size={14} color="text2">
          12 покупок
        </Text>
      </View>
      {orders
        .filter((o) => f === 'all' || o.kind === f)
        .map((o) => (
          <Card key={o.id} style={{ marginHorizontal: 20, padding: 16, gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
              <View style={{ gap: 2 }}>
                <Text size={17} weight={700}>
                  Заказ № {o.id}
                </Text>
                <Text size={13} color="text2">
                  {o.date}
                </Text>
              </View>
              <View style={{ height: 24, paddingHorizontal: 10, borderRadius: 12, backgroundColor: o.status.bg, justifyContent: 'center' }}>
                <Text size={12} lineHeight={14} weight={700} color={o.status.fg}>
                  {o.status.label}
                </Text>
              </View>
            </View>
            {line}
            {o.items.map((it) => {
              const thumb = it.photo ? (
                <View style={{ width: 72, height: 72, borderRadius: radius.m, backgroundColor: colors.bg, padding: 4 }}>
                  <Image source={it.photo} style={{ flex: 1 }} contentFit="contain" />
                  {it.badge ? (
                    <View style={{ position: 'absolute', left: 6, top: 6, height: 18, paddingHorizontal: 6, borderRadius: 9, backgroundColor: colors.red, justifyContent: 'center' }}>
                      <Text size={10} lineHeight={12} weight={700} color="surface">
                        {it.badge}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : (
                <Gradient style={{ width: 72, height: 72, borderRadius: radius.m, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="ticket-01" size={30} color="surface" weight={1.6} />
                </Gradient>
              );
              const body = (
                <View style={{ flex: 1, gap: 3 }}>
                  <Text size={16} weight={700}>
                    {it.name}
                  </Text>
                  <Text size={13} color="text2">
                    {it.meta}
                  </Text>
                </View>
              );
              return (
                <Pressable
                  key={it.name}
                  accessibilityRole={it.product ? 'link' : undefined}
                  disabled={!it.product}
                  onPress={() => it.product && router.push({ pathname: '/product/[id]', params: { id: it.product } })}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  {thumb}
                  {body}
                </Pressable>
              );
            })}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name={o.note.icon} size={16} color="text2" weight={1.6} />
              <Text size={13} color="text2">
                {o.note.text}
              </Text>
            </View>
            {line}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text size={14} color="text2">
                Итого
              </Text>
              <Text display size={22}>
                {o.total}
                <Text size={22} weight={700}>
                  {' ₸'}
                </Text>
              </Text>
            </View>
          </Card>
        ))}
    </Screen>
  );
}
