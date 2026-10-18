import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, NavBar, OtpInput, Screen, Star, Text } from '@/components';
import { maskPhone, usePrefs } from '@/data/prefs';

const WAIT = 59;
/** Demo: the backend would check the code; here any 6 digits pass except 000000 (shows the error state). */
const check = (c: string) => c !== '000000';

/** Подтверждение по SMS перед сменой пароля: 6 ячеек, таймер повторной отправки, ошибка с числом попыток. */
export default function PasswordCode() {
  const { personal } = usePrefs();
  const [code, setCode] = useState('');
  const [left, setLeft] = useState(WAIT);
  const [tries, setTries] = useState(3);
  const [state, setState] = useState<'typing' | 'error' | 'success'>('typing');

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const submit = (c: string) => {
    if (c.length < 6) return;
    if (check(c)) {
      setState('success');
      setTimeout(() => router.replace('/password/new'), 600);
    } else {
      setTries((n) => n - 1);
      setState('error');
    }
  };
  const change = (c: string) => {
    setCode(c);
    if (state !== 'success') setState('typing');
    if (c.length === 6) submit(c);
  };
  const helper = state === 'error' ? (tries > 0 ? `Неверный код. Осталось ${tries} ${tries === 1 ? 'попытка' : 'попытки'}` : 'Попытки закончились — запросите новый код') : state === 'success' ? 'Номер подтверждён' : left ? `Повторная отправка через 0:${String(left).padStart(2, '0')}` : '';

  return (
    <Screen
      gap={24}
      header={<NavBar title="Подтверждение" />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 420, left: 20 }} />
        </View>
      }>
      <View style={{ marginHorizontal: 20, marginTop: 16, gap: 8 }}>
        <Text display size={28} lineHeight={31} accessibilityRole="header">
          Введите код
        </Text>
        <Text size={15} lineHeight={21} color="text2">
          Отправили SMS с кодом на номер {maskPhone(personal.phone)}.
        </Text>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <OtpInput value={code} onChange={change} state={tries <= 0 ? 'disabled' : state} helper={helper} autoFocus />
      </View>
      <View style={{ marginHorizontal: 20, gap: 12 }}>
        <Button label="Подтвердить" height={52} onPress={() => submit(code)} />
        <Button
          label="Отправить код повторно"
          disabled={!!left}
          variant="soft"
          height={52}
          onPress={() => {
            setLeft(WAIT);
            setTries(3);
            setCode('');
            setState('typing');
          }}
        />
      </View>
    </Screen>
  );
}
