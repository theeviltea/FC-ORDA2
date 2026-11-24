import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, ClipPath, Defs, G, Line, Polygon, RadialGradient, Stop } from 'react-native-svg';

import { Avatar, Icon, Pressable, Text, type IconName } from '@/components';
import { img } from '@/data/images';
import { catOf, findFan, relOf, setRel, useSocial, type Reaction } from '@/data/social';
import { colors, shadows } from '@/theme';

const pent = (cx: number, cy: number, r: number, rot: number) =>
  [0, 1, 2, 3, 4].map((k) => `${(cx + r * Math.cos(((rot + 72 * k) * Math.PI) / 180)).toFixed(2)},${(cy + r * Math.sin(((rot + 72 * k) * Math.PI) / 180)).toFixed(2)}`).join(' ');
const outer = [0, 1, 2, 3, 4].map((k) => {
  const a = -90 + 72 * k;
  const rad = (a * Math.PI) / 180;
  return { a, ox: 32 + 27 * Math.cos(rad), oy: 33 + 27 * Math.sin(rad), vx: 32 + 9.5 * Math.cos(rad), vy: 33 + 9.5 * Math.sin(rad), ix: 32 + 18.5 * Math.cos(rad), iy: 33 + 18.5 * Math.sin(rad) };
});

/** Мяч ORDA AI (без значка). */
export function AiBall({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        <RadialGradient id="aiball" cx="38%" cy="30%" r="75%">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="0.65" stopColor="#F2F6FA" />
          <Stop offset="1" stopColor="#C9D8E8" />
        </RadialGradient>
        <ClipPath id="aiclip">
          <Circle cx="32" cy="32" r="30" />
        </ClipPath>
      </Defs>
      <Circle cx="32" cy="32" r="30" fill="url(#aiball)" />
      <G clipPath="url(#aiclip)" fill={colors.navy}>
        <Polygon points={pent(32, 33, 9.5, -90)} />
        {outer.map((o) => (
          <Polygon key={o.a} points={pent(o.ox, o.oy, 9, o.a + 180)} />
        ))}
      </G>
      <G clipPath="url(#aiclip)" stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round">
        {outer.map((o) => (
          <Line key={o.a} x1={o.vx} y1={o.vy} x2={o.ix} y2={o.iy} />
        ))}
      </G>
      <Circle cx="32" cy="32" r="30" fill="none" stroke="rgba(23,42,81,0.18)" strokeWidth={1} />
    </Svg>
  );
}

/** Мяч со значком ИИ. */
export function AiBadgeBall({ size }: { size: number }) {
  const b = Math.round(size * 0.44);
  return (
    <View style={{ width: size, height: size }}>
      <AiBall size={size} />
      <View style={{ position: 'absolute', right: -size * 0.06, top: -size * 0.06, width: b, height: b, borderRadius: b / 2, backgroundColor: colors.blue, borderWidth: 2, borderColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="sparkles" size={Math.round(b * 0.58)} color="surface" weight={2} />
      </View>
    </View>
  );
}

/** Плавающая кнопка ИИ-помощника в правом нижнем углу главных экранов. */
export function AiFab({ bottom }: { bottom?: number }) {
  const insets = useSafeAreaInsets();
  const b = bottom ?? (Platform.OS === 'web' ? 104 : insets.bottom + 16);
  const [pulse] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(pulse, { toValue: 1, duration: 2400, easing: Easing.out(Easing.quad), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', right: 16, bottom: b, zIndex: 20 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="ИИ-помощник ORDA" onPress={() => router.push('/ai')} hitSlop={6}>
        <Animated.View
          pointerEvents="none"
          style={{ position: 'absolute', top: 2, left: 2, right: 2, bottom: 2, borderRadius: 40, backgroundColor: colors.blue, opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }), transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.45] }) }] }}
        />
        <View style={{ boxShadow: '0 8px 16px rgba(23, 42, 81, 0.28)', borderRadius: 32 }}>
          <AiBadgeBall size={64} />
        </View>
      </Pressable>
    </View>
  );
}

