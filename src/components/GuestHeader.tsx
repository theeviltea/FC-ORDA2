import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import { img } from '@/data/images';
import { colors } from '@/theme';

import { Glass } from './Glass';
import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

/** Header of the guest (signed-out) zone: glass capsule with crest + ORDA wordmark, blue glass «Войти» on the right. */
export function GuestHeader() {
  return (
    <View style={{ height: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Glass radius={24} style={{ height: 48, paddingLeft: 6, paddingRight: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View accessibilityLabel="ФК «Ордабасы»" style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={img.crest} style={{ width: 22, height: 28 }} contentFit="contain" />
        </View>
        <Text display size={22} style={{ letterSpacing: 0.9 }}>
          ORDA
        </Text>
      </Glass>
      <View style={{ flex: 1 }} />
      <Pressable accessibilityRole="button" onPress={() => router.push('/login')}>
        <Glass radius={22} tint={colors.blue600} interactive style={{ height: 44, paddingLeft: 12, paddingRight: 16, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="user-circle" size={20} color="surface" weight={1.8} />
          <Text size={15} weight={700} color="surface">
            Войти
          </Text>
        </Glass>
      </Pressable>
    </View>
  );
}
