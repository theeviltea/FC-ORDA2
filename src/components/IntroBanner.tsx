import { Image } from 'expo-image';
import { View } from 'react-native';

import { colors, radius } from '@/theme';

import { Star } from './Star';
import { Text } from './Text';

/** Light-blue section intro (Викторины, Конкурсы, Опросы): title, one line, 3D icon on the right. */
export function IntroBanner({ title, sub, icon }: { title: string; sub: string; icon: number }) {
  return (
    <View style={{ marginHorizontal: 20, padding: 16, paddingRight: 116, borderRadius: radius.l, backgroundColor: colors.blue10, overflow: 'hidden', gap: 6 }}>
      <Star w={120} fill="#B8E2F4" style={{ right: -16, top: -10 }} />
      <Image source={icon} style={{ position: 'absolute', right: 12, top: '50%', marginTop: -44, width: 88, height: 88 }} contentFit="contain" />
      <Text size={19} lineHeight={23} weight={700}>
        {title}
      </Text>
      <Text size={14} lineHeight={18} color="text2">
        {sub}
      </Text>
    </View>
  );
}
