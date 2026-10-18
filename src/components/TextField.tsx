import { useState, type ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { bodyFamily, colors } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type State = 'default' | 'error' | 'success' | 'disabled';

type Props = Omit<TextInputProps, 'style'> & { label?: string; icon?: IconName; state?: State; helper?: string; right?: ReactNode };

const look: Record<State, { border: string; ring?: string; help: string }> = {
  default: { border: colors.line, help: colors.text2 },
  error: { border: colors.red, ring: '0 0 0 4px rgba(227, 5, 18, 0.08)', help: colors.errorText },
  success: { border: '#1E9E5A', help: colors.successText },
  disabled: { border: colors.surfaceSunken, help: colors.text2 },
};

/** DS TextField: 52px, radius 14, optional leading icon and trailing `right` slot (e.g. show-password); focus = blue border + soft ring; error / success with helper. */
export function TextField({ label, icon, state = 'default', helper, right, ...input }: Props) {
  const [focus, setFocus] = useState(false);
  const l = look[state];
  const border = focus && state === 'default' ? colors.blue : l.border;
  const ring = focus && state === 'default' ? '0 0 0 4px rgba(18, 158, 217, 0.16)' : l.ring;
  const status = state === 'error' ? 'alert-circle' : state === 'success' ? 'checkmark-circle-02' : null;
  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text size={13} weight={500} color={state === 'error' ? 'errorText' : 'text2'}>
          {label}
        </Text>
      ) : null}
      <View style={{ height: 52, paddingHorizontal: 16, borderRadius: 14, backgroundColor: state === 'disabled' ? colors.surfaceSunken : colors.surface, borderWidth: 1.5, borderColor: border, boxShadow: ring, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {icon ? <Icon name={icon} size={20} color="text2" /> : null}
        <TextInput
          {...input}
          editable={state !== 'disabled'}
          placeholderTextColor={colors.text3}
          onFocus={(e) => {
            setFocus(true);
            input.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            input.onBlur?.(e);
          }}
          style={[{ flex: 1, minWidth: 0, height: 48, fontFamily: bodyFamily[500], fontSize: 16, color: colors.navy }, { outlineStyle: 'none' } as object]}
        />
        {right}
        {status ? <Icon name={status} size={20} color={state === 'error' ? colors.red : '#1E9E5A'} weight={1.8} /> : null}
      </View>
      {helper ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {status ? <Icon name={status} size={16} color={l.help} weight={1.8} /> : null}
          <Text size={13} weight={status ? 500 : 400} color={l.help}>
            {helper}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
