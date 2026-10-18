import { Image } from 'expo-image';

import { colors, shadows } from '@/theme';

import { Pressable } from './Pressable';
import { Star } from './Star';
import { Text } from './Text';

/** Section tile with a 3D icon (Media and Fan zone grids): title, subtitle, icon bottom-right. */
export function IconTile({ title, sub, icon, iconSize = 46, onPress }: { title: string; sub: string; icon: number; iconSize?: number; onPress?: () => void }) {
  const inset = iconSize > 50 ? 10 : 18;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={title}
      onPress={onPress}
      style={{ flexBasis: '45%', flexGrow: 1, height: 150, padding: 14, borderRadius: 22, overflow: 'hidden', backgroundColor: colors.surface, gap: 4, ...shadows.card }}>
      <Star w={12} fill={colors.sky} style={{ right: 14, top: 16 }} />
      <Text display size={18} lineHeight={20} style={{ maxWidth: 130 }}>
        {title}
      </Text>
      <Text size={13} lineHeight={17} color="text2" style={{ maxWidth: 115 }}>
        {sub}
      </Text>
      <Image source={icon} style={{ position: 'absolute', right: inset, bottom: inset, width: iconSize, height: iconSize }} contentFit="contain" />
    </Pressable>
  );
}
