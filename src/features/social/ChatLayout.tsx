import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Star } from '@/components';
import { colors } from '@/theme';

/** Экран-переписка: шапка поверх, лента прижата к низу и прокручивается к последнему сообщению, поле ввода снизу. */
export function ChatLayout({ header, children, composer, overlay, scrollKey }: { header: ReactNode; children: ReactNode; composer: ReactNode; overlay?: ReactNode; scrollKey?: unknown }) {
  const insets = useSafeAreaInsets();
  const ref = useRef<ScrollView>(null);
  useEffect(() => {
    const t = setTimeout(() => ref.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t);
  }, [scrollKey]);
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient pointerEvents="none" colors={['#DCEEF8', colors.bg]} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 320 }} />
      <Star w={140} fill="rgba(18,158,217,0.07)" style={{ right: -50, top: 150 }} />
      <Star w={70} fill="rgba(18,158,217,0.06)" style={{ left: -24, top: 470 }} />
      <ScrollView ref={ref} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingTop: insets.top + 76, paddingHorizontal: 14, paddingBottom: 16, gap: 8 }} keyboardShouldPersistTaps="handled" onContentSizeChange={() => ref.current?.scrollToEnd({ animated: false })}>
        {children}
      </ScrollView>
      {composer}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: insets.top + 6, paddingHorizontal: 16, paddingBottom: 8 }} pointerEvents="box-none">
        {header}
      </View>
      {overlay}
    </KeyboardAvoidingView>
  );
}
