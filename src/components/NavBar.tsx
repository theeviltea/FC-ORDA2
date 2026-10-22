import { router } from 'expo-router';
import { View } from 'react-native';

import { colors } from '@/theme';

import { GlassButton } from './Glass';
import type { IconName } from './Icon';
import { Text } from './Text';

type Props = {
  title: string;
  /** Hide «Назад» on screens that have nowhere to go back to. */
  back?: boolean;
  /** `active` = pressed toggle (favourite): red, filled. */
  action?: { icon: IconName; label: string; onPress: () => void; active?: boolean };
  tone?: 'light' | 'dark';
};

/** Second-level nav bar (iOS 26 style): round glass «Назад» left, centred uppercase title, one glass action (or empty slot) right. */
export function NavBar({ title, back = true, action, tone = 'light' }: Props) {
  const fg = tone === 'dark' ? colors.surface : colors.navy;
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <View style={{ height: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {back ? <GlassButton icon="arrow-left-01" label="Назад" tone={tone} onPress={goBack} /> : <View style={{ width: 44 }} />}
      <Text display size={20} upper numberOfLines={1} align="center" color={fg} style={{ flex: 1, letterSpacing: 0.4 }}>
        {title}
      </Text>
      {action ? (
        <GlassButton icon={action.icon} label={action.label} tone={tone} onPress={action.onPress} selected={action.active} color={action.active ? colors.red : undefined} filled={action.active} />
      ) : (
        <View style={{ width: 44 }} />
      )}
    </View>
  );
}
