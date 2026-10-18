# ORDA — фан-приложение ФК «Ордабасы»

Expo SDK 57 · React Native 0.86 · TypeScript · expo-router. Одна кодовая база на iOS, Android и web
(web-сборка — кликабельный прототип по ссылке: https://theeviltea.github.io/FC-ORDA2/).

## Запуск

```bash
npm install
npm run web        # прототип в браузере
npm run ios        # / npm run android — через Expo Go или dev build
npm run typecheck
npm run lint
```

## Структура

```
design/tokens.json        токены из ORDA Design System (источник правды)
scripts/build-tokens.mjs  tokens.json → src/theme/tokens.ts  (npm run tokens)
src/theme/                цвета, градиенты, радиусы, тени, шрифты SO Sporty + Roboto Condensed
src/icons/icons.ts        иконки Hugeicons из компонента Icon дизайн-канваса
src/components/           компоненты 1:1 с дизайн-системой (TabBar, AppHeader, GuestHeader, NavBar, OfferBanner…)
src/data/                 моки (профиль, лента главной) и карта картинок
src/features/             экраны, собранные из компонентов
src/app/                  роуты expo-router: файл = роут
assets/                   шрифт SO Sporty и картинки, выгруженные с канваса
```

## Что готово

- Таб-бар: Главная · Медиа · Матчи · Магазин · Фан-зона (плавающая карточка, как в дизайне)
- Главная `/` — шапка с профилем и баллами, истории, билет, ближайший матч с обратным отсчётом,
  «Для вас», магазин, видео, игрок матча, команда, турнирная таблица, новости, партнёры
- Главная гостя `/guest` — шапка с лого ORDA и «Войти», баннер «Стань частью ORDA»
- Профиль `/profile` — открывается по аватару в шапке
- Остальные вкладки и экраны пока заглушки «Скоро здесь» (`/soon?title=…`)

## Правила

- Цвета — только из токенов (`colors.*` или имя токена в `color` у `Text`/`Icon`).
- Новые экраны собираем из `src/components`. Нужного компонента нет — сначала дизайн-система, потом сюда.
- Заголовки — SO Sporty (`<Text display>`), остальной текст — Roboto Condensed.
- Навбар второго уровня — `NavBar`: «Назад» слева, заголовок по центру, одна иконка справа.

## Деплой превью

Пуш в `main` → GitHub Actions собирает web (`npm run export:web`) и кладёт `dist` в ветку `gh-pages`.
GitHub Pages раздаёт её по адресу https://theeviltea.github.io/FC-ORDA2/.
