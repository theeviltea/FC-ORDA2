import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';

import { Star } from './Star';

/**
 * Result-screen motion (quiz finished, contest entry sent…), 1:1 with the «Итог викторины» board:
 * headline rises, trophy pops in and floats, score and points pop, stars twinkle, confetti falls.
 * With «Reduce motion» on, everything simply appears.
 */

const native = Platform.OS !== 'web';

function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => sub.remove();
  }, []);
  return reduce;
}

const loop = (v: Animated.Value, ms: number, delay = 0) =>
  Animated.sequence([
    Animated.delay(delay),
    Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: ms / 2, easing: Easing.inOut(Easing.ease), useNativeDriver: native }),
        Animated.timing(v, { toValue: 0, duration: ms / 2, easing: Easing.inOut(Easing.ease), useNativeDriver: native }),
      ]),
    ),
  ]);

/** One-shot entrance. `rise` = slide up 24 px + fade, `pop` = overshooting scale with a little twist. */
export function Appear({ kind = 'rise', delay = 0, duration, float, style, children }: { kind?: 'rise' | 'pop'; delay?: number; duration?: number; float?: boolean; style?: StyleProp<ViewStyle>; children: ReactNode }) {
  const reduce = useReduceMotion();
  const t = useState(() => new Animated.Value(0))[0];
  const f = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    if (reduce) {
      t.setValue(1);
      return;
    }
    const ms = duration ?? (kind === 'pop' ? 800 : 700);
    const a = Animated.timing(t, { toValue: 1, duration: ms, delay, easing: Easing.out(Easing.cubic), useNativeDriver: native });
    a.start();
    const fl = float ? loop(f, 3000, delay + ms) : null;
    fl?.start();
    return () => {
      a.stop();
      fl?.stop();
    };
  }, [reduce, kind, delay, duration, float, t, f]);
  const transform =
    kind === 'pop'
      ? [
          { scale: t.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 1.15, 1] }) },
          { rotate: t.interpolate({ inputRange: [0, 0.7, 1], outputRange: ['-20deg', '4deg', '0deg'] }) },
          { translateY: f.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) },
        ]
      : [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }];
  return <Animated.View style={[style, { opacity: t.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 1] }), transform }]}>{children}</Animated.View>;
}

/** Brand star that slowly breathes and turns (decor). */
export function TwinkleStar({ w, fill = '#FFFFFF', duration = 4000, delay = 0, style }: { w: number; fill?: string; duration?: number; delay?: number; style: StyleProp<ViewStyle> }) {
  const reduce = useReduceMotion();
  const v = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    if (reduce) return;
    const a = loop(v, duration, delay);
    a.start();
    return () => a.stop();
  }, [reduce, v, duration, delay]);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', width: w, height: w },
        style,
        {
          opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.5] }),
          transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }, { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] }) }],
        },
      ]}>
      <Star w={w} fill={fill} style={{ left: 0, top: 0 }} />
    </Animated.View>
  );
}

/** Soft white ring pulsing out of a pill (the points badge). Put it first inside a `position: relative` parent. */
export function GlowRing({ radius, delay = 2000 }: { radius: number; delay?: number }) {
  const reduce = useReduceMotion();
  const v = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    if (reduce) return;
    const a = Animated.sequence([Animated.delay(delay), Animated.loop(Animated.timing(v, { toValue: 1, duration: 2000, easing: Easing.out(Easing.ease), useNativeDriver: native }))]);
    a.start();
    return () => a.stop();
  }, [reduce, v, delay]);
  if (reduce) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: radius,
          borderWidth: 6,
          borderColor: 'rgba(255, 255, 255, 0.5)',
          opacity: v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] }),
          transform: [{ scaleX: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) }, { scaleY: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] }) }],
        },
      ]}
    />
  );
}

const PIECES = ['#FFFFFF', '#E30512', '#7CC6E9', '#FFD84D', '#129ED9'];

function Piece({ i, height }: { i: number; height: number }) {
  const v = useState(() => new Animated.Value(0))[0];
  const duration = [3000, 3700, 4400, 5100][i % 4];
  const delay = [300, 650, 1000, 1350, 1700][i % 5];
  useEffect(() => {
    const a = Animated.sequence([Animated.delay(delay), Animated.loop(Animated.timing(v, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: native }))]);
    a.start();
    return () => a.stop();
  }, [v, duration, delay]);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: `${6 + i * 7}%`,
        width: 8,
        height: 14,
        borderRadius: 2,
        backgroundColor: PIECES[i % PIECES.length],
        opacity: v.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 1, 1] }),
        transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-40, height + 40] }) }, { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '540deg'] }) }],
      }}
    />
  );
}

/** Falling brand-colour confetti over the whole screen (14 pieces, looping). */
export function Confetti({ count = 14 }: { count?: number }) {
  const reduce = useReduceMotion();
  const { height } = useWindowDimensions();
  if (reduce) return null;
  return (
    <View pointerEvents="none" aria-hidden style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      {Array.from({ length: count }, (_, i) => (
        <Piece key={i} i={i} height={height} />
      ))}
    </View>
  );
}
