import { Tabs } from 'expo-router';

import { TabBar, tabMeta } from '@/components';
import { colors } from '@/theme';

/** Main app: Главная · Медиа · Матчи · Магазин · Фан-зона (floating tab bar). */
export default function TabsLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg }, animation: 'fade' }}
      tabBar={(props) => <TabBar {...props} meta={tabMeta} aliases={{ guest: 'index' }} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="media" />
      <Tabs.Screen name="matches" />
      <Tabs.Screen name="shop" />
      <Tabs.Screen name="fan" />
      {/* Guest home belongs to «Главная»: no tab of its own. */}
      <Tabs.Screen name="guest" options={{ href: null }} />
    </Tabs>
  );
}
