import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';

import { Button, Checkbox, GameSheet, Icon, NavBar, Notice, Pressable, Screen, Text, TextField } from '@/components';
import { img } from '@/data/images';
import { cooldownLeft, photoRules, setStadium, useStadium } from '@/data/stadium';
import { Card, Footer, MatchStrip, Points, Rules } from '@/features/stadium/parts';
import { colors } from '@/theme';

type Step = 'empty' | 'denied' | 'picked' | 'uploading';
const frames = [
  { id: 'none', label: 'Без рамки' },
  { id: 'orda', label: 'ORDA' },
  { id: 'star', label: 'Звезда' },
] as const;

/** Selfie preview with the chosen frame. */
function Shot({ frame }: { frame: (typeof frames)[number]['id'] }) {
  return (
    <View style={{ height: 300, borderRadius: 18, overflow: 'hidden', backgroundColor: colors.navy, borderWidth: frame === 'orda' ? 6 : 0, borderColor: colors.blue }}>
      <Image source={img.photoFans} accessibilityLabel="Ваше фото с трибуны" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" contentPosition={{ top: '20%', left: '35%' }} />
      {frame === 'orda' ? (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, backgroundColor: colors.blue, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Image source={img.crest} style={{ width: 20, height: 24 }} contentFit="contain" />
          <Text display size={18} color="surface">
            ORDA — МЫ ВМЕСТЕ
          </Text>
        </View>
      ) : null}
      {frame === 'star' ? <Image source={img.crest} style={{ position: 'absolute', right: 12, top: 12, width: 44, height: 52 }} contentFit="contain" /> : null}
    </View>
  );
}

