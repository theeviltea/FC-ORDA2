import { useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type Props = {
  children: ReactNode;
  /** Header pinned to the top (AppHeader / GuestHeader / NavBar); content scrolls under it. */
  header?: ReactNode;
  /** Leaves room for the floating tab bar. */
  tabs?: boolean;
  gap?: number;
  /** Decorative layer that scrolls with the content (brand stars). */
  decor?: ReactNode;
  /** Bar pinned to the bottom (e.g. «Купить»); `footerHeight` reserves room for it. */
  footer?: ReactNode;
  footerHeight?: number;
  /** Page background. */
  bg?: string;
  /** Header background when it differs from the page (white on articles). */
  headerBg?: string;
};

/** Screen on the brand background: fixed header on top, scrollable content below. */
export function Screen({ children, header, tabs, gap = 28, decor, footer, footerHeight = 0, bg = colors.bg, headerBg }: Props) {
  const insets = useSafeAreaInsets();
  const [scrolled, setScrolled] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {header ? (
        <View
          style={{
            paddingTop: insets.top + 8,
            backgroundColor: headerBg ?? bg,
            zIndex: 10,
            borderBottomWidth: 1,
            borderColor: scrolled ? colors.line : 'transparent',
            boxShadow: scrolled ? '0 6px 16px rgba(23, 42, 81, 0.06)' : undefined,
          }}>
          {header}
        </View>
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        onScroll={(e) => {
          const s = e.nativeEvent.contentOffset.y > 2;
          if (s !== scrolled) setScrolled(s);
        }}
        contentContainerStyle={{ paddingTop: header ? 8 : insets.top + 8, paddingBottom: (tabs ? 110 : 40) + footerHeight + insets.bottom, gap }}>
        {decor}
        {children}
      </ScrollView>
      {footer}
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
