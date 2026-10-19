import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, NavBar, Screen, Star, Text, TextField } from '@/components';
import { formatPhone } from '@/data/prefs';

/** Восстановление пароля: номер телефона → код из SMS → новый пароль → снова вход. */
export default function Forgot() {
  const { phone: initial } = useLocalSearchParams<{ phone?: string }>();
  const [phone, setPhone] = useState(initial ?? '');
  const [tried, setTried] = useState(false);
  const full = phone.replace(/\D/g, '').length === 10;
  const send = () => {
    setTried(true);
    if (full) router.push({ pathname: '/password/code', params: { mode: 'reset', phone } });
  };
  return (
    <Screen
      gap={24}
      header={<NavBar title="Восстановление" />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 330, left: 290 }} />
        </View>
      }>
      <View style={{ marginHorizontal: 20, marginTop: 16, gap: 8 }}>
        <Text display size={28} lineHeight={31} accessibilityRole="header">
          Забыли пароль?
        </Text>
        <Text size={15} lineHeight={21} color="text2">
          Введите номер телефона, привязанный к аккаунту. Мы пришлём SMS с кодом.
        </Text>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <TextField label="Номер телефона" prefix="+7" value={phone} onChangeText={(t) => setPhone(formatPhone(t))} keyboardType="phone-pad" autoComplete="tel" placeholder="700 000 00 00" autoFocus onSubmitEditing={send} state={tried && !full ? 'error' : 'default'} helper={tried && !full ? 'Введите номер полностью' : undefined} />
      </View>
      <View style={{ marginHorizontal: 20, gap: 12 }}>
        <Button label="Отправить код" height={52} onPress={send} />
        <Button label="Вернуться ко входу" variant="soft" height={52} onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
