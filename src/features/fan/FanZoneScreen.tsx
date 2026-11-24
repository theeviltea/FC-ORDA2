import { router } from 'expo-router';
import { View } from 'react-native';

import { AppHeader, Carousel, Gradient, IconTile, OfferBanner, PageTitle, Pressable, Screen, SectionHeader, Star, Text } from '@/components';
import { img } from '@/data/images';
import { friendsOf, incomingOf, plural, useSocial } from '@/data/social';
import { FanAvatar } from '@/features/social/parts';
import { colors, shadows } from '@/theme';

const routes: Record<string, '/quizzes' | '/contests' | '/polls' | '/predictions' | '/tasks' | '/interactive'> = {
  Викторины: '/quizzes',
  Конкурсы: '/contests',
  Опросы: '/polls',
  'Результаты матчей': '/predictions',
  Задания: '/tasks',
  Интерактив: '/interactive',
};

const tiles = [
  { title: 'Викторины', sub: 'Проверьте знания о клубе', icon: img.icon3dQuiz },
  { title: 'Конкурсы', sub: 'Призы и розыгрыши', icon: img.icon3dContest },
  { title: 'Опросы', sub: 'Голос болельщика', icon: img.icon3dPoll },
  { title: 'Результаты матчей', sub: 'Прогнозы и итоги', icon: img.icon3dResults },
  { title: 'Задания', sub: 'Баллы за активность', icon: img.icon3dTasks },
  { title: 'Интерактив', sub: 'Игры на стадионе', icon: img.icon3dInteractive },
];

const offers = ['kit', 'live', 'bonus', 'tickets'] as const;

/** Фан-зона: предложения «Для вас» и разделы активностей болельщика. */
export function FanZoneScreen() {
  const social = useSocial();
  const friends = friendsOf(social);
  const requests = incomingOf(social).length;
  return (
    <Screen tabs gap={16} header={<AppHeader />}>
      <PageTitle>Фан-зона</PageTitle>
      <SectionHeader title="Для вас" link="Все" onPress={() => router.push('/for-you')} />
      <View style={{ marginTop: -8 }}>
        <Carousel>
          {offers.map((o) => (
            <Pressable key={o} accessibilityRole="link" onPress={() => router.push({ pathname: '/offer/[id]', params: { id: o } })} style={{ width: 300 }}>
              <OfferBanner offer={o} />
            </Pressable>
          ))}
        </Carousel>
      </View>
      <SectionHeader title="Сообщество" />
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: -4 }}>
        <Pressable accessibilityRole="link" accessibilityLabel={`Друзья: ${friends.length}${requests ? `, заявок: ${requests}` : ''}`} onPress={() => router.push('/friends')} style={{ flex: 1, height: 150, padding: 14, borderRadius: 22, backgroundColor: colors.surface, gap: 4, ...shadows.card }}>
          {requests ? (
            <View style={{ position: 'absolute', right: 12, top: 12, height: 22, paddingHorizontal: 8, borderRadius: 11, backgroundColor: colors.red, justifyContent: 'center' }}>
              <Text size={12} lineHeight={14} weight={700} color="surface">
                +{requests}
              </Text>
            </View>
          ) : null}
          <Text display size={18}>
            Друзья
          </Text>
          <Text size={13} color="text2">
            {friends.length} {plural(friends.length, ['друг', 'друга', 'друзей'])}{requests ? ` · ${requests} ${plural(requests, ['заявка', 'заявки', 'заявок'])}` : ''}
          </Text>
          <View style={{ position: 'absolute', left: 14, bottom: 14, flexDirection: 'row' }}>
            {friends.slice(0, 3).map((f, i) => (
              <View key={f.id} style={{ marginLeft: i ? -10 : 0, borderRadius: 20, borderWidth: 2, borderColor: colors.surface }}>
                <FanAvatar id={f.id} size={34} online={false} />
              </View>
            ))}
          </View>
        </Pressable>
        <Pressable accessibilityRole="link" onPress={() => router.push('/forum')} style={{ flex: 1, height: 150, borderRadius: 22, overflow: 'hidden' }}>
          <Gradient colors={[colors.navy, '#0B3A6B', colors.blue600]} style={{ flex: 1, padding: 14, gap: 4 }}>
            <Star w={80} fill="rgba(18,158,217,0.35)" style={{ right: -24, bottom: -24 }} />
            <Text display size={18} color="surface">
              Форум
            </Text>
            <Text size={13} color="onDark2">
              Обсуждаем матчи и трансферы
            </Text>
            <View style={{ position: 'absolute', left: 14, bottom: 14, height: 26, paddingHorizontal: 9, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.14)', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#3BE07F' }} />
              <Text size={12} weight={700} color="surface">
                128 онлайн
              </Text>
            </View>
          </Gradient>
        </Pressable>
      </View>
      <SectionHeader title="Игры и активности" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 }}>
        {tiles.map((t) => (
          <IconTile key={t.title} {...t} iconSize={64} onPress={() => router.push(routes[t.title])} />
        ))}
      </View>
    </Screen>
  );
}
