import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Button, Gradient, Icon, NavBar, Pressable, Screen, Star, Text } from '@/components';
import { contests, findContest, useEntries } from '@/data/contests';
import { share } from '@/data/share';
import { useCountdown } from '@/hooks/useCountdown';
import { colors, shadows } from '@/theme';

const plural = (n: number, f: [string, string, string]) => (n % 10 === 1 && n % 100 !== 11 ? f[0] : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? f[1] : f[2]);

function H2({ children }: { children: string }) {
  return (
    <Text display size={22} lineHeight={24} upper style={{ marginHorizontal: 20, marginTop: 6, marginBottom: -4 }}>
      {children}
    </Text>
  );
}

/** Конкурс: шапка со статусом, обратный отсчёт, главный приз, шаги участия, итоги, «Участвовать». */
export default function ContestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = findContest(id ?? '') ?? contests[0];
  const entry = useEntries()[c.id];
  const cd = useCountdown(c.deadline ?? new Date());
  const days = Number(cd[0].v);
  const hours = Number(cd[1].v);
  const cells = [
    { v: cd[0].v, l: plural(days, ['день', 'дня', 'дней']) },
    { v: cd[1].v, l: plural(hours, ['час', 'часа', 'часов']) },
    { v: String(c.participants), l: plural(c.participants, ['участник', 'участника', 'участников']) },
  ];
  const closed = days === 0 && hours === 0 && cd[2].v === '00';

  return (
    <Screen gap={14} header={<NavBar title="Конкурс" action={{ icon: 'share-08', label: 'Поделиться', onPress: share(`Конкурс ORDA: ${c.title}`) }} />}>
      <Gradient style={{ marginHorizontal: 20, padding: 18, gap: 10, borderRadius: 24, overflow: 'hidden' }}>
        <Text display size={96} lineHeight={83} align="right" color="rgba(255,255,255,0.08)" style={{ position: 'absolute', right: -8, top: -10 }} aria-hidden>
          {c.watermark}
        </Text>
        <Star w={14} fill={colors.sky} style={{ left: '62%', top: 22 }} />
        <View style={{ alignSelf: 'flex-start', height: 26, paddingHorizontal: 11, borderRadius: 13, backgroundColor: entry ? colors.successText : colors.red, justifyContent: 'center' }}>
          <Text size={12} lineHeight={14} weight={700} color="surface">
            {entry ? 'Ты участвуешь' : closed ? 'Приём заявок закрыт' : 'Приём заявок открыт'}
          </Text>
        </View>
        <Text display size={30} lineHeight={31} upper color="surface" accessibilityRole="header" style={{ maxWidth: 300 }}>
          {c.title}
        </Text>
        <Text size={14} color="onDark2">
          {c.kind} · {c.participants} {plural(c.participants, ['участник', 'участника', 'участников'])} · до {c.deadlineText}
        </Text>
      </Gradient>

      <View style={{ marginHorizontal: 20, flexDirection: 'row', gap: 8 }} accessibilityLabel={`До конца приёма заявок ${cells[0].v} ${cells[0].l} ${cells[1].v} ${cells[1].l}`}>
        {cells.map((x) => (
          <View key={x.l} style={{ flex: 1, height: 64, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', gap: 2, ...shadows.card }}>
            <Text display size={24} lineHeight={24} color="blue600">
              {x.v}
            </Text>
            <Text size={12} color="text2">
              {x.l}
            </Text>
          </View>
        ))}
      </View>

      <H2>Главный приз</H2>
      <View style={{ marginHorizontal: 20, borderRadius: 22, backgroundColor: colors.surface, overflow: 'hidden', ...shadows.card }}>
        <View style={{ height: 200, backgroundColor: colors.blue10, overflow: 'hidden' }}>
          <Star w={110} fill="#DCEEF8" style={{ right: -24, top: -24 }} />
          <Star w={46} fill="#DCEEF8" style={{ left: 18, bottom: 16 }} />
          <Image source={c.prize.photo} accessibilityLabel={c.prize.title} style={{ position: 'absolute', left: 0, right: 0, top: 12, height: 176, transform: [{ rotate: '-4deg' }] }} contentFit={c.thumb.cover ? 'cover' : 'contain'} />
          <View style={{ position: 'absolute', left: 12, top: 12, height: 24, paddingHorizontal: 10, borderRadius: 12, backgroundColor: colors.navy, justifyContent: 'center' }}>
            <Text size={12} lineHeight={14} weight={700} color="surface">
              {c.prize.winners} {plural(c.prize.winners, ['победитель', 'победителя', 'победителей'])}
            </Text>
          </View>
        </View>
        <View style={{ paddingTop: 14, paddingHorizontal: 16, paddingBottom: 16, gap: 4 }}>
          <Text size={17} weight={700}>
            {c.prize.title}
          </Text>
          <Text size={14} color="text2">
            {c.prize.sub}
          </Text>
        </View>
      </View>

      <H2>Как участвовать</H2>
      <View style={{ marginHorizontal: 20, paddingVertical: 4, paddingHorizontal: 16, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card }}>
        {c.steps.map((s, i) => (
          <View key={s.t} style={{ flexDirection: 'row', gap: 14, paddingVertical: 14, borderBottomWidth: i < c.steps.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' }}>
              <Text display size={18} lineHeight={20} color="surface">
                {String(i + 1)}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text size={16} weight={700}>
                {s.t}
              </Text>
              <Text size={14} lineHeight={20} color="text2">
                {s.d}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ marginHorizontal: 20, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.blue10, flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
        <Icon name="notification-01" size={20} color="blue600" />
        <Text size={14} lineHeight={20} color="blue600" style={{ flex: 1 }}>
          Итоги — {c.resultsText} в приложении. Победителю пришлём уведомление и расскажем, как забрать приз.
        </Text>
      </View>
      <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/soon', params: { title: 'Правила конкурса' } })} style={{ marginHorizontal: 20, alignSelf: 'flex-start', minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="file-01" size={18} color="blue600" />
        <Text size={15} weight={600} color="blue600">
          Полные правила конкурса
        </Text>
      </Pressable>
      {entry ? (
        <Button label="Моя заявка" variant="soft" height={52} style={{ marginHorizontal: 20 }} onPress={() => router.push({ pathname: '/contest/apply', params: { id: c.id } })} />
      ) : (
        <Button label="Участвовать" height={52} disabled={closed} style={{ marginHorizontal: 20 }} onPress={() => router.push({ pathname: '/contest/apply', params: { id: c.id } })} />
      )}
      <Text size={13} color="text2" align="center" style={{ marginTop: -4 }}>
        Участие бесплатное · одна заявка от болельщика
      </Text>
    </Screen>
  );
}
