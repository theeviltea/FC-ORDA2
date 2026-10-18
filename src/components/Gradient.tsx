import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { gradients } from '@/theme';

/** Brand vertical gradient navy → blue (`linear-gradient(180deg, #172A51, #129ED9)`). */
export function Gradient({ style, children, colors = gradients.brand }: { style?: StyleProp<ViewStyle>; children?: ReactNode; colors?: readonly [string, string, ...string[]] }) {
  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={style}>
      {children}
    </LinearGradient>
  );
}
