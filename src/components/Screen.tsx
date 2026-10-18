import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

/** Scrollable screen on the brand background. `tabs` leaves room for the floating tab bar. */
export function Screen({ children, tabs, gap = 28, decor }: { children: ReactNode; tabs?: boolean; gap?: number; decor?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: (tabs ? 110 : 40) + insets.bottom, gap }}>
        {decor}
        {children}
      </ScrollView>
    </View>
  );
}

/** Horizontal carousel with the 20px gutter. */
export function Carousel({ children, gap = 12 }: { children: ReactNode; gap?: number }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap, paddingBottom: 6 }}>
      {children}
    </ScrollView>
  );
}
