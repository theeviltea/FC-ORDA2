import { HomeScreen } from '@/features/home/HomeScreen';

/** Signed-out home: same feed, GuestHeader with «Войти» and the join banner. */
export default function GuestHome() {
  return <HomeScreen guest />;
}
