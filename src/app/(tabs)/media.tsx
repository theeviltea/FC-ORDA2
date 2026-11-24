import { View } from 'react-native';

import { MediaScreen } from '@/features/media/MediaScreen';
import { AiFab } from '@/features/social/parts';

export default function Tab() {
  return (
    <View style={{ flex: 1 }}>
      <MediaScreen />
      <AiFab />
    </View>
  );
}
