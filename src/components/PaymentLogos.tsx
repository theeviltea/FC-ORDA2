import { Image } from 'expo-image';
import { Linking, View } from 'react-native';

import { img } from '@/data/images';
import { epayUrl } from '@/data/legal';
import { colors } from '@/theme';

import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

/**
 * Informers required by Halyk Bank: full-colour Visa / Mastercard marks, the bank's ePay mark linking to epayment.kz,
 * and a 3-D Secure note. The ePay tile is a text placeholder until the bank's official logo kit arrives.
 */
export function PaymentLogos({ note = true, align = 'flex-start' }: { note?: boolean; align?: 'flex-start' | 'center' }) {
  return (
    <View style={{ gap: 10, alignItems: align }}>
      <View accessibilityLabel="Принимаем карты Visa и Mastercard, оплата через Halyk ePay" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: align }}>
        <Image source={img.payVisa} accessibilityLabel="Visa" style={{ width: 52, height: 33, borderRadius: 5 }} contentFit="contain" />
        <Image source={img.payMastercard} accessibilityLabel="Mastercard" style={{ width: 52, height: 33, borderRadius: 5 }} contentFit="contain" />
        <Pressable accessibilityRole="link" accessibilityLabel="Halyk ePay — платёжный сервис Halyk Bank, открыть epayment.kz" onPress={() => Linking.openURL(epayUrl)} style={{ height: 33, paddingHorizontal: 10, borderRadius: 5, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text size={13} weight={700}>
            Halyk ePay
          </Text>
          <Icon name="link-square-02" size={14} color="text2" weight={1.8} />
        </Pressable>
      </View>
      {note ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="security-check" size={16} color="successText" weight={1.8} />
          <Text size={12} lineHeight={16} color="text2">
            Платежи защищены 3-D Secure: Visa Secure и Mastercard Identity Check
          </Text>
        </View>
      ) : null}
    </View>
  );
}
