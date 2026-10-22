import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import { usePrefs } from '@/data/prefs';
import { fan, formatPoints } from '@/data/user';
import { img } from '@/data/images';
import { colors } from '@/theme';

import { Avatar } from './Avatar';
import { Glass, GlassButton } from './Glass';
import { GuestHeader } from './GuestHeader';
import { Pressable } from './Pressable';
import { Text } from './Text';

/** Top-level header: glass capsule with avatar + name + points on the left, round glass bell on the right. Signed out → GuestHeader. */
export function AppHeader() {
  const { authed, personal } = usePrefs();
  if (!authed) return <GuestHeader />;
  return (
    <View style={{ height: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Pressable accessibilityRole="link" accessibilityLabel={`Профиль: ${personal.first}, ${formatPoints(fan.points)} баллов`} onPress={() => router.push('/profile')}>
        <Glass radius={24} interactive style={{ height: 48, paddingLeft: 4, paddingRight: 6, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: colors.surface, overflow: 'hidden', backgroundColor: colors.blue10 }}>
            <Avatar size={36} />
          </View>
          <Text size={17} weight={700}>
            {personal.first}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 32, paddingLeft: 4, paddingRight: 10, borderRadius: 16, backgroundColor: colors.blue10 }}>
            <Image source={img.coin} style={{ width: 22, height: 22 }} contentFit="contain" />
            <Text size={14} weight={700}>
              {formatPoints(fan.points)}
            </Text>
          </View>
        </Glass>
      </Pressable>
      <View style={{ flex: 1 }} />
      <GlassButton icon="notification-01" label="Уведомления" badge={fan.unread} onPress={() => router.push('/inbox')} />
    </View>
  );
}
