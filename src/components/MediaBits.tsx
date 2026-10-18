import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, shadows } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

/** «📷 48» pill on photo covers. */
export function PhotoCount({ n, style }: { n: number | string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ position: 'absolute', right: 8, bottom: 8, height: 24, paddingHorizontal: 8, borderRadius: 12, backgroundColor: 'rgba(23,42,81,0.72)', flexDirection: 'row', alignItems: 'center', gap: 4 }, style]}>
      <Icon name="camera-01" size={14} color="surface" weight={1.8} />
      <Text size={12} lineHeight={14} weight={700} color="surface">
        {n}
      </Text>
    </View>
  );
}

/** Duration tag in the corner of a video thumbnail. */
export function Duration({ children, bottom = 8 }: { children: string; bottom?: number }) {
  return (
    <View style={{ position: 'absolute', right: 8, bottom, height: 22, paddingHorizontal: 7, borderRadius: 6, backgroundColor: 'rgba(10,18,36,0.78)', justifyContent: 'center' }}>
      <Text size={12} lineHeight={14} weight={700} color="surface" style={{ fontVariant: ['tabular-nums'] }}>
        {children}
      </Text>
    </View>
  );
}

/** White round play button centred on a thumbnail. */
export function PlayBadge({ size = 52 }: { size?: number }) {
  return (
    <View style={{ position: 'absolute', left: '50%', top: '50%', width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, borderRadius: size / 2, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(10, 18, 36, 0.3)' }}>
      <Icon name="play" size={Math.round(size * 0.44)} color="blue" filled />
    </View>
  );
}

/** White rounded action pill (like / comments / share / download). `active` = liked (pink bg, red heart). */
export function ActionPill({ icon, label, onPress, active, grow }: { icon: IconName; label: string; onPress?: () => void; active?: boolean; grow?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={active !== undefined ? { selected: active } : undefined}
      onPress={onPress}
      style={{ flex: grow ? 1 : undefined, height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: active ? colors.errorBg : colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, ...shadows.card }}>
      <Icon name={icon} size={18} color={active ? colors.red : 'text'} filled={active} weight={1.8} />
      <Text size={14} weight={700}>
        {label}
      </Text>
    </Pressable>
  );
}

/** «Скачать» (secondary) + «Поделиться» (primary) pair under photos. */
export function DownloadShare({ onDownload, onShare }: { onDownload: () => void; onShare: () => void }) {
  const btn = (icon: IconName, label: string, primary: boolean, onPress: () => void): ReactNode => (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ flex: 1, height: 52, borderRadius: 16, backgroundColor: primary ? colors.blue600 : colors.blue10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <Icon name={icon} size={20} color={primary ? 'surface' : 'blue600'} weight={1.8} />
      <Text size={16} weight={700} color={primary ? 'surface' : 'blue600'}>
        {label}
      </Text>
    </Pressable>
  );
  return (
    <View style={{ marginHorizontal: 20, flexDirection: 'row', gap: 10 }}>
      {btn('download-04', 'Скачать', false, onDownload)}
      {btn('share-08', 'Поделиться', true, onShare)}
    </View>
  );
}

/** Horizontally scrolling filter chips (Все / Матчи / …). `tone` = white or chip-bg for inactive. */
export function ChipRow({ items, value, onChange, tone = 'white' }: { items: string[]; value: number; onChange: (i: number) => void; tone?: 'white' | 'grey' }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
      {items.map((l, i) => {
        const on = i === value;
        return (
          <Pressable key={l} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => onChange(i)} style={{ height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: on ? colors.navy : tone === 'white' ? colors.surface : colors.chipBg, justifyContent: 'center' }}>
            <Text size={14} weight={on ? 700 : 500} color={on ? 'surface' : 'text'}>
              {l}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
