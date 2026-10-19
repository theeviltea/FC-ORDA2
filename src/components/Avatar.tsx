import { Image } from 'expo-image';
import { View } from 'react-native';

import { usePrefs } from '@/data/prefs';
import { colors } from '@/theme';

import { Icon } from './Icon';

/** The fan's profile photo, or a user icon on light blue when the account has none. */
export function Avatar({ size, label }: { size: number; label?: string }) {
  const { avatar } = usePrefs();
  return avatar ? (
    <Image source={avatar} accessibilityLabel={label} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />
  ) : (
    <View accessibilityLabel={label} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="user" size={Math.round(size * 0.45)} color="sky" />
    </View>
  );
}
