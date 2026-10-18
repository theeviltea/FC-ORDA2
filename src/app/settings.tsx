import { router } from 'expo-router';
import { View } from 'react-native';

import { ListCard, NavBar, Screen, SectionHeader, Star } from '@/components';
import { soon } from '@/data/nav';
import { languages, usePrefs } from '@/data/prefs';

/** Настройки: аккаунт, уведомления, язык, помощь. */
export default function Settings() {
  const { lang } = usePrefs();
  const section = (title: string, rows: Parameters<typeof ListCard>[0]['rows']) => (
    <View style={{ gap: 12, marginTop: 8 }}>
      <SectionHeader title={title} />
      <ListCard rows={rows} />
    </View>
  );
  return (
    <Screen
      gap={12}
      header={<NavBar title="Настройки" />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 500, right: -20 }} />
        </View>
      }>
      {section('Аккаунт', [
        { icon: 'user', title: 'Личные данные', sub: 'Имя, телефон и почта', onPress: () => router.push('/personal') },
        { icon: 'shield-01', title: 'Безопасность', sub: 'Пароль и вход', onPress: soon('Безопасность') },
        { icon: 'notification-01', title: 'Уведомления', sub: 'Матчи, новости клуба', onPress: () => router.push('/notification-settings') },
      ])}
      {section('Язык', [{ icon: 'translate', title: 'Язык приложения', sub: languages.find((l) => l.id === lang)!.name, onPress: () => router.push('/language') }])}
      {section('Помощь', [
        { icon: 'customer-support', title: 'Центр поддержки', sub: 'Ответим в течение часа', onPress: () => router.push('/support') },
        { icon: 'smart-phone-01', title: 'О приложении', sub: 'Версия 1.0.0', onPress: soon('О приложении') },
      ])}
    </Screen>
  );
}
