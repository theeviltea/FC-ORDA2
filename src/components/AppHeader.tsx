import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import { fan, formatPoints } from '@/data/user';
import { img } from '@/data/images';
import { soon } from '@/data/nav';
import { colors, shadows } from '@/theme';

import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

/** Top-level header: avatar + name + points on the left, notifications bell on the right. */
export function AppHeader() {
  return (
    <View style={{ height: 48, paddingLeft: 20, paddingRight: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Профиль"
        onPress={() => router.push('/profile')}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: colors.surface, overflow: 'hidden', backgroundColor: colors.blue10, ...shadows.avatar }}>
          <Image source={img.avatar} style={{ width: 36, height: 36 }} />
        </View>
        <Text size={17} weight={700}>
          {fan.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 28, paddingLeft: 4, paddingRight: 10, borderRadius: 14, borderWidth: 1.5, borderColor: colors.blue, backgroundColor: colors.surface }}>
          <Image source={img.coin} style={{ width: 22, height: 22 }} contentFit="contain" />
          <Text size={14} weight={700}>
            {formatPoints(fan.points)}
          </Text>
        </View>
      </Pressable>
      <View style={{ flex: 1 }} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Уведомления, ${fan.unread} новых`}
        onPress={soon('Уведомления')}
        style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="notification-01" size={24} />
        <View style={{ position: 'absolute', top: 4, right: 2, minWidth: 20, height: 20, paddingHorizontal: 4, borderRadius: 10, backgroundColor: colors.red, borderWidth: 2, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
          <Text size={11} weight={700} color="surface" lineHeight={13}>
            {fan.unread}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
