import { Image } from 'expo-image';
import { View } from 'react-native';

import { people, type PersonKey } from '@/data/people';
import { colors } from '@/theme';

/** Round head-shot cropped from a full-length cut-out: the photo is scaled to `photoHeight`, pinned to the top and centred on the head. */
export function PersonAvatar({ who, size, photoHeight, border }: { who: PersonKey; size: number; photoHeight: number; border?: boolean }) {
  const p = people[who];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: colors.blue10, borderWidth: border ? 2 : 0, borderColor: colors.surface }}>
      <Image source={p.src} style={{ position: 'absolute', top: 2, left: size / 2 - (border ? 2 : 0) - p.cx * photoHeight * p.ratio, height: photoHeight, width: photoHeight * p.ratio }} />
    </View>
  );
}
