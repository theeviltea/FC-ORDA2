import type { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

import { colors, shadows } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];
export type TabMeta = Record<string, { label: string; icon: IconName }>;

/**
 * ORDA floating tab bar: white card 68px, radius 24, 16px from the screen edges.
 * Active tab = blue icon (stroke 1.8) + bold label, inactive = text-3.
 */
export function TabBar({ state, navigation, insets, meta, aliases = {} }: TabBarProps & { meta: TabMeta; aliases?: Record<string, string> }) {
  const current = state.routes[state.index]?.name;
  const activeName = aliases[current] ?? current;
  return (
    <View
      accessibilityRole="tablist"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: Math.max(insets.bottom, 12) + 8,
        height: 68,
        paddingHorizontal: 6,
        borderRadius: 24,
        backgroundColor: colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.tabbar,
      }}>
      {state.routes.map((route, i) => {
        const m = meta[route.name];
        if (!m) return null;
        const on = route.name === activeName;
        const col = on ? 'blue' : 'text3';
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
            style={{ flex: 1, alignItems: 'center', gap: 3, paddingVertical: 8 }}>
            <Icon name={m.icon} size={24} color={col} weight={on ? 1.8 : 1.5} />
            <Text size={11} lineHeight={13} weight={on ? 700 : 500} color={col}>
              {m.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const tabMeta: TabMeta = {
  index: { label: 'Главная', icon: 'fire' },
  media: { label: 'Медиа', icon: 'news-01' },
  matches: { label: 'Матчи', icon: 'football' },
  shop: { label: 'Магазин', icon: 'shopping-bag-02' },
  fan: { label: 'Фан-зона', icon: 'champion' },
};
