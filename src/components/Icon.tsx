import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { icons, type IconName } from '@/icons/icons';
import { colors, type ColorName } from '@/theme';

type Props = { name: IconName; size?: number; color?: ColorName | (string & {}); weight?: number; filled?: boolean };

/** Hugeicons stroke-rounded icon, 24×24 grid. `weight` = stroke width (DS default 1.5). */
export function Icon({ name, size = 24, color = 'text', weight = 1.5, filled }: Props) {
  const col = color in colors ? colors[color as ColorName] : color;
  const ic: { s: string; f?: string; w?: number } = icons[name];
  return (
    <View style={{ width: size, height: size, flexShrink: 0 }} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={ic.s} fill={filled ? col : 'none'} stroke={col} strokeWidth={ic.w ?? weight} strokeLinecap="round" strokeLinejoin="round" />
        {ic.f ? <Path d={ic.f} fill={col} /> : null}
      </Svg>
    </View>
  );
}

export type { IconName };
