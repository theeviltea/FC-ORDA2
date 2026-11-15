import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { Appear, PointsPill, ResultButton, ResultScreen } from '@/components';
import { img } from '@/data/images';
import { colors } from '@/theme';

/** Фото показали на табло: +30 баллов. */
export default function PhotoShown() {
  return (
    <>
      <StatusBar style="light" />
      <ResultScreen
        top={
          <Appear kind="pop" delay={100} float>
            <View style={{ width: 200, height: 150, borderRadius: 16, padding: 6, backgroundColor: '#0A1530', borderWidth: 2, borderColor: colors.sky, transform: [{ rotate: '-3deg' }] }}>
              <Image source={img.photoFans} accessibilityLabel="Ваше фото на табло" style={{ flex: 1, borderRadius: 10 }} contentFit="cover" contentPosition={{ top: '20%', left: '35%' }} />
            </View>
          </Appear>
        }
        title="Вы на табло!"
        text="Ваше фото показали на большом экране на 34-й минуте. Весь стадион вас видел!"
        actions={
          <>
            <ResultButton label="К играм" onPress={() => router.dismissTo('/interactive')} />
            <ResultButton label="Отправить ещё фото" icon="camera-01" outline onPress={() => router.replace('/stadium/photo')} />
          </>
        }>
        <PointsPill n="+30 баллов" />
      </ResultScreen>
    </>
  );
}
