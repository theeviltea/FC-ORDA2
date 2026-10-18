import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { NavBar, OfferBanner, Pressable, Screen, Text } from '@/components';
import { offers, type OfferKind } from '@/data/offers';
import { colors } from '@/theme';

const chips: { id: 'all' | OfferKind; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'sale', label: 'Скидки' },
  { id: 'excl', label: 'Эксклюзив' },
  { id: 'bonus', label: 'Бонусы' },
];

/** Для вас: фильтр по типу и лента персональных предложений (баннер + заголовок + срок). */
export default function ForYou() {
  const [chip, setChip] = useState<'all' | OfferKind>('all');
  const list = offers.filter((o) => chip === 'all' || o.kind === chip);
  return (
    <Screen gap={16} header={<NavBar title="Для вас" />}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityRole="tablist" accessibilityLabel="Тип предложения" contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {chips.map((c) => {
          const on = c.id === chip;
          return (
            <Pressable key={c.id} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setChip(c.id)} style={{ height: 44, paddingHorizontal: 18, borderRadius: 22, backgroundColor: on ? colors.navy : colors.chipBg, justifyContent: 'center' }}>
              <Text size={15} weight={on ? 700 : 500} color={on ? 'surface' : 'text'}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={{ gap: 22, paddingHorizontal: 20 }}>
        {list.map((o) => (
          <Pressable key={o.id} accessibilityRole="link" accessibilityLabel={`${o.title}. ${o.sub}. ${o.until}`} onPress={() => router.push({ pathname: '/offer/[id]', params: { id: o.id } })} style={{ gap: 10 }}>
            <OfferBanner offer={o.id} />
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, paddingHorizontal: 4 }}>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <Text size={17} lineHeight={20} weight={700}>
                  {o.title}
                </Text>
                <Text size={14} lineHeight={19} color="text2">
                  {o.sub}
                </Text>
              </View>
              <View style={{ height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: o.urgent ? colors.errorBg : colors.blue10, justifyContent: 'center' }}>
                <Text size={12} lineHeight={14} weight={700} color={o.urgent ? 'errorText' : 'blue600'}>
                  {o.until}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
