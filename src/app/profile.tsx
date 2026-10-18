import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Gradient, Icon, NavBar, Pressable, Screen, SectionHeader, Star, Text, TicketQRSheet, type IconName } from '@/components';
import { img } from '@/data/images';
import { usePrefs } from '@/data/prefs';
import { fan, formatPoints } from '@/data/user';
import { colors, radius, shadows } from '@/theme';

const rows: { icon: IconName; title: string; sub: string; to: Href }[] = [
  { icon: 'champion', title: 'Мои достижения', sub: '3 получено · 2 в процессе', to: '/achievements' },
  { icon: 'shopping-bag-02', title: 'История покупок', sub: '12 покупок', to: '/orders' },
  { icon: 'notification-01', title: 'Уведомления', sub: 'Матчи, новости клуба', to: '/notification-settings' },
  { icon: 'settings-01', title: 'Настройки', sub: 'Данные, язык, помощь', to: '/settings' },
];

/** Профиль болельщика: карточка ORDA ID, баллы и уровень, ближайший билет, меню аккаунта. */
export default function Profile() {
  const [qr, setQr] = useState(false);
  const { personal } = usePrefs();
  return (
    <>
    <Screen
      gap={16}
      header={<NavBar title="Профиль" action={{ icon: 'settings-01', label: 'Настройки', onPress: () => router.push('/settings') }} />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 560, right: -20 }} />
          <Star w={44} style={{ top: 980, left: 12 }} />
        </View>
      }>
      <Gradient style={{ marginHorizontal: 20, paddingTop: 24, paddingHorizontal: 16, paddingBottom: 20, borderRadius: radius.xl, overflow: 'hidden', alignItems: 'center', gap: 10, ...shadows.raised }}>
        <Text display size={120} lineHeight={103} color="rgba(255,255,255,0.07)" style={{ position: 'absolute', left: -6, top: -10 }} aria-hidden>
          {'ORDA\nFAN'}
        </Text>
        <Star w={40} h={66} fill={colors.bg} style={{ left: -20, top: 120 }} />
        <Star w={40} h={66} fill={colors.bg} style={{ right: -20, top: 120 }} />
        <Star w={16} fill={colors.surface} style={{ left: 70, top: 28 }} />
        <Star w={12} fill={colors.sky} style={{ right: 64, top: 52 }} />
        <View style={{ width: 96, height: 96 }}>
          <View style={{ flex: 1, borderRadius: 48, padding: 3, backgroundColor: colors.surface }}>
            <Image source={img.avatar} accessibilityLabel={fan.name} style={{ flex: 1, borderRadius: 45 }} contentFit="cover" />
          </View>
          <View accessibilityLabel="Подтверждённый профиль" style={{ position: 'absolute', right: 0, bottom: 2, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.blue600, borderWidth: 3, borderColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="tick-02" size={14} color="surface" weight={2.6} />
          </View>
        </View>
        <Text display size={32} lineHeight={32} upper color="surface" style={{ marginTop: 2, letterSpacing: 0.6 }}>
          {personal.first}
        </Text>
        <Text size={14} color="onDark2">
          ORDA ID {fan.ordaId} · болельщик с {fan.since}
        </Text>
        <Pressable accessibilityRole="button" onPress={() => router.push('/personal')} style={{ height: 36, paddingHorizontal: 14, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.14)', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="user" size={16} color="surface" weight={1.8} />
          <Text size={14} weight={700} color="surface">
            Редактировать
          </Text>
        </Pressable>
      </Gradient>

      <Pressable accessibilityRole="link" accessibilityLabel={`Мои достижения: ${formatPoints(fan.points)} баллов, уровень ${fan.level}`} onPress={() => router.push('/achievements')} style={{ marginHorizontal: 20 }}>
      <Card style={{ padding: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image source={img.coin} style={{ width: 38, height: 38 }} contentFit="contain" />
          <Text display size={32} lineHeight={32}>
            {formatPoints(fan.points)}
          </Text>
          <Text size={14} color="text2" style={{ marginTop: 6 }}>
            баллов
          </Text>
          <View style={{ flex: 1 }} />
          <View style={{ height: 28, paddingHorizontal: 12, borderRadius: 14, backgroundColor: colors.navy, justifyContent: 'center' }}>
            <Text size={13} weight={700} color="surface">
              Уровень {fan.level}
            </Text>
          </View>
        </View>
        <View style={{ gap: 6 }}>
          <View
            accessibilityRole="progressbar"
            accessibilityLabel={`Прогресс до уровня «${fan.nextLevel}»`}
            accessibilityValue={{ min: 0, max: 100, now: Math.round(fan.progress * 100) }}
            style={{ height: 10, borderRadius: 5, backgroundColor: colors.blue10, overflow: 'hidden' }}>
            <View style={{ width: `${fan.progress * 100}%`, height: 10, borderRadius: 5, backgroundColor: colors.blue }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text size={13} color="text2">
              {fan.levelName}
            </Text>
            <Text size={13} color="text2">
              ещё {fan.toNext} до «{fan.nextLevel}»
            </Text>
          </View>
        </View>
      </Card>
      </Pressable>

      <View style={{ marginTop: 8 }}>
        <SectionHeader title="Мои билеты" link="Все" onPress={() => router.push('/my-tickets')} />
      </View>
      <Card accent style={{ marginHorizontal: 20, padding: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text size={17} weight={700}>
              ORDA — Кайрат
            </Text>
            <Text size={13} weight={500} color="text2" style={{ letterSpacing: 0.5 }}>
              25 ОКТ · 19:00 · ФАН-СЕКТОР ЮГ · РЯД 4
            </Text>
          </View>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surfaceSunken, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bar-code-01" size={24} />
          </View>
        </View>
        <Button label="Показать QR-код" icon="qr-code" onPress={() => setQr(true)} />
      </Card>

      <View style={{ marginTop: 8 }}>
        <SectionHeader title="Аккаунт" />
      </View>
      <Card style={{ marginHorizontal: 20, paddingHorizontal: 16 }}>
        {rows.map((r, i) => (
          <Pressable
            key={r.title}
            accessibilityRole="link"
            onPress={() => router.push(r.to)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64, paddingVertical: 10, borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={r.icon} size={22} color="blue" weight={1.6} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text size={16} weight={700}>
                {r.title}
              </Text>
              <Text size={13} color="text2">
                {r.sub}
              </Text>
            </View>
            <Icon name="arrow-right-01" size={20} color="text3" weight={1.8} />
          </Pressable>
        ))}
      </Card>

      <Button label="Выйти из аккаунта" icon="logout-01" variant="outlineDanger" height={52} onPress={() => router.replace('/guest')} style={{ marginHorizontal: 20, marginTop: 8 }} />
      <Text size={13} color="text2" align="center" style={{ marginTop: -6 }}>
        Баллы и билеты сохранятся в вашем ORDA ID
      </Text>
    </Screen>
    <TicketQRSheet visible={qr} onClose={() => setQr(false)} />
    </>
  );
}
