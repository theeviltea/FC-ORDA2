import { View } from 'react-native';

import { Text } from './Text';

/** Title of a tab section under the app header (SO Sporty 34, uppercase). */
export function PageTitle({ children }: { children: string }) {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Text display size={34} lineHeight={38} upper>
        {children}
      </Text>
    </View>
  );
}
