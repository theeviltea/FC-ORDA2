import { router } from 'expo-router';
import { View } from 'react-native';

import { colors } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

type Props = {
  title: string;
  /** Hide «Назад» on screens that have nowhere to go back to. */
  back?: boolean;
  /** `active` = pressed toggle (favourite): red, filled. */
  action?: { icon: IconName; label: string; onPress: () => void; active?: boolean };
  tone?: 'light' | 'dark';
};

/** Second-level nav bar: «Назад» left, centred uppercase title, one action icon (or empty slot) right. */
export function NavBar({ title, back = true, action, tone = 'light' }: Props) {
  const fg = tone === 'dark' ? colors.surface : colors.navy;
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <View style={{ height: 48, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {back ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Назад" onPress={goBack} style={{ width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow-left-01" size={26} color={fg} weight={1.8} />
        </Pressable>
      ) : (
        <View style={{ width: 44 }} />
      )}
      <Text display size={20} upper numberOfLines={1} align="center" color={fg} style={{ flex: 1, letterSpacing: 0.4 }}>
        {title}
      </Text>
      {action ? (
        <Pressable accessibilityRole="button" accessibilityLabel={action.label} accessibilityState={action.active !== undefined ? { selected: action.active } : undefined} onPress={action.onPress} style={{ width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={action.icon} size={24} color={action.active ? colors.red : fg} filled={action.active} />
        </Pressable>
      ) : (
        <View style={{ width: 44 }} />
      )}
    </View>
  );
}