/** Аватар болельщика: буква на фирменном цвете (фото подключим с API), зелёная точка «в сети». */
export function FanAvatar({ id, size, online, ring = colors.surface }: { id: string; size: number; online?: boolean; ring?: string }) {
  if (id === 'me') return <Avatar size={size} />;
  if (id === 'club')
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={img.crest} style={{ width: size * 0.5, height: size * 0.61 }} contentFit="contain" />
      </View>
    );
  const f = findFan(id);
  if (!f) return null;
  const on = online ?? f.online;
  const d = Math.max(10, Math.round(size * 0.26));
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: f.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text display size={Math.round(size * 0.42)} lineHeight={Math.round(size * 0.5)} color={f.fg}>
          {f.initial}
        </Text>
      </View>
      {on ? <View accessibilityLabel="в сети" style={{ position: 'absolute', right: 0, bottom: 0, width: d, height: d, borderRadius: d / 2, backgroundColor: '#1DB45A', borderWidth: 2, borderColor: ring }} /> : null}
    </View>
  );
}

export const nameOf = (id: string) => (id === 'me' ? 'Бекжан' : id === 'club' ? 'ФК «Ордабасы»' : (findFan(id)?.name ?? ''));

/** Баллы и уровень одной строкой. */
export function Points({ id, size = 13 }: { id: string; size?: number }) {
  const f = findFan(id);
  if (!f) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Image source={img.coin} style={{ width: 16, height: 16 }} contentFit="contain" />
      <Text size={size} weight={700}>
        {f.points}
      </Text>
      <Text size={size} color="text2">
        · ур. {f.level}
      </Text>
    </View>
  );
}

const btn = (bg: string, border?: string): ViewStyle => ({ flex: 1, height: 40, borderRadius: 12, backgroundColor: bg, borderWidth: border ? 1.5 : 0, borderColor: border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 });

