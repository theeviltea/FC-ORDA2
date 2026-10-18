import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable as RNPressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { img } from '@/data/images';
import { colors } from '@/theme';

import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

const N = 29;
const PERIOD = 30;
const seats = ['12', '13'];
const codes = ['1264 · 0412 · 0012', '1264 · 0412 · 0013'];

/** Placeholder QR (the real code comes from the backend): three finder squares, timing lines, a clear centre for the crest. */
function qrPath(ticket: number, gen: number) {
  let seed = 7919 * (ticket + 1) + 104729 * (gen + 1);
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const finder = (x: number, y: number, r: number, c: number) => {
    const dx = c - x;
    const dy = r - y;
    if (dx < -1 || dy < -1 || dx > 7 || dy > 7) return null;
    if (dx === -1 || dy === -1 || dx === 7 || dy === 7) return false;
    return Math.max(Math.abs(dx - 3), Math.abs(dy - 3)) !== 2;
  };
  let d = '';
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      let on: boolean | null = null;
      for (const [x, y] of [
        [0, 0],
        [N - 7, 0],
        [0, N - 7],
      ]) {
        const f = finder(x, y, r, c);
        if (f !== null) on = f;
      }
      if (on === null) {
        if (r === 6) on = c % 2 === 0;
        else if (c === 6) on = r % 2 === 0;
        else if (r >= 11 && r <= 17 && c >= 11 && c <= 17) on = false;
        else on = rnd() > 0.52;
      }
      if (on) d += `M${c} ${r}h1v1h-1z`;
    }
  return d;
}

function Cell({ label, value, big, flex }: { label: string; value: string; big?: boolean; flex: number }) {
  return (
    <View style={{ flex, gap: 2 }}>
      <Text size={11} weight={700} upper color="text2" style={{ letterSpacing: 0.7 }}>
        {label}
      </Text>
      <Text display={big} size={big ? 20 : 15} lineHeight={big ? 20 : 19} weight={700}>
        {value}
      </Text>
    </View>
  );
}

/** Bottom sheet with the entry QR: refreshes every 30 s, two tickets in the order, sector / row / seat / gate. */
export function TicketQRSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [i, setI] = useState(0);
  const [clock, setClock] = useState({ t: 24, gen: 0 });
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setClock((c) => (c.t - 1 <= 0 ? { t: PERIOD, gen: c.gen + 1 } : { ...c, t: c.t - 1 })), 1000);
    return () => clearInterval(id);
  }, [visible]);
  const d = useMemo(() => qrPath(i, clock.gen), [i, clock.gen]);
  const arrow = (dir: 'left' | 'right', target: number, off: boolean) => (
    <Pressable accessibilityRole="button" accessibilityLabel={dir === 'left' ? 'Предыдущий билет' : 'Следующий билет'} disabled={off} onPress={() => setI(target)} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: off ? colors.bg : colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={dir === 'left' ? 'arrow-left-01' : 'arrow-right-01'} size={20} color={off ? 'text3' : 'blue600'} weight={2} />
    </Pressable>
  );
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%', maxWidth: 440, alignSelf: 'center' }}>
        <RNPressable accessibilityRole="button" accessibilityLabel="Закрыть" onPress={onClose} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(23,42,81,0.55)' }} />
        <View accessibilityViewIsModal accessibilityLabel="QR-код билета" style={{ paddingTop: 10, paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 12) + 18, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.surface, gap: 14, boxShadow: '0 -12px 40px rgba(10, 18, 36, 0.25)' }}>
          <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.line }} />
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text display size={24} lineHeight={24} upper>
                ORDA — Кайрат
              </Text>
              <Text size={14} color="text2">
                Сб, 25 октября · 19:00 · вход с 17:30
              </Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Закрыть" onPress={onClose} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceSunken, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="cancel-01" size={20} weight={2} />
            </Pressable>
          </View>

          <View style={{ alignSelf: 'center', width: 260, padding: 18, borderRadius: 24, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', gap: 12 }}>
            <View style={{ width: 220, height: 220 }}>
              <Svg width={220} height={220} viewBox={`0 0 ${N} ${N}`} accessibilityLabel="QR-код для входа на стадион">
                <Path d={d} fill={colors.navy} />
              </Svg>
              <View style={{ position: 'absolute', left: 87, top: 87, width: 46, height: 46, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={img.crest} style={{ width: 30, height: 36 }} contentFit="contain" />
              </View>
            </View>
            <Text size={15} weight={700} style={{ letterSpacing: 1.8, fontVariant: ['tabular-nums'] }}>
              {codes[i]}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'stretch' }}>
              <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.blue10, overflow: 'hidden' }}>
                <View style={{ width: `${(clock.t / PERIOD) * 100}%`, height: 4, backgroundColor: colors.blue }} />
              </View>
              <Text size={12} color="text2" style={{ fontVariant: ['tabular-nums'] }}>
                0:{String(clock.t).padStart(2, '0')}
              </Text>
            </View>
          </View>
          <Text size={13} color="text2" align="center" style={{ marginTop: -6 }}>
            Код обновляется каждые 30 секунд — скриншот не подойдёт
          </Text>

          <View style={{ flexDirection: 'row', gap: 8, padding: 14, borderRadius: 16, backgroundColor: colors.bg }}>
            <Cell flex={1.3} label="Сектор" value="Юг · фан" />
            <Cell flex={0.7} label="Ряд" value="4" big />
            <Cell flex={0.8} label="Место" value={seats[i]} big />
            <Cell flex={1} label="Вход" value="Ворота 3" />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {arrow('left', 0, i === 0)}
            <View style={{ alignItems: 'center', gap: 6 }}>
              <Text size={14} weight={700} accessibilityLiveRegion="polite">
                Билет {i + 1} из {seats.length}
              </Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {seats.map((s, k) => (
                  <View key={s} style={{ width: k === i ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: k === i ? colors.blue : colors.line }} />
                ))}
              </View>
            </View>
            {arrow('right', 1, i === seats.length - 1)}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.blue10 }}>
            <Icon name="information-circle" size={20} color="blue600" weight={1.8} />
            <Text size={13} lineHeight={18} color="blue600" style={{ flex: 1 }}>
              Яркость экрана увеличена. Поднесите код к сканеру на турникете.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
