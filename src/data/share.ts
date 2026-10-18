import { Share } from 'react-native';

/** Opens the system share sheet; ignored where sharing is unavailable (some web views). */
export const share = (message: string) => () => {
  Share.share({ message }).catch(() => undefined);
};
