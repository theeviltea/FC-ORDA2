import { Image, type ImageSource } from 'expo-image';
import { View } from 'react-native';

import { colors, radius, shadows } from '@/theme';

import { Button } from './Button';
import { Pressable } from './Pressable';
import { Text } from './Text';

export type Product = { name: string; price: string; badge?: string; tone?: 'new' | 'hit'; photo: ImageSource | number };

/** Shop product tile: photo with badge, name, price (blue-600), «Купить». */
export function ProductCard({ item, width = 164, onPress }: { item: Product; width?: number; onPress?: () => void }) {
  return (
    <View style={{ width, height: 290, padding: 8, paddingBottom: 10, borderRadius: radius.l, backgroundColor: colors.surface, gap: 8, ...shadows.card }}>
      <Pressable accessibilityRole="link" accessibilityLabel={item.name} onPress={onPress} style={{ height: 150, borderRadius: radius.m, overflow: 'hidden', backgroundColor: colors.surface }}>
        <Image source={item.photo} style={{ flex: 1, margin: 6 }} contentFit="contain" />
        {item.badge ? (
          <View style={{ position: 'absolute', top: 8, left: 8, height: 20, paddingHorizontal: 8, borderRadius: 10, backgroundColor: item.tone === 'hit' ? colors.red : colors.navy, justifyContent: 'center' }}>
            <Text size={11} lineHeight={13} weight={700} color="surface">
              {item.badge}
            </Text>
          </View>
        ) : null}
      </Pressable>
      <View style={{ paddingHorizontal: 4, gap: 4, flex: 1 }}>
        <Text size={14} weight={600} lineHeight={17} numberOfLines={2} style={{ minHeight: 35 }}>
          {item.name}
        </Text>
        <Text size={16} weight={700} color="blue600">
          {item.price}
        </Text>
      </View>
      <Button label="Купить" height={44} onPress={onPress} />
    </View>
  );
}
