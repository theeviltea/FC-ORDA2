import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';

import { img } from '@/data/images';
import { colors } from '@/theme';

import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

type Step = 'ask' | 'busy' | 'done';

const losses: { icon?: IconName; title: string }[] = [
  { title: '2 480 баллов и уровень 21' },
  { icon: 'champion', title: '3 достижения' },
  { icon: 'shopping-bag-02', title: 'История из 12 покупок' },
];

/**
 * Account deletion: confirm → «Удаляем…» → «Аккаунт удалён».
 * Prototype: the request is simulated (1.4 s); `onDeleted` signs out once the user leaves the done state.
 */
export function DeleteAccountDialog({ visible, onClose, onDeleted }: { visible: boolean; onClose: () => void; onDeleted: () => void }) {
  const [step, setStep] = useState<Step>('ask');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const busy = step === 'busy';
  const done = step === 'done';
  const confirm = () => {
    if (step !== 'ask') return;
    setStep('busy');
    timer.current = setTimeout(() => setStep('done'), 1400);
  };
  const close = () => {
    if (busy) return;
    if (done) onDeleted();
    else onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: 'rgba(23,42,81,0.55)' }}>
        <View accessibilityViewIsModal style={{ width: '100%', maxWidth: 392, alignSelf: 'center', paddingTop: done ? 28 : 24, paddingHorizontal: 20, paddingBottom: 20, borderRadius: 28, backgroundColor: colors.surface, alignItems: 'center', gap: 14, boxShadow: '0 20px 50px rgba(10, 18, 36, 0.3)' }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: done ? colors.successBg : colors.errorBg, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={done ? 'checkmark-circle-02' : 'delete-02'} size={done ? 32 : 30} color={done ? 'successText' : 'errorText'} weight={1.8} />
          </View>
          <Text display size={28} lineHeight={28} upper align="center" accessibilityRole="header">
            {done ? 'Аккаунт удалён' : 'Удалить аккаунт?'}
          </Text>
          {done ? (
            <>
              <Text size={15} lineHeight={21} color="text2" align="center">
                Спасибо, что были с «Ордабасы». Вернуться можно в любой момент — просто зарегистрируйтесь заново.
              </Text>
              <Button label="На главную" height={52} onPress={onDeleted} style={{ alignSelf: 'stretch', marginTop: 4 }} />
            </>
          ) : (
            <>
              <Text size={15} lineHeight={21} color="text2" align="center">
                Аккаунт ORDA ID 004 217 удалится навсегда — восстановить его не получится. Вместе с ним пропадут:
              </Text>
              <View style={{ alignSelf: 'stretch', paddingVertical: 4, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.bg }}>
                {losses.map((l, i) => (
                  <View key={l.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44, borderBottomWidth: i < losses.length - 1 ? 1 : 0, borderColor: colors.line }}>
                    {l.icon ? <Icon name={l.icon} size={22} color="blue" weight={1.6} /> : <Image source={img.coin} style={{ width: 22, height: 22 }} contentFit="contain" />}
                    <Text size={15} weight={600} style={{ flex: 1 }}>
                      {l.title}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={{ alignSelf: 'stretch', gap: 10, marginTop: 4 }}>
                <Pressable accessibilityRole="button" accessibilityState={{ busy, disabled: busy }} disabled={busy} onPress={confirm} style={{ height: 52, borderRadius: 16, backgroundColor: busy ? '#E0646B' : colors.errorText, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {busy ? <ActivityIndicator size="small" color={colors.surface} /> : null}
                  <Text size={17} weight={700} color="surface" accessibilityLiveRegion="polite">
                    {busy ? 'Удаляем…' : 'Удалить навсегда'}
                  </Text>
                </Pressable>
                <Button label="Отмена" variant="soft" height={52} disabled={busy} onPress={onClose} />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
