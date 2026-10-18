import type { ReactNode } from 'react';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { aspect, img } from '@/data/images';
import { colors } from '@/theme';

import { Gradient } from './Gradient';
import { Star } from './Star';
import { Text } from './Text';

export type Offer = 'kit' | 'live' | 'bonus' | 'tickets';

const watermark = (text: string, color: string, side: 'left' | 'right', offset: number | `${number}%` = -6) => (
  <Text
    display
    size={88}
    lineHeight={77}
    color={color}
    align={side === 'right' ? 'right' : 'left'}
    style={{ position: 'absolute', top: -4, [side]: offset }}
    aria-hidden>
    {text}
  </Text>
);

function Chip({ label, red, dot }: { label: string; red?: boolean; dot?: boolean }) {
  return (
    <View style={{ alignSelf: 'flex-start', height: 22, paddingHorizontal: 9, borderRadius: 11, backgroundColor: red ? colors.red : colors.navy, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      {dot ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.surface }} /> : null}
      <Text size={11} lineHeight={13} weight={700} color="surface">
        {label}
      </Text>
    </View>
  );
}

/** «Для вас» offer banner, four art variants. `hero` = 230px tall for the offer page. */
export function OfferBanner({ offer, hero }: { offer: Offer; hero?: boolean }) {
  const h = hero ? 230 : 176;
  const title = hero ? 26 : 22;
  const big = hero ? 60 : 48;
  const copy = (chip: ReactNode, heading: string, dark: boolean, bottom: ReactNode, width: `${number}%` = '52%') => (
    <View style={{ position: 'absolute', left: 18, top: 16, bottom: 16, width, gap: 8 }}>
      {chip}
      <Text display size={title} lineHeight={Math.round(title * 1.08)} color={dark ? 'navy' : 'surface'}>
        {heading}
      </Text>
      <View style={{ marginTop: 'auto' }}>{bottom}</View>
    </View>
  );
  const bigText = (t: string) => (
    <Text display size={big} lineHeight={big} color="surface">
      {t}
    </Text>
  );

  let art: ReactNode;
  if (offer === 'kit') {
    art = (
      <>
        <Gradient style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        {watermark('KIT\n2026', 'rgba(255,255,255,0.1)', 'right')}
        <Star w={16} fill={colors.surface} style={{ right: '46%', top: 22 }} />
        <Star w={10} fill={colors.sky} style={{ right: 20, bottom: 28 }} />
        <Image source={img.jersey} style={{ position: 'absolute', right: -24, bottom: -22, width: h * 1.12, height: h * 1.12, transform: [{ rotate: '-6deg' }] }} />
        <Image source={img.coin} style={{ position: 'absolute', right: '44%', top: '30%', width: 34, height: 34, transform: [{ rotate: '-14deg' }] }} />
        <Image source={img.coin} style={{ position: 'absolute', right: 10, bottom: 12, width: 46, height: 46, transform: [{ rotate: '10deg' }] }} />
        {copy(<Chip label="Только для вас" />, 'Форма любимой команды', false, bigText('−15%'))}
      </>
    );
  } else if (offer === 'live') {
    const ph = h * 2.05;
    art = (
      <>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.surface }} />
        {watermark('LIVE\nLIVE', colors.star, 'left', '40%')}
        <Star w={36} h={60} fill={colors.blue} style={{ right: -18, top: '34%' }} />
        <Image source={img.teamCutout} style={{ position: 'absolute', left: '46%', top: 16, height: ph, width: ph * aspect.teamCutout }} />
        <Gradient colors={['rgba(255,255,255,0)', '#FFFFFF']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 36 }} />
        {copy(
          <Chip label="Эксклюзив" red dot />,
          'Прямой эфир с командой',
          true,
          <Text size={13} color="text2">
            Перед каждым домашним матчем
          </Text>,
          '46%',
        )}
      </>
    );
  } else if (offer === 'bonus') {
    art = (
      <>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.blue }} />
        {watermark('+500\n+500', 'rgba(255,255,255,0.12)', 'right', -8)}
        <Star w={14} fill={colors.surface} style={{ left: '52%', top: 24 }} />
        <Star w={22} fill={colors.navy} style={{ left: '46%', bottom: 26 }} />
        <Image source={img.coin} style={{ position: 'absolute', right: -6, top: h * 0.04, width: h * 0.92, height: h * 0.92, transform: [{ rotate: '8deg' }] }} />
        {copy(<Chip label="Только для вас" />, 'Бонусы и награды', false, bigText('+500'))}
      </>
    );
  } else {
    const ph = h * 1.9;
    art = (
      <>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.navy }} />
        {watermark('GATE\nOPEN', 'rgba(255,255,255,0.07)', 'right')}
        <Star w={44} h={72} fill={colors.blue} style={{ left: -22, bottom: -14 }} />
        <Star w={12} fill={colors.sky} style={{ left: '48%', top: 26 }} />
        <Image source={img.playerAstanov} style={{ position: 'absolute', right: -10, top: 14, height: ph, width: ph * aspect.playerAstanov }} />
        <Gradient colors={['rgba(23,42,81,0)', colors.navy]} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40 }} />
        {copy(
          <Chip label="Эксклюзив" red />,
          'Билеты и доступ',
          false,
          <Text size={13} color="onDark2">
            Быстрый вход и ранняя продажа
          </Text>,
        )}
      </>
    );
  }

  return (
    <View
      style={{
        height: h,
        borderRadius: 22,
        overflow: 'hidden',
        boxShadow: offer === 'live' ? '0 2px 12px rgba(23, 42, 81, 0.06)' : undefined,
      }}>
      {art}
    </View>
  );
}
