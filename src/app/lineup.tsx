import { router } from 'expo-router';
import { Share, View } from 'react-native';

import { Card, Carousel, Gradient, Icon, NavBar, PersonAvatar, Pitch, Pressable, Screen, Star, Text } from '@/components';
import { bench, startingXI } from '@/data/lineup';
import { colors, radius, shadows } from '@/theme';

const roleOrder = ['Вратарь', 'Защитник', 'Полузащитник', 'Нападающий'];
const list = startingXI.slice().sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

function Section({ title, count }: { title: string; count?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 6 }}>
      <Text display size={24} lineHeight={28}>
        {title}
      </Text>
      {count !== undefined ? (
        <Text size={14} weight={700} color="blue600">
          {count}
        </Text>
      ) : null}
    </View>
  );
}

const share = () => {
  Share.share({ message: 'Ожидаемый состав «Ордабасы» на матч с «Кайратом» — 25 октября, 19:00' }).catch(() => undefined);
};

/** Состав команды на матч: тренер, расстановка 4-3-3 на поле, стартовый состав и запасные. */
export default function Lineup() {
  return (
    <Screen gap={16} header={<NavBar title="Состав команды" action={{ icon: 'share-08', label: 'Поделиться', onPress: share }} />}>
      <View style={{ marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.blue10 }}>
        <Icon name="clock-01" size={18} color="blue600" weight={1.8} />
        <Text size={14} weight={600} color="blue600" style={{ flex: 1 }}>
          Ожидаемый состав на матч с «Кайратом». Официальный — за час до игры.
        </Text>
      </View>

      <Pressable accessibilityRole="link" onPress={() => router.push('/team')} style={{ marginHorizontal: 20, padding: 12, borderRadius: radius.l, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 12, ...shadows.card }}>
        <PersonAvatar who="martin" size={56} photoHeight={250} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text size={17} weight={700}>
            Андрей Мартин
          </Text>
          <Text size={13} color="text2">
            Главный тренер
          </Text>
        </View>
        <Icon name="arrow-right-01" size={20} color="text2" weight={1.8} />
      </Pressable>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <Text display size={24} lineHeight={28}>
          Расстановка
        </Text>
        <View style={{ height: 28, paddingHorizontal: 12, borderRadius: 14, backgroundColor: colors.navy, justifyContent: 'center' }}>
          <Text display size={16} color="surface">
            4-3-3
          </Text>
        </View>
      </View>

      <Gradient style={{ marginHorizontal: 20, height: 470, borderRadius: radius.xl, overflow: 'hidden' }}>
        <Pitch inset={12} circle={84} boxW={170} boxH={64} />
        <Star w={16} fill={colors.sky} style={{ right: 26, top: 210 }} />
        <Star w={10} fill={colors.surface} style={{ left: 30, top: 250 }} />
        {startingXI.map((p) => (
          <Pressable
            key={p.num}
            accessibilityRole="link"
            accessibilityLabel={`${p.num}, ${p.name}`}
            onPress={() => router.push({ pathname: '/player/[num]', params: { num: p.num } })}
            style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: 84, marginLeft: -42, alignItems: 'center', gap: 4 }}>
            <View style={{ width: 48, height: 48 }}>
              <PersonAvatar who={p.who} size={48} photoHeight={210} border />
              <View style={{ position: 'absolute', right: -6, bottom: -4, minWidth: 22, height: 22, paddingHorizontal: 4, borderRadius: 11, backgroundColor: colors.navy, borderWidth: 2, borderColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
                <Text display size={12} lineHeight={13} color="surface">
                  {p.num}
                </Text>
              </View>
            </View>
            <View style={{ maxWidth: 84, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6, backgroundColor: 'rgba(23,42,81,0.55)' }}>
              <Text size={12} lineHeight={15} weight={700} color="surface" numberOfLines={1}>
                {p.short}
              </Text>
            </View>
          </Pressable>
        ))}
      </Gradient>

      <Section title="Стартовый состав" count={11} />
      <Card style={{ marginHorizontal: 20, paddingHorizontal: 14, paddingVertical: 4 }}>
        {list.map((p, i) => (
          <Pressable key={p.num} accessibilityRole="link" onPress={() => router.push({ pathname: '/player/[num]', params: { num: p.num } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: i < list.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken }}>
            <Text display size={17} color="text2" align="center" style={{ width: 22 }}>
              {p.num}
            </Text>
            <PersonAvatar who={p.who} size={44} photoHeight={196} />
            <View style={{ flex: 1, gap: 1, minWidth: 0 }}>
              <Text size={16} weight={700} numberOfLines={1}>
                {p.name}
              </Text>
              <Text size={13} color="text2">
                {p.role}
              </Text>
            </View>
            {p.cap ? (
              <View accessibilityLabel="Капитан" style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#F5B800', alignItems: 'center', justifyContent: 'center' }}>
                <Text size={12} lineHeight={14} weight={700}>
                  К
                </Text>
              </View>
            ) : null}
          </Pressable>
        ))}
      </Card>

      <Section title="Запасные" count={bench.length} />
      <Carousel gap={10}>
        {bench.map((p) => (
          <Pressable key={p.num} accessibilityRole="link" onPress={() => router.push({ pathname: '/player/[num]', params: { num: p.num } })} style={{ width: 92, paddingTop: 12, paddingBottom: 10, paddingHorizontal: 6, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', gap: 6, ...shadows.card }}>
            <PersonAvatar who={p.who} size={52} photoHeight={230} />
            <Text size={13} lineHeight={16} weight={700} align="center">
              {p.short}
            </Text>
            <Text display size={14} color="text2">
              № {p.num}
            </Text>
          </Pressable>
        ))}
      </Carousel>
    </Screen>
  );
}

