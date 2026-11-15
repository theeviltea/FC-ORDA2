import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { img } from '@/data/images';
import { colors } from '@/theme';

import { Appear, Confetti, GlowRing, TwinkleStar } from './Celebrate';
import { Gradient } from './Gradient';
import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Star } from './Star';
import { Text } from './Text';

/**
 * Full-screen game result (check-in done, photo shown, half-time score, prize won).
 * `happy` → brand gradient, twinkling stars and confetti; otherwise a calm navy screen.
 */
export function ResultScreen({ happy = true, top, title, text, children, actions }: { happy?: boolean; top?: ReactNode; title: string; text: ReactNode; children?: ReactNode; actions: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Gradient colors={happy ? [colors.navy, colors.blue] : [colors.navy, '#1F3F6E']} style={{ flex: 1, overflow: 'hidden' }}>
      {happy ? (
        <>
          <TwinkleStar w={90} duration={3000} style={{ right: 30, top: 110 }} />
          <TwinkleStar w={240} duration={6000} delay={300} style={{ left: -110, top: 440 }} />
        </>
      ) : (
        <Star w={200} fill="rgba(255,255,255,0.08)" style={{ right: -80, top: 380 }} />
      )}
      <View style={{ paddingTop: insets.top + 56, paddingHorizontal: 24, alignItems: 'center', gap: 16 }}>
        {top}
        <Appear delay={300}>
          <Text display size={34} lineHeight={36} upper color="surface" align="center" accessibilityRole="header">
            {title}
          </Text>
        </Appear>
        <Appear delay={500}>
          <Text size={17} lineHeight={25} color="blue10" align="center">
            {text}
          </Text>
        </Appear>
        {children}
      </View>
      <Appear delay={1200} style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(insets.bottom, 12) + 20, gap: 10 }}>
        {actions}
      </Appear>
      {happy ? <Confetti /> : null}
    </Gradient>
  );
}

/** «+20 баллов» pill with the coin and a pulsing ring. */
export function PointsPill({ n, delay = 1000 }: { n: string; delay?: number }) {
  return (
    <Appear kind="pop" delay={delay} duration={600}>
      <GlowRing radius={22} delay={delay + 800} />
      <View style={{ height: 44, paddingLeft: 8, paddingRight: 18, borderRadius: 22, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Image source={img.coin} style={{ width: 30, height: 30 }} contentFit="contain" />
        <Text size={18} weight={700}>
          {n}
        </Text>
      </View>
    </Appear>
  );
}

/** Translucent rows under a result («Точный счёт ✓ +20»). */
export function ResultRows({ rows, delay = 1000 }: { rows: { label: string; value: string; mark?: 'yes' | 'no' }[]; delay?: number }) {
  return (
    <Appear delay={delay} style={{ alignSelf: 'stretch' }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 4, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)' }}>
        {rows.map((r, i) => (
          <View key={r.label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderColor: 'rgba(255,255,255,0.14)' }}>
            <Text size={15} color="onDark2">
              {r.label}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {r.mark ? <Icon name={r.mark === 'yes' ? 'tick-02' : 'cancel-01'} size={16} color={r.mark === 'yes' ? '#7FD3A2' : '#FF8A8F'} weight={2.6} /> : null}
              <Text size={15} weight={700} color="surface">
                {r.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Appear>
  );
}

/** White / outlined buttons on result screens. */
export function ResultButton({ label, icon, onPress, outline }: { label: string; icon?: IconName; onPress: () => void; outline?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ height: 54, borderRadius: 16, backgroundColor: outline ? 'transparent' : colors.surface, borderWidth: outline ? 1.5 : 0, borderColor: 'rgba(255,255,255,0.6)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {icon ? <Icon name={icon} size={20} color={outline ? 'surface' : 'navy'} weight={1.8} /> : null}
      <Text size={17} weight={700} color={outline ? 'surface' : 'navy'}>
        {label}
      </Text>
    </Pressable>
  );
}
