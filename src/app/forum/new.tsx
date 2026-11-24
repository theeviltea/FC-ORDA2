import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, GameSheet, Icon, NavBar, Pressable, Screen, SectionHeader, Text } from '@/components';
import { img } from '@/data/images';
import { addThread, forumCats } from '@/data/social';
import { bodyFamily, colors } from '@/theme';

function Field({ label, value, onChange, placeholder, max, tall }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; max: number; tall?: boolean }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ marginHorizontal: 20, gap: 6 }}>
      <Text size={14} weight={700}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={(t) => onChange(t.slice(0, max))}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.text3}
        accessibilityLabel={label}
        multiline
        style={[{ minHeight: tall ? 140 : 52, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: focus ? colors.blue : colors.line, fontFamily: bodyFamily[400], fontSize: 16, lineHeight: 23, color: colors.navy, textAlignVertical: 'top' }, { outlineStyle: 'none' } as object]}
      />
      <Text size={12} color="text3" style={{ alignSelf: 'flex-end' }}>
        {value.length} / {max}
      </Text>
    </View>
  );
}

/** Новая тема на форуме: раздел, заголовок, текст и фото → на проверку модератору. */
export default function NewTopic() {
  const { cat: initial } = useLocalSearchParams<{ cat?: string }>();
  const insets = useSafeAreaInsets();
  const [cat, setCat] = useState<string | null>(initial ?? null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const ready = !!cat && title.trim().length >= 5;
  const publish = () => {
    if (!ready || !cat) return;
    setSent(addThread(cat, title.trim(), text.trim()));
  };
  return (
    <View style={{ flex: 1 }}>
      <Screen gap={14} header={<NavBar title="Новая тема" />} footerHeight={110}>
        <SectionHeader title="Раздел" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20 }}>
          {forumCats.map((c) => {
            const on = cat === c.id;
            return (
              <Pressable key={c.id} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => setCat(c.id)} style={{ height: 40, paddingHorizontal: 12, borderRadius: 20, borderWidth: on ? 0 : 1.5, borderColor: colors.line, backgroundColor: on ? colors.navy : colors.surface, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name={c.icon} size={16} color={on ? 'surface' : c.fg} />
                <Text size={14} weight={on ? 700 : 500} color={on ? 'surface' : 'text'}>
                  {c.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Field label="Заголовок" value={title} onChange={setTitle} placeholder="О чём хотите поговорить?" max={120} />
        <Field label="Текст" value={text} onChange={setText} placeholder="Расскажите подробнее: факты, ссылки, ваше мнение" max={3000} tall />
        <Text size={14} weight={700} style={{ marginHorizontal: 20 }}>
          Фото{' '}
          <Text size={14} color="text3">
            · до 5 штук
          </Text>
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20 }}>
          {photo ? (
            <View style={{ width: 84, height: 84, borderRadius: 16, overflow: 'hidden' }}>
              <Image source={img.newsHuddle} style={{ width: 84, height: 84 }} contentFit="cover" />
              <Pressable accessibilityRole="button" accessibilityLabel="Убрать фото" onPress={() => setPhoto(false)} style={{ position: 'absolute', right: 4, top: 4, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(10,20,40,0.6)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="cancel-01" size={14} color="surface" weight={2.2} />
              </Pressable>
            </View>
          ) : null}
          <Pressable accessibilityRole="button" onPress={() => setPhoto(true)} style={{ width: 84, height: 84, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#B8C6DA', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Icon name="image-01" size={22} color="blue600" />
            <Text size={13} weight={700} color="blue600">
              {photo ? 'Ещё' : 'Фото'}
            </Text>
          </Pressable>
        </View>
        <View style={{ marginHorizontal: 20, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.blue10, flexDirection: 'row', gap: 10 }}>
          <Icon name="information-circle" size={20} color="blue" />
          <Text size={13} lineHeight={18} color="#33415F" style={{ flex: 1 }}>
            Тему проверит модератор — обычно до 15 минут. Без оскорблений, ставок и рекламы.
          </Text>
        </View>
      </Screen>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 12, paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 12) + 18, backgroundColor: 'rgba(255,255,255,0.96)', gap: 8, boxShadow: '0 -6px 24px rgba(23, 42, 81, 0.08)' }}>
        <Button label="Опубликовать" icon="sent" height={54} disabled={!ready} onPress={publish} />
        {ready ? null : (
          <Text size={12} color="text2" align="center">
            Выберите раздел и напишите заголовок
          </Text>
        )}
      </View>
      <GameSheet visible={!!sent} onClose={() => router.replace('/forum')} icon="checkmark-circle-02" title="Тема на проверке" text="Обычно это занимает до 15 минут. Пришлём уведомление, когда тему опубликуют.">
        <View style={{ alignSelf: 'center', height: 36, paddingHorizontal: 14, borderRadius: 18, backgroundColor: colors.blue10, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Image source={img.coin} style={{ width: 20, height: 20 }} />
          <Text size={14} weight={700} color="blue600">
            +10 баллов за первую тему
          </Text>
        </View>
        <Button label="К форуму" height={54} onPress={() => router.replace('/forum')} />
        <Button label="Открыть мою тему" variant="soft" height={48} onPress={() => sent && router.replace({ pathname: '/forum/thread/[id]', params: { id: sent } })} />
      </GameSheet>
    </View>
  );
}
