import { router } from 'expo-router';
import { View } from 'react-native';

import { AppHeader, Carousel, IconTile, OfferBanner, PageTitle, Pressable, Screen, SectionHeader } from '@/components';
import { img } from '@/data/images';
import { soon } from '@/data/nav';

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
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 }}>
        {tiles.map((t) => (
          <IconTile key={t.title} {...t} iconSize={64} onPress={t.title === 'Викторины' ? () => router.push('/quizzes') : t.title === 'Конкурсы' ? () => router.push('/contests') : soon(t.title)} />
        ))}
      </View>
    </Screen>
  );
}
