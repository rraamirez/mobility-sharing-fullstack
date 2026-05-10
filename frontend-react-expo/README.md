# Mobility Sharing Frontend React Native Expo

React Native/Expo frontend for Mobility Sharing.

This app can run on:

- Expo Go on a physical mobile device.
- Android Emulator.
- iOS Simulator.
- Web, through Expo export and the Docker setup in the monorepo root.

## Development

```bash
npm install
npm start
```

## Backend URL

For Docker web builds, the app uses:

```text
http://localhost:8080
```

For a physical mobile device with Expo, use your computer's local network IP:

```powershell
$env:EXPO_PUBLIC_API_URL="http://YOUR_LOCAL_IP:8080"
npm start
```

For Android Emulator:

```powershell
$env:EXPO_PUBLIC_API_URL="http://10.0.2.2:8080"
npm start
```

## Web Build

```bash
npm run export:web
```

The Dockerfile exports the web version and serves it through Nginx.
