import { View } from 'react-native';

import { colors } from '@/theme';

import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

type Props = { value: number; onChange: (n: number) => void; min?: number; max?: number; label?: string };

/** DS QuantityStepper: white «−» / «+» 40×40 on a sunken bg track, SO Sporty number; edge buttons dim to text-3. */
export function QuantityStepper({ value, onChange, min = 1, max = 6, label = 'Количество' }: Props) {
  const btn = (icon: 'minus-sign' | 'add-01', a11y: string, next: number, off: boolean) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityState={{ disabled: off }}
      disabled={off}
      onPress={() => onChange(Math.min(max, Math.max(min, next)))}
      style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(23, 42, 81, 0.08)' }}>
      <Icon name={icon} size={18} color={off ? 'text3' : 'text'} weight={2} />
    </Pressable>
  );
  return (
    <View accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ min, max, now: value }} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, padding: 4, borderRadius: 16, backgroundColor: colors.bg }}>
      {btn('minus-sign', 'Меньше', value - 1, value <= min)}
      <Text display size={22} align="center" accessibilityLiveRegion="polite" style={{ minWidth: 44, fontVariant: ['tabular-nums'] }}>
        {value}
      </Text>
      {btn('add-01', 'Больше', value + 1, value >= max)}
    </View>
  );
}
