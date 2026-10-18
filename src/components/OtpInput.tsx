import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import { colors } from '@/theme';

import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

type State = 'typing' | 'error' | 'success' | 'disabled';

/** DS OtpInput: N cells 56px (radius 14), caret in the active cell; error / success / disabled with a helper line under the cells. One hidden input drives all cells, so SMS autofill and paste work. */
export function OtpInput({ value, onChange, length = 6, state = 'typing', helper, autoFocus }: { value: string; onChange: (v: string) => void; length?: number; state?: State; helper?: string; autoFocus?: boolean }) {
  const ref = useRef<TextInput>(null);
  const [focus, setFocus] = useState(!!autoFocus);
  const def = { error: 'Неверный код', success: 'Номер подтверждён' } as Record<string, string>;
  const help = helper ?? def[state] ?? '';
  const helpColor = state === 'error' ? 'errorText' : state === 'success' ? 'successText' : 'text2';
  return (
    <View style={{ gap: 10 }}>
      <Pressable accessible={false} onPress={() => ref.current?.focus()} style={{ flexDirection: 'row', gap: 8 }}>
        {Array.from({ length }, (_, i) => {
          const d = value[i] ?? '';
          const active = focus && state === 'typing' && i === Math.min(value.length, length - 1) && value.length < length;
          let border: string = d ? '#B8E2F4' : colors.line;
          let bg: string = colors.surface;
          let fg: string = colors.navy;
          if (active) border = colors.blue;
          if (state === 'error') {
            border = colors.red;
            fg = colors.errorText;
          }
          if (state === 'success') border = '#1E9E5A';
          if (state === 'disabled') {
            border = colors.surfaceSunken;
            bg = colors.surfaceSunken;
            fg = colors.text3;
          }
          return (
            <View key={i} style={{ flex: 1, height: 56, borderRadius: 14, borderWidth: 1.5, borderColor: border, backgroundColor: bg, boxShadow: active ? '0 0 0 4px rgba(18, 158, 217, 0.16)' : undefined, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <Text display size={26} lineHeight={30} color={fg} style={{ fontVariant: ['tabular-nums'] }}>
                {d}
              </Text>
              {active ? <View style={{ width: 1.5, height: 24, backgroundColor: colors.blue }} /> : null}
            </View>
          );
        })}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          autoFocus={autoFocus}
          editable={state !== 'disabled'}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={length}
          caretHidden
          accessibilityLabel="Код из SMS"
          style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, fontSize: 16, color: 'transparent' }, { outlineStyle: 'none' } as object]}
        />
      </Pressable>
      {help ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }} accessibilityLiveRegion="polite">
          <Icon name={state === 'error' ? 'alert-circle' : state === 'success' ? 'checkmark-circle-02' : 'clock-01'} size={16} color={helpColor} weight={1.8} />
          <Text size={13} weight={500} color={helpColor}>
            {help}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
