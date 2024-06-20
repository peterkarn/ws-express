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
 -  Restart dev localhost with new .env params  

## Nuxt
 - To test **v2 connection (old)** you can temporary replace
 `connection: GetApiDomain({ isDev, $config, req, env }, 'socket'),`
*with*
 `connection: 'http://localhost:3334',`
while *VueSocketIO* being initialized in  *app/plugins/socket.client.js*
 - To test **v4 connection (new)** node_modules/@altacore/plugin-helpers/dist/esm/socketService.js should be temporary edited. Setup io connection  with `this.#socket = io('http://localhost:3333',options)`   

**IMPORTANT: don't forger revert changes**



