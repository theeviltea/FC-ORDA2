# Notes for coding agents

- Expo SDK 57. Install packages with `npx expo install <pkg>` (falls back to the `sdk-57` npm dist-tag).
- Check the versioned Expo docs for SDK 57 before using an API.
- Before committing run `npm run typecheck` and `npm run lint`.
- Design source: the «ORDA Fan App» design canvas and «ORDA Design System». Match them 1:1.
- Colours only from `src/theme/tokens.ts` (generated — edit `design/tokens.json`, then `npm run tokens`).
