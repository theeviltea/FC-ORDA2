import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import {
  AppHeader,
  Button,
  Card,
  Carousel,
  Gradient,
  GuestHeader,
  Icon,
  OfferBanner,
  PlayerCard,
  Pressable,
  ProductCard,
  Screen,
  SectionHeader,
  Star,
  Text,
} from '@/components';
import { img } from '@/data/images';
import { news, nextMatch, nextTicket, playerOfMatch, products, sponsors, squad, stories, table, videos } from '@/data/home';
import { soon } from '@/data/nav';
import { useCountdown } from '@/hooks/useCountdown';
import { colors, gradients, radius, shadows } from '@/theme';

/** Главная. `guest` = signed-out zone: GuestHeader + «Стань частью ORDA» instead of the profile header. */
export function HomeScreen({ guest }: { guest?: boolean }) {
  return (
    <Screen
      tabs
      header={guest ? <GuestHeader /> : <AppHeader />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={64} style={{ top: 470, left: 300 }} />
          <Star w={40} style={{ top: 905, left: 18 }} />
          <Star w={88} style={{ top: 1240, left: 150 }} />
          <Star w={48} style={{ top: 1960, left: 320 }} />
        </View>
      }>
      {guest ? <JoinBanner /> : null}
      <Stories guest={guest} />
      {guest ? null : <TicketSoon />}
      <NextMatch />
      <ForYou />
      <Shop />
      <Videos />
      <PlayerOfMatch />
      <Squad />
      <Table />
      <News />
      <Partners />
    </Screen>
  );
}

function JoinBanner() {
  return (
    <Pressable accessibilityRole="link" onPress={soon('Регистрация')} style={{ marginHorizontal: 20 }}>
      <Gradient style={{ borderRadius: radius.l, overflow: 'hidden', padding: 16, paddingRight: 116, gap: 6 }}>
        <Star w={14} fill={colors.sky} style={{ right: 120, top: 14 }} />
        <Image source={img.coin} style={{ position: 'absolute', right: 14, top: '50%', marginTop: -42, width: 84, height: 84 }} contentFit="contain" />
        <Text display size={20} lineHeight={22} upper color="surface">
          Стань частью ORDA
        </Text>
        <Text size={14} lineHeight={19} color="blue10">
          Копи баллы, покупай билеты и участвуй в конкурсах
        </Text>
        <View style={{ alignSelf: 'flex-start', marginTop: 4, height: 36, paddingHorizontal: 14, borderRadius: 12, backgroundColor: colors.surface, justifyContent: 'center' }}>
          <Text size={14} weight={700} color="blue600">
            Зарегистрироваться
          </Text>
        </View>
      </Gradient>
    </Pressable>
  );
}

function Stories({ guest }: { guest?: boolean }) {
  return (
    <View style={{ marginTop: guest ? -8 : -12 }}>
      <Carousel gap={14}>
        {stories.map((s) => (
          <Pressable key={s.label} accessibilityRole="button" accessibilityLabel={`История: ${s.label}`} onPress={soon('Истории')} style={{ width: 76, alignItems: 'center', gap: 6 }}>
            {s.fresh ? (
              <Gradient colors={gradients.story} style={{ width: 72, height: 72, borderRadius: 36, padding: 3, boxShadow: '0 0 14px rgba(169, 85, 244, 0.3)' }}>
                <StoryCover cover={s.cover} />
                {s.live ? <View style={{ position: 'absolute', top: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.blue, borderWidth: 2, borderColor: colors.bg }} /> : null}
              </Gradient>
            ) : (
              <View style={{ width: 72, height: 72, borderRadius: 36, padding: 3, backgroundColor: colors.storySeen }}>
                <StoryCover cover={s.cover} />
              </View>
            )}
            <Text size={12} weight={500} numberOfLines={1}>
              {s.label}
            </Text>
          </Pressable>
        ))}
      </Carousel>
    </View>
  );
}

function StoryCover({ cover }: { cover: number }) {
  return (
    <View style={{ flex: 1, borderRadius: 33, borderWidth: 3, borderColor: colors.bg, backgroundColor: colors.blue, overflow: 'hidden' }}>
      <Image source={cover} style={{ flex: 1 }} contentFit="cover" />
    </View>
  );
}

