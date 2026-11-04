import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appear, Gradient, Icon, Pressable, Text, TwinkleStar } from '@/components';
import { usePrefs } from '@/data/prefs';
import { tenge } from '@/data/shop';
import { colors } from '@/theme';

/** Оплата прошла: номер заказа, сумма, электронный чек на e-mail, куда смотреть статус. */
export default function Paid() {
  const { kind, total } = useLocalSearchParams<{ kind?: string; total?: string }>();
  const insets = useSafeAreaInsets();
  const { personal } = usePrefs();
  const tickets = kind === 'tickets';
  return (
    <Gradient style={{ flex: 1, overflow: 'hidden' }}>
      <TwinkleStar w={80} duration={3000} style={{ right: 30, top: 120 }} />
      <TwinkleStar w={200} duration={6000} delay={300} style={{ left: -80, top: 420 }} />
      <View style={{ paddingTop: insets.top + 120, paddingHorizontal: 28, alignItems: 'center', gap: 16 }}>
        <Appear kind="pop" duration={800}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="checkmark-circle-02" size={56} color="successText" weight={1.8} />
          </View>
        </Appear>
        <Appear delay={300}>
          <Text display size={32} lineHeight={34} upper color="surface" align="center" accessibilityRole="header">
            Оплата прошла
          </Text>
        </Appear>
        <Appear delay={500}>
          <Text size={16} lineHeight={24} color="blue10" align="center" style={{ maxWidth: 310 }}>
            {`Заказ № 004217-118 на ${tenge(Number(total ?? 0))}. Электронный чек отправили на ${personal.email}.`}
          </Text>
        </Appear>
        <Appear delay={700}>
          <Text size={14} lineHeight={20} color="blue10" align="center" style={{ maxWidth: 310, opacity: 0.85 }}>
            {tickets ? 'Билеты уже в разделе «Мои билеты».' : 'Статус заказа — в разделе «Мои заказы». Мы пришлём уведомление, когда он будет готов.'}
          </Text>
        </Appear>
      </View>
      <Appear delay={900} style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(insets.bottom, 12) + 28, gap: 10 }}>
        <Pressable accessibilityRole="button" onPress={() => router.replace(tickets ? '/my-tickets' : '/orders')} style={{ height: 52, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Text size={17} weight={700} color="blue600">
            {tickets ? 'Мои билеты' : 'Мои заказы'}
          </Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.dismissAll()} style={{ height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' }}>
          <Text size={17} weight={700} color="surface">
            Готово
          </Text>
        </Pressable>
      </Appear>
    </Gradient>
  );
}
