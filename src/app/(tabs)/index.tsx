import { usePrefs } from '@/data/prefs';
import { View } from 'react-native';

import { HomeScreen } from '@/features/home/HomeScreen';
import { AiFab } from '@/features/social/parts';

/** Главная: guest feed when signed out (prototype: after «Выйти из аккаунта»). */
export default function Home() {
  const { authed } = usePrefs();
  return (
    <View style={{ flex: 1 }}>
      <HomeScreen guest={!authed} />
      <AiFab />
    </View>
  );
}
