import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Icon, NavBar, PasswordField, Pressable, Screen, Star, Text, TextField } from '@/components';
import { formatPhone } from '@/data/prefs';
import { pendingSignup } from '@/data/signup';
import { colors } from '@/theme';

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
const pwOk = (s: string) => s.length >= 8 && /[a-zа-я]/i.test(s) && /\d/.test(s);

/** Регистрация: фото, имя, фамилия, телефон, почта, пароль, согласие → код из SMS (прототип: подходят любые 6 цифр) → главная. */
export default function Register() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [agree, setAgree] = useState(false);
  const [tried, setTried] = useState(false);

  const err = {
    first: !first.trim() ? 'Введите имя' : '',
    phone: phone.replace(/\D/g, '').length < 10 ? 'Введите номер полностью' : '',
    email: !email.trim() ? 'Введите почту' : !emailOk(email) ? 'Проверьте адрес: не хватает домена, например .kz' : '',
    pw: !pwOk(pw) ? 'Не меньше 8 символов, буквы и цифры' : '',
    agree: !agree,
  };
  const show = (k: 'first' | 'phone' | 'email') => (tried && err[k] ? { state: 'error' as const, helper: err[k] } : {});

  const pick = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true, aspect: [1, 1] });
    if (!r.canceled && r.assets?.[0]) setPhoto(r.assets[0].uri);
  };

  const submit = () => {
    setTried(true);
    if (err.first || err.phone || err.email || err.pw || err.agree) return;
    pendingSignup.current = { personal: { first: first.trim(), last: last.trim(), phone: `+7 ${phone}`, email: email.trim(), birth: '' }, avatar: photo };
    router.push({ pathname: '/password/code', params: { mode: 'register', phone } });
  };

  return (
    <Screen
      gap={24}
      header={<NavBar title="Регистрация" />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={70} style={{ top: 150, left: 300 }} />
          <Star w={40} style={{ top: 760, left: 12 }} />
        </View>
      }>
      <View style={{ marginHorizontal: 20, marginTop: 16, gap: 8 }}>
        <Text display size={28} lineHeight={31} accessibilityRole="header">
          Создайте аккаунт
        </Text>
        <Text size={15} lineHeight={21} color="text2">
          Заполните данные, чтобы стать частью клуба.
        </Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={photo ? 'Заменить фото профиля' : 'Добавить фото профиля'} onPress={pick} style={{ width: 88, height: 88 }}>
          <View style={{ flex: 1, borderRadius: 44, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {photo ? <Image source={photo} style={{ width: 88, height: 88 }} contentFit="cover" /> : <Icon name="user" size={40} color="sky" />}
          </View>
          <View style={{ position: 'absolute', right: 0, bottom: 2, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.blue600, borderWidth: 3, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={photo ? 'camera-01' : 'add-01'} size={14} color="surface" weight={2.4} />
          </View>
        </Pressable>
        <Text size={14} weight={600} color="blue600">
          {photo ? 'Заменить фото' : 'Добавить фото'}
        </Text>
      </View>
      <View style={{ marginHorizontal: 20, gap: 16 }}>
        <TextField label="Имя" value={first} onChangeText={setFirst} autoComplete="given-name" textContentType="givenName" {...show('first')} />
        <TextField label="Фамилия" value={last} onChangeText={setLast} placeholder="Введите фамилию" autoComplete="family-name" textContentType="familyName" />
        <TextField label="Номер телефона" prefix="+7" value={phone} onChangeText={(t) => setPhone(formatPhone(t))} keyboardType="phone-pad" autoComplete="tel" placeholder="700 000 00 00" {...show('phone')} />
        <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" {...show('email')} />
        <PasswordField label="Пароль" value={pw} onChangeText={setPw} autoComplete="new-password" textContentType="newPassword" state={tried && err.pw ? 'error' : 'default'} helper="Не меньше 8 символов, буквы и цифры" />
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: agree }} onPress={() => setAgree(!agree)} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 4 }}>
          <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: agree ? colors.blue600 : tried ? colors.red : '#8391AD', backgroundColor: agree ? colors.blue600 : colors.surface, alignItems: 'center', justifyContent: 'center' }}>
            {agree ? <Icon name="tick-02" size={14} color="surface" weight={2.8} /> : null}
          </View>
          <Text size={14} lineHeight={20} color={tried && !agree ? 'errorText' : 'text2'} style={{ flex: 1 }}>
            Принимаю{' '}
            <Text size={14} lineHeight={20} weight={600} color="blue600" onPress={() => router.push({ pathname: '/soon', params: { title: 'Условия использования' } })}>
              условия использования
            </Text>{' '}
            и даю согласие на обработку персональных данных
          </Text>
        </Pressable>
      </View>
      <Button label="Зарегистрироваться" height={52} style={{ marginHorizontal: 20 }} onPress={submit} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        <Text size={15} color="text2">
          Уже есть аккаунт?
        </Text>
        <Pressable accessibilityRole="link" onPress={() => router.replace('/login')} style={{ minHeight: 44, justifyContent: 'center' }}>
          <Text size={15} weight={700} color="blue600">
            Войти
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
