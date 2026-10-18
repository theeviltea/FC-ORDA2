import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Gradient, Icon, NavBar, Pitch, Pressable, QuantityStepper, Screen, Star, Text } from '@/components';
import { img } from '@/data/images';
import { tenge } from '@/data/shop';
import { colors, radius } from '@/theme';

type Zone = 'N' | 'S' | 'W' | 'E';

const zones: Record<Zone, { name: string; label: string; price: number; left: string; few: boolean; note: string }> = {
  N: { name: 'Северная', label: 'Северная', price: 3500, left: 'Осталось 412 мест', few: false, note: 'Центр поля сбоку от ворот. Хороший обзор атак ORDA во втором тайме.' },
  S: { name: 'Южная · фан-сектор', label: 'Южная · фан-сектор', price: 2000, left: 'Осталось 148 мест', few: false, note: 'Сектор активной поддержки: стоячие места, флаги и баннеры. Вход с 17:30.' },
  W: { name: 'Западная', label: 'Западная', price: 5000, left: 'Осталось 36 мест', few: true, note: 'Центральная трибуна под навесом, места у скамейки запасных.' },
  E: { name: 'Восточная · VIP', label: 'Восточная · VIP', price: 12000, left: 'Осталось 9 мест', few: true, note: 'Ложа с отдельным входом, кейтеринг в перерыве и парковка.' },
};

const MAX = 6;
const word = (n: number) => (n === 1 ? 'билет' : n < 5 ? 'билета' : 'билетов');
const price = (n: number) => tenge(n).replace(' ₸', '');

/** One stand of the stadium map: free (light blue), few seats left (grey), selected (blue-600). */
function Stand({ z, on, onPick, style, vertical }: { z: Zone; on: boolean; onPick: () => void; style: object; vertical?: 'left' | 'right' }) {
  const d = zones[z];
  const bg = on ? colors.blue600 : d.few ? colors.surfaceSunken : colors.blue10;
  const border = on ? colors.blue600 : d.few ? colors.surfaceSunken : '#B8E2F4';
  const fg = on ? 'surface' : 'text';
  const content = (
    <>
      <Text size={vertical ? 11 : 12} lineHeight={14} weight={700} upper color={fg} style={{ letterSpacing: 0.7 }}>
        {d.label}
      </Text>
      <Text size={vertical ? 12 : 13} lineHeight={15} weight={600} color={fg}>
        {tenge(d.price)}
      </Text>
    </>
  );
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`${d.name}, ${tenge(d.price)}`}
      accessibilityState={{ checked: on }}
      onPress={onPick}
      style={[{ borderWidth: 1.5, borderColor: border, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, style]}>
      {vertical ? (
        <View style={{ position: 'absolute', width: 196, height: 54, alignItems: 'center', justifyContent: 'center', gap: 2, transform: [{ rotate: vertical === 'left' ? '-90deg' : '90deg' }] }}>{content}</View>
      ) : (
        <View style={{ alignItems: 'center', gap: 1 }}>{content}</View>
      )}
    </Pressable>
  );
}

function Legend({ color, border, children }: { color: string; border?: string; children: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: color, borderWidth: border ? 1.5 : 0, borderColor: border }} />
      <Text size={12} color="text2">
        {children}
      </Text>
    </View>
  );
}

