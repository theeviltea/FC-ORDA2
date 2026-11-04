import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Card, NavBar, PaymentLogos, Screen, Text } from '@/components';
import { documents, findDoc } from '@/data/legal';

/** Текст документа (оферта, политика, согласие, оплата, доставка, возврат): разделы с абзацами. */
export default function LegalDocScreen() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const d = findDoc(doc ?? '') ?? documents[0];
  const withLogos = d.id === 'payment' || d.id === 'offer';
  return (
    <Screen gap={12} header={<NavBar title="Документ" />}>
      <View style={{ marginHorizontal: 20, gap: 6, marginTop: 4 }}>
        <Text display size={28} lineHeight={30} upper accessibilityRole="header">
          {d.title}
        </Text>
        <Text size={13} color="text2">
          Редакция от {d.updated}
        </Text>
      </View>
      {d.sections.map((s) => (
        <Card key={s.title} style={{ marginHorizontal: 20, padding: 16, gap: 10 }}>
          <Text size={17} lineHeight={22} weight={700} accessibilityRole="header">
            {s.title}
          </Text>
          {s.body.map((p, i) => (
            <Text key={i} size={15} lineHeight={22} color="text2">
              {p}
            </Text>
          ))}
        </Card>
      ))}
      {withLogos ? (
        <Card style={{ marginHorizontal: 20, padding: 16 }}>
          <PaymentLogos />
        </Card>
      ) : null}
    </Screen>
  );
}
