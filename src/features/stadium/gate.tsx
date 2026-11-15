import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Button, GameSheet, Notice } from '@/components';
import { usePrefs } from '@/data/prefs';
import { match, setStadium, useStadium } from '@/data/stadium';
import { colors } from '@/theme';

type Step = 'guest' | 'ticket' | 'checkin' | 'location' | 'checking' | 'fail' | null;

/**
 * Entry to the stadium games: guest → sign in, no ticket → buy one, not checked in → check-in sheets
 * (geolocation within 300 m of the stadium). Prototype: the location check is simulated and succeeds
 * when access is allowed; «Не разрешать» shows the failure sheet.
 */
export function useGate() {
  const { authed } = usePrefs();
  const s = useStadium();
  const [step, setStep] = useState<Step>(null);
  const [next, setNext] = useState<Href | null>(null);

  const open = (to: Href | null) => {
    setNext(to);
    if (!authed) return setStep('guest');
    if (!s.hasTicket) return setStep('ticket');
    if (!s.checkedIn) return setStep('checkin');
    if (to) router.push(to);
  };
  const close = () => setStep(null);
  const check = () => {
    setStep('checking');
    setTimeout(() => {
      setStep(null);
      setStadium({ checkedIn: true });
      router.push({ pathname: '/stadium/checked-in', params: next ? { next: String(next) } : {} });
    }, 1400);
  };

  const sheets = (
    <>
      <GameSheet visible={step === 'guest'} onClose={close} icon="user" title="Войдите, чтобы играть" text="Игры на стадионе доступны болельщикам с аккаунтом ORDA: так мы начислим баллы и свяжемся, если вы выиграете.">
        <Button label="Войти" height={54} onPress={() => (close(), router.push('/login'))} />
        <Button label="Создать аккаунт" variant="soft" height={54} onPress={() => (close(), router.push('/register'))} />
      </GameSheet>

      <GameSheet visible={step === 'ticket'} onClose={close} icon="ticket-01" title="Нужен билет на матч" text={`Игры открыты для зрителей матча ${match.title}. Купите билет в приложении — он появится в «Моих билетах».`}>
        <Button label="Купить билет" icon="ticket-01" height={54} onPress={() => (close(), router.push('/tickets'))} />
        <Button label="У меня бумажный билет" variant="soft" height={54} onPress={() => (setStadium({ hasTicket: true }), setStep('checkin'))} />
      </GameSheet>

      <GameSheet visible={step === 'checkin'} onClose={close} icon="location-01" title="Вы на стадионе?" text="Отметьтесь, чтобы открыть игры и получить +50 баллов. Проверим геопозицию — нужно быть в радиусе 300 м от стадиона.">
        <Notice icon="ticket-01" text={`Билет: ${match.title} · ${match.seat.sector}, ряд ${match.seat.row}, место ${match.seat.place}`} />
        <Button label="Отметиться" icon="location-01" height={54} onPress={() => setStep('location')} />
        <Button label="Позже" variant="muted" height={50} onPress={close} />
      </GameSheet>

      <GameSheet visible={step === 'location' || step === 'checking'} onClose={close} icon="location-01" title="Доступ к геопозиции" text="Нужен один раз, чтобы подтвердить, что вы на стадионе. Мы не отслеживаем ваши перемещения.">
        <View>
          <Button label={step === 'checking' ? 'Проверяем…' : 'Разрешить'} height={54} disabled={step === 'checking'} onPress={check} />
          {step === 'checking' ? <ActivityIndicator style={{ position: 'absolute', top: 17, left: 24 }} color={colors.surface} /> : null}
        </View>
        <Button label="Не разрешать" variant="muted" height={50} disabled={step === 'checking'} onPress={() => setStep('fail')} />
      </GameSheet>

      <GameSheet visible={step === 'fail'} onClose={close} icon="location-01" tone="red" title="Не получилось отметиться" text="Мы не нашли вас рядом со стадионом. Включите геопозицию для ORDA и подойдите ближе к входу.">
        <Notice icon="wifi-01" text="Плохая связь? Подключитесь к бесплатному Wi-Fi «ORDA Fans»." />
        <Button label="Попробовать ещё раз" icon="refresh" height={54} onPress={() => setStep('location')} />
        <Button label="Закрыть" variant="muted" height={50} onPress={close} />
      </GameSheet>
    </>
  );
  return { open, sheets, checkedIn: s.checkedIn };
}
