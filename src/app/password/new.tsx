import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, NavBar, PasswordField, Screen, Star, Text } from '@/components';
import { setPrefs } from '@/data/prefs';
import { colors } from '@/theme';

const strength = (p: string) => {
  if (!p) return 0;
  let s = p.length >= 8 ? 1 : 0;
  if (/[a-zа-я]/i.test(p) && /\d/.test(p)) s++;
  if (p.length >= 10) s++;
  if (/[A-ZА-Я]/.test(p) && /[^\w\s]|_/.test(p)) s++;
  return Math.max(1, s);
};
const words = ['', 'Слабый пароль', 'Средний пароль', 'Надёжный пароль', 'Очень надёжный пароль'];

/** Новый пароль после подтверждения по SMS: шкала надёжности, проверка совпадения, «Сохранить пароль». */
export default function NewPassword() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [tried, setTried] = useState(false);
  const st = strength(p1);
  const valid = p1.length >= 8 && /[a-zа-я]/i.test(p1) && /\d/.test(p1);
  const match = !!p2 && p1 === p2;
  const p1Err = tried && !valid;
  const p2State = p2 ? (match ? 'success' : p2.length >= p1.length || tried ? 'error' : 'default') : tried ? 'error' : 'default';
  const p2Help = p2State === 'success' ? 'Пароли совпадают' : p2State === 'error' ? (p2 ? 'Пароли не совпадают' : 'Повторите пароль') : undefined;

  const save = () => {
    setTried(true);
    if (!valid || !match) return;
    if (mode === 'reset') {
      setPrefs({ passwordChanged: 'Изменён только что', notice: 'Пароль обновлён. Войдите с новым паролем.' });
      router.dismissTo('/login');
      return;
    }
    setPrefs({ passwordChanged: 'Изменён только что' });
    router.dismissTo('/security');
  };

  return (
    <Screen
      gap={24}
      header={<NavBar title="Новый пароль" />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 520, left: 290 }} />
        </View>
      }>
      <View style={{ marginHorizontal: 20, marginTop: 16, gap: 8 }}>
        <Text display size={28} lineHeight={31} accessibilityRole="header">
          Придумайте новый пароль
        </Text>
        <Text size={15} lineHeight={21} color={p1Err ? 'errorText' : 'text2'}>
          Не меньше 8 символов: буквы и цифры.
        </Text>
      </View>
      <View style={{ marginHorizontal: 20, gap: 16 }}>
        <PasswordField label="Новый пароль" value={p1} onChangeText={setP1} autoComplete="new-password" textContentType="newPassword" state={p1Err ? 'error' : 'default'} />
        {p1 ? (
          <View style={{ gap: 6, marginTop: -6 }}>
            <View style={{ flexDirection: 'row', gap: 4 }} aria-hidden>
              {[1, 2, 3, 4].map((k) => (
                <View key={k} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: k <= st ? (st === 1 ? colors.red : colors.blue) : colors.line }} />
              ))}
            </View>
            <Text size={13} color={st === 1 ? 'errorText' : 'text2'} accessibilityLiveRegion="polite">
              {words[st]}
            </Text>
          </View>
        ) : null}
        <PasswordField label="Повторите пароль" value={p2} onChangeText={setP2} autoComplete="new-password" textContentType="newPassword" state={p2State} helper={p2Help} />
      </View>
      <Button label="Сохранить пароль" height={52} onPress={save} style={{ marginHorizontal: 20 }} />
    </Screen>
  );
}