/** Мини-карточка болельщика: фото, имя, рейтинг, «Добавить» / «Написать». */
export function FanCard({ id }: { id: string }) {
  const s = useSocial();
  const f = findFan(id);
  if (!f) return null;
  const rel = relOf(s, id);
  const sub = rel === 'friend' ? 'В друзьях' : f.mutual ? `${f.mutual} общ. ${f.mutual === 1 ? 'друг' : 'друга'}` : f.sector;
  return (
    <View style={{ flex: 1, minWidth: 150, padding: 12, paddingTop: 16, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', gap: 4, ...shadows.card }}>
      <Pressable accessibilityRole="link" accessibilityLabel={f.name} onPress={() => router.push({ pathname: '/fan/[id]', params: { id } })} style={{ alignItems: 'center', gap: 6 }}>
        <FanAvatar id={id} size={64} ring={colors.surface} />
        <Text size={16} weight={700} numberOfLines={1}>
          {f.short}
        </Text>
      </Pressable>
      <Points id={id} />
      <Text size={12} color="text3">
        {sub}
      </Text>
      <View style={{ width: '100%', marginTop: 8, flexDirection: 'row', gap: 6 }}>
        {rel === 'none' ? (
          <Pressable accessibilityRole="button" onPress={() => setRel(id, 'sent')} style={btn(colors.blue600)}>
            <Icon name="user-round-plus" size={17} color="surface" weight={2} />
            <Text size={14} weight={700} color="surface">
              Добавить
            </Text>
          </Pressable>
        ) : rel === 'sent' ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Заявка отправлена, отменить" onPress={() => setRel(id, 'none')} style={btn(colors.surface, colors.line)}>
            <Icon name="clock-01" size={16} color="text2" />
            <Text size={13} weight={700} color="text2">
              Заявка отправлена
            </Text>
          </Pressable>
        ) : rel === 'incoming' ? (
          <>
            <Pressable accessibilityRole="button" onPress={() => setRel(id, 'friend')} style={btn(colors.blue600)}>
              <Icon name="user-round-check" size={17} color="surface" weight={2} />
              <Text size={14} weight={700} color="surface">
                Принять
              </Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Отклонить" onPress={() => setRel(id, 'none')} style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="cancel-01" size={18} color="text2" weight={2} />
            </Pressable>
          </>
        ) : (
          <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/chat/[id]', params: { id } })} style={btn(colors.blue10)}>
            <Icon name="message-01" size={17} color="blue600" weight={2} />
            <Text size={14} weight={700} color="blue600">
              Написать
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/** Метка раздела форума. */
export function CatChip({ cat }: { cat: string }) {
  if (cat === 'club')
    return (
      <View style={{ alignSelf: 'flex-start', height: 24, paddingHorizontal: 8, borderRadius: 7, backgroundColor: colors.navy, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Icon name="champion" size={13} color="surface" weight={2} />
        <Text size={12} lineHeight={14} weight={700} color="surface">
          Клуб
        </Text>
      </View>
    );
  const c = catOf(cat);
  if (!c) return null;
  return (
    <View style={{ alignSelf: 'flex-start', height: 24, paddingHorizontal: 8, borderRadius: 7, backgroundColor: c.bg, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Icon name={c.icon} size={13} color={c.fg} weight={2} />
      <Text size={12} lineHeight={14} weight={700} color={c.fg}>
        {c.name}
      </Text>
    </View>
  );
}

/** Ряд реакций: свои подсвечены. */
export function Reactions({ items, mine = [], small, onPress }: { items: Reaction[]; mine?: string[]; small?: boolean; onPress?: (e: string) => void }) {
  const all = [...items];
  mine.forEach((e) => {
    if (!all.some((r) => r.e === e)) all.push({ e, n: 0 });
  });
  return (
    <>
      {all.map((r) => {
        const on = mine.includes(r.e) || (r.mine && !mine.length);
        const n = r.n + (mine.includes(r.e) && !r.mine ? 1 : 0);
        const h = small ? 28 : 32;
        return (
          <Pressable key={r.e} accessibilityRole="button" accessibilityLabel={`Реакция ${r.e}, ${n}`} accessibilityState={{ selected: !!on }} onPress={() => onPress?.(r.e)} style={{ height: h, paddingHorizontal: small ? 8 : 10, borderRadius: h / 2, backgroundColor: on ? colors.blue10 : colors.bg, borderWidth: 1.5, borderColor: on ? colors.sky : 'transparent', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text size={small ? 13 : 14}>{r.e}</Text>
            <Text size={small ? 13 : 14} weight={700} color={on ? 'blue600' : 'text2'}>
              {n}
            </Text>
          </Pressable>
        );
      })}
    </>
  );
}

/** Строка «Ур. … · время» под автором. */
export function AuthorRow({ id, time, size = 40, badge }: { id: string; time: string; size?: number; badge?: 'club' | 'author' }) {
  const f = findFan(id);
  const sub = id === 'club' ? time : `Ур. ${id === 'me' ? 21 : (f?.level ?? 0)} · ${time}`;
  const go = () => (id === 'club' || id === 'me' ? undefined : router.push({ pathname: '/fan/[id]', params: { id } }));
  return (
    <Pressable accessibilityRole="link" onPress={go} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 }}>
      <FanAvatar id={id} size={size} />
      <View style={{ flexShrink: 1, gap: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Text size={size < 40 ? 15 : 16} weight={700} numberOfLines={1}>
            {size < 40 && f ? f.short : nameOf(id)}
          </Text>
          {id === 'club' ? <Icon name="checkmark-badge-01" size={16} color="blue" weight={2} /> : null}
          {badge ? (
            <View style={{ height: 20, paddingHorizontal: 7, borderRadius: 6, backgroundColor: badge === 'club' ? colors.navy : colors.blue10, justifyContent: 'center' }}>
              <Text size={11} lineHeight={13} weight={700} color={badge === 'club' ? 'surface' : 'blue600'}>
                {badge === 'club' ? 'Ответ клуба' : 'Автор'}
              </Text>
            </View>
          ) : null}
        </View>
        <Text size={12} color="text3">
          {sub}
        </Text>
      </View>
    </Pressable>
  );
}

/** Кнопка-«пилюля» (фильтры, быстрые ответы). */
export function Chip({ label, on, onPress, outline }: { label: string; on?: boolean; onPress?: () => void; outline?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!on }}
      onPress={onPress}
      style={{ height: outline ? 36 : 40, paddingHorizontal: outline ? 13 : 14, borderRadius: 20, backgroundColor: outline ? colors.surface : on ? colors.navy : colors.chipBg, borderWidth: outline ? 1.5 : 0, borderColor: '#B8E2F4', alignItems: 'center', justifyContent: 'center' }}>
      <Text size={14} weight={on || outline ? 700 : 500} color={outline ? 'blue600' : on ? 'surface' : 'text'}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Подпись-подсказка с иконкой. */
export function Hint({ icon = 'information-circle', text }: { icon?: IconName; text: string }) {
  return (
    <View style={{ marginHorizontal: 20, flexDirection: 'row', gap: 8 }}>
      <Icon name={icon} size={18} color="text3" />
      <Text size={13} lineHeight={18} color="text2" style={{ flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

/** Есть ли у пользователя этот болельщик в друзьях. */
export function useRel(id: string) {
  const s = useSocial();
  return relOf(s, id);
}
