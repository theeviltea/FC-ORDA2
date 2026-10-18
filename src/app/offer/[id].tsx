import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button, Icon, NavBar, OfferBanner, Pressable, Screen, Star, Text } from '@/components';
import { img } from '@/data/images';
import { findOffer, offers, type Offer } from '@/data/offers';
import { share } from '@/data/share';
import { bodyFamily, colors, shadows } from '@/theme';

const daysLeft = (d: Date) => Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));
const dayWord = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? 'день' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'дня' : 'дней');

const card = { marginHorizontal: 20, padding: 18, gap: 14, borderRadius: 22, backgroundColor: colors.surface, overflow: 'hidden' as const, ...shadows.card };

function Promo({ a }: { a: Extract<Offer['action'], { type: 'promo' }> }) {
  const [copied, setCopied] = useState<'no' | 'yes' | 'fail'>('no');
  const copy = async () => {
    try {
      await Clipboard.setStringAsync(a.code);
      setCopied('yes');
    } catch {
      setCopied('fail');
    }
  };
  return (
    <View accessibilityLabel="Промокод" style={card}>
      <Star w={90} fill="#DCEEF8" style={{ right: -26, top: -26 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text size={14} weight={700} color="text2">
          Ваш промокод
        </Text>
        <View style={{ height: 24, paddingHorizontal: 9, borderRadius: 12, backgroundColor: colors.red, justifyContent: 'center' }}>
          <Text size={12} lineHeight={14} weight={700} color="surface">
            {a.off}
          </Text>
        </View>
      </View>
      <View style={{ height: 64, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: '#7CC6E9', backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
        <Text display size={34} lineHeight={36} color="blue600" selectable style={{ letterSpacing: 2.7 }}>
          {a.code}
        </Text>
      </View>
      {copied === 'yes' ? (
        <Pressable accessibilityRole="button" accessibilityLiveRegion="polite" onPress={copy} style={{ height: 52, borderRadius: 16, backgroundColor: colors.successBg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon name="tick-02" size={20} color="successText" weight={2.2} />
          <Text size={17} weight={700} color="successText">
            Скопировано
          </Text>
        </Pressable>
      ) : (
        <Button label="Скопировать промокод" icon="file-01" height={52} onPress={copy} />
      )}
      {copied === 'fail' ? (
        <Text size={13} color="errorText" align="center" style={{ marginTop: -6 }}>
          Не получилось скопировать — промокод можно выделить и скопировать вручную
        </Text>
      ) : null}
      <Pressable accessibilityRole="link" onPress={() => router.push(a.to)} style={{ height: 52, borderRadius: 16, backgroundColor: colors.blue10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Text size={17} weight={700} color="blue600">
          Перейти к товару
        </Text>
        <Icon name="arrow-right-01" size={20} color="blue600" weight={2} />
      </Pressable>
    </View>
  );
}

function Question() {
  const [q, setQ] = useState('');
  const [sent, setSent] = useState(false);
  const [focus, setFocus] = useState(false);
  if (sent)
    return (
      <View accessibilityLiveRegion="polite" style={[card, { backgroundColor: colors.successBg, flexDirection: 'row', alignItems: 'flex-start', gap: 12 }]}>
        <Icon name="checkmark-circle-02" size={24} color="successText" weight={1.8} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text size={16} weight={700} color="successText">
            Вопрос отправлен
          </Text>
          <Text size={14} lineHeight={20} color="text2">
            Если его выберут для эфира, пришлём уведомление.
          </Text>
        </View>
      </View>
    );
  return (
    <View style={card}>
      <Text size={14} weight={700} color="text2">
        Ваш вопрос игрокам
      </Text>
      <TextInput
        multiline
        value={q}
        onChangeText={setQ}
        maxLength={200}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="Например: какой гол сезона ваш любимый?"
        placeholderTextColor={colors.text3}
        accessibilityLabel="Ваш вопрос игрокам"
        style={[
          { height: 110, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1.5, borderColor: focus ? colors.blue : colors.line, fontFamily: bodyFamily[500], fontSize: 16, lineHeight: 22, color: colors.navy, textAlignVertical: 'top', boxShadow: focus ? '0 0 0 4px rgba(18, 158, 217, 0.16)' : undefined },
          { outlineStyle: 'none' } as object,
        ]}
      />
      <Text size={12} color="text3" align="right" style={{ marginTop: -8 }}>
        {q.length}/200
      </Text>
      <Button label="Отправить вопрос" icon="sent" height={52} disabled={!q.trim()} onPress={() => setSent(true)} />
    </View>
  );
}

function Progress({ a }: { a: Extract<Offer['action'], { type: 'progress' }> }) {
  return (
    <View style={card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Image source={img.coin} style={{ width: 44, height: 44 }} contentFit="contain" />
        <View style={{ flex: 1, gap: 2 }}>
          <Text size={14} weight={700} color="text2">
            Ваша серия
          </Text>
          <Text display size={26} lineHeight={28}>
            {a.done} из {a.of} матчей
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 6 }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: a.of, now: a.done }}>
        {Array.from({ length: a.of }, (_, k) => (
          <View key={k} style={{ flex: 1, height: 44, borderRadius: 12, backgroundColor: k < a.done ? colors.blue : colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={k < a.done ? 'tick-02' : 'ticket-01'} size={20} color={k < a.done ? 'surface' : 'blue'} weight={2} />
          </View>
        ))}
      </View>
      <Text size={14} lineHeight={20} color="text2">
        {a.next}
      </Text>
      <Button label="Купить билеты" icon="ticket-01" height={52} onPress={() => router.push('/tickets')} />
    </View>
  );
}

function Remind({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return on ? (
    <Pressable accessibilityRole="button" accessibilityLiveRegion="polite" onPress={() => setOn(false)} style={{ marginHorizontal: 20, height: 52, borderRadius: 16, backgroundColor: colors.successBg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <Icon name="tick-02" size={20} color="successText" weight={2.2} />
      <Text size={17} weight={700} color="successText">
        Напомним в день старта
      </Text>
    </Pressable>
  ) : (
    <Button label={label} icon="notification-01" height={52} style={{ marginHorizontal: 20 }} onPress={() => setOn(true)} />
  );
}

/** Предложение «Для вас»: баннер, срок, описание, действие (промокод / вопрос / серия / напоминание), условия. */
export default function OfferScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const o = findOffer(id ?? '') ?? offers[0];
  const left = o.ends ? daysLeft(o.ends) : null;
  const a = o.action;
  return (
    <Screen gap={16} header={<NavBar title={o.kind === 'sale' ? 'Акция' : o.kind === 'bonus' ? 'Бонус' : 'Эксклюзив'} action={{ icon: 'share-08', label: 'Поделиться', onPress: share(`${o.title} — ${o.sub}. Приложение ORDA`) }} />}>
      <View style={{ paddingHorizontal: 20 }}>
        <OfferBanner offer={o.id} hero />
      </View>
      <View style={{ paddingHorizontal: 20, gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          <View style={{ height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: o.urgent ? colors.errorBg : colors.blue10, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Icon name="clock-01" size={14} color={o.urgent ? 'errorText' : 'blue600'} weight={2} />
            <Text size={12} lineHeight={14} weight={700} color={o.urgent ? 'errorText' : 'blue600'}>
              {left !== null ? `Осталось ${left} ${dayWord(left)}` : o.until[0].toUpperCase() + o.until.slice(1)}
            </Text>
          </View>
          <View style={{ height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: colors.blue10, justifyContent: 'center' }}>
            <Text size={12} lineHeight={14} weight={700} color="blue600">
              {o.section}
            </Text>
          </View>
        </View>
        <Text display size={28} lineHeight={30} upper accessibilityRole="header">
          {o.title}
        </Text>
        <Text size={16} lineHeight={24} color="text2">
          {o.text}
        </Text>
      </View>

      {a.type === 'promo' ? <Promo a={a} /> : a.type === 'question' ? <Question /> : a.type === 'progress' ? <Progress a={a} /> : <Remind label={a.label} />}

      <View style={{ marginHorizontal: 20, paddingVertical: 6, paddingHorizontal: 18, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card }}>
        <Text display size={20} lineHeight={22} upper style={{ marginTop: 12, marginBottom: 4 }}>
          Условия
        </Text>
        {o.terms.map((t, i) => (
          <View key={t.title} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12, borderBottomWidth: i < o.terms.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={t.icon} size={20} color="blue600" />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text size={15} weight={700}>
                {t.title}
              </Text>
              <Text size={14} lineHeight={19} color="text2">
                {t.text}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}
