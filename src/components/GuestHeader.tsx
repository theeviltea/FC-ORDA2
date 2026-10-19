import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import { img } from '@/data/images';
import { colors, shadows } from '@/theme';

import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

/** Header of the guest (signed-out) zone: club crest + ORDA wordmark, «Войти» on the right. */
export function GuestHeader() {
  return (
    <View style={{ height: 48, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View accessibilityLabel="ФК «Ордабасы»" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.avatar }}>
          <Image source={img.crest} style={{ width: 22, height: 28 }} contentFit="contain" />
        </View>
        <Text display size={22} style={{ letterSpacing: 0.9 }}>
          ORDA
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/login')}
        style={{ height: 36, paddingLeft: 10, paddingRight: 14, borderRadius: 18, backgroundColor: colors.blue600, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="user-circle" size={20} color="surface" weight={1.8} />
        <Text size={15} weight={700} color="surface">
          Войти
        </Text>
      </Pressable>
    </View>
  );
}
