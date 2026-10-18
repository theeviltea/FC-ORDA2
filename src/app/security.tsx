import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Icon, ListCard, NavBar, Screen, SectionHeader, Star, Switch, Text } from '@/components';
import { maskPhone, usePrefs } from '@/data/prefs';
import { colors, radius } from '@/theme';

const devices = [
  { icon: 'smart-phone-01' as const, title: 'iPhone 15 · это устройство', sub: 'Шымкент · сейчас' },
  { icon: 'laptop' as const, title: 'MacBook Air · Safari', sub: 'Шымкент · вчера, 21:14' },
];

/** Безопасность: пароль (смена через код из SMS), номер для подтверждения, вход по биометрии, устройства. */
export default function Security() {
  const { personal, passwordChanged } = usePrefs();
  const [bio, setBio] = useState(true);
  const fresh = passwordChanged === 'Изменён только что';
  const section = (title: string, children: React.ReactNode) => (
    <View style={{ gap: 12, marginTop: 8 }}>
      <SectionHeader title={title} />
      {children}
    </View>
  );
  return (
    <Screen
      gap={12}
      header={<NavBar title="Безопасность" />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 560, right: -20 }} />
        </View>
      }>
      {fresh ? (
        <View accessibilityLiveRegion="polite" style={{ marginHorizontal: 20, marginTop: 4, padding: 14, borderRadius: radius.l, backgroundColor: colors.successBg, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Icon name="checkmark-circle-02" size={22} color="successText" weight={1.8} />
          <Text size={14} lineHeight={19} weight={600} color="successText" style={{ flex: 1 }}>
            Пароль изменён. На других устройствах нужно будет войти заново.
          </Text>
        </View>
      ) : (
        <Text size={15} lineHeight={21} color="text2" style={{ marginHorizontal: 20, marginTop: 4 }}>
          Важные действия с аккаунтом подтверждаем кодом из SMS на ваш номер.
        </Text>
      )}
      {section(
        'Пароль',
        <View style={{ marginHorizontal: 20, padding: 16, gap: 14, borderRadius: radius.l, backgroundColor: colors.surface, boxShadow: '0 2px 12px rgba(23, 42, 81, 0.06)' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="lock-password" size={22} color="blue" weight={1.6} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text size={16} weight={700}>
                Пароль
              </Text>
              <Text size={13} color={fresh ? 'successText' : 'text2'}>
                {passwordChanged}
              </Text>
            </View>
          </View>
          <Button label="Изменить пароль" icon="sms-code" variant="soft" onPress={() => router.push('/password/code')} />
          <Text size={13} lineHeight={18} color="text2">
            Пришлём код на {maskPhone(personal.phone)}, затем вы придумаете новый пароль.
          </Text>
        </View>,
      )}
      {section(
        'Вход',
        <ListCard
          rows={[
            { icon: 'sms-code', title: 'Номер для кодов', sub: maskPhone(personal.phone) },
            { icon: 'finger-print', title: 'Вход по Face ID', sub: 'Вместо пароля на этом телефоне', right: <Switch label="Вход по Face ID" value={bio} onChange={setBio} /> },
          ]}
        />,
      )}
      {section('Устройства', <ListCard rows={devices} />)}
    </Screen>
  );
}
