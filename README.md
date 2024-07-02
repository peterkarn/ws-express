# Web socket express test server

 - Clone project  
 - Install via npm/yarn/pnpm
 - Add `event.js` data into /events folder  (see existing examples)
 - Import evens/event.js into server_v2.js of server_v4.js
 - Run server 
 - `(npm/yarn/pnpm) start:v2`  will start on http://localhost:3334 (old socket connection server) 
 -  `(npm/yarn/pnpm) start:v4`  will start on http://localhost:3333 (new socket connection server) 

## Vue3

 - Config your vue3  `.env`  project file:
  `VITE_SOCKET_V2_EXEC=http://localhost:3334`
  `VITE_SOCKET_V4_EXEC=http://localhost:3333`
 -  Restart dev localhost with updated .env params  

## Nuxt
 - Add to your `nuxt.config.js` env paramenters:
 `SOCKET_V4_EXEC: 'http://localhost:3333'`
 `SOCKET_V2_EXEC: 'http://localhost:3334'`
  -  Restart dev localhost with updated NUXT configuration



