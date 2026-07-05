# froke Frontend

Expo React Native app configured for a custom development client.

This app does not run in Expo Go. Build and install the custom `froke` development client with EAS, then run the Expo dev server.

## Env Vars

Create `.env`:

```bash
cp .env.example .env
```

Required values:

```bash
EXPO_PUBLIC_API_BASE_URL=http://YOUR_BACKEND_HOST:9090/api
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_EAS_PROJECT_ID=
```

Use `http://localhost:9090/api` for an iOS simulator. Use your Mac's Wi-Fi IP, such as `http://192.168.1.25:9090/api`, for a physical phone.

## Phone Setup

```bash
npm install
npx eas login
npx eas build:configure
npx eas build --profile development --platform android
```

or:

```bash
npx eas build --profile development --platform ios
```

Install the finished EAS development build on your phone, then start Metro:

```bash
npm start
```

Open the installed `froke` development client and connect to the dev server.
