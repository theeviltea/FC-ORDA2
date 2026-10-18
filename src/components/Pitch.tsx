import { View } from 'react-native';

type Props = { inset: number; circle: number; boxW: number; boxH: number; line?: string };

/** Football pitch markings (outline, halfway line, centre circle, both penalty boxes) over a parent gradient. */
export function Pitch({ inset, circle, boxW, boxH, line = 'rgba(255,255,255,0.22)' }: Props) {
  const abs = { position: 'absolute' } as const;
  return (
    <View style={[abs, { top: 0, left: 0, right: 0, bottom: 0 }]} pointerEvents="none">
      <View style={[abs, { top: inset, left: inset, right: inset, bottom: inset, borderWidth: 1.5, borderColor: line, borderRadius: 5 }]} />
      <View style={[abs, { left: inset, right: inset, top: '50%', height: 1.5, backgroundColor: line }]} />
      <View style={[abs, { left: '50%', top: '50%', width: circle, height: circle, marginLeft: -circle / 2, marginTop: -circle / 2, borderRadius: circle / 2, borderWidth: 1.5, borderColor: line }]} />
      <View style={[abs, { left: '50%', top: inset, width: boxW, height: boxH, marginLeft: -boxW / 2, borderWidth: 1.5, borderTopWidth: 0, borderColor: line }]} />
      <View style={[abs, { left: '50%', bottom: inset, width: boxW, height: boxH, marginLeft: -boxW / 2, borderWidth: 1.5, borderBottomWidth: 0, borderColor: line }]} />
    </View>
  );
}
