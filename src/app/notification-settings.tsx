import { useState } from 'react';
import { View } from 'react-native';

import { ListCard, NavBar, Screen, SectionHeader, Star, Switch, Text } from '@/components';

const groups = [
  {
    title: 'Матчи',
    items: [
      { id: 'reminders', title: 'Напоминания о матчах', sub: 'За день и за час до начала', on: true },
      { id: 'goals', title: 'Голы и счёт', sub: 'В прямом эфире во время игры', on: true },
      { id: 'lineups', title: 'Составы', sub: 'Когда клуб объявит состав', on: false },
    ],
  },
  {
    title: 'Клуб',
    items: [
      { id: 'news', title: 'Новости клуба', sub: 'Главные события и интервью', on: true },
      { id: 'offers', title: 'Предложения', sub: 'Билеты, магазин и скидки', on: false },
      { id: 'points', title: 'Баллы и награды', sub: 'Начисления и новые уровни', on: true },
    ],
  },
];

/** Настройки уведомлений: переключатели по темам. Билеты и заказы приходят всегда. */
export default function NotificationSettings() {
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(groups.flatMap((g) => g.items.map((i) => [i.id, i.on]))));
  return (
    <Screen
      gap={12}
      header={<NavBar title="Уведомления" />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 500, right: -20 }} />
        </View>
      }>
      <Text size={15} lineHeight={21} color="text2" style={{ marginHorizontal: 20, marginTop: 4 }}>
        Выберите, о чём рассказывать. Сообщения о билетах и заказах приходят всегда.
      </Text>
      {groups.map((g) => (
        <View key={g.title} style={{ gap: 12, marginTop: 8 }}>
          <SectionHeader title={g.title} />
          <ListCard rows={g.items.map((i) => ({ title: i.title, sub: i.sub, right: <Switch label={i.title} value={on[i.id]} onChange={(v) => setOn({ ...on, [i.id]: v })} /> }))} />
        </View>
      ))}
    </Screen>
  );
}
