import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appear, Confetti, GlowRing, Gradient, Pressable, Text, TwinkleStar } from '@/components';
import { contests, findContest } from '@/data/contests';
import { img } from '@/data/images';
import { colors } from '@/theme';

/** Заявка отправлена: модерация, дата итогов, +20 баллов за участие. Та же анимация результата, что у викторины. */
export default function ContestSent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = findContest(id ?? '') ?? contests[0];
  const insets = useSafeAreaInsets();
  return (
    <Gradient style={{ flex: 1, overflow: 'hidden' }}>
      <Text display size={120} lineHeight={103} color="rgba(255,255,255,0.07)" style={{ position: 'absolute', left: -10, top: 70 }} aria-hidden>
        {'GOOD\nLUCK'}
      </Text>
      <TwinkleStar w={60} duration={3000} style={{ right: 40, top: 100 }} />
      <TwinkleStar w={150} duration={6000} delay={300} style={{ right: -50, bottom: 140 }} />
      <TwinkleStar w={40} duration={4000} delay={800} style={{ left: 30, bottom: 260 }} />
      <View style={{ paddingTop: insets.top + 140, paddingHorizontal: 28, alignItems: 'center', gap: 18 }}>
        <Appear kind="pop" delay={100} duration={900} float>
          <Image source={img.icon3dContest} style={{ width: 150, height: 150, filter: 'drop-shadow(0 18px 26px rgba(10, 18, 36, 0.4))' } as object} contentFit="contain" />
        </Appear>
        <Appear delay={400}>
          <Text display size={32} lineHeight={34} upper color="surface" align="center" accessibilityRole="header">
            Заявка отправлена!
          </Text>
        </Appear>
        <Appear delay={600}>
          <Text size={16} lineHeight={24} color="blue10" align="center" style={{ maxWidth: 300 }}>
            Фото на модерации. Итоги — {c.resultsText}, мы пришлём уведомление в приложении.
          </Text>
        </Appear>
        <Appear kind="pop" delay={1000} duration={600}>
          <GlowRing radius={20} delay={1700} />
          <View style={{ height: 40, paddingLeft: 6, paddingRight: 14, borderRadius: 20, backgroundColor: 'rgba(23,42,81,0.35)', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Image source={img.coin} style={{ width: 28, height: 28 }} contentFit="contain" />
            <Text size={15} weight={700} color="surface">
              +20 баллов за участие
            </Text>
          </View>
        </Appear>
      </View>
      <Confetti />
      <Appear delay={1300} duration={600} style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(insets.bottom, 12) + 28, gap: 10 }}>
        <Pressable accessibilityRole="button" onPress={() => router.dismissTo('/contests')} style={{ height: 52, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Text size={17} weight={700} color="blue600">
            Готово
          </Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.replace({ pathname: '/contest/apply', params: { id: c.id } })} style={{ height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' }}>
          <Text size={17} weight={700} color="surface">
            Посмотреть заявку
          </Text>
        </Pressable>
      </Appear>
    </Gradient>
  );
}
