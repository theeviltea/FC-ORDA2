import { useLocalSearchParams } from 'expo-router';

import { NavBar, Screen } from '@/components';
import { ComingSoon } from '@/features/stub/TabStub';

/** Placeholder for screens that exist on the design canvas but are not built yet. */
export default function Soon() {
  const { title } = useLocalSearchParams<{ title?: string }>();
  return (
    <Screen gap={16} header={<NavBar title={title ?? 'Скоро'} />}>
      <ComingSoon />
    </Screen>
  );
}
