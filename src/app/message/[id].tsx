import { Image } from 'expo-image';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Linking, Share, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appear, Button, Gradient, Icon, NavBar, Pressable, Screen, Star, Text, TwinkleStar } from '@/components';
import { findBroadcast, type BroadcastBlock } from '@/data/broadcasts';
import { img } from '@/data/images';
import { colors, shadows } from '@/theme';

const open = (href: string) => (/^https?:/.test(href) ? Linking.openURL(href).catch(() => undefined) : router.push(href as Href));

/** Абзац из админки: `**жирный**` и `[ссылка](/путь)`. */
function Rich({ text, size = 17, lineHeight = 26, color = '#33415F', weight = 400 }: { text: string; size?: number; lineHeight?: number; color?: string; weight?: 400 | 700 }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return (
    <Text size={size} lineHeight={lineHeight} color={color} weight={weight}>
      {parts.map((p, i) => {
        const bold = p.match(/^\*\*([^*]+)\*\*$/);
        if (bold)
          return (
            <RNText key={i} style={{ fontWeight: '700', color: colors.navy }}>
              {bold[1]}
            </RNText>
          );
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link)
          return (
            <RNText key={i} accessibilityRole="link" onPress={() => open(link[2])} style={{ fontWeight: '700', color: colors.blue600, textDecorationLine: 'underline' }}>
              {link[1]}
            </RNText>
          );
        return p;
      })}
    </Text>
  );
}

function Block({ b }: { b: BroadcastBlock }) {
  if (b.type === 'lead') return <Rich text={b.text} size={19} lineHeight={27} color={colors.navy} weight={700} />;
  if (b.type === 'p') return <Rich text={b.text} />;
  if (b.type === 'quote')
    return (
      <View style={{ paddingLeft: 16, borderLeftWidth: 4, borderColor: colors.blue, gap: 6 }}>
        <Text size={18} lineHeight={26} style={{ fontStyle: 'italic' }}>
          {b.text}
        </Text>
        {b.by ? (
          <Text size={14} weight={700} color="text2">
            {b.by}
          </Text>
        ) : null}
      </View>
    );
  return (
    <View style={{ padding: 16, borderRadius: 18, backgroundColor: colors.bg, gap: 12 }}>
      {b.title ? (
        <Text display size={20} lineHeight={22} upper>
          {b.title}
        </Text>
      ) : null}
      {b.items.map((it) => (
        <View key={it.text} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={it.icon} size={18} color="blue" weight={1.8} />
          </View>
          <View style={{ flex: 1, paddingTop: 6 }}>
            <Rich text={it.text} size={16} lineHeight={22} color={colors.navy} />
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * Сообщение клуба: рассылка из админки, не привязанная к разделу приложения.
 * Открывается из пуша и из ленты уведомлений.
 */
export default function Message() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const m = findBroadcast(id);
  const share = () => m && Share.share({ message: `${m.title} — ФК «Ордабасы»` }).catch(() => undefined);
  const top = insets.top + 68;

  if (!m)
    return (
      <Screen header={<NavBar title="Сообщение" />}>
        <View style={{ marginTop: 60, marginHorizontal: 20, alignItems: 'center', gap: 12 }}>
          <Icon name="notification-01" size={40} color="text3" />
          <Text size={17} weight={700} align="center">
            Сообщение не найдено
          </Text>
          <Text size={14} color="text2" align="center">
            Возможно, клуб его уже удалил
          </Text>
          <Button label="Все уведомления" variant="soft" onPress={() => router.replace('/inbox')} />
        </View>
      </Screen>
    );

  return (
    <Screen gap={0} headerBg={colors.navy} header={<NavBar title="Сообщение" tone="dark" action={{ icon: 'share-08', label: 'Поделиться', onPress: share }} />}>
      <StatusBar style="light" />
      <Gradient colors={[colors.navy, '#0B3A6B', colors.blue600]} style={{ marginTop: -top, paddingTop: top + 12, paddingHorizontal: 20, paddingBottom: m.cover ? 116 : 30, overflow: 'hidden', gap: 16 }}>
        <Star w={230} fill="rgba(18,158,217,0.22)" style={{ right: -90, top: 40 }} />
        <TwinkleStar w={26} duration={3000} style={{ right: 36, top: top + 40 }} />
        <TwinkleStar w={12} duration={4000} delay={600} style={{ right: 64, top: top + 90 }} />
        <Appear delay={50} style={{ gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)' }}>
              <Image source={img.crest} style={{ width: 28, height: 34 }} contentFit="contain" accessibilityIgnoresInvertColors />
            </View>
            <View style={{ gap: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text size={17} weight={700} color="surface">
                  ФК «Ордабасы»
                </Text>
                <Icon name="checkmark-badge-01" size={17} color="#7CC6E9" weight={2} />
              </View>
              <Text size={14} color="#A9C6E3">
                {m.when}
              </Text>
            </View>
          </View>
          <View style={{ alignSelf: 'flex-start', height: 26, paddingHorizontal: 11, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.14)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="notification-01" size={14} color="#7CC6E9" weight={2} />
            <Text size={13} lineHeight={15} weight={700} color="#E7F5FB">
              {m.tag}
            </Text>
          </View>
          <Text display size={m.cover ? 34 : 30} lineHeight={m.cover ? 35 : 31} upper color="surface" accessibilityRole="header">
            {m.title}
          </Text>
        </Appear>
      </Gradient>

      {m.cover ? (
        <Appear delay={250} style={{ marginTop: -92, marginHorizontal: 20, borderRadius: 24, overflow: 'hidden', boxShadow: '0 14px 34px rgba(23, 42, 81, 0.28)' }}>
          <Image source={m.cover} accessibilityLabel={m.coverAlt} style={{ width: '100%', height: 210 }} contentFit="cover" contentPosition={{ top: '35%', left: '50%' }} />
        </Appear>
      ) : null}

      <View style={{ marginTop: m.cover ? 16 : -14, marginHorizontal: 20, paddingTop: 22, paddingHorizontal: 20, paddingBottom: 24, borderRadius: 24, backgroundColor: colors.surface, gap: 14, ...shadows.card }}>
        {m.blocks.map((b, i) => (
          <Block key={i} b={b} />
        ))}
        {m.button ? <Button label={m.button.label} icon={m.button.icon} height={54} onPress={() => open(m.button!.href)} /> : null}
      </View>

      <View style={{ marginTop: 18, marginHorizontal: 20, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name="notification-01" size={14} color="text3" weight={1.8} />
          <Text size={13} color="text3">
            {`Рассылка клуба · ${m.date}`}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Button label="Поделиться" icon="share-08" variant="soft" height={50} onPress={share} />
          </View>
          <Pressable accessibilityRole="button" onPress={() => (router.canGoBack() ? router.back() : router.replace('/inbox'))} style={{ flex: 1, height: 50, borderRadius: 16, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Text size={16} weight={700}>
              Все уведомления
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
