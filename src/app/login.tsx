import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Icon, NavBar, PasswordField, Pressable, Screen, Star, Text, TextField } from '@/components';
import { img } from '@/data/images';
import { formatPhone, setPrefs, usePrefs } from '@/data/prefs';
import { colors, shadows } from '@/theme';

/** Вход: телефон + пароль. Прототип: подходит любой полный номер и непустой пароль. */
export default function Login() {
  const { notice, personal } = usePrefs();
  const [phone, setPhone] = useState(notice ? formatPhone(personal.phone.replace(/^\+7/, '')) : '');
  const [pw, setPw] = useState('');
  const [tried, setTried] = useState(false);
  const phoneErr = tried && phone.replace(/\D/g, '').length < 10;
  const pwErr = tried && !pw;

  const submit = () => {
    setTried(true);
    if (phone.replace(/\D/g, '').length < 10 || !pw) return;
    setPrefs({ authed: true, notice: null });
    router.dismissAll();
    router.navigate('/');
  };

  return (
    <Screen
      gap={24}
      header={<NavBar title="Вход" />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={90} style={{ top: 120, left: 280 }} />
          <Star w={44} style={{ top: 560, left: 16 }} />
        </View>
      }>
      <View style={{ marginHorizontal: 20, marginTop: 16, width: 76, height: 76, borderRadius: 38, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.avatar }}>
        <Image source={img.crest} accessibilityLabel="ФК «Ордабасы»" style={{ width: 46, height: 56 }} contentFit="contain" />
        <Star w={16} fill={colors.blue} style={{ right: -10, top: 2 }} />
        <Star w={10} fill={colors.sky} style={{ right: -18, top: 22 }} />
      </View>
      <View style={{ marginHorizontal: 20, gap: 8 }}>
        <Text display size={28} lineHeight={31} accessibilityRole="header">
          Рады видеть вас!
        </Text>
        <Text size={15} lineHeight={21} color="text2">
          Войдите, чтобы покупать билеты, копить баллы и голосовать за игрока матча.
        </Text>
      </View>
      {notice ? (
        <View accessibilityLiveRegion="polite" style={{ marginHorizontal: 20, marginTop: -8, padding: 14, borderRadius: 16, backgroundColor: colors.successBg, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Icon name="checkmark-circle-02" size={22} color="successText" weight={1.8} />
          <Text size={14} lineHeight={19} weight={600} color="successText" style={{ flex: 1 }}>
            {notice}
          </Text>
        </View>
      ) : null}
      <View style={{ marginHorizontal: 20, gap: 16 }}>
        <TextField label="Номер телефона" prefix="+7" value={phone} onChangeText={(t) => setPhone(formatPhone(t))} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" placeholder="700 000 00 00" state={phoneErr ? 'error' : 'default'} helper={phoneErr ? 'Введите номер полностью' : undefined} />
        <PasswordField label="Пароль" value={pw} onChangeText={setPw} autoComplete="current-password" textContentType="password" onSubmitEditing={submit} state={pwErr ? 'error' : 'default'} helper={pwErr ? 'Введите пароль' : undefined} />
      </View>
      <View style={{ marginHorizontal: 20, gap: 12 }}>
        <Button label="Войти" height={52} onPress={submit} />
        <Button label="Забыли пароль?" variant="soft" height={52} onPress={() => router.push({ pathname: '/forgot', params: phone ? { phone } : {} })} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 24 }}>
        <Text size={15} color="text2">
          Нет аккаунта?
        </Text>
        <Pressable accessibilityRole="link" onPress={() => router.replace('/register')} style={{ minHeight: 44, justifyContent: 'center' }}>
          <Text size={15} weight={700} color="blue600">
            Зарегистрироваться
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
