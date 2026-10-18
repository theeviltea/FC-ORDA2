import { Image } from 'expo-image';
import { Gradient, Star, Text } from '@/components';
import { img } from '@/data/images';
import { colors, radius } from '@/theme';

/** «Экран в работе» card: the design is ready on the canvas, the code is next. */
export function ComingSoon() {
  return (
    <Gradient style={{ marginHorizontal: 20, borderRadius: radius.xl, overflow: 'hidden', padding: 24, minHeight: 220, justifyContent: 'flex-end', gap: 8 }}>
      <Text display size={96} lineHeight={84} color="rgba(255,255,255,0.08)" style={{ position: 'absolute', left: 12, top: 0 }} aria-hidden>
        {'SOON\nSOON'}
      </Text>
      <Star w={40} h={66} fill={colors.bg} style={{ right: -20, top: 60 }} />
      <Star w={16} fill={colors.sky} style={{ left: 40, top: 30 }} />
      <Image source={img.coin} style={{ position: 'absolute', right: 26, top: 24, width: 72, height: 72 }} contentFit="contain" />
      <Text display size={26} upper color="surface">
        Скоро здесь
      </Text>
      <Text size={15} lineHeight={20} color="onDark2">
        Экран уже нарисован в дизайне — переносим его в приложение следующим шагом.
      </Text>
    </Gradient>
  );
}
