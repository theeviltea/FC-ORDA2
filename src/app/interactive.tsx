import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Gradient, Icon, NavBar, Pressable, Screen, Star, Text, type IconName } from '@/components';
import { img } from '@/data/images';
import { soon } from '@/data/nav';
import { colors, shadows } from '@/theme';

const games: { icon: IconName; title: string; sub: string; state: 'live' | 'match' | 'break'; tone: 'red' | 'blue'; to?: () => void }[] = [
  { icon: 'mic-01', title: 'Шумомер', sub: 'Поддержите голосом: самый громкий сектор покажут на табло', state: 'live', tone: 'red', to: () => router.push('/noise') },
  { icon: 'camera-01', title: 'Фото на табло', sub: 'Отправьте селфи с трибуны — лучшие попадут на экран', state: 'match', tone: 'blue', to: soon('Фото на табло') },
  { icon: 'football', title: 'Счёт перерыва', sub: 'Угадайте счёт к 45-й минуте · +20 баллов', state: 'match', tone: 'blue', to: soon('Счёт перерыва') },
  { icon: 'gift', title: 'Розыгрыш в перерыве', sub: 'Ваш билет участвует автоматически', state: 'break', tone: 'blue', to: soon('Розыгрыш в перерыве') },
];
const steps = [
  ['Приходите на матч', 'Игры открываются за 2 часа до начала'],
  ['Отметьтесь по билету', 'Нажмите «Я на стадионе» — QR-код проверит место'],
  ['Играйте и копите баллы', 'Баллы за игры придут после финального свистка'],
];

/** Интерактив: матч-день с отметкой «Я на стадионе», игры на стадионе, как это работает. */
export default function Interactive() {
  const [here, setHere] = useState(false);
  return (
    <Screen gap={16} header={<NavBar title="Интерактив" />}>
      <View style={{ marginHorizontal: 20, borderRadius: 24, overflow: 'hidden', backgroundColor: colors.navy }}>
        <Image source={img.photoFans} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.35 }} contentFit="cover" />
        <Gradient colors={['rgba(23,42,81,0.2)', colors.navy]} locations={[0, 0.85] as const} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View style={{ padding: 18, gap: 12 }}>
          <View style={{ alignSelf: 'flex-start', height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: colors.red, justifyContent: 'center' }}>
            <Text size={12} lineHeight={14} weight={700} color="surface">
              Матч-день
            </Text>
          </View>
          <Text display size={30} lineHeight={31} upper color="surface">
            ORDA — Кайрат
          </Text>
          <Text size={14} color="onDark2">
            Сб, 25 октября · 19:00 · интерактив откроется в 17:00
          </Text>
          <View style={{ padding: 12, borderRadius: 16, backgroundColor: here ? 'rgba(30,158,90,0.25)' : 'rgba(255,255,255,0.1)', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: here ? '#1E9E5A' : colors.blue, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={here ? 'tick-02' : 'location-01'} size={22} color="surface" weight={here ? 2.4 : 1.8} />
            </View>
            <View style={{ flex: 1, gap: 2 }} accessibilityLiveRegion="polite">
              <Text size={16} weight={700} color="surface">
                {here ? 'Вы на стадионе · +50 баллов' : 'Отметьтесь на стадионе'}
              </Text>
              <Text size={13} color="onDark2">
                {here ? 'Сектор Юг · фан, ряд 4. Все игры открыты' : '+50 баллов и доступ ко всем играм'}
              </Text>
            </View>
          </View>
          {here ? null : <Button label="Я на стадионе" icon="qr-code" variant="white" height={52} onPress={() => setHere(true)} />}
        </View>
      </View>

      <Text display size={24} lineHeight={28} style={{ marginHorizontal: 20, marginTop: 8, marginBottom: -4 }}>
        Игры на стадионе
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 }}>
        {games.map((g) => (
          <Pressable key={g.title} accessibilityRole="link" onPress={g.to} style={{ width: '47.9%', minHeight: 196, padding: 14, gap: 8, borderRadius: 22, backgroundColor: colors.surface, overflow: 'hidden', ...shadows.card }}>
            <Star w={54} fill={colors.bg} style={{ right: -14, top: -14 }} />
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: g.tone === 'red' ? colors.errorBg : colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={g.icon} size={26} color={g.tone === 'red' ? 'red' : 'blue'} weight={1.7} />
            </View>
            <Text display size={17} lineHeight={19}>
              {g.title}
            </Text>
            <Text size={13} lineHeight={18} color="text2">
              {g.sub}
            </Text>
            <View style={{ marginTop: 'auto', alignSelf: 'flex-start', height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: g.state === 'live' ? colors.red : colors.surfaceSunken, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              {g.state === 'live' ? null : <Icon name="clock-01" size={15} color="text2" weight={2} />}
              <Text size={12} lineHeight={14} weight={700} color={g.state === 'live' ? 'surface' : 'text2'}>
                {g.state === 'live' ? 'Идёт сейчас' : g.state === 'match' ? 'Во время матча' : 'В перерыве'}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Text display size={24} lineHeight={28} style={{ marginHorizontal: 20, marginTop: 8, marginBottom: -4 }}>
        Как это работает
      </Text>
      <View style={{ marginHorizontal: 20, paddingVertical: 4, paddingHorizontal: 16, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card }}>
        {steps.map(([t, d], i) => (
          <View key={t} style={{ flexDirection: 'row', gap: 14, paddingVertical: 14, borderBottomWidth: i < steps.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' }}>
              <Text display size={18} lineHeight={20} color="surface">
                {String(i + 1)}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text size={16} weight={700}>
                {t}
              </Text>
              <Text size={14} lineHeight={20} color="text2">
                {d}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}
