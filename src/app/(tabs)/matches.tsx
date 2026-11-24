import { View } from 'react-native';

import { MatchesScreen } from '@/features/matches/MatchesScreen';
import { AiFab } from '@/features/social/parts';

export default function Tab() {
  return (
    <View style={{ flex: 1 }}>
      <MatchesScreen />
      <AiFab />
    </View>
  );
}