/** Фото на табло: доступ к камере, выбор фото и рамки, подпись, отправка (прототип: первая отправка падает, чтобы показать повтор). */
export default function PhotoWall() {
  const s = useStadium();
  const [step, setStep] = useState<Step>('empty');
  const [asked, setAsked] = useState(false);
  const [sheet, setSheet] = useState<'camera' | 'error' | 'cooldown' | null>(null);
  const [frame, setFrame] = useState<(typeof frames)[number]['id']>('orda');
  const [caption, setCaption] = useState('');
  const [agree, setAgree] = useState(false);
  const [tried, setTried] = useState(false);
  const [pct, setPct] = useState(0);
  const wait = cooldownLeft(s.photoSentAt);

  const pick = () => {
    if (wait) return setSheet('cooldown');
    if (!asked) return setSheet('camera');
    setStep('picked');
  };
  const send = () => {
    if (!agree) return setTried(true);
    setPct(0);
    setStep('uploading');
  };

  useEffect(() => {
    if (step !== 'uploading') return;
    // Prototype: the first upload stalls at 60% (busy stadium network), the retry goes through.
    const fail = !s.uploadFailedOnce;
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(1, p + 0.08);
      setPct(p);
      if (fail && p >= 0.6) {
        clearInterval(t);
        setStadium({ uploadFailedOnce: true });
        setStep('picked');
        setSheet('error');
      } else if (p >= 1) {
        clearInterval(t);
        setStadium({ photoSentAt: Date.now() });
        router.replace('/stadium/photo-status');
      }
    }, 120);
    return () => clearInterval(t);
  }, [step, s.uploadFailedOnce]);

  const footer =
    step === 'picked' || step === 'uploading' ? (
      <Footer>
        {step === 'uploading' ? (
          <View style={{ gap: 8 }} accessibilityLiveRegion="polite">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text size={15} weight={700}>
                Отправляем фото…
              </Text>
              <Text size={15} weight={700} color="blue">
                {`${Math.round(pct * 100)}%`}
              </Text>
            </View>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.surfaceSunken, overflow: 'hidden' }}>
              <View style={{ width: `${Math.round(pct * 100)}%`, height: 8, borderRadius: 4, backgroundColor: colors.blue }} />
            </View>
            <Text size={12} color="text2">
              Не закрывайте приложение
            </Text>
          </View>
        ) : (
          <>
            <Button label="Отправить на табло" icon="image-upload" height={54} onPress={send} />
            <Text size={12} lineHeight={16} color={tried && !agree ? 'errorText' : 'text2'} align="center" accessibilityLiveRegion="polite">
              {tried && !agree ? 'Отметьте согласие, чтобы отправить фото' : 'Фото проверит модератор, обычно за пару минут'}
            </Text>
          </>
        )}
      </Footer>
    ) : null;

  return (
    <Screen gap={16} header={<NavBar title="Фото на табло" />} footer={footer} footerHeight={step === 'picked' || step === 'uploading' ? 110 : 0}>
      <MatchStrip minute="Идёт сейчас · 32′" score="1 : 0" />

      {step === 'empty' || step === 'denied' ? (
        <Card gap={14}>
          <View style={{ height: 220, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.line, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20 }}>
            <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: step === 'denied' ? colors.errorBg : colors.blue10, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={step === 'denied' ? 'camera-off-01' : 'camera-01'} size={32} color={step === 'denied' ? 'red' : 'blue'} weight={1.7} />
            </View>
            <Text display size={20} lineHeight={22} align="center">
              {step === 'denied' ? 'Нет доступа к камере' : 'Селфи с трибуны'}
            </Text>
            <Text size={14} lineHeight={20} color="text2" align="center">
              {step === 'denied' ? 'Разрешите доступ в настройках телефона или выберите готовое фото из галереи' : 'Лучшие фото покажем на большом экране стадиона'}
            </Text>
          </View>
          {step === 'denied' ? (
            <>
              <Button label="Открыть настройки" icon="settings-01" height={52} onPress={() => Linking.openSettings()} />
              <Button label="Выбрать из галереи" icon="image-01" variant="soft" height={52} onPress={() => (wait ? setSheet('cooldown') : setStep('picked'))} />
            </>
          ) : (
            <>
              <Button label="Сделать фото" icon="camera-01" height={52} onPress={pick} />
              <Button label="Выбрать из галереи" icon="image-01" variant="soft" height={52} onPress={pick} />
            </>
          )}
          <Points n="+30 баллов, если фото покажут" />
        </Card>
      ) : (
        <Card gap={14}>
          <Shot frame={frame} />
          <View style={{ flexDirection: 'row', gap: 8 }} accessibilityRole="radiogroup">
            {frames.map((f) => (
              <Pressable key={f.id} accessibilityRole="radio" accessibilityState={{ checked: frame === f.id }} onPress={() => setFrame(f.id)} style={{ flex: 1, height: 40, borderRadius: 12, borderWidth: 1.5, borderColor: frame === f.id ? colors.blue : colors.line, backgroundColor: frame === f.id ? colors.blue10 : colors.surface, alignItems: 'center', justifyContent: 'center' }}>
                <Text size={14} weight={700} color={frame === f.id ? 'blue600' : 'text2'}>
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextField label="Подпись (необязательно)" placeholder="Например: Юг, мы с вами!" value={caption} onChangeText={(v) => setCaption(v.slice(0, 40))} helper={`${caption.length}/40`} />
          <Checkbox checked={agree} onChange={setAgree} label="Согласен(на), что фото покажут на табло и в соцсетях клуба" />
          <Pressable accessibilityRole="button" onPress={() => setStep('empty')} style={{ alignSelf: 'center', paddingVertical: 6 }}>
            <Text size={15} weight={700} color="blue">
              Выбрать другое фото
            </Text>
          </Pressable>
        </Card>
      )}

      <Rules title="Правила" items={photoRules} />

      <GameSheet visible={sheet === 'camera'} onClose={() => setSheet(null)} icon="camera-01" title="Доступ к камере" text="ORDA нужна камера, чтобы сделать селфи для табло. Фото уходит только модератору клуба.">
        <Button label="Разрешить" height={54} onPress={() => (setAsked(true), setSheet(null), setStep('picked'))} />
        <Button label="Не разрешать" variant="muted" height={50} onPress={() => (setAsked(true), setSheet(null), setStep('denied'))} />
      </GameSheet>

      <GameSheet visible={sheet === 'error'} onClose={() => setSheet(null)} icon="wifi-disconnected-01" tone="red" title="Фото не отправилось" text="На стадионе перегружена мобильная сеть. Фото сохранено — попробуйте ещё раз.">
        <Notice icon="wifi-01" text="Подключитесь к бесплатному Wi-Fi «ORDA Fans» — так быстрее." />
        <Button label="Отправить ещё раз" icon="refresh" height={54} onPress={() => (setSheet(null), send())} />
        <Button label="Отменить" variant="muted" height={50} onPress={() => setSheet(null)} />
      </GameSheet>

      <GameSheet visible={sheet === 'cooldown'} onClose={() => setSheet(null)} icon="clock-01" tone="warn" title={`Следующее фото через ${wait} мин`} text="Одно фото раз в 10 минут — так на табло попадёт больше болельщиков.">
        <Button label="Статус моего фото" height={54} onPress={() => (setSheet(null), router.push('/stadium/photo-status'))} />
        <Button label="Понятно" variant="muted" height={50} onPress={() => setSheet(null)} />
      </GameSheet>
    </Screen>
  );
}
