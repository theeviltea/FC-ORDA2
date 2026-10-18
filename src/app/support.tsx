import { useState } from 'react';
import { Linking, TextInput, View } from 'react-native';

import { Button, Icon, NavBar, Pressable, Screen, SectionHeader, Star, Text, TextField, type IconName } from '@/components';
import { usePrefs } from '@/data/prefs';
import { bodyFamily, colors, radius, shadows } from '@/theme';

const faq = [
  ['Как вернуть билет?', 'Билет можно вернуть не позднее чем за 24 часа до матча: «Мои билеты» → билет → «Вернуть». Деньги придут на карту в течение 3 рабочих дней.'],
  ['Где мой заказ из магазина?', 'Статус заказа видно в «Истории покупок». Курьер позвонит за час до доставки.'],
  ['Как получить баллы?', 'Баллы начисляются за посещение матчей, покупки в магазине, квизы и прогнозы.'],
];

const contacts: { icon: IconName; title: string; sub: string; url: string }[] = [
  { icon: 'mail-01', title: 'Написать', sub: 'support@fanclub.kz', url: 'mailto:support@fanclub.kz' },
  { icon: 'call-02', title: 'Позвонить', sub: '+7 727 355 00 55', url: 'tel:+77273550055' },
];

/** Центр поддержки: контакты, частые вопросы (аккордеон), форма обращения. */
export default function Support() {
  const { personal } = usePrefs();
  const [open, setOpen] = useState(0);
  const [email, setEmail] = useState(personal.email);
  const [topic, setTopic] = useState('');
  const [msg, setMsg] = useState('');
  const [focus, setFocus] = useState(false);
  const [sent, setSent] = useState(false);
  const [tried, setTried] = useState(false);
  const empty = !msg.trim();

  return (
    <Screen
      gap={14}
      header={<NavBar title="Центр поддержки" />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 560, right: -20 }} />
        </View>
      }>
      <View style={{ marginHorizontal: 20, marginTop: 4, gap: 6 }}>
        <Text display size={28} lineHeight={31} accessibilityRole="header">
          Чем можем помочь?
        </Text>
        <Text size={15} lineHeight={21} color="text2">
          Отвечаем ежедневно с 9:00 до 21:00, обычно в течение часа.
        </Text>
      </View>
      <View style={{ marginHorizontal: 20, flexDirection: 'row', gap: 10 }}>
        {contacts.map((c) => (
          <Pressable key={c.title} accessibilityRole="link" accessibilityLabel={`${c.title}: ${c.sub}`} onPress={() => Linking.openURL(c.url).catch(() => undefined)} style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.l, backgroundColor: colors.surface, ...shadows.card }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={c.icon} size={22} color="blue" weight={1.6} />
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Text size={15} weight={700}>
                {c.title}
              </Text>
              <Text size={12} color="text2" numberOfLines={1}>
                {c.sub}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: 8 }}>
        <SectionHeader title="Частые вопросы" />
      </View>
      <View style={{ marginHorizontal: 20, paddingHorizontal: 16, borderRadius: radius.l, backgroundColor: colors.surface, ...shadows.card }}>
        {faq.map(([q, a], i) => {
          const on = i === open;
          return (
            <View key={q} style={{ borderBottomWidth: i < faq.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken }}>
              <Pressable accessibilityRole="button" accessibilityState={{ expanded: on }} onPress={() => setOpen(on ? -1 : i)} style={{ minHeight: 56, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <Text size={15} weight={700} style={{ flex: 1 }}>
                  {q}
                </Text>
                <Icon name={on ? 'arrow-up-01' : 'arrow-down-01'} size={20} color="text2" weight={1.8} />
              </Pressable>
              {on ? (
                <Text size={14} lineHeight={20} color="text2" style={{ marginBottom: 14 }}>
                  {a}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>

      <View style={{ marginTop: 8 }}>
        <SectionHeader title="Написать обращение" />
      </View>
      {sent ? (
        <View style={{ marginHorizontal: 20, padding: 18, borderRadius: radius.l, backgroundColor: colors.successBg, flexDirection: 'row', gap: 12, alignItems: 'flex-start' }} accessibilityLiveRegion="polite">
          <Icon name="checkmark-circle-02" size={24} color="successText" weight={1.8} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text size={16} weight={700} color="successText">
              Обращение отправлено
            </Text>
            <Text size={14} lineHeight={20} color="text2">
              Ответим на {email} в течение часа. Номер обращения — № 3107.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setSent(false);
                setTried(false);
                setTopic('');
                setMsg('');
              }}
              style={{ marginTop: 6, minHeight: 36, justifyContent: 'center' }}>
              <Text size={14} weight={700} color="blue600">
                Написать ещё
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={{ marginHorizontal: 20, gap: 16 }}>
          <TextField label="Ваш email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <TextField label="Тема" value={topic} onChangeText={setTopic} placeholder="Например, вопрос по билету" />
          <View style={{ gap: 6 }}>
            <Text size={13} weight={500} color={tried && empty ? 'errorText' : 'text2'}>
              Сообщение
            </Text>
            <TextInput
              multiline
              value={msg}
              onChangeText={setMsg}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              placeholder="Опишите вопрос подробнее. Если речь о заказе — укажите его номер"
              placeholderTextColor={colors.text3}
              accessibilityLabel="Сообщение"
              style={[
                { height: 120, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1.5, borderColor: tried && empty ? colors.red : focus ? colors.blue : colors.line, backgroundColor: colors.surface, fontFamily: bodyFamily[500], fontSize: 16, lineHeight: 22, color: colors.navy, textAlignVertical: 'top', boxShadow: focus ? '0 0 0 4px rgba(18, 158, 217, 0.16)' : undefined },
                { outlineStyle: 'none' } as object,
              ]}
            />
            {tried && empty ? (
              <Text size={13} color="errorText">
                Напишите, с чем помочь
              </Text>
            ) : null}
          </View>
          <Button
            label="Отправить"
            icon="sent"
            height={52}
            onPress={() => {
              setTried(true);
              if (!empty) setSent(true);
            }}
          />
          <Text size={12} lineHeight={17} color="text2" align="center">
            Нажимая «Отправить», вы соглашаетесь на обработку данных для ответа на обращение.
          </Text>
        </View>
      )}
    </Screen>
  );
}
