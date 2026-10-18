import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';

import { AppHeader, Card, FilterChips, Icon, PageTitle, Pressable, ProductCard, Screen, SegmentedTabs, Star, Text, type IconName, type Product } from '@/components';
import { aspect, img } from '@/data/images';
import { soon } from '@/data/nav';
import { colors, radius } from '@/theme';

const products: Product[] = [
  { name: 'Домашняя джерси 2024/25', price: '24 990 ₸', badge: 'Новое', tone: 'new', photo: img.jersey },
  { name: 'Кружка «Ордабасы»', price: '6 990 ₸', badge: 'Хит продаж', tone: 'hit', photo: img.mug },
  { name: 'Спортивное худи (синее)', price: '18 990 ₸', photo: img.hoodie },
  { name: 'Шарф болельщика ORDA', price: '7 990 ₸' },
  { name: 'Тренировочный комплект', price: '21 990 ₸', photo: img.trainingKit },
  { name: 'Зимняя куртка клуба', price: '34 990 ₸', photo: img.jacket },
  { name: 'Рюкзак с логотипом', price: '14 990 ₸', photo: img.backpack },
  { name: 'Флаг болельщика 1,5 м', price: '4 990 ₸', photo: img.flag },
];

type Status = 'way' | 'ready' | 'done';
type Order = {
  id: string;
  date: string;
  status: Status;
  items: { name: string; meta: string; photo: number }[];
  note: { icon: IconName; text: string };
  total: string;
  action?: { icon: IconName; label: string };
  tracker?: number;
};

const orders: Order[] = [
  {
    id: '1102',
    date: '14 октября 2026, 11:20',
    status: 'way',
    items: [
      { name: 'Спортивное худи (синее)', meta: 'Размер M · 1 шт.', photo: img.hoodie },
      { name: 'Рюкзак с логотипом', meta: '1 шт.', photo: img.backpack },
    ],
    tracker: 2,
    note: { icon: 'delivery-truck-01', text: 'Курьер привезёт завтра, 10:00–14:00' },
    total: '33 980',
    action: { icon: 'location-01', label: 'Отследить заказ' },
  },
  {
    id: '0973',
    date: '1 октября 2026, 14:08',
    status: 'ready',
    items: [
      { name: 'Кружка «Ордабасы»', meta: '1 шт. · 6 990 ₸', photo: img.mug },
      { name: 'Флаг болельщика 1,5 м', meta: '1 шт. · 4 990 ₸', photo: img.flag },
    ],
    note: { icon: 'store-01', text: 'Самовывоз из фан-шопа на стадионе · до 25 октября' },
    total: '11 980',
  },
  {
    id: '1048',
    date: '18 сентября 2026, 19:42',
    status: 'done',
    items: [{ name: 'Домашняя джерси 2024/25', meta: 'Размер L · 1 шт.', photo: img.jersey }],
    note: { icon: 'checkmark-circle-02', text: 'Доставлено курьером 21 сентября' },
    total: '24 990',
    action: { icon: 'shopping-bag-02', label: 'Купить снова' },
  },
];

const statusLook: Record<Status, { label: string; bg: string; fg: string; note: string }> = {
  way: { label: 'В пути', bg: colors.blue10, fg: colors.blue600, note: colors.blue600 },
  ready: { label: 'Готов к выдаче', bg: '#FFF4D6', fg: '#8A5A00', note: colors.text2 },
  done: { label: 'Доставлен', bg: colors.successBg, fg: colors.successText, note: colors.successText },
};

const steps = ['Оформлен', 'Собран', 'В пути', 'Доставлен'];
const activeCount = orders.filter((o) => o.status !== 'done').length;

function Promo() {
  return (
    <Pressable accessibilityRole="link" onPress={soon('Товар')} style={{ marginHorizontal: 20, height: 150, borderRadius: 22, overflow: 'hidden', backgroundColor: colors.blue }}>
      <Star w={160} fill="rgba(255,255,255,0.25)" style={{ right: -40, top: -50 }} />
      <Image source={img.shopPromo} style={{ position: 'absolute', right: 22, top: 10, height: 136, width: 136 * aspect.shopPromo }} />
      <View style={{ padding: 18, gap: 6, width: 230 }}>
        <Text size={12} weight={700} color="blue10" style={{ letterSpacing: 1 }}>
          НОВЫЕ ТОВАРЫ
        </Text>
        <Text display size={26} lineHeight={29} color="surface">
          ОРДАБАСЫ 2027
        </Text>
        <Text size={14} lineHeight={18} color="surface">
          Официальная игровая и повседневная экипировка твоего любимого клуба.
        </Text>
      </View>
    </Pressable>
  );
}

