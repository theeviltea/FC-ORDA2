import { Text as RNText, type TextProps, type TextStyle } from 'react-native';

import { bodyFamily, colors, displayFamily, type ColorName, type Weight } from '@/theme';

type Props = TextProps & {
  /** SO Sporty (headlines, numbers) instead of Roboto Condensed. */
  display?: boolean;
  size?: number;
  weight?: Weight;
  color?: ColorName | (string & {});
  lineHeight?: number;
  upper?: boolean;
  align?: TextStyle['textAlign'];
};

export function Text({ display, size = 16, weight = 400, color = 'text', lineHeight, upper, align, style, ...rest }: Props) {
  const col = color in colors ? colors[color as ColorName] : color;
  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily: display ? displayFamily : bodyFamily[weight],
          fontSize: size,
          lineHeight: lineHeight ?? Math.round(size * (display ? 1.1 : 1.3)),
          color: col,
          textTransform: upper ? 'uppercase' : undefined,
          textAlign: align,
        },
        style,
      ]}
    />
  );
}
