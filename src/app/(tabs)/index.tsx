import { usePrefs } from '@/data/prefs';
import { HomeScreen } from '@/features/home/HomeScreen';

/** Главная: guest feed when signed out (prototype: after «Выйти из аккаунта»). */
export default function Home() {
  const { authed } = usePrefs();
  return <HomeScreen guest={!authed} />;
}
