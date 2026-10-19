import { useState, type ComponentProps } from 'react';

import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { TextField } from './TextField';

/** TextField for passwords with a show / hide eye on the right. */
export function PasswordField(props: Omit<ComponentProps<typeof TextField>, 'secureTextEntry' | 'right'>) {
  const [show, setShow] = useState(false);
  return (
    <TextField
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
      secureTextEntry={!show}
      right={
        <Pressable accessibilityRole="button" accessibilityLabel={show ? 'Скрыть пароль' : 'Показать пароль'} onPress={() => setShow(!show)} style={{ width: 36, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -8 }}>
          <Icon name={show ? 'view-off-slash' : 'view'} size={20} color="text2" weight={1.8} />
        </Pressable>
      }
    />
  );
}
