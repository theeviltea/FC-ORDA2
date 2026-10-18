import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Gradient, Icon, NavBar, Pressable, ProductCard, Screen, Star, Text, TextField } from '@/components';
import { aspect, img } from '@/data/images';
import { findItem, promoCodes, tenge } from '@/data/shop';
import { colors, radius, shadows } from '@/theme';

/** Gallery slides for an item with photos: front, crest close-up, on a player, team shot. */
function Slide({ k, photo, thumb }: { k: number; photo: number; thumb?: boolean }) {
  const fill = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const;
  if (k === 1)
    return (
      <View style={[fill, { backgroundColor: '#F7FAFD', overflow: 'hidden' }]}>
        <Image source={photo} style={{ position: 'absolute', left: '-95%', top: '-38%', width: '300%', aspectRatio: 1 }} />
      </View>
    );
  if (k === 2) {
    const h = thumb ? 114 : 608;
    return (
      <Gradient style={[fill, { overflow: 'hidden', alignItems: 'center' }]}>
        {thumb ? null : (
          <>
            <Text display size={120} lineHeight={103} color="rgba(255,255,255,0.08)" style={{ position: 'absolute', left: 12, top: -6 }} aria-hidden>
              {'KIT\n2026'}
            </Text>
            <Star w={18} fill={colors.sky} style={{ left: 40, top: 160 }} />
          </>
        )}
        <Image source={img.playerAstanov} style={{ marginTop: thumb ? 6 : 18, height: h, width: h * aspect.playerAstanov }} />
      </Gradient>
    );
  }
  if (k === 3) return <Image source={img.newsTrio} style={fill} contentFit="cover" contentPosition={{ top: '30%' }} />;
  return <Image source={photo} style={[fill, { margin: thumb ? 10 : 12 }]} contentFit="contain" />;
}

