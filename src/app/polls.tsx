import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Icon, IntroBanner, NavBar, Pressable, Screen, Text } from '@/components';
import { img } from '@/data/images';
import { people, type PersonKey } from '@/data/people';
import { colors, shadows } from '@/theme';

const motm: { num: string; name: string; who: PersonKey; pct: number }[] = [
  { num: '10', name: 'Эльхан Астанов', who: 'astanov', pct: 46 },
  { num: '9', name: 'Эвертон Мораес', who: 'moraes', pct: 27 },
  { num: '1', name: 'Бекхан Шайзада', who: 'shaizada', pct: 15 },
  { num: '22', name: 'Султанбек Астанов', who: 'sAstanov', pct: 12 },
];
const kits = [
  { t: 'Домашняя синяя', pct: 58 },
  { t: 'Выездная белая', pct: 29 },
  { t: 'Ретро-форма 2000-х', pct: 13 },
];
const goals = [
  { t: 'Мораес, 2-й гол в ворота «Тобыла»', pct: 41, win: true },
  { t: 'Астанов, штрафной с «Елимаем»', pct: 36 },
  { t: 'Натель, удар с лёта', pct: 23 },
];

const card = { marginHorizontal: 20, padding: 16, gap: 12, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card };

function Pill({ text, bg, fg, icon }: { text: string; bg: string; fg: 'errorText' | 'blue600' | 'text2'; icon?: 'clock-01' | 'champion' }) {
  return (
    <View style={{ alignSelf: 'flex-start', height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: bg, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      {icon ? <Icon name={icon} size={15} color={fg} weight={2} /> : null}
      <Text size={12} lineHeight={14} weight={700} color={fg}>
        {text}
      </Text>
    </View>
  );
}

function H2({ children }: { children: string }) {
  return (
    <Text display size={24} lineHeight={28} style={{ marginHorizontal: 20, marginTop: 8, marginBottom: -4 }}>
      {children}
    </Text>
  );
}

function Voted({ text }: { text: string }) {
  return (
    <View accessibilityLiveRegion="polite" style={{ paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.successBg, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Icon name="checkmark-circle-02" size={18} color="successText" weight={2} />
      <Text size={14} weight={700} color="successText" style={{ flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

/** Опросы: игрок матча (карточки игроков), активный опрос, завершённый с итогами. Голос — +10 баллов. */
export default function Polls() {
  const [pick, setPick] = useState<number | null>(null);
  const [voted, setVoted] = useState(false);
  const [kit, setKit] = useState<number | null>(null);
  const [kitVoted, setKitVoted] = useState(false);

  return (
    <Screen gap={16} header={<NavBar title="Опросы" />}>
      <IntroBanner title="Голос болельщика" sub="Отвечайте на опросы клуба — за каждый голос +10 баллов." icon={img.icon3dPoll} />

      <H2>Игрок матча</H2>
      <View style={card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pill text="Голосование до 23:59" bg={colors.errorBg} fg="errorText" icon="clock-01" />
          <View style={{ flex: 1 }} />
          <Image source={img.crest} style={{ width: 18, height: 22 }} contentFit="contain" />
          <Text size={13} weight={700} color="text2">
            3 : 1 Елимай
          </Text>
        </View>
        <Text size={19} lineHeight={23} weight={700}>
          Кто лучший игрок матча с «Елимаем»?
        </Text>
        <View accessibilityRole="radiogroup" accessibilityLabel="Игрок матча" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {motm.map((p, i) => {
            const on = pick === i;
            const ph = people[p.who];
            const h = 210;
            const w = h * ph.ratio;
            return (
              <Pressable key={p.num} accessibilityRole="radio" accessibilityState={{ checked: on, disabled: voted }} accessibilityLabel={`${p.name}${voted ? `, ${p.pct}%` : ''}`} disabled={voted} onPress={() => setPick(i)} style={{ width: '48.4%', height: 176, borderRadius: 18, overflow: 'hidden', backgroundColor: colors.bg, borderWidth: 2, borderColor: on ? colors.blue : 'transparent' }}>
                <Text display size={44} lineHeight={46} color="#DCEEF8" style={{ position: 'absolute', left: 10, top: 4 }} aria-hidden>
                  {p.num}
                </Text>
                <View style={{ position: 'absolute', left: 0, right: 0, top: 14, alignItems: 'center' }}>
                  <Image source={ph.src} style={{ width: w, height: h, transform: [{ translateX: (0.5 - ph.cx) * w }] }} contentFit="contain" />
                </View>
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 84, backgroundColor: 'rgba(242,246,250,0.92)' }} />
                {on ? (
                  <View style={{ position: 'absolute', right: 8, top: 8, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.blue600, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="tick-02" size={15} color="surface" weight={2.6} />
                  </View>
                ) : null}
                <View style={{ position: 'absolute', left: 10, right: 10, bottom: 8, gap: 4 }}>
                  <Text size={14} lineHeight={17} weight={700}>
                    {p.name}
                  </Text>
                  {voted ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.line, overflow: 'hidden' }}>
                        <View style={{ width: `${p.pct}%`, height: 6, borderRadius: 3, backgroundColor: on ? colors.blue : '#B8E2F4' }} />
                      </View>
                      <Text size={13} weight={700}>
                        {p.pct}%
                      </Text>
                    </View>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
        {voted ? <Voted text="Голос принят · +10 баллов · 1 284 голоса" /> : <Button label="Голосовать" height={52} disabled={pick === null} onPress={() => setVoted(true)} />}
      </View>

      <H2>Активные</H2>
      <View style={card}>
        <Pill text="Клуб · до 24 октября" bg={colors.blue10} fg="blue600" />
        <Text size={19} lineHeight={23} weight={700}>
          В какой форме играть дома с «Кайратом»?
        </Text>
        <View accessibilityRole="radiogroup" style={{ gap: 8 }}>
          {kits.map((k, i) => {
            const on = kit === i;
            return (
              <Pressable key={k.t} accessibilityRole="radio" accessibilityState={{ checked: on, disabled: kitVoted }} disabled={kitVoted} onPress={() => setKit(i)} style={{ minHeight: 52, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.bg, borderWidth: 2, borderColor: on && !kitVoted ? colors.blue : 'transparent', flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14 }}>
                {kitVoted ? <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${k.pct}%`, backgroundColor: on ? '#B8E2F4' : '#DCEEF8' }} /> : null}
                {!kitVoted ? (
                  <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: on ? colors.blue : '#8391AD', alignItems: 'center', justifyContent: 'center' }}>{on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue }} /> : null}</View>
                ) : null}
                <Text size={16} weight={on ? 700 : 500} style={{ flex: 1 }}>
                  {k.t}
                </Text>
                {kitVoted ? (
                  <Text size={15} weight={700}>
                    {k.pct}%
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
        {kitVoted ? (
          <Text size={13} color="text2">
            Ваш голос учтён · 3 906 голосов
          </Text>
        ) : (
          <Button label="Голосовать" height={52} disabled={kit === null} onPress={() => setKitVoted(true)} />
        )}
      </View>

      <H2>Завершённые</H2>
      <View style={[card, { gap: 14 }]}>
        <Pill text="Опрос завершён" bg={colors.surfaceSunken} fg="text2" icon="champion" />
        <Text size={19} lineHeight={23} weight={700}>
          Лучший гол сентября
        </Text>
        {goals.map((g) => (
          <View key={g.t} style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                {g.win ? <Icon name="champion" size={16} color="blue" weight={1.8} /> : null}
                <Text size={15} weight={g.win ? 700 : 500} style={{ flex: 1 }}>
                  {g.t}
                </Text>
              </View>
              <Text size={15} weight={700}>
                {g.pct}%
              </Text>
            </View>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.blue10, overflow: 'hidden' }}>
              <View style={{ width: `${g.pct}%`, height: 8, borderRadius: 4, backgroundColor: g.win ? colors.blue : '#B8E2F4' }} />
            </View>
          </View>
        ))}
        <Text size={13} color="text2">
          2 418 голосов · итоги 1 октября
        </Text>
      </View>
    </Screen>
  );
}
