import type { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

import { Glass } from './Glass';
import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];
export type TabMeta = Record<string, { label: string; icon: IconName }>;

/**
 * Web preview tab bar (iOS/Android use native tabs): floating glass capsule 64px, 16px from the screen edges.
 * Active tab = blue icon (stroke 1.8) + bold label on a soft blue pill, inactive = text-2.
 */
export function TabBar({ state, navigation, insets, meta, aliases = {} }: TabBarProps & { meta: TabMeta; aliases?: Record<string, string> }) {
  const current = state.routes[state.index]?.name;
  const activeName = aliases[current] ?? current;
  return (
    <Glass
      radius={32}
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: Math.max(insets.bottom, 12) + 8,
        height: 64,
        paddingHorizontal: 6,
      }}>
      <View accessibilityRole="tablist" style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      {state.routes.map((route, i) => {
        const m = meta[route.name];
        if (!m) return null;
        const on = route.name === activeName;
        const col = on ? 'blue' : 'text2';
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={m.label}
            onPress={() => {
              const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!e.defaultPrevented && (state.index !== i || route.name !== activeName)) navigation.navigate(route.name);
            }}
            style={{ flex: 1, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: on ? 'rgba(18, 158, 217, 0.12)' : undefined }}>
            <Icon name={m.icon} size={24} color={col} weight={on ? 1.8 : 1.5} />
            <Text size={11} lineHeight={13} weight={on ? 700 : 500} color={col}>
              {m.label}
            </Text>
          </Pressable>
        );
      })}
      </View>
    </Glass>
  );
}

export const tabMeta: TabMeta = {
  index: { label: 'Главная', icon: 'fire' },
  media: { label: 'Медиа', icon: 'news-01' },
  matches: { label: 'Матчи', icon: 'football' },
  shop: { label: 'Магазин', icon: 'shopping-bag-02' },
  fan: { label: 'Фан-зона', icon: 'champion' },
};
