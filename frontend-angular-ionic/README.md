# Mobility Sharing Frontend Angular Ionic

Standalone Mobility Sharing web frontend built with Angular and Ionic.

## Development

```bash
npm install
npm start
```

The app expects the backend at:

```text
http://localhost:8080
```

## Build

```bash
npm run build
```

## Docker

From the monorepo root:

```bash
docker compose up -d --build frontend-ionic
```

Frontend URL:

```text
http://localhost:3000
```

This project is independent from the React Native/Expo frontend located at `../frontend-react-expo`.
