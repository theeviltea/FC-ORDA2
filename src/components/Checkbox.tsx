import { View } from 'react-native';

import { colors } from '@/theme';

import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

/** DS Checkbox: 24px box, radius 7, blue when checked; whole row (min 56) is the tap target. */
export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={() => onChange(!checked)} style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
      <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: checked ? colors.blue600 : '#8391AD', backgroundColor: checked ? colors.blue600 : colors.surface, alignItems: 'center', justifyContent: 'center' }}>
        {checked ? <Icon name="tick-02" size={14} color="surface" weight={2.8} /> : null}
      </View>
      <Text size={15} lineHeight={20} weight={500} style={{ flex: 1 }}>
        {label}
      </Text>
    </Pressable>
  );
}
