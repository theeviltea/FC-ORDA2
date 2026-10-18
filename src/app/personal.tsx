import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Icon, ListCard, NavBar, Pressable, Screen, Star, Text, TextField } from '@/components';
import { img } from '@/data/images';
import { soon } from '@/data/nav';
import { setPrefs, usePrefs, type Personal } from '@/data/prefs';
import { colors } from '@/theme';

const emailOk = (s: string) => /^\S+@\S+\.\S+$/.test(s.trim());
const dateOk = (s: string) => /^\d{2}\.\d{2}\.\d{4}$/.test(s.trim());

/** Личные данные: фото, имя, фамилия, телефон (подтверждён), почта, дата рождения, пароль; «Сохранить изменения». */
export default function PersonalData() {
  const { personal, passwordChanged } = usePrefs();
  const [f, setF] = useState<Personal>(personal);
  const [tried, setTried] = useState(false);
  const set = (k: keyof Personal) => (v: string) => setF({ ...f, [k]: v });
  const err = {
    first: !f.first.trim() ? 'Введите имя' : '',
    email: !emailOk(f.email) ? 'Проверьте адрес почты' : '',
    birth: !dateOk(f.birth) ? 'Формат ДД.ММ.ГГГГ' : '',
  };
  const show = (k: keyof typeof err) => (tried && err[k] ? { state: 'error' as const, helper: err[k] } : {});

  const save = () => {
    setTried(true);
    if (err.first || err.email || err.birth) return;
    setPrefs({ personal: { ...f, first: f.first.trim(), last: f.last.trim(), email: f.email.trim() } });
    router.back();
  };

  return (
    <Screen
      gap={16}
      header={<NavBar title="Личные данные" />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 560, right: -20 }} />
        </View>
      }>
      <View style={{ alignItems: 'center', gap: 10, marginTop: 4 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Изменить фото" onPress={soon('Изменить фото')} style={{ width: 104, height: 104 }}>
          <View style={{ flex: 1, padding: 3, borderRadius: 52, backgroundColor: colors.surface, boxShadow: '0 6px 20px rgba(23, 42, 81, 0.12)' }}>
            <Image source={img.avatar} style={{ flex: 1, borderRadius: 49 }} contentFit="cover" />
          </View>
          <View style={{ position: 'absolute', right: 2, bottom: 4, width: 34, height: 34, borderRadius: 17, backgroundColor: colors.blue600, borderWidth: 3, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="camera-01" size={16} color="surface" weight={1.8} />
          </View>
        </Pressable>
        <Text size={14} weight={600} color="blue600">
          Изменить фото
        </Text>
      </View>

      <View style={{ marginHorizontal: 20, gap: 16 }}>
        <TextField label="Имя" value={f.first} onChangeText={set('first')} autoComplete="given-name" {...show('first')} />
        <TextField label="Фамилия" value={f.last} onChangeText={set('last')} autoComplete="family-name" />
        <TextField label="Номер телефона" value={f.phone} state="success" helper="Номер подтверждён" editable={false} accessibilityHint="Номер меняется через поддержку" />
        <TextField label="Эл. почта" value={f.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" autoComplete="email" {...show('email')} />
        <TextField label="Дата рождения" value={f.birth} onChangeText={set('birth')} icon="calendar-03" keyboardType="numbers-and-punctuation" placeholder="ДД.ММ.ГГГГ" maxLength={10} {...show('birth')} />
      </View>
      <View>
        <ListCard rows={[{ icon: 'lock', title: 'Пароль', sub: passwordChanged, onPress: () => router.push('/security') }]} />
      </View>

      <Button label="Сохранить изменения" height={52} onPress={save} style={{ marginHorizontal: 20, marginTop: 8 }} />
      <Pressable accessibilityRole="button" onPress={soon('Удаление аккаунта')} style={{ marginHorizontal: 20, height: 44, alignItems: 'center', justifyContent: 'center' }}>
        <Text size={15} weight={600} color="errorText">
          Удалить аккаунт
        </Text>
      </Pressable>
    </Screen>
  );
}
