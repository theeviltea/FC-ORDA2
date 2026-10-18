import type { StyleProp, ViewStyle } from 'react-native';

import { colors, radius } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

type Variant = 'primary' | 'white' | 'soft' | 'muted' | 'outlineDanger';

const look: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.blue600, fg: colors.surface },
  white: { bg: colors.surface, fg: colors.navy },
  soft: { bg: colors.blue10, fg: colors.blue600 },
  muted: { bg: '#E9EEF5', fg: colors.text2 },
  outlineDanger: { bg: colors.surface, fg: colors.errorText, border: colors.line },
};

/** DS button. Primary = blue-600 fill, no coloured shadow. */
export function Button({ label, icon, onPress, variant = 'primary', height = 48, disabled, style }: { label: string; icon?: IconName; onPress?: () => void; variant?: Variant; height?: number; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const l = look[disabled ? 'muted' : variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          height,
          borderRadius: height >= 52 ? 16 : radius.m,
          backgroundColor: l.bg,
          borderWidth: l.border ? 1.5 : 0,
          borderColor: l.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        },
        style,
      ]}>
      {icon ? <Icon name={icon} size={20} color={l.fg} weight={1.8} /> : null}
      <Text size={height >= 52 ? 17 : 16} weight={700} color={l.fg}>
        {label}
      </Text>
    </Pressable>
  );
}
