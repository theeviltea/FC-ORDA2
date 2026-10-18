import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Icon, NavBar, Pressable, Screen, Star, Text, TextField } from '@/components';
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

function Eye({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={on ? 'Скрыть пароль' : 'Показать пароль'} onPress={toggle} style={{ width: 36, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -8 }}>
      <Icon name={on ? 'view-off-slash' : 'view'} size={20} color="text2" weight={1.8} />
    </Pressable>
  );
}

/** Новый пароль после подтверждения по SMS: шкала надёжности, проверка совпадения, «Сохранить пароль». */
export default function NewPassword() {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
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
        <TextField label="Новый пароль" value={p1} onChangeText={setP1} secureTextEntry={!show1} autoCapitalize="none" autoComplete="new-password" textContentType="newPassword" state={p1Err ? 'error' : 'default'} right={<Eye on={show1} toggle={() => setShow1(!show1)} />} />
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
        <TextField label="Повторите пароль" value={p2} onChangeText={setP2} secureTextEntry={!show2} autoCapitalize="none" autoComplete="new-password" textContentType="newPassword" state={p2State} helper={p2Help} right={<Eye on={show2} toggle={() => setShow2(!show2)} />} />
      </View>
      <Button label="Сохранить пароль" height={52} onPress={save} style={{ marginHorizontal: 20 }} />
    </Screen>
  );
}
