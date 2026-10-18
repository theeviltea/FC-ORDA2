import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Button, Gradient, NavBar, Screen, Star, Text } from '@/components';
import { findContest } from '@/data/contests';
import { img } from '@/data/images';
import { share } from '@/data/share';
import { colors, shadows } from '@/theme';

/** Победители завершённого конкурса: шапка, карточка победителя с призом, благодарность. */
export default function ContestWinners() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = findContest(id ?? 'poster') ?? findContest('poster')!;
  return (
    <Screen gap={14} header={<NavBar title="Победители" action={{ icon: 'share-08', label: 'Поделиться', onPress: share(`Итоги конкурса ORDA «${c.title}»`) }} />}>
      <Gradient style={{ marginHorizontal: 20, padding: 18, gap: 10, borderRadius: 24, overflow: 'hidden' }}>
        <Text display size={96} lineHeight={83} align="right" color="rgba(255,255,255,0.08)" style={{ position: 'absolute', right: -8, top: -10 }} aria-hidden>
          {'WIN\nNER'}
        </Text>
        <Star w={14} fill={colors.sky} style={{ left: '62%', top: 22 }} />
        <View style={{ alignSelf: 'flex-start', height: 26, paddingHorizontal: 11, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center' }}>
          <Text size={12} lineHeight={14} weight={700} color="surface">
            Конкурс завершён
          </Text>
        </View>
        <Text display size={30} lineHeight={31} upper color="surface" accessibilityRole="header" style={{ maxWidth: 300 }}>
          {c.title}
        </Text>
        <Text size={14} color="onDark2">
          Приём заявок закрыт · {c.participants} участников · {c.prize.winners} победитель
        </Text>
      </Gradient>

      <Text display size={22} lineHeight={24} upper style={{ marginHorizontal: 20, marginTop: 6, marginBottom: -4 }}>
        Победитель
      </Text>
      <View style={{ marginHorizontal: 20, borderRadius: 22, backgroundColor: colors.surface, overflow: 'hidden', ...shadows.card }}>
        <View style={{ height: 250, backgroundColor: colors.navy }}>
          <Image source={img.photoFans} accessibilityLabel="Фото победителя с трибуны" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" />
          <Gradient colors={['rgba(23,42,81,0)', 'rgba(23,42,81,0.85)']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 }} />
          <Image source={img.trophy} style={{ position: 'absolute', right: 12, top: 12, width: 64, height: 64 }} contentFit="contain" />
          <View style={{ position: 'absolute', left: 16, bottom: 14, gap: 2 }}>
            <Text display size={24} lineHeight={26} upper color="surface">
              Заявка № 0087
            </Text>
            <Text size={13} color="onDark2">
              Плакат с домашнего матча
            </Text>
          </View>
        </View>
        <View style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={c.prize.photo} style={{ width: 44, height: 44 }} contentFit="contain" />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text size={12} weight={700} upper color="blue600" style={{ letterSpacing: 0.7 }}>
              Выигранный приз
            </Text>
            <Text size={16} weight={700}>
              {c.prize.title}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ marginHorizontal: 20, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.surfaceSunken }}>
        <Text size={13} lineHeight={18} color="text2">
          По правилам конкурса победитель выбран случайным образом среди принятых заявок. Имя публикуем только с согласия победителя.
        </Text>
      </View>

      <View style={{ marginHorizontal: 20, padding: 18, gap: 6, borderRadius: 22, backgroundColor: colors.surface, overflow: 'hidden', ...shadows.card }}>
        <Star w={80} fill="#DCEEF8" style={{ right: -22, bottom: -22 }} />
        <Text display size={22} lineHeight={24} upper>
          Спасибо за поддержку!
        </Text>
        <Text size={14} lineHeight={20} color="text2">
          Спасибо всем, кто прислал свои работы. Ваша поддержка объединяет команду и болельщиков.
        </Text>
      </View>
      <Button label="Другие конкурсы" variant="soft" height={52} style={{ marginHorizontal: 20 }} onPress={() => (router.canGoBack() ? router.back() : router.replace('/contests'))} />
    </Screen>
  );
}
