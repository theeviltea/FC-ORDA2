import { router } from 'expo-router';

/** Screens that are designed on the canvas but not built yet open a placeholder with their title. */
export const soon = (title: string) => () => router.push({ pathname: '/soon', params: { title } });
