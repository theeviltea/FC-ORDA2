import { NativeTabs } from 'expo-router/unstable-native-tabs';
import type { ImageSourcePropType } from 'react-native';

import { tabMeta } from '@/components';
import { bodyFamily, colors } from '@/theme';

/** Brand Hugeicons rendered as template PNGs (`assets/images/tabs`): the system tints them, `-on` = bolder stroke. */
const icon: Record<string, { default: ImageSourcePropType; selected: ImageSourcePropType }> = {
  index: { default: require('../../../assets/images/tabs/fire.png'), selected: require('../../../assets/images/tabs/fire-on.png') },
  media: { default: require('../../../assets/images/tabs/news-01.png'), selected: require('../../../assets/images/tabs/news-01-on.png') },
  matches: { default: require('../../../assets/images/tabs/football.png'), selected: require('../../../assets/images/tabs/football-on.png') },
  shop: { default: require('../../../assets/images/tabs/shopping-bag-02.png'), selected: require('../../../assets/images/tabs/shopping-bag-02-on.png') },
  fan: { default: require('../../../assets/images/tabs/champion.png'), selected: require('../../../assets/images/tabs/champion-on.png') },
};

const tab = (name: keyof typeof icon) => (
  <NativeTabs.Trigger name={name} disableAutomaticContentInsets contentStyle={{ backgroundColor: colors.bg }}>
    <NativeTabs.Trigger.Icon src={icon[name]} renderingMode="template" />
    <NativeTabs.Trigger.Label>{tabMeta[name].label}</NativeTabs.Trigger.Label>
  </NativeTabs.Trigger>
);

/**
 * Main app on iOS/Android: system tab bar — Liquid Glass on iOS 26 (shrinks while scrolling down), Material bar on Android.
 * Screens handle their own insets (floating glass header on top, safe-area bottom includes the tab bar).
 */
export default function TabsLayout() {
  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      backBehavior="history"
      tintColor={colors.blue}
      iconColor={{ default: colors.text2, selected: colors.blue }}
      indicatorColor={colors.blue10}
      labelStyle={{ default: { fontFamily: bodyFamily[500], fontSize: 11, color: colors.text2 }, selected: { fontFamily: bodyFamily[700], fontSize: 11, color: colors.blue } }}>
      {tab('index')}
      {tab('media')}
      {tab('matches')}
      {tab('shop')}
      {tab('fan')}
      {/* Guest home belongs to «Главная»: no tab of its own. */}
      <NativeTabs.Trigger name="guest" hidden />
    </NativeTabs>
  );
}
