import { router } from 'expo-router';
import { Linking, View } from 'react-native';

import { Card, Icon, ListCard, NavBar, PaymentLogos, Screen, SectionHeader, Star, Text } from '@/components';
import type { IconName } from '@/icons/icons';
import { company, documents, pickup } from '@/data/legal';

function Info({ icon, label, value, onPress }: { icon: IconName; label: string; value: string; onPress?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
      <Icon name={icon} size={20} color="blue" weight={1.6} />
      <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
        <Text size={12} weight={700} upper color="text2" style={{ letterSpacing: 0.6 }}>
          {label}
        </Text>
        <Text size={15} lineHeight={20} weight={600} color={onPress ? 'blue600' : 'text'} onPress={onPress} accessibilityRole={onPress ? 'link' : undefined}>
          {value}
        </Text>
      </View>
    </View>
  );
}

/**
 * Документы и реквизиты (требования Halyk Bank к интернет-ресурсу и мобильному приложению):
 * сведения о клубе, контакты поддержки, пункт выдачи, документы оферты, способы оплаты и информеры платёжных систем.
 */
export default function Legal() {
  const section = (title: string, children: React.ReactNode) => (
    <View style={{ gap: 12, marginTop: 8 }}>
      <SectionHeader title={title} />
      {children}
    </View>
  );
  const tel = (p: string) => () => Linking.openURL(`tel:${p.replace(/[^+\d]/g, '')}`);
  return (
    <Screen
      gap={12}
      header={<NavBar title="Документы" />}
      decor={
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="none">
          <Star w={80} style={{ top: 620, right: -20 }} />
        </View>
      }>
      {section(
        'О клубе',
        <Card style={{ marginHorizontal: 20, padding: 16, gap: 14 }}>
          <Text size={17} lineHeight={22} weight={700}>
            {company.name}
          </Text>
          <Info icon="legal-document-01" label="БИН" value={company.bin} />
          <Info icon="location-01" label="Страна, город" value={`${company.country}, ${company.city}`} />
          <Info icon="building-03" label="Юридический адрес" value={company.legalAddress} />
          <Info icon="location-01" label="Фактический адрес" value={company.actualAddress} />
          <Info icon="clock-01" label="График работы поддержки" value={company.schedule} />
          {company.phones.map((p) => (
            <Info key={p} icon="call" label="Телефон поддержки" value={p} onPress={tel(p)} />
          ))}
          <Info icon="mail-01" label="E-mail" value={company.email} />
        </Card>,
      )}
      {section(
        'Пункт выдачи',
        <Card style={{ marginHorizontal: 20, padding: 16, gap: 14 }}>
          <Text size={17} weight={700}>
            {pickup.title}
          </Text>
          <Info icon="location-01" label="Адрес" value={`${pickup.country}, г. ${pickup.city}, ${pickup.address}`} />
          <Info icon="clock-01" label="Режим работы" value={pickup.schedule} />
          <Info icon="call" label="Телефон" value={pickup.phone} onPress={tel(pickup.phone)} />
          <Info icon="store-01" label="Как добраться" value={pickup.route} />
        </Card>,
      )}
      {section(
        'Документы',
        <ListCard rows={documents.map((d) => ({ icon: d.icon, title: d.title, sub: d.short, onPress: () => router.push({ pathname: '/legal/[doc]', params: { doc: d.id } }) }))} />,
      )}
      {section(
        'Оплата',
        <Card style={{ marginHorizontal: 20, padding: 16, gap: 12 }}>
          <Text size={15} lineHeight={21} color="text2">
            Принимаем карты Visa и Mastercard. Оплата проходит на защищённой странице Halyk Bank, клуб не видит и не хранит данные карты.
          </Text>
          <PaymentLogos />
        </Card>,
      )}
      <Text size={12} lineHeight={17} color="text3" align="center" style={{ marginHorizontal: 32, marginTop: 4 }}>
        Документы всегда доступны здесь: Профиль → Настройки → Документы
      </Text>
    </Screen>
  );
}
