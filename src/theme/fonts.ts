import {
  RobotoCondensed_400Regular,
  RobotoCondensed_500Medium,
  RobotoCondensed_600SemiBold,
  RobotoCondensed_700Bold,
} from '@expo-google-fonts/roboto-condensed';

/** Brand fonts: SO Sporty for display (headlines, numbers), Roboto Condensed for body text. */
export const fontAssets = {
  SOSporty: require('../../assets/fonts/SOSporty.ttf'),
  RobotoCondensed_400Regular,
  RobotoCondensed_500Medium,
  RobotoCondensed_600SemiBold,
  RobotoCondensed_700Bold,
};

export type Weight = 400 | 500 | 600 | 700;

export const bodyFamily: Record<Weight, string> = {
  400: 'RobotoCondensed_400Regular',
  500: 'RobotoCondensed_500Medium',
  600: 'RobotoCondensed_600SemiBold',
  700: 'RobotoCondensed_700Bold',
};

export const displayFamily = 'SOSporty';
