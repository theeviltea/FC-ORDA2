import type { ReactNode } from 'react';
import { Modal, Pressable as RNPressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';

export type SheetTone = 'blue' | 'red' | 'warn';
const tones: Record<SheetTone, { bg: string; fg: string }> = {
  blue: { bg: colors.blue10, fg: colors.blue },
  red: { bg: colors.errorBg, fg: colors.red },
  warn: { bg: '#FFF4DC', fg: '#8A5A00' },
};

/** Bottom sheet for game prompts and errors: big icon, uppercase title, text, then actions (children). */
export function GameSheet({ visible, onClose, icon, tone = 'blue', title, text, children }: { visible: boolean; onClose: () => void; icon?: IconName; tone?: SheetTone; title: string; text?: string; children?: ReactNode }) {
  const insets = useSafeAreaInsets();
  const t = tones[tone];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <RNPressable accessibilityRole="button" accessibilityLabel="Закрыть" onPress={onClose} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(23,42,81,0.55)' }} />
        <View accessibilityViewIsModal style={{ width: '100%', maxWidth: 440, alignSelf: 'center', paddingTop: 10, paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 12) + 22, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.surface, gap: 14, boxShadow: '0 -12px 40px rgba(10, 18, 36, 0.25)' }}>
          <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.line }} />
          {icon ? (
            <View style={{ alignSelf: 'center', marginTop: 6, width: 72, height: 72, borderRadius: 24, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={icon} size={36} color={t.fg} weight={1.7} />
            </View>
          ) : null}
          <Text display size={26} lineHeight={28} upper align="center" accessibilityRole="header">
            {title}
          </Text>
          {text ? (
            <Text size={15} lineHeight={22} color="text2" align="center">
              {text}
            </Text>
          ) : null}
          {children}
        </View>
      </View>
    </Modal>
  );
}

/** Coloured note inside sheets and cards. */
export function Notice({ icon, text, tone = 'info' }: { icon: IconName; text: string; tone?: 'info' | 'ok' | 'warn' | 'err' }) {
  const [bg, fg] = { info: [colors.blue10, colors.blue600], ok: [colors.successBg, colors.successText], warn: ['#FFF4DC', '#8A5A00'], err: [colors.errorBg, '#B0040E'] }[tone];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: bg }}>
      <Icon name={icon} size={20} color={fg} weight={1.8} />
      <Text size={14} lineHeight={20} weight={600} color={fg} style={{ flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}
