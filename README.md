# yapper

Simple chat app with a vite+preact frontend, bun backend and pocketbase for auth and db.

Made for [Hack Club Summer Of Making](https://summer.hackclub.com/)

Only AI used here is Copilot (free from github student pack) for some tab suggestions here and there, however it's mostly my work!

## How to run it

In one terminal, setup pocketbase:

```bash
cd packages/pocketbase
pocketbase serve
# Create superuser in browser
# It should automatically restore from migrations
```

and in another start the backend:

```bash
cd packages/backend
bun i
bun index.ts
```

and in yet another terminal start the frontend:

```bash
cd packages/frontend
bun i
bun dev
```
