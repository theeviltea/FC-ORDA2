import { View } from 'react-native';

import { colors } from '@/theme';

import { Pressable } from './Pressable';
import { Text } from './Text';

type Props = { labels: string[]; counts?: number[]; active: number; onChange: (i: number) => void; label?: string };

/** DS SegmentedTabs: chip-bg track, navy active segment; blue counter badge (blue-600 inactive, blue active). */
export function SegmentedTabs({ labels, counts = [], active, onChange, label }: Props) {
  return (
    <View accessibilityRole="tablist" accessibilityLabel={label} style={{ marginHorizontal: 20, flexDirection: 'row', gap: 4, padding: 4, borderRadius: 16, backgroundColor: colors.chipBg }}>
      {labels.map((l, i) => {
        const on = i === active;
        const n = counts[i] ?? 0;
        return (
          <Pressable
            key={l}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(i)}
            style={{ flexGrow: 1, flexShrink: 1, flexBasis: 'auto', height: 44, borderRadius: 12, backgroundColor: on ? colors.navy : 'transparent', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 10 }}>
            <Text size={15} weight={on ? 700 : 600} color={on ? 'surface' : 'text2'} numberOfLines={1}>
              {l}
            </Text>
            {n > 0 ? (
              <View accessibilityLabel={`${n} активных`} style={{ minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, backgroundColor: on ? colors.blue : colors.blue600, alignItems: 'center', justifyContent: 'center' }}>
                <Text size={12} lineHeight={14} weight={700} color="surface">
                  {n}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

/** Pill filters (Все / Дома / В гостях): navy when pressed, white otherwise. */
export function FilterChips<T extends string>({ items, value, onChange }: { items: { id: T; label: string }[]; value: T; onChange: (id: T) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, flexWrap: 'wrap' }}>
      {items.map((f) => {
        const on = f.id === value;
        return (
          <Pressable
            key={f.id}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(f.id)}
            style={{ height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: on ? colors.navy : colors.surface, justifyContent: 'center' }}>
            <Text size={14} weight={on ? 700 : 500} color={on ? 'surface' : 'text'}>
              {f.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
