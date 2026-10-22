import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type ColorValue, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

/** Real Liquid Glass only on iOS 26+; everywhere else a blurred translucent fallback. */
export const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

export type GlassTone = 'light' | 'dark';

type GlassProps = {
  children?: ReactNode;
  radius?: number;
  tone?: GlassTone;
  /** Tinted glass (e.g. brand blue for a primary action). */
  tint?: ColorValue;
  /** iOS 26: glass reacts to touch (pressed shimmer). */
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Glass surface for floating controls (nav bar buttons, header capsules).
 * iOS 26 → system `GlassView`; iOS < 26 and web → blur + white veil; Android → near-opaque veil (no cheap blur).
 */
export function Glass({ children, radius = 22, tone = 'light', tint, interactive, style }: GlassProps) {
  const dark = tone === 'dark';
  if (liquidGlass) {
    return (
      <GlassView glassEffectStyle="regular" isInteractive={interactive} colorScheme={dark ? 'dark' : 'light'} tintColor={tint} style={[{ borderRadius: radius, overflow: 'hidden' }, style]}>
        {children}
      </GlassView>
    );
  }
  const veil = tint ?? (dark ? 'rgba(23, 42, 81, 0.38)' : Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.66)');
  return (
    <View style={[{ borderRadius: radius, boxShadow: dark ? '0 6px 18px rgba(0, 0, 0, 0.22)' : '0 6px 18px rgba(23, 42, 81, 0.12)' }, style]}>
      <View style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
        {Platform.OS !== 'android' ? <BlurView intensity={dark ? 40 : 60} tint={dark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} /> : null}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: veil, borderRadius: radius, borderWidth: 1, borderColor: dark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.95)' }]} />
      </View>
      {children}
    </View>
  );
}

type GlassButtonProps = {
  icon: IconName;
  label: string;
  onPress?: () => void;
  tone?: GlassTone;
  /** Icon colour override (e.g. red filled heart when a toggle is on). */
  color?: ColorValue;
  filled?: boolean;
  selected?: boolean;
  size?: number;
  /** Small counter in the corner (unread notifications). */
  badge?: number | string;
  role?: 'button' | 'link';
};

/** Round glass icon button, 44 px: back, share, favourite, notifications. */
export function GlassButton({ icon, label, onPress, tone = 'light', color, filled, selected, size = 44, badge, role = 'button' }: GlassButtonProps) {
  const fg = color ?? (tone === 'dark' ? colors.surface : colors.navy);
  return (
    <Pressable accessibilityRole={role} accessibilityLabel={badge ? `${label}, ${badge} новых` : label} accessibilityState={selected !== undefined ? { selected } : undefined} onPress={onPress} hitSlop={4}>
      <Glass radius={size / 2} tone={tone} interactive style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={22} color={fg as string} weight={1.8} filled={filled} />
      </Glass>
      {badge ? (
        <View style={{ position: 'absolute', top: -3, right: -4, minWidth: 20, height: 20, paddingHorizontal: 4, borderRadius: 10, backgroundColor: colors.red, borderWidth: 2, borderColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Text size={11} weight={700} color="surface" lineHeight={13}>
            {badge}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
