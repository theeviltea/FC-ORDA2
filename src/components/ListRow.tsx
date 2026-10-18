import type { ReactNode } from 'react';
import { View } from 'react-native';

import { colors, radius, shadows } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

type Row = { icon?: IconName; title: string; sub?: string; onPress?: () => void; right?: ReactNode };

/** White grouped list card (Profile «Аккаунт», Settings, notification settings): rows 64+ with dividers. */
export function ListCard({ rows }: { rows: Row[] }) {
  return (
    <View style={{ marginHorizontal: 20, paddingHorizontal: 16, borderRadius: radius.l, backgroundColor: colors.surface, ...shadows.card }}>
      {rows.map((r, i) => {
        const body = (
          <>
            {r.icon ? (
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={r.icon} size={22} color="blue" weight={1.6} />
              </View>
            ) : null}
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Text size={16} weight={700}>
                {r.title}
              </Text>
              {r.sub ? (
                <Text size={13} color="text2">
                  {r.sub}
                </Text>
              ) : null}
            </View>
            {r.right ?? (r.onPress ? <Icon name="arrow-right-01" size={20} color="text3" weight={1.8} /> : null)}
          </>
        );
        const style = { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64, paddingVertical: 10, borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken } as const;
        return r.onPress ? (
          <Pressable key={r.title} accessibilityRole="link" onPress={r.onPress} style={style}>
            {body}
          </Pressable>
        ) : (
          <View key={r.title} style={style}>
            {body}
          </View>
        );
      })}
    </View>
  );
}
