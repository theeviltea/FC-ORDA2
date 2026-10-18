import { View } from 'react-native';

import { NavBar, Pressable, Screen, Star, Text } from '@/components';
import { languages, setPrefs, usePrefs } from '@/data/prefs';
import { colors, radius, shadows } from '@/theme';

/** Язык приложения: радиогруппа из трёх языков, выбор сразу сохраняется. */
export default function Language() {
  const { lang } = usePrefs();
  return (
    <Screen
      gap={12}
      header={<NavBar title="Язык приложения" />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 500, right: -20 }} />
        </View>
      }>
      <Text size={15} lineHeight={21} color="text2" style={{ marginHorizontal: 20, marginTop: 4 }}>
        Интерфейс, уведомления и новости будут на выбранном языке.
      </Text>
      <View accessibilityRole="radiogroup" accessibilityLabel="Язык приложения" style={{ marginHorizontal: 20, marginTop: 4, paddingHorizontal: 16, borderRadius: radius.l, backgroundColor: colors.surface, ...shadows.card }}>
        {languages.map((l, i) => {
          const on = l.id === lang;
          return (
            <Pressable
              key={l.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={l.name}
              onPress={() => setPrefs({ lang: l.id })}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64, paddingVertical: 10, borderBottomWidth: i < languages.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken }}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text size={16} weight={700}>
                  {l.name}
                </Text>
                <Text size={13} color="text2">
                  {l.sub}
                </Text>
              </View>
              <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: on ? 7 : 2, borderColor: on ? colors.blue600 : '#C9D3E3', backgroundColor: colors.surface }} />
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
