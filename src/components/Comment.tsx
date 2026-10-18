import { useState } from 'react';
import { View } from 'react-native';

import type { CommentItem } from '@/data/news';
import { colors, shadows } from '@/theme';

import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

/** DS Comment: initial avatar, author + time, like toggle; texts over 180 chars clamp to 4 lines with «Показать больше». */
export function Comment({ c }: { c: CommentItem }) {
  const [liked, setLiked] = useState(!!c.liked);
  const [open, setOpen] = useState(false);
  const long = c.text.length > 180;
  const count = c.likes - (c.liked ? 1 : 0) + (liked ? 1 : 0);
  return (
    <View style={{ padding: 14, borderRadius: 18, backgroundColor: colors.surface, gap: 8, ...shadows.card }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
          <Text size={15} weight={700} color="blue600">
            {c.initial}
          </Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text size={15} weight={700}>
            {c.author}
          </Text>
          <Text size={12} color="text2">
            {c.time}
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Нравится" accessibilityState={{ selected: liked }} onPress={() => setLiked(!liked)} style={{ minWidth: 44, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
          <Icon name="favourite" size={18} color={liked ? colors.red : 'text2'} filled={liked} />
          <Text size={14} weight={600} color="text2">
            {count}
          </Text>
        </Pressable>
      </View>
      <Text size={15} lineHeight={21} numberOfLines={long && !open ? 4 : undefined}>
        {c.text}
      </Text>
      {long ? (
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen(!open)} style={{ alignSelf: 'flex-start', minHeight: 32, marginTop: -2, flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Text size={14} weight={700} color="blue600">
            {open ? 'Свернуть' : 'Показать больше'}
          </Text>
          <Icon name={open ? 'arrow-up-01' : 'arrow-down-01'} size={16} color="blue600" weight={2} />
        </Pressable>
      ) : null}
    </View>
  );
}
