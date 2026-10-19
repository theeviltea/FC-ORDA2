import type { Personal } from './prefs';

/** Registration form handed from /register to the SMS step; applied once the code is confirmed. */
export const pendingSignup: { current: { personal: Personal; avatar: string | null } | null } = { current: null };
