import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const D = 'M12 0C12.8 8 16 11.2 24 12 16 12.8 12.8 16 12 24 11.2 16 8 12.8 0 12 8 11.2 11.2 8 12 0z';

type Props = {
  w: number;
  h?: number;
  fill?: string;
  /** Vertical gradient stops instead of a flat fill. */
  stops?: [number, string][];
  style?: StyleProp<ViewStyle>;
};

/** The ORDA four-point star (brand book graphic). Stretch it with a different `h`. */
export function Star({ w, h = w, fill = '#DCEEF8', stops, style }: Props) {
  const id = stops ? `g${stops.map((s) => s[1].slice(1)).join('')}` : undefined;
  return (
    <Svg width={w} height={h} viewBox="0 0 24 24" preserveAspectRatio="none" style={[{ position: 'absolute' }, style]} pointerEvents="none">
      {stops ? (
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            {stops.map(([o, c]) => (
              <Stop key={o} offset={o} stopColor={c} />
            ))}
          </LinearGradient>
        </Defs>
      ) : null}
      <Path d={D} fill={stops ? `url(#${id})` : fill} />
    </Svg>
  );
}