function TicketSoon() {
  return (
    <View style={{ gap: 12, paddingHorizontal: 20 }}>
      <SectionHeader title="Скоро" link="Мои билеты" onPress={soon('Мои билеты')} inset={false} />
      <Card accent style={{ padding: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text size={17} weight={700}>
              {nextTicket.match}
            </Text>
            <Text size={13} weight={500} color="text2" style={{ letterSpacing: 0.5 }}>
              {nextTicket.meta}
            </Text>
          </View>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surfaceSunken, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bar-code-01" size={24} />
          </View>
        </View>
        <Button label="Показать QR-код" icon="qr-code" onPress={soon('QR-код билета')} />
      </Card>
    </View>
  );
}

function Club({ name, logo }: { name: string; logo: number }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 10 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={logo} style={{ width: 40, height: 49 }} contentFit="contain" />
      </View>
      <Text display size={17} color="surface" style={{ letterSpacing: 0.5 }}>
        {name}
      </Text>
    </View>
  );
}

function NextMatch() {
  const countdown = useCountdown(nextMatch.startsIn);
  return (
    <View style={{ gap: 12, paddingHorizontal: 20 }}>
      <SectionHeader title="Ближайший матч" link="Все матчи" onPress={() => router.navigate('/matches')} inset={false} />
      <Gradient style={{ borderRadius: radius.xl, overflow: 'hidden', paddingTop: 24, paddingHorizontal: 18, paddingBottom: 18, gap: 20, ...shadows.raised }}>
        <Text display size={96} lineHeight={84} color="rgba(255,255,255,0.08)" style={{ position: 'absolute', left: 12, top: 0 }} aria-hidden>
          {'MATCH\nDAY\nMATCH\nDAY'}
        </Text>
        <Star w={40} h={66} fill={colors.bg} style={{ left: -20, top: 128 }} />
        <Star w={40} h={66} fill={colors.bg} style={{ right: -20, top: 128 }} />
        <Star w={14} fill={colors.sky} style={{ left: 30, top: 30 }} />
        <Star w={20} fill={colors.surface} style={{ right: 34, top: 92 }} />
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text display size={20} color="surface" align="center">
            {nextMatch.league}
          </Text>
          <Text size={16} color="onDark2" align="center">
            {nextMatch.when}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Club {...nextMatch.home} />
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
            <Text display size={16} color="onDark2">
              VS
            </Text>
          </View>
          <Club {...nextMatch.away} />
        </View>
        <View accessibilityRole="timer" accessibilityLabel="До начала матча" style={{ flexDirection: 'row', gap: 6 }}>
          {countdown.map((c) => (
            <View key={c.u} style={{ flex: 1, height: 58, borderRadius: 10, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
              <Text display size={24} lineHeight={26} color="surface" style={{ fontVariant: ['tabular-nums'] }}>
                {c.v}
              </Text>
              <Text size={11} lineHeight={13} color="onDark2" upper style={{ letterSpacing: 0.7 }}>
                {c.u}
              </Text>
            </View>
          ))}
        </View>
        <Button label="Купить билеты" variant="white" height={52} onPress={soon('Билеты')} />
      </Gradient>
    </View>
  );
}

function ForYou() {
  const offers = ['kit', 'live', 'bonus', 'tickets'] as const;
  return (
    <View style={{ gap: 12 }}>
      <SectionHeader title="Для вас" link="Все" onPress={soon('Для вас')} />
      <Carousel>
        {offers.map((o) => (
          <Pressable key={o} accessibilityRole="link" onPress={soon(o === 'kit' ? 'Предложение' : 'Для вас')} style={{ width: 300 }}>
            <OfferBanner offer={o} />
          </Pressable>
        ))}
      </Carousel>
    </View>
  );
}

function Shop() {
  return (
    <View style={{ gap: 12 }}>
      <SectionHeader title="Магазин" link="Ещё" onPress={() => router.navigate('/shop')} />
      <Carousel>
        {products.map((p) => (
          <ProductCard key={p.name} item={p} onPress={soon('Товар')} />
        ))}
      </Carousel>
    </View>
  );
}

function Videos() {
  return (
    <View style={{ gap: 12 }}>
      <SectionHeader title="Видео" link="Все" onPress={() => router.navigate('/media')} />
      <Carousel>
        {videos.map((v) => (
          <Pressable key={v.title} accessibilityRole="link" accessibilityLabel={`Смотреть: ${v.title}`} onPress={soon('Видео')} style={{ width: 248, gap: 6 }}>
            <View style={{ height: 140, borderRadius: 18, overflow: 'hidden', backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={v.cover} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(23,42,81,0.18)' }} />
              {v.live ? (
                <View style={{ position: 'absolute', left: 10, top: 10, height: 22, paddingHorizontal: 8, borderRadius: 6, backgroundColor: colors.red, justifyContent: 'center' }}>
                  <Text size={11} lineHeight={13} weight={700} color="surface">
                    LIVE
                  </Text>
                </View>
              ) : null}
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="play" size={22} color="blue" filled />
              </View>
            </View>
            <Text size={16} weight={700}>
              {v.title}
            </Text>
            <Text size={13} color="text2" style={{ marginTop: -4 }}>
              {v.meta}
            </Text>
          </Pressable>
        ))}
      </Carousel>
    </View>
  );
}

function RatingRing({ value }: { value: number }) {
  const r = 29;
  const len = 2 * Math.PI * r;
  return (
    <View style={{ position: 'absolute', right: 14, bottom: 16, width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={64} height={64} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={32} cy={32} r={r} stroke="rgba(255,255,255,0.25)" strokeWidth={6} fill="none" />
        <Circle cx={32} cy={32} r={r} stroke="#FFFFFF" strokeWidth={6} fill="none" strokeDasharray={`${len * value} ${len}`} />
      </Svg>
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
        <Text display size={17} lineHeight={17} color="surface">
          {Math.round(value * 100)}%
        </Text>
        <Text size={9} lineHeight={11} color="onDark2" upper>
          рейт
        </Text>
      </View>
    </View>
  );
}

function PlayerOfMatch() {
  const p = playerOfMatch;
  const ph = 420;
  return (
    <View style={{ gap: 12, paddingHorizontal: 20 }}>
      <SectionHeader title="Игрок матча" link="Подробнее" onPress={soon('Игрок')} inset={false} />
      <Card style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
        <Pressable accessibilityRole="link" accessibilityLabel={p.name} onPress={soon('Игрок')}>
          <Gradient style={{ height: 230, overflow: 'hidden' }}>
            <Text display size={100} lineHeight={88} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', left: 10, top: -4 }} aria-hidden>
              {'BEST\nPLAYER'}
            </Text>
            <Star w={40} h={66} fill={colors.bg} style={{ left: -20, top: 96 }} />
            <Star w={18} fill={colors.surface} style={{ left: 150, top: 30 }} />
            <Star w={12} fill={colors.sky} style={{ right: 22, top: 120 }} />
            <Image source={img.playerAstanov} style={{ position: 'absolute', right: -6, top: 18, height: ph, width: ph * 0.499 }} />
            <Gradient colors={['rgba(23,42,81,0)', 'rgba(23,42,81,0.75)']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 }} />
            <View style={{ position: 'absolute', left: 18, bottom: 16, gap: 2 }}>
              <Text display size={52} lineHeight={50} color="surface">
                {p.num}
              </Text>
              <Text display size={20} color="surface">
                {p.name}
              </Text>
              <Text size={14} color="onDark2">
                {p.role}
              </Text>
            </View>
            <RatingRing value={p.rating} />
          </Gradient>
        </Pressable>
        <View style={{ padding: 18, gap: 16 }}>
          {p.stats.map((s) => (
            <View key={s.label} style={{ gap: 6 }}>
              <Text size={14} color="text2">
                {s.label}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.blue10, overflow: 'hidden' }}>
                  <View style={{ width: `${s.w * 100}%`, height: 10, borderRadius: 5, backgroundColor: colors.blue }} />
                </View>
                <Text display size={18} align="right" style={{ minWidth: 52 }}>
                  {s.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

function Squad() {
  return (
    <View style={{ gap: 12 }}>
      <SectionHeader title="Команда" link="Подробнее" onPress={soon('Команда')} />
      <Carousel>
        {squad.map((p) => (
          <PlayerCard key={p.name} person={p} onPress={soon('Игрок')} />
        ))}
      </Carousel>
    </View>
  );
}

const cols = [
  { k: 'p', h: 'И' },
  { k: 'w', h: 'В' },
  { k: 'd', h: 'Н' },
  { k: 'l', h: 'П' },
  { k: 'gd', h: 'РМ' },
] as const;

function Table() {
  return (
    <View style={{ gap: 12, paddingHorizontal: 20 }}>
      <SectionHeader title="Турнирная таблица" link="Подробнее" onPress={soon('Турнирная таблица')} inset={false} />
      <Card style={{ padding: 6 }}>
        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
          <Text size={13} weight={500} color="text2" style={{ width: 30, paddingLeft: 8 }}>
            #
          </Text>
          <Text size={13} weight={500} color="text2" style={{ flex: 1, paddingLeft: 4 }}>
            Команда
          </Text>
          {cols.map((c) => (
            <Text key={c.k} size={13} weight={500} color="text2" align="center" style={{ width: 34 }}>
              {c.h}
            </Text>
          ))}
          <Text size={13} weight={500} color="text2" align="center" style={{ width: 38 }}>
            О
          </Text>
        </View>
        {table.map((r) => (
          <View key={r.pos} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderRadius: radius.m, backgroundColor: r.us ? colors.blue10 : 'transparent' }}>
            <Text size={15} weight={r.us ? 700 : 400} color={r.us ? 'text' : 'text2'} style={{ width: 30, paddingLeft: 8 }}>
              {r.pos}
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 4 }}>
              <Image source={r.logo} style={{ width: 18, height: 22 }} contentFit="contain" />
              <Text size={15} weight={r.us ? 700 : 400} numberOfLines={1}>
                {r.club}
              </Text>
            </View>
            {cols.map((c) => (
              <Text key={c.k} size={15} weight={r.us ? 700 : 400} align="center" style={{ width: 34 }}>
                {r[c.k]}
              </Text>
            ))}
            <Text size={15} weight={700} color={r.us ? 'blue600' : 'text'} align="center" style={{ width: 38 }}>
              {r.pts}
            </Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

function News() {
  return (
    <View style={{ gap: 12, paddingHorizontal: 20 }}>
      <SectionHeader title="Новости клуба" link="Все" onPress={() => router.navigate('/media')} inset={false} />
      <View style={{ gap: 10 }}>
        {news.map((n) => (
          <Pressable key={n.title} accessibilityRole="link" onPress={soon('Новость')} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 10, borderRadius: radius.l, backgroundColor: colors.surface, ...shadows.card }}>
            <Image source={n.img} style={{ width: 76, height: 76, borderRadius: 14 }} contentFit="cover" />
            <View style={{ flex: 1, gap: 4 }}>
              <Text size={16} weight={700} lineHeight={20}>
                {n.title}
              </Text>
              <Text size={13} color="text2">
                {n.meta}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Partners() {
  const [lead, ...rest] = sponsors;
  return (
    <View accessibilityLabel="Партнёры клуба" style={{ gap: 12, paddingHorizontal: 20 }}>
      <Text display size={24} lineHeight={28}>
        Партнёры клуба
      </Text>
      <Card style={{ height: 104, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
        <Star w={64} style={{ right: -20, top: -20 }} />
        <Image source={lead.logo} accessibilityLabel={lead.name} style={{ width: Math.min(lead.h * lead.ratio, 210), height: lead.h + 12 }} contentFit="contain" />
      </Card>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {rest.map((p) => (
          <Card key={p.name} style={{ flexBasis: '45%', flexGrow: 1, height: 88, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={p.logo} accessibilityLabel={p.name} style={{ width: '100%', height: p.h }} contentFit="contain" />
          </Card>
        ))}
      </View>
    </View>
  );
}
