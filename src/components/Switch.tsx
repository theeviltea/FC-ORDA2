import { Pressable, View } from 'react-native';

import { colors } from '@/theme';

/** DS Switch 52×32: blue track when on, grey when off; white knob with soft shadow. */
export function Switch({ value, onChange, label, disabled }: { value: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  const track = disabled ? (value ? '#B8E2F4' : colors.chipBg) : value ? colors.blue : colors.storySeen;
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onChange(!value)}
      style={{ width: 52, height: 32, borderRadius: 16, backgroundColor: track, cursor: 'pointer', transitionDuration: '200ms', transitionProperty: 'background-color' } as object}>
      <View style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.surface, boxShadow: '0 2px 6px rgba(23, 42, 81, 0.25)', transitionDuration: '200ms', transitionProperty: 'left' } as object} />
    </Pressable>
  );
}
