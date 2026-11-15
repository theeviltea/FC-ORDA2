import { Image } from 'expo-image';
import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Gradient, Icon, Star, Text, type IconName } from '@/components';
import { img } from '@/data/images';
import { match } from '@/data/stadium';
import { colors, shadows } from '@/theme';

/** Red pill with a blinking dot: «Идёт сейчас · 32′». */
export function LiveChip({ label }: { label: string }) {
  const [v] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 0.35, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(v, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    a.start();
    return () => a.stop();
  }, [v]);
  return (
    <View style={{ alignSelf: 'flex-start', height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: colors.red, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Animated.View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.surface, opacity: v }} />
      <Text size={12} lineHeight={14} weight={700} color="surface">
        {label}
      </Text>
    </View>
  );
}

export function Chip({ label, icon, bg = colors.surfaceSunken, fg = colors.text2 }: { label: string; icon?: IconName; bg?: string; fg?: string }) {
  return (
    <View style={{ alignSelf: 'flex-start', height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: bg, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      {icon ? <Icon name={icon} size={15} color={fg} weight={2} /> : null}
      <Text size={12} lineHeight={14} weight={700} color={fg}>
        {label}
      </Text>
    </View>
  );
}

function Crest({ src, w, h }: { src: number; w: number; h: number }) {
  return (
    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={src} style={{ width: w, height: h }} contentFit="contain" />
    </View>
  );
}

/** Dark match card with the live minute, score and an optional footer (timer bar, hint). */
export function MatchStrip({ minute, score, live = true, children }: { minute: string; score: string; live?: boolean; children?: ReactNode }) {
  return (
    <Gradient colors={[colors.navy, '#0B3A6B']} style={{ marginHorizontal: 20, padding: 16, borderRadius: 22, overflow: 'hidden', gap: 12 }}>
      <Star w={70} fill="rgba(18,158,217,0.25)" style={{ right: -20, top: -24 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {live ? <LiveChip label={minute} /> : <Chip label={minute} icon="clock-01" bg="rgba(255,255,255,0.14)" fg={colors.surface} />}
        <Text size={13} color="onDark2">
          {match.round}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Crest src={img.crest} w={27} h={33} />
          <Text display size={17} color="surface">
            {match.home}
          </Text>
        </View>
        <Text display size={36} lineHeight={38} color="surface">
          {score}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text display size={17} color="surface">
            {match.away}
          </Text>
          <Crest src={img.clubKairat} w={30} h={33} />
        </View>
      </View>
      {children}
    </Gradient>
  );
}

/** Progress bar under the match card: «Приём прогнозов до 30′ · осталось 12 мин». */
export function TimerBar({ label, left, pct, color = colors.sky }: { label: string; left: string; pct: number; color?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text size={13} color="onDark2">
          {label}
        </Text>
        <Text size={13} weight={700} color="surface">
          {left}
        </Text>
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
        <View style={{ width: `${Math.round(pct * 100)}%`, height: 6, borderRadius: 3, backgroundColor: color }} />
      </View>
    </View>
  );
}

export function SectionTitle({ children }: { children: string }) {
  return (
    <Text display size={24} lineHeight={28} style={{ marginHorizontal: 20, marginTop: 8, marginBottom: -4 }} accessibilityRole="header">
      {children}
    </Text>
  );
}

export function Card({ children, padding = 16, gap = 14 }: { children: ReactNode; padding?: number; gap?: number }) {
  return <View style={{ marginHorizontal: 20, padding, gap, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card }}>{children}</View>;
}

/** Icon + text rows («Правила», «Как играть»). */
export function Rules({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      <View style={{ marginHorizontal: 20, paddingVertical: 4, paddingHorizontal: 16, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card }}>
        {items.map(([ic, t], i) => (
          <View key={t} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: i < items.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={ic as IconName} size={18} color="blue" weight={1.7} />
            </View>
            <Text size={14} lineHeight={20} color="text2" style={{ flex: 1 }}>
              {t}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

export type StepState = 'done' | 'now' | 'next' | 'fail' | 'off';
const stepLook: Record<StepState, { icon: IconName; bg: string; fg: string; text: string }> = {
  done: { icon: 'tick-02', bg: colors.blue, fg: colors.surface, text: colors.navy },
  now: { icon: 'clock-01', bg: colors.surface, fg: colors.blue, text: colors.navy },
  next: { icon: 'clock-01', bg: colors.surfaceSunken, fg: colors.text3, text: colors.text3 },
  fail: { icon: 'cancel-01', bg: colors.red, fg: colors.surface, text: '#B0040E' },
  off: { icon: 'minus-sign', bg: colors.surfaceSunken, fg: '#B9CBE0', text: colors.text3 },
};

/** Vertical status timeline (photo moderation → queue → shown). */
export function Timeline({ steps }: { steps: { state: StepState; title: string; sub: string; icon?: IconName }[] }) {
  return (
    <View accessibilityRole="list">
      {steps.map((s, i) => {
        const l = stepLook[s.state];
        return (
          <View key={s.title} style={{ flexDirection: 'row', gap: 14, paddingBottom: 18 }}>
            {i < steps.length - 1 ? <View style={{ position: 'absolute', left: 17, top: 40, bottom: -6, width: 2, backgroundColor: s.state === 'done' ? colors.blue : colors.line }} /> : null}
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: l.bg, borderWidth: s.state === 'now' ? 2 : 0, borderColor: colors.blue, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={s.icon ?? l.icon} size={18} color={l.fg} weight={2.2} />
            </View>
            <View style={{ flex: 1, gap: 2, paddingTop: 6 }}>
              <Text size={16} weight={700} color={l.text}>
                {s.title}
              </Text>
              <Text size={14} lineHeight={19} color="text2">
                {s.sub}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

/** Square-ish placeholder QR (real code comes from the backend). */
export function FakeQR({ size, cells = 21, seed = 11 }: { size: number; cells?: number; seed?: number }) {
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  const finder = (r: number, c: number) => {
    for (const [y, x] of [
      [0, 0],
      [0, cells - 7],
      [cells - 7, 0],
    ]) {
      const dy = r - y;
      const dx = c - x;
      if (dy >= 0 && dy < 7 && dx >= 0 && dx < 7) return Math.max(Math.abs(dx - 3), Math.abs(dy - 3)) !== 2;
      if (dy >= -1 && dy <= 7 && dx >= -1 && dx <= 7) return false;
    }
    return null;
  };
  const cell = size / cells;
  const rows = [];
  for (let r = 0; r < cells; r++)
    for (let c = 0; c < cells; c++) {
      const f = finder(r, c);
      const on = f === null ? rnd() < 0.45 : f;
      if (on) rows.push(<View key={`${r}-${c}`} style={{ position: 'absolute', left: c * cell, top: r * cell, width: cell + 0.5, height: cell + 0.5, backgroundColor: colors.navy }} />);
    }
  return (
    <View accessibilityRole="image" accessibilityLabel="QR-код" style={{ width: size, height: size }}>
      {rows}
    </View>
  );
}

/** White bar pinned to the bottom with the main action. */
export function Footer({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 14, paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 12) + 16, backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 8, boxShadow: '0 -8px 28px rgba(23, 42, 81, 0.1)' }}>{children}</View>;
}

/** Small «+30 баллов» badge on light screens. */
export function Points({ n }: { n: string }) {
  return (
    <View style={{ alignSelf: 'flex-start', height: 30, paddingLeft: 4, paddingRight: 12, borderRadius: 15, backgroundColor: colors.blue10, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Image source={img.coin} style={{ width: 22, height: 22 }} contentFit="contain" />
      <Text size={14} weight={700} color="blue600">
        {n}
      </Text>
    </View>
  );
}
