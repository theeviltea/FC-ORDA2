import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';

import { AppHeader, Gradient, Icon, IconTile, PageTitle, Pressable, Screen, SectionHeader, Star, Text } from '@/components';
import { aspect, img } from '@/data/images';
import { soon } from '@/data/nav';
import { colors, radius, shadows } from '@/theme';

const slides = [
  { tag: 'Матч', title: '«Ордабасы» сохранил лидерство и завершил первый круг на вершине таблицы', date: '18 мая 2025', alt: 'Игроки «Ордабасы» празднуют гол', photo: img.videoGoal, pos: { left: '40%' } },
  { tag: 'Команда', title: 'Состав на матч с «Кайратом» объявлен', date: 'Сегодня', alt: 'Команда перед матчем', photo: img.newsLineup, pos: { top: '30%' } },
  { tag: 'Клуб', title: 'Новый нападающий подписал контракт с клубом', date: '31 июля', alt: 'Игроки «Ордабасы» на поле', photo: img.newsShout, pos: { left: '45%' } },
];

const tiles = [
  { title: 'Видео', sub: 'Трансляции и обзоры матчей', icon: img.icon3dVideo },
  { title: 'Фото', sub: 'Лучшие моменты в кадре', icon: img.icon3dPhoto },
  { title: 'Статьи и интервью', sub: 'Специальные материалы', icon: img.icon3dArticles },
  { title: 'Пресс-конференции', sub: 'Брифинги и заявления', icon: img.icon3dPress },
];

const pad = (n: number) => String(n).padStart(2, '0');

function Featured() {
  const [i, setI] = useState(0);
  const n = slides.length;
  const s = slides[i];
  return (
    <Gradient style={{ marginHorizontal: 20, height: 400, borderRadius: radius.xl, overflow: 'hidden' }}>
      <Image source={s.photo} accessibilityLabel={s.alt} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" contentPosition={s.pos} transition={200} />
      <Gradient colors={['rgba(23,42,81,0.35)', 'rgba(23,42,81,0)']} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 120 }} />
      <Gradient colors={['rgba(23,42,81,0)', 'rgba(23,42,81,0.78)', colors.navy]} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 260 }} />
      <Pressable accessibilityRole="link" onPress={soon('Новость')} style={{ position: 'absolute', left: 18, right: 18, bottom: 76, gap: 8 }}>
        <View style={{ alignSelf: 'flex-start', height: 24, paddingHorizontal: 10, borderRadius: 12, backgroundColor: colors.surface, justifyContent: 'center' }}>
          <Text size={12} lineHeight={14} weight={700}>
            {s.tag}
          </Text>
        </View>
        <Text display size={21} lineHeight={25} color="surface" style={{ maxWidth: 300 }}>
          {s.title}
        </Text>
        <Text size={13} color="onDark2">
          {s.date}
        </Text>
      </Pressable>
      <View style={{ position: 'absolute', left: 18, right: 18, bottom: 16, flexDirection: 'row', alignItems: 'center' }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Предыдущий материал" onPress={() => setI((i - 1 + n) % n)} style={{ width: 44, height: 44, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow-left-01" size={20} color="surface" weight={2} />
        </Pressable>
        <View accessibilityLiveRegion="polite" style={{ height: 44, paddingHorizontal: 14, backgroundColor: 'rgba(23,42,81,0.6)', justifyContent: 'center' }}>
          <Text display size={18} color="surface" style={{ letterSpacing: 0.7 }}>
            {`${pad(i + 1)}/${pad(n)}`}
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Следующий материал" onPress={() => setI((i + 1) % n)} style={{ width: 44, height: 44, borderTopRightRadius: 10, borderBottomRightRadius: 10, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow-right-01" size={20} color="surface" weight={2} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {slides.map((x, k) => (
            <View key={x.title} style={{ width: k === i ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: k === i ? colors.surface : 'rgba(255,255,255,0.4)' }} />
          ))}
        </View>
      </View>
    </Gradient>
  );
}

function TeamCard() {
  return (
    <Pressable accessibilityRole="link" accessibilityLabel="Команда" onPress={soon('Команда')} style={{ marginHorizontal: 20, height: 176, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.surface, ...shadows.card }}>
      <Text display size={92} lineHeight={81} color="star" style={{ position: 'absolute', left: 110, top: -8 }} aria-hidden>
        {'TEAM\nTEAM'}
      </Text>
      <Star w={40} h={66} fill={colors.blue} style={{ right: -20, top: 56 }} />
      <Image source={img.mediaTeam} style={{ position: 'absolute', left: 176, top: 12, height: 172, width: 172 * aspect.mediaTeam }} />
      <Gradient colors={['rgba(255,255,255,0)', '#FFFFFF']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40 }} />
      <View style={{ position: 'absolute', left: 18, top: 18, bottom: 18, width: 150, gap: 6 }}>
        <Text display size={26} lineHeight={26} upper>
          Команда
        </Text>
        <Text size={14} lineHeight={18} color="text2">
          Игроки, тренерский штаб и персонал
        </Text>
        <View style={{ marginTop: 'auto', alignSelf: 'flex-start', height: 36, paddingHorizontal: 12, borderRadius: 10, backgroundColor: colors.navy, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text size={14} weight={700} color="surface">
            35 человек
          </Text>
          <Icon name="arrow-right-01" size={16} color="surface" weight={2} />
        </View>
      </View>
    </Pressable>
  );
}

/** Медиацентр: главные материалы (карусель топ-новостей на фото), команда, разделы медиа. */
export function MediaScreen() {
  return (
    <Screen tabs gap={16} header={<AppHeader />}>
      <PageTitle>Медиацентр</PageTitle>
      <View style={{ marginBottom: -4 }}>
        <SectionHeader title="Главное" link="Все новости" onPress={soon('Новости')} />
      </View>
      <Featured />
      <TeamCard />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 }}>
        {tiles.map((t) => (
          <IconTile key={t.title} {...t} onPress={soon(t.title)} />
        ))}
      </View>
    </Screen>
  );
}