function Tracker({ at }: { at: number }) {
  return (
    <View style={{ paddingTop: 12, paddingBottom: 10, paddingHorizontal: 4, borderRadius: radius.m, backgroundColor: colors.bg }}>
      <View style={{ position: 'absolute', left: '12.5%', right: '12.5%', top: 19, height: 2, backgroundColor: colors.line }} />
      <View style={{ position: 'absolute', left: '12.5%', width: `${(at / (steps.length - 1)) * 75}%`, top: 19, height: 2, backgroundColor: colors.blue }} />
      <View style={{ flexDirection: 'row' }}>
        {steps.map((s, i) => {
          const done = i <= at;
          const cur = i === at;
          return (
            <View key={s} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
              <View style={{ height: 16, justifyContent: 'center' }}>
                <View style={{ width: cur ? 16 : 12, height: cur ? 16 : 12, borderRadius: 8, backgroundColor: done ? colors.blue : colors.line, boxShadow: cur ? '0 0 0 4px rgba(18, 158, 217, 0.2)' : undefined }} />
              </View>
              <Text size={11} lineHeight={13} weight={cur ? 700 : 500} color={done ? 'text' : 'text3'}>
                {s}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function OrderCard({ o }: { o: Order }) {
  const look = statusLook[o.status];
  const line = <View style={{ height: 1, backgroundColor: colors.surfaceSunken }} />;
  return (
    <Card style={{ marginHorizontal: 20, padding: 16, gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <View style={{ gap: 2 }}>
          <Text size={17} weight={700}>
            Заказ № {o.id}
          </Text>
          <Text size={13} color="text2">
            {o.date}
          </Text>
        </View>
        <View style={{ height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: look.bg, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: look.fg }} />
          <Text size={12} lineHeight={14} weight={700} color={look.fg}>
            {look.label}
          </Text>
        </View>
      </View>
      {line}
      {o.items.map((it) => (
        <View key={it.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 64, height: 64, borderRadius: radius.m, backgroundColor: colors.bg, padding: 4 }}>
            <Image source={it.photo} style={{ flex: 1 }} contentFit="contain" />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text size={16} weight={700}>
              {it.name}
            </Text>
            <Text size={13} color="text2">
              {it.meta}
            </Text>
          </View>
        </View>
      ))}
      {o.tracker !== undefined ? <Tracker at={o.tracker} /> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name={o.note.icon} size={16} color={look.note} weight={1.6} />
        <Text size={13} color={look.note} style={{ flex: 1 }}>
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
      {o.action ? (
        <Pressable accessibilityRole="button" onPress={soon(o.action.label)} style={{ height: 44, borderRadius: radius.m, backgroundColor: colors.blue10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name={o.action.icon} size={18} color="blue600" weight={1.8} />
          <Text size={15} weight={700} color="blue600">
            {o.action.label}
          </Text>
        </Pressable>
      ) : null}
    </Card>
  );
}

type Filter = 'all' | 'active' | 'done';

function Orders() {
  const [f, setF] = useState<Filter>('all');
  const list = orders.filter((o) => f === 'all' || (f === 'done' ? o.status === 'done' : o.status !== 'done'));
  return (
    <View style={{ gap: 14 }}>
      <FilterChips
        value={f}
        onChange={setF}
        items={[
          { id: 'all', label: `Все · ${orders.length}` },
          { id: 'active', label: `Активные · ${activeCount}` },
          { id: 'done', label: 'Завершённые' },
        ]}
      />
      {list.map((o) => (
        <OrderCard key={o.id} o={o} />
      ))}
      <Pressable accessibilityRole="link" onPress={soon('История покупок')} style={{ alignSelf: 'center', minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text size={15} weight={600} color="blue600">
          Вся история покупок
        </Text>
        <Icon name="arrow-right-01" size={18} color="blue600" weight={2} />
      </Pressable>
    </View>
  );
}

/** Магазин: витрина с товарами и вкладка «Мои заказы» со статусами. */
export function ShopScreen() {
  const [tab, setTab] = useState(0);
  return (
    <Screen tabs gap={18} header={<AppHeader />}>
      <PageTitle>Магазин</PageTitle>
      <SegmentedTabs label="Раздел магазина" labels={['Магазин', 'Мои заказы']} counts={[0, activeCount]} active={tab} onChange={setTab} />
      {tab === 0 ? (
        <View style={{ gap: 16 }}>
          <Promo />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 }}>
            {products.map((p) => (
              <View key={p.name} style={{ flexBasis: '45%', flexGrow: 1 }}>
                <ProductCard item={p} width="100%" onPress={soon('Товар')} />
              </View>
            ))}
          </View>
          <Pressable accessibilityRole="button" style={{ marginHorizontal: 20, height: 52, borderRadius: 16, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
            <Text size={16} weight={700} color="blue600">
              Показать ещё
            </Text>
          </Pressable>
        </View>
      ) : (
        <Orders />
      )}
    </Screen>
  );
}
