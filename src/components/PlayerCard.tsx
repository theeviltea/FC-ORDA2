import { Image } from 'expo-image';
import { View, type DimensionValue } from 'react-native';

import { people, type PersonKey } from '@/data/people';
import { colors, radius, shadows } from '@/theme';

import { Gradient } from './Gradient';
import { Pressable } from './Pressable';
import { Star } from './Star';
import { Text } from './Text';

export type Person = { num: string; name: string; role: string; who: PersonKey };

/** Squad card: big shirt number (ORDA for staff), brand stars, cut-out fading into white, name + role. */
export function PlayerCard({ person, onPress, width = 170 }: { person: Person; onPress?: () => void; width?: DimensionValue }) {
  const p = people[person.who];
  const ph = 360;
  const pw = ph * p.ratio;
  const big = person.num || 'ORDA';
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={person.name} onPress={onPress} style={{ width, height: 312, borderRadius: radius.l, overflow: 'hidden', backgroundColor: colors.surface, ...shadows.card }}>
      <View style={{ height: 250, overflow: 'hidden' }}>
        <Star w={180} h={340} fill={colors.navy} style={{ left: -108, top: 56 }} />
        <Star w={180} h={360} stops={[[0, colors.blue], [0.55, colors.sky], [1, colors.blue10]]} style={{ right: -100, top: -80 }} />
        <Text display size={big.length > 2 ? 34 : 64} lineHeight={big.length > 2 ? 36 : 64} upper style={{ position: 'absolute', left: 12, top: 10 }}>
          {big}
        </Text>
        <Star w={12} fill={colors.sky} style={{ left: 14, top: 132 }} />
        <Star w={10} fill={colors.surface} style={{ left: 30, top: 182 }} />
        <Star w={12} fill={colors.blue} style={{ right: 16, top: 150 }} />
        <Image source={p.src} style={{ position: 'absolute', left: '60%', marginLeft: -pw / 2, top: 40, width: pw, height: ph }} />
        <Gradient colors={['rgba(255,255,255,0)', '#FFFFFF']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 56 }} />
      </View>
      <View style={{ paddingHorizontal: 12, paddingTop: 2, gap: 2 }}>
        <Text size={15} weight={700} lineHeight={18} numberOfLines={2}>
          {person.name}
        </Text>
        <Text size={13} color="text2" lineHeight={16} numberOfLines={2}>
          {person.role}
        </Text>
      </View>
    </Pressable>
  );
}
