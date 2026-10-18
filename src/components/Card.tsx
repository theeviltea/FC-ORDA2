import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadows } from '@/theme';

/** White surface card, radius 20, soft shadow. `accent` = 1.5px blue border (active ticket). */
export function Card({ children, accent, style }: { children: ReactNode; accent?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        { borderRadius: radius.l, backgroundColor: colors.surface, borderWidth: accent ? 1.5 : 0, borderColor: colors.blue, ...shadows.card },
        style,
      ]}>
      {children}
    </View>
  );
}
