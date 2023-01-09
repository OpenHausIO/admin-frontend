# vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

> NOTE: You need to run the [backend](https://github.com/OpenHausIO/backend) to develop the frontend
> E.g. as [Docker Container](https://github.com/OpenHausIO/backend/blob/main/docs/DOCKER.md) or application on the host machine

```sh
npm install
```

### Create Admin account
```sh
curl -v -X PUT --unix-socket /tmp/open-haus.sock \
   http://127.0.0.1:8080/api/users \
   -H "Content-Type: application/json" \
   -d '{"email":"info@example.com","password":"Pa$$w0rd", "name":"Administrator", "enabled": "true", "admin": "true"}'
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Description
This is a User Interface for the HTTP backend API.<br />
Its basicly a GUI for the [postman collection](https://github.com/OpenHausIO/backend/blob/dev/postman.json).

> The "Admin frontend" is a early work in progress project, that doesn't get the love it needs.

## Screenshots
![Dashboard](./docs/img/dashboard.png)
--
![Rooms](./docs/img/rooms.png)
--
![Devices](./docs/img/devices.png)
--
![Endpoints](./docs/img/endpoints.png)
--
![Plugins](./docs/img/plugins.png)
--
![Plugins](./docs/img/plugins-install.png)
--
![Users](./docs/img/users.png)
--
![Vault](./docs/img/vault.png)
--
![SSDP](./docs/img/ssdp.png)