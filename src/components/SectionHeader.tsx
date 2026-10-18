import { View } from 'react-native';

import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

/** Section title (SO Sporty 24) with an optional «Все →» link on the right. */
export function SectionHeader({ title, link, onPress, inset = true }: { title: string; link?: string; onPress?: () => void; inset?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, paddingHorizontal: inset ? 20 : 0 }}>
      <Text display size={24} lineHeight={28} style={{ flexShrink: 1 }}>
        {title}
      </Text>
      {link ? (
        <Pressable accessibilityRole="link" onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44 }}>
          <Text size={15} weight={600} color="blue600">
            {link}
          </Text>
          <Icon name="arrow-right-01" size={18} color="blue600" weight={2} />
        </Pressable>
      ) : null}
    </View>
  );
}