/** Покупка билетов: матч, схема стадиона с выбором трибуны, количество и панель «Оплатить». */
export default function Tickets() {
  const insets = useSafeAreaInsets();
  const [zone, setZone] = useState<Zone>('S');
  const [qty, setQty] = useState(2);
  const z = zones[zone];

  const footer = (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 14, paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 12) + 18, backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 14, boxShadow: '0 -8px 28px rgba(23, 42, 81, 0.1)' }}>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text size={13} color="text2" numberOfLines={1}>
          {`${qty} ${word(qty)} · ${z.name}`}
        </Text>
        <Text display size={26} lineHeight={26}>
          {price(z.price * qty)}
          <Text size={26} weight={700}>
            {' ₸'}
          </Text>
        </Text>
      </View>
      <Button label="Оплатить" icon="ticket-01" height={52} style={{ paddingHorizontal: 22 }} onPress={() => router.push({ pathname: '/soon', params: { title: 'Оплата' } })} />
    </View>
  );

  return (
    <Screen gap={14} header={<NavBar title="Купить билеты" />} footer={footer} footerHeight={80}>
      <Card style={{ marginHorizontal: 20, padding: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flexDirection: 'row' }}>
            {[
              { src: img.crest, w: 24 },
              { src: img.clubKairat, w: 26 },
            ].map((c, i) => (
              <View key={i} style={{ width: 40, height: 40, marginLeft: i ? -10 : 0, borderRadius: 20, backgroundColor: colors.bg, borderWidth: 2, borderColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={c.src} style={{ width: c.w, height: 29 }} contentFit="contain" />
              </View>
            ))}
          </View>
          <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
            <Text display size={20} lineHeight={22}>
              ORDA — Кайрат
            </Text>
            <Text size={13} color="text2">
              Сб, 25 октября · 25 тур
            </Text>
          </View>
          <Text display size={22} color="blue600">
            19:00
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="location-01" size={16} color="text2" />
          <Text size={13} color="text2" style={{ flex: 1 }}>
            Стадион им. Кажымукана Мунайтпасова, Шымкент
          </Text>
        </View>
        <Pressable accessibilityRole="link" onPress={() => router.push('/lineup')} style={{ height: 44, borderRadius: radius.m, backgroundColor: colors.blue10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon name="football-pitch" size={18} color="blue600" weight={1.8} />
          <Text size={15} weight={700} color="blue600">
            Состав команды
          </Text>
        </Pressable>
      </Card>

      <Card style={{ marginHorizontal: 20, padding: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text display size={22}>
            Выберите трибуну
          </Text>
          <Text size={13} color="text2">
            цены за 1 место
          </Text>
        </View>
        <View accessibilityRole="radiogroup" accessibilityLabel="Трибуна" style={{ gap: 6 }}>
          <Stand z="N" on={zone === 'N'} onPick={() => setZone('N')} style={{ height: 52, borderTopLeftRadius: 26, borderTopRightRadius: 26, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
          <View style={{ flexDirection: 'row', gap: 6, height: 196 }}>
            <Stand z="W" on={zone === 'W'} onPick={() => setZone('W')} vertical="left" style={{ width: 54, borderRadius: 10 }} />
            <Gradient style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
              <Pitch inset={10} circle={52} boxW={100} boxH={30} line="rgba(255,255,255,0.35)" />
              <Star w={14} fill={colors.sky} style={{ right: 22, top: 56 }} />
            </Gradient>
            <Stand z="E" on={zone === 'E'} onPick={() => setZone('E')} vertical="right" style={{ width: 54, borderRadius: 10 }} />
          </View>
          <Stand z="S" on={zone === 'S'} onPick={() => setZone('S')} style={{ height: 52, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 26, borderBottomRightRadius: 26 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
          <Legend color={colors.blue10} border="#B8E2F4">
            Свободно
          </Legend>
          <Legend color={colors.blue600}>Выбрано</Legend>
          <Legend color={colors.surfaceSunken}>Мало мест</Legend>
        </View>
      </Card>

      <Card style={{ marginHorizontal: 20, padding: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ gap: 3, flex: 1 }}>
            <Text size={12} weight={700} upper color="text2" style={{ letterSpacing: 0.7 }}>
              Трибуна
            </Text>
            <Text size={18} weight={700}>
              {z.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: z.few ? colors.errorText : colors.successText }} />
              <Text size={13} color={z.few ? 'errorText' : 'successText'}>
                {z.left}
              </Text>
            </View>
          </View>
          <Text display size={26}>
            {price(z.price)}
            <Text size={26} weight={700}>
              {' ₸'}
            </Text>
          </Text>
        </View>
        <Text size={14} lineHeight={20} color="text2">
          {z.note}
        </Text>
        <View style={{ height: 1, backgroundColor: colors.line }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text size={15} weight={600}>
            Количество
          </Text>
          <QuantityStepper value={qty} onChange={setQty} min={1} max={MAX} label="Количество билетов" />
        </View>
        <Text size={13} lineHeight={18} color="text2">
          Не больше 6 билетов на один аккаунт. Билеты появятся в разделе «Мои билеты».
        </Text>
      </Card>
    </Screen>
  );
}
