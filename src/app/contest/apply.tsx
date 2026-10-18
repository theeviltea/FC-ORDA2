import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Checkbox, Icon, NavBar, Pressable, Screen, Star, Text } from '@/components';
import { contests, findContest, submitEntry, useEntries } from '@/data/contests';
import { colors, shadows } from '@/theme';

/** Участие в конкурсе: одно фото (галерея), согласие с правилами, «Отправить заявку». С уже отправленной заявкой — просмотр. */
export default function ContestApply() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = findContest(id ?? '') ?? contests[0];
  const entry = useEntries()[c.id];
  const [photo, setPhoto] = useState<string | number | null>(null);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const shown = entry?.photo ?? photo;
  const ready = !!photo && agree;

  const pick = async () => {
    setError('');
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsMultipleSelection: false });
    if (r.canceled || !r.assets?.[0]) return;
    const a = r.assets[0];
    if (a.fileSize && a.fileSize > 10 * 1024 * 1024) {
      setError('Файл больше 10 МБ — выберите другой снимок');
      return;
    }
    setPhoto(a.uri);
  };

  const hint = ready ? 'Всё готово — отправляй заявку' : photo ? 'Фото загружено. Прими правила конкурса, чтобы отправить заявку' : 'Добавь фото и прими правила конкурса';

  return (
    <Screen gap={14} header={<NavBar title={entry ? 'Моя заявка' : 'Участие в конкурсе'} />}>
      <View style={{ marginHorizontal: 20, padding: 16, gap: 4, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card }}>
        <Text size={19} lineHeight={23} weight={700}>
          {c.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="clock-01" size={15} color="text2" />
          <Text size={13} color="text2">
            {entry ? `Заявка № ${entry.number} · итоги ${c.resultsText}` : `Приём фото до ${c.deadlineText}, 23:59`}
          </Text>
        </View>
      </View>

      <Text display size={22} lineHeight={24} upper style={{ marginHorizontal: 20, marginTop: 6, marginBottom: -4 }}>
        Твоё фото с матча
      </Text>
      <View style={{ marginHorizontal: 20, padding: 12, gap: 12, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card }}>
        {shown ? (
          <View style={{ height: 230, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.navy }}>
            <Image source={shown} accessibilityLabel="Загруженное фото с матча" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" contentPosition={{ top: '30%' }} />
            <View style={{ position: 'absolute', left: 10, top: 10, height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Icon name={entry ? 'clock-01' : 'checkmark-circle-02'} size={15} color={entry ? 'blue600' : 'successText'} weight={2} />
              <Text size={12} lineHeight={14} weight={700} color={entry ? 'blue600' : 'successText'}>
                {entry ? 'На модерации' : 'Фото загружено'}
              </Text>
            </View>
            {!entry ? (
              <View style={{ position: 'absolute', right: 10, top: 10, flexDirection: 'row', gap: 6 }}>
                <Pressable accessibilityRole="button" accessibilityLabel="Заменить фото" onPress={pick} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="image-02" size={20} />
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="Удалить фото" onPress={() => setPhoto(null)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="cancel-01" size={20} color="errorText" />
                </Pressable>
              </View>
            ) : null}
          </View>
        ) : (
          <Pressable accessibilityRole="button" accessibilityLabel="Выбрать фото" onPress={pick} style={{ height: 230, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: error ? colors.red : '#7CC6E9', backgroundColor: '#F5FAFD', alignItems: 'center', justifyContent: 'center', gap: 10, overflow: 'hidden' }}>
            <Star w={70} fill="#DCEEF8" style={{ right: -18, top: -18 }} />
            <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="image-01" size={30} color="blue600" />
            </View>
            <Text size={16} weight={700}>
              Добавь один свой снимок
            </Text>
            <Text size={13} color={error ? 'errorText' : 'text2'}>
              {error || 'JPG или PNG, до 10 МБ'}
            </Text>
            <View style={{ marginTop: 4, height: 44, paddingHorizontal: 22, borderRadius: 14, borderWidth: 1.5, borderColor: colors.blue600, justifyContent: 'center' }}>
              <Text size={16} weight={700} color="blue600">
                Выбрать фото
              </Text>
            </View>
          </Pressable>
        )}
        <View style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.blue10, flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
          <Icon name={entry ? 'information-circle' : 'star-award-01'} size={18} color="blue600" />
          <Text size={13} lineHeight={18} color="blue600" style={{ flex: 1 }}>
            {entry ? 'Модерация занимает до суток. Заявку нельзя изменить после отправки — одна заявка от болельщика.' : 'Покажи, как ты поддерживаешь «Ордабасы» на стадионе. Лица других людей лучше не снимать крупно.'}
          </Text>
        </View>
      </View>

      {entry ? (
        <Button label="Все конкурсы" variant="soft" height={52} style={{ marginHorizontal: 20, marginTop: 8 }} onPress={() => router.dismissTo('/contests')} />
      ) : (
        <>
          <View style={{ marginHorizontal: 20, paddingVertical: 4, paddingHorizontal: 16, borderRadius: 22, backgroundColor: colors.surface, ...shadows.card }}>
            <Checkbox checked={agree} onChange={setAgree} label="Я согласен с правилами конкурса и публикацией фото" />
          </View>
          <Button
            label="Отправить заявку"
            height={52}
            disabled={!ready}
            style={{ marginHorizontal: 20, marginTop: 8 }}
            onPress={() => {
              submitEntry(c.id, photo!);
              router.replace({ pathname: '/contest/sent', params: { id: c.id } });
            }}
          />
          <Text size={13} lineHeight={18} color="text2" align="center" style={{ marginTop: -4, marginHorizontal: 20 }} accessibilityLiveRegion="polite">
            {hint}
          </Text>
        </>
      )}
    </Screen>
  );
}
