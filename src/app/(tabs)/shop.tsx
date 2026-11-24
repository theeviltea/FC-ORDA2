import { View } from 'react-native';

import { ShopScreen } from '@/features/shop/ShopScreen';
import { AiFab } from '@/features/social/parts';

export default function Tab() {
  return (
    <View style={{ flex: 1 }}>
      <ShopScreen />
      <AiFab />
    </View>
  );
}
