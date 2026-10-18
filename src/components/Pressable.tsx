import { Pressable as RNPressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

type Props = Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle> };

/** Pressable with a light press-state (opacity) used across the app. */
export function Pressable({ style, ...rest }: Props) {
  return <RNPressable {...rest} style={({ pressed }) => [{ cursor: 'pointer' } as ViewStyle, style, pressed && { opacity: 0.7 }]} />;
}
