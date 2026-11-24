import { useState, type ReactNode } from 'react';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Pressable, type IconName } from '@/components';
import { bodyFamily, colors } from '@/theme';

type Props = {
  placeholder: string;
  onSend: (text: string) => void;
  /** Left round button (+ attach, avatar…). */
  left?: ReactNode;
  /** Above the field: «Ответ для …». */
  top?: ReactNode;
  /** Shown instead of send when the field is empty (mic). */
  idleIcon?: IconName;
  /** Answer in progress: a stop button instead of send. */
  busy?: boolean;
  onStop?: () => void;
  footnote?: ReactNode;
  initial?: string;
};

/** Поле ввода внизу экрана для чатов, ИИ-помощника и ответов на форуме. */
export function Composer({ placeholder, onSend, left, top, idleIcon, busy, onStop, footnote, initial = '' }: Props) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState(initial);
  const [focus, setFocus] = useState(false);
  const has = text.trim().length > 0;
  const active = focus || has;
  const send = () => {
    if (!has || busy) return;
    onSend(text.trim());
    setText('');
  };
  return (
    <View style={{ paddingTop: 10, paddingHorizontal: 12, paddingBottom: Math.max(insets.bottom, 10) + 12, backgroundColor: 'rgba(255,255,255,0.96)', borderTopWidth: 1, borderColor: colors.surfaceSunken, gap: 8 }}>
      {top}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
        {left}
        <View
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 52,
            paddingVertical: 4,
            paddingRight: 4,
            paddingLeft: 16,
            borderRadius: 26,
            backgroundColor: active ? colors.surface : colors.bg,
            borderWidth: active ? 1.5 : 1,
            borderColor: active ? colors.blue : colors.line,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}>
          <TextInput
            value={text}
            onChangeText={(t) => setText(t.slice(0, 3000))}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder={placeholder}
            placeholderTextColor={colors.text3}
            accessibilityLabel={placeholder}
            multiline
            onSubmitEditing={send}
            style={[{ flex: 1, maxHeight: 110, paddingVertical: 10, fontFamily: bodyFamily[400], fontSize: 16, lineHeight: 21, color: colors.navy }, { outlineStyle: 'none' } as object]}
          />
          {busy ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Остановить ответ" onPress={onStop} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: colors.surface }} />
            </Pressable>
          ) : has || !idleIcon ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Отправить" disabled={!has} onPress={send} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: has ? colors.blue600 : colors.line, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="sent" size={20} color={has ? 'surface' : 'text3'} weight={1.8} />
            </Pressable>
          ) : (
            <Pressable accessibilityRole="button" accessibilityLabel="Голосовое сообщение" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={idleIcon} size={20} color="surface" weight={1.8} />
            </Pressable>
          )}
        </View>
      </View>
      {footnote}
    </View>
  );
}

/** Три прыгающие точки «печатает». */
export function TypingDots({ color = colors.text3 }: { color?: string }) {
  return (
    <View accessibilityLabel="Печатает" style={{ flexDirection: 'row', gap: 5 }}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, opacity: 0.4 + i * 0.25 }} />
      ))}
    </View>
  );
}
