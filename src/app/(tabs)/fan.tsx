import { View } from 'react-native';

import { FanZoneScreen } from '@/features/fan/FanZoneScreen';
import { AiFab } from '@/features/social/parts';

export default function Tab() {
  return (
    <View style={{ flex: 1 }}>
      <FanZoneScreen />
      <AiFab />
    </View>
  );
}
