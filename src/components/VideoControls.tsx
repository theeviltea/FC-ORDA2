import { View } from 'react-native';

import { colors } from '@/theme';

import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

/** −10 / play-pause / +10 cluster centred on a video frame. `big` = fullscreen sizes. */
export function PlayCluster({ playing, onToggle, onBack, onFwd, big }: { playing: boolean; onToggle: () => void; onBack: () => void; onFwd: () => void; big?: boolean }) {
  const side = big ? 52 : 44;
  const main = big ? 76 : 64;
  const skip = (label: string, a11y: string, onPress: () => void) => (
    <Pressable accessibilityRole="button" accessibilityLabel={a11y} onPress={onPress} style={{ width: side, height: side, borderRadius: side / 2, backgroundColor: big ? 'rgba(10,18,36,0.45)' : 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
      <Text size={big ? 14 : 12} weight={700} color="surface">
        {label}
      </Text>
    </Pressable>
  );
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: big ? 56 : 36 }} pointerEvents="box-none">
      {skip('−10', 'Назад на 10 секунд', onBack)}
      <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Пауза' : 'Смотреть'} onPress={onToggle} style={{ width: main, height: main, borderRadius: main / 2, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center', boxShadow: big ? '0 10px 30px rgba(10, 18, 36, 0.4)' : undefined }}>
        <Icon name={playing ? 'pause' : 'play'} size={big ? 32 : 28} color="blue" filled />
      </Pressable>
      {skip('+10', 'Вперёд на 10 секунд', onFwd)}
    </View>
  );
}

/** Progress bar with a white thumb; optional chapter ticks. */
export function Progress({ pct, height = 4, buffered, ticks = [] }: { pct: number; height?: number; buffered?: number; ticks?: number[] }) {
  const thumb = height + 10;
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }} style={{ height, borderRadius: height / 2, backgroundColor: 'rgba(255,255,255,0.3)' }}>
      {buffered ? <View style={{ position: 'absolute', left: 0, top: 0, width: `${buffered * 100}%`, height, borderRadius: height / 2, backgroundColor: 'rgba(255,255,255,0.35)' }} /> : null}
      <View style={{ position: 'absolute', left: 0, top: 0, width: `${pct * 100}%`, height, borderRadius: height / 2, backgroundColor: colors.blue }} />
      {ticks.map((t) => (
        <View key={t} style={{ position: 'absolute', top: -2, left: `${t * 100}%`, width: 3, height: height + 4, borderRadius: 2, backgroundColor: colors.surface }} />
      ))}
      <View style={{ position: 'absolute', top: (height - thumb) / 2, left: `${pct * 100}%`, marginLeft: -thumb / 2, width: thumb, height: thumb, borderRadius: thumb / 2, backgroundColor: colors.surface }} />
    </View>
  );
}
