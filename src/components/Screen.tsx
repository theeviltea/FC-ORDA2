import { useState, type ReactNode, type RefObject } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type Props = {
  children: ReactNode;
  /** Floating header (AppHeader / GuestHeader / NavBar); content scrolls under it. */
  header?: ReactNode;
  /** Tab screen: leaves room for the tab bar. */
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
  /** Access to the scroll view (jump to a section). */
  scrollRef?: RefObject<ScrollView | null>;
  /** Thin reading-progress bar under the header (long reads). */
  readingProgress?: boolean;
};

/** `#F2F6FA` + alpha → `rgba(…)` for the scroll-edge fade. */
function fade(hex: string, a: number) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/**
 * Screen on the brand background. The header floats over the content (iOS 26 style: glass buttons, no bar);
 * once the content scrolls under it, a soft scroll-edge fade in the page colour keeps the title readable.
 */
export function Screen({ children, header, tabs, gap = 28, decor, footer, footerHeight = 0, bg = colors.bg, headerBg, scrollRef, readingProgress }: Props) {
  const insets = useSafeAreaInsets();
  const [scrolled, setScrolled] = useState(false);
  const [read, setRead] = useState(0);
  const [headerH, setHeaderH] = useState(insets.top + 8 + 52);
  const edge = headerBg ?? bg;
  // Native tabs (iOS/Android) already sit outside the content and report their height through the safe-area insets;
  // the web keeps the floating JS tab bar, so it needs the extra room.
  const tabRoom = tabs && Platform.OS === 'web' ? 110 : 40;
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        onScroll={(e) => {
          const s = e.nativeEvent.contentOffset.y > 2;
          if (s !== scrolled) setScrolled(s);
          if (readingProgress) {
            const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
            const max = contentSize.height - layoutMeasurement.height;
            setRead(max > 0 ? Math.min(1, Math.max(0, contentOffset.y / max)) : 0);
          }
        }}
        contentContainerStyle={{ paddingTop: header ? headerH + 8 : insets.top + 8, paddingBottom: tabRoom + footerHeight + insets.bottom, gap }}>
        {decor}
        {children}
      </ScrollView>
      {header ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }} pointerEvents="box-none" onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}>
          <LinearGradient
            pointerEvents="none"
            colors={[fade(edge, 0.98), fade(edge, 0.92), fade(edge, 0)]}
            locations={[0, 0.7, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: -32, opacity: scrolled || headerBg ? 1 : 0 }}
          />
          <View style={{ paddingTop: insets.top + 8 }} pointerEvents="box-none">
            {header}
          </View>
          {readingProgress ? (
            <View aria-hidden style={{ height: 3, marginTop: 4, marginHorizontal: 16, borderRadius: 2, overflow: 'hidden', backgroundColor: colors.blue10 }}>
              <View style={{ width: `${Math.round(read * 100)}%`, height: 3, backgroundColor: colors.blue }} />
            </View>
          ) : null}
        </View>
      ) : null}
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
