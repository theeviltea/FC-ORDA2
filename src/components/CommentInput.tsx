import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bodyFamily, colors } from '@/theme';

import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

const MAX = 1000;

/** DS CommentInput, pinned to the bottom: grey pill when empty, blue focus ring while typing, counter for long text. */
export function CommentInput({ onSend }: { onSend: (text: string) => void }) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [focus, setFocus] = useState(false);
  const [h, setH] = useState(21);
  const has = text.trim().length > 0;
  const long = text.length > 80;
  const active = focus || has;
  const send = () => {
    if (!has) return;
    onSend(text.trim());
    setText('');
    setH(21);
  };
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 12, paddingHorizontal: 16, paddingBottom: Math.max(insets.bottom, 12) + 16, backgroundColor: colors.surface, boxShadow: '0 -6px 24px rgba(23, 42, 81, 0.08)' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: long ? 'flex-end' : 'center',
          gap: 8,
          minHeight: 52,
          paddingVertical: 4,
          paddingRight: 4,
          paddingLeft: 16,
          borderRadius: long ? 22 : 26,
          backgroundColor: active ? colors.surface : colors.bg,
          borderWidth: 1.5,
          borderColor: active ? colors.blue : colors.line,
          boxShadow: active ? '0 0 0 4px rgba(18, 158, 217, 0.15)' : undefined,
        }}>
        <View style={{ flex: 1, minWidth: 0, paddingVertical: long ? 6 : 0, gap: 6 }}>
          <TextInput
            value={text}
            onChangeText={(t) => setText(t.slice(0, MAX))}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder="Написать комментарий…"
            placeholderTextColor={colors.text3}
            accessibilityLabel="Комментарий"
            multiline
            numberOfLines={1}
            onContentSizeChange={(e) => setH(Math.min(105, Math.max(21, e.nativeEvent.contentSize.height)))}
            style={[{ height: text ? h : 21, marginVertical: long ? 0 : 10, fontFamily: bodyFamily[400], fontSize: 16, lineHeight: 21, color: colors.navy}, { outlineStyle: 'none' } as object]}
          />
          {long ? (
            <Text size={12} color="text2">
              {text.length} / {MAX}
            </Text>
          ) : null}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Отправить" disabled={!has} onPress={send} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: has ? colors.blue600 : colors.line, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ transform: [{ translateX: -1 }, { translateY: 1 }] }}>
            <Icon name="sent" size={20} color={has ? 'surface' : 'text3'} weight={1.8} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
