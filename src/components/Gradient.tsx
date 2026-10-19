import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { gradients } from '@/theme';

/** Brand vertical gradient navy → blue (`linear-gradient(180deg, #172A51, #129ED9)`). */
export function Gradient({ style, children, colors = gradients.brand, locations }: { style?: StyleProp<ViewStyle>; children?: ReactNode; colors?: readonly [string, string, ...string[]]; locations?: readonly [number, number, ...number[]] }) {
  return (
    <LinearGradient colors={colors} locations={locations} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={style}>
      {children}
    </LinearGradient>
  );
}
