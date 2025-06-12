# Web socket events testing tool

- Clone project
- Install via npm/yarn/pnpm
- Run server
- `(npm/yarn/pnpm) start:v2` will start on http://localhost:3332 (V2 connection server)
- `(npm/yarn/pnpm) start:v4` will start on http://localhost:3334 (V4 connection server)

## Vue3

- Config your vue3 `.env.development` project file:
  `VITE_SOCKET_V2_EXEC=http://localhost:3332`
  `VITE_SOCKET_V4_EXEC=http://localhost:3334`
- Restart dev localhost with updated .env params

## Nuxt

- Add to your `nuxt.config.js` env paramenters:
  `SOCKET_V2_EXEC: 'http://localhost:3332'`
  `SOCKET_V4_EXEC: 'http://localhost:3334'`
- Restart dev localhost with updated NUXT configuration