function Gallery({ photo, badge }: { photo: number; badge?: string }) {
  const [i, setI] = useState(0);
  const n = 4;
  const round = { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '50%', marginTop: -20, ...shadows.card } as const;
  return (
    <>
      <View accessibilityLabel="Фото товара" style={{ height: 320, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.surface }}>
        <Slide k={i} photo={photo} />
        {badge ? (
          <View style={{ position: 'absolute', top: 10, left: 10, height: 22, paddingHorizontal: 9, borderRadius: 11, backgroundColor: colors.navy, justifyContent: 'center' }}>
            <Text size={12} lineHeight={14} weight={700} color="surface">
              {badge}
            </Text>
          </View>
        ) : null}
        <View style={{ position: 'absolute', top: 10, right: 10, height: 24, paddingHorizontal: 10, borderRadius: 12, backgroundColor: 'rgba(23,42,81,0.72)', justifyContent: 'center' }}>
          <Text size={12} lineHeight={14} weight={700} color="surface">
            {`${i + 1} / ${n}`}
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Предыдущее фото" onPress={() => setI((i + n - 1) % n)} style={[round, { left: 8 }]}>
          <Icon name="arrow-left-01" size={20} weight={2} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Следующее фото" onPress={() => setI((i + 1) % n)} style={[round, { right: 8 }]}>
          <Icon name="arrow-right-01" size={20} weight={2} />
        </Pressable>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 10, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
          {[0, 1, 2, 3].map((k) => (
            <View key={k} style={{ width: k === i ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: k === i ? colors.blue : 'rgba(23,42,81,0.2)' }} />
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[0, 1, 2, 3].map((k) => (
          <Pressable key={k} accessibilityRole="button" accessibilityLabel={`Фото ${k + 1}`} onPress={() => setI(k)} style={{ flex: 1, height: 64, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: k === i ? colors.blue : colors.surfaceSunken, backgroundColor: colors.surface }}>
            <Slide k={k} photo={photo} thumb />
          </Pressable>
        ))}
      </View>
    </>
  );
}

function NoPhoto() {
  return (
    <View style={{ height: 320, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.surfaceSunken, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Star w={120} fill={colors.star} style={{ right: -30, top: -30 }} />
      <Star w={44} fill={colors.star} style={{ left: 18, bottom: 22 }} />
      <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(23, 42, 81, 0.08)' }}>
        <Icon name="image-01" size={38} color="text3" />
      </View>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Text size={16} weight={700}>
          Фото скоро появится
        </Text>
        <Text size={13} color="text2">
          Мы готовим снимки этого товара
        </Text>
      </View>
    </View>
  );
}

const panel = { padding: 18, borderRadius: 22 } as const;
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const swatches = [
  { id: 'blue', name: 'голубой', hex: colors.blue },
  { id: 'white', name: 'белый', hex: '#FFFFFF' },
];

function Accordion({ items }: { items: { id: string; title: string; body: string }[] }) {
  const [open, setOpen] = useState('desc');
  return (
    <Card style={{ paddingHorizontal: 18, borderRadius: 22 }}>
      {items.map((a, i) => {
        const on = a.id === open;
        return (
          <View key={a.id} style={{ borderBottomWidth: i < items.length - 1 ? 1 : 0, borderColor: colors.surfaceSunken }}>
            <Pressable accessibilityRole="button" accessibilityState={{ expanded: on }} onPress={() => setOpen(on ? '' : a.id)} style={{ height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text size={16} weight={600}>
                {a.title}
              </Text>
              <Icon name={on ? 'arrow-up-01' : 'arrow-down-01'} size={20} color="text2" weight={2} />
            </Pressable>
            {on ? (
              <Text size={15} lineHeight={22} color="text2" style={{ marginBottom: 16 }}>
                {a.body}
              </Text>
            ) : null}
          </View>
        );
      })}
    </Card>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <Text size={15} weight={700}>
      {children}
    </Text>
  );
}

/** Карточка товара: галерея, цена, размер / цвет / количество, промокод, описание, похожие, панель «Купить». */
export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = findItem(id ?? 'jersey');
  const insets = useSafeAreaInsets();
  const [fav, setFav] = useState(false);
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('blue');
  const [qty, setQty] = useState(1);
  const [code, setCode] = useState('');
  const [promo, setPromo] = useState<{ code: string; off: number } | 'error' | null>(null);
  const wearable = ['jersey', 'hoodie', 'training', 'jacket'].includes(item.id);

  const off = promo && promo !== 'error' ? promo.off : 0;
  const unit = Math.round(item.base * (1 - off));
  const apply = () => {
    const c = code.trim().toUpperCase();
    setPromo(promoCodes[c] ? { code: c, off: promoCodes[c] } : 'error');
  };
  const similar = ['training', 'flag', 'backpack', 'hoodie'].filter((x) => x !== item.id).slice(0, 2).map(findItem);
  const summary = [wearable ? `Размер ${size}` : null, `${qty} шт.`, promo && promo !== 'error' ? promo.code : null].filter(Boolean).join(' · ');

  const footer = (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 12, paddingHorizontal: 16, paddingBottom: Math.max(insets.bottom, 12) + 16, backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 14, boxShadow: '0 -6px 24px rgba(23, 42, 81, 0.1)' }}>
      <View>
        <Text size={13} color="text2">
          {summary}
        </Text>
        <Text display size={22}>
          {tenge(unit * qty)}
        </Text>
      </View>
      <Button label="Купить" height={54} style={{ flex: 1 }} onPress={() => router.push({ pathname: '/soon', params: { title: 'Оформление заказа' } })} />
    </View>
  );

  return (
    <Screen
      gap={12}
      header={<NavBar title="Магазин" action={{ icon: 'favourite', label: fav ? 'Убрать из избранного' : 'В избранное', active: fav, onPress: () => setFav(!fav) }} />}
      footer={footer}
      footerHeight={80}>
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <Card style={{ padding: 10, borderRadius: 22, gap: 10 }}>{item.photo ? <Gallery photo={item.photo as number} badge={item.badge} /> : <NoPhoto />}</Card>

        <Card style={[panel, { gap: 8 }]}>
          <Text display size={22} lineHeight={26}>
            {item.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Text display size={26} color="blue600">
              {tenge(unit)}
            </Text>
            {off ? (
              <>
                <Text size={16} color="text2" style={{ textDecorationLine: 'line-through' }}>
                  {tenge(item.base)}
                </Text>
                <View style={{ height: 22, paddingHorizontal: 8, borderRadius: 11, backgroundColor: colors.red, justifyContent: 'center' }}>
                  <Text size={12} lineHeight={14} weight={700} color="surface">
                    −{Math.round(off * 100)}%
                  </Text>
                </View>
              </>
            ) : null}
          </View>
          <Text size={15} lineHeight={22} color="text2">
            {item.lead}
          </Text>
        </Card>

        <Card style={[panel, { gap: 14 }]}>
          {wearable ? (
            <>
              <Label>Размер</Label>
              <View accessibilityRole="radiogroup" accessibilityLabel="Размер" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {sizes.map((s) => {
                  const on = s === size;
                  return (
                    <Pressable key={s} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => setSize(s)} style={{ minWidth: 52, height: 44, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1.5, borderColor: on ? colors.blue : colors.line, backgroundColor: on ? colors.blue : colors.surface, alignItems: 'center', justifyContent: 'center' }}>
                      <Text size={16} weight={on ? 700 : 600} color={on ? 'surface' : 'text'}>
                        {s}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={{ height: 1, backgroundColor: colors.surfaceSunken }} />
            </>
          ) : null}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ gap: 10 }}>
              <Label>Цвет: {swatches.find((c) => c.id === color)?.name}</Label>
              <View accessibilityRole="radiogroup" accessibilityLabel="Цвет" style={{ flexDirection: 'row', gap: 6 }}>
                {swatches.map((c) => {
                  const on = c.id === color;
                  return (
                    <Pressable key={c.id} accessibilityRole="radio" accessibilityLabel={c.name} accessibilityState={{ checked: on }} onPress={() => setColor(c.id)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ width: on ? 32 : 26, height: on ? 32 : 26, borderRadius: 16, borderWidth: on ? 2 : 0, borderColor: colors.blue, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: on ? 22 : 26, height: on ? 22 : 26, borderRadius: 13, backgroundColor: c.hex, borderWidth: 1, borderColor: colors.line }} />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={{ gap: 10, alignItems: 'flex-end' }}>
              <Label>Количество</Label>
              <View style={{ flexDirection: 'row', alignItems: 'center', height: 44, borderRadius: 12, backgroundColor: colors.surfaceSunken }}>
                <Pressable accessibilityRole="button" accessibilityLabel="Меньше" onPress={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                  <Text size={22} weight={600}>
                    −
                  </Text>
                </Pressable>
                <Text size={17} weight={700} align="center" style={{ minWidth: 20 }}>
                  {qty}
                </Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Больше" onPress={() => setQty(Math.min(9, qty + 1))} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                  <Text size={22} weight={600}>
                    +
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Card>

        <Card style={[panel, { gap: 12 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 32 }}>
            <Label>Промокод</Label>
            {promo && promo !== 'error' ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setPromo(null);
                  setCode('');
                }}>
                <Text size={14} weight={600} color="blue600">
                  Убрать
                </Text>
              </Pressable>
            ) : null}
          </View>
          {promo && promo !== 'error' ? (
            <>
              <TextField value={promo.code} icon="discount-tag-01" state="success" helper={`Скидка ${Math.round(promo.off * 100)}% на этот товар применена`} editable={false} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 14, borderRadius: radius.m, backgroundColor: colors.successBg }}>
                <Text size={15} weight={600} color="successText">
                  Ваша выгода
                </Text>
                <Text size={15} weight={700} color="successText">
                  −{tenge((item.base - unit) * qty)}
                </Text>
              </View>
            </>
          ) : (
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <TextField
                  value={code}
                  onChangeText={(t) => {
                    setCode(t);
                    if (promo === 'error') setPromo(null);
                  }}
                  onSubmitEditing={apply}
                  autoCapitalize="characters"
                  placeholder="Введите промокод"
                  icon="discount-tag-01"
                  state={promo === 'error' ? 'error' : 'default'}
                  helper={promo === 'error' ? 'Промокод не найден или истёк' : undefined}
                />
              </View>
              <Pressable accessibilityRole="button" onPress={apply} style={{ height: 52, paddingHorizontal: 18, borderRadius: 14, backgroundColor: colors.blue10, justifyContent: 'center' }}>
                <Text size={16} weight={700} color="blue600">
                  Применить
                </Text>
              </Pressable>
            </View>
          )}
        </Card>

        <Accordion
          items={[
            { id: 'desc', title: 'Описание', body: item.lead },
            { id: 'spec', title: 'Характеристики', body: 'Состав: [состав ткани]. Посадка: [тип посадки]. Уход: [условия стирки].' },
            { id: 'ship', title: 'Доставка и возврат', body: 'Доставка по Казахстану: [сроки]. Возврат в течение [N] дней при сохранении бирок.' },
          ]}
        />

        <Text display size={24} lineHeight={28} style={{ marginTop: 12, marginHorizontal: 4 }}>
          Похожие товары
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {similar.map((p) => (
            <View key={p.id} style={{ flex: 1 }}>
              <ProductCard item={p} width="100%" onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })} />
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
