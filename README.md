# froke

`froke` is one app split into two independent projects in one fresh repo:

```text
my-app/
  frontend/  Expo React Native app with a custom development client
  backend/   FastAPI API backed by MongoDB
```

There is no Nx, Turborepo, or workspace setup. Run each side from its own folder.

## What To Install

On your Mac:

- Python 3.11 or newer
- Node.js 18 or newer
- npm
- MongoDB Community Edition, or another MongoDB instance you can connect to
- An Expo account

For building/running the phone app:

- Install the Expo CLI/EAS CLI through `npx`; no global install is required.
- iPhone: you need an Apple Developer account for installing an EAS development build on a physical iPhone.
- Android: you can install the EAS development APK on your phone.
- You do not run this app in Expo Go. Build and install the custom `froke` development client instead.

## Backend Env Vars

Create `backend/.env` from `backend/.env.example`:

```bash
MONGO_URL=mongodb://localhost:27017/froke
DATABASE_NAME=froke
PORT=9090
ENVIRONMENT=development
```

For a hosted MongoDB, replace `MONGO_URL` with that connection string.

## Frontend Env Vars

Create `frontend/.env` from `frontend/.env.example`:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:9090/api
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_EAS_PROJECT_ID=
```

Firebase is used for email/password auth and image uploads. Fill every `EXPO_PUBLIC_FIREBASE_*` value from your Firebase project settings before testing login, signup, review posting, or image upload flows.

`EXPO_PUBLIC_EAS_PROJECT_ID` is optional until you connect the Expo project with EAS. EAS can add it for you when you configure/build the project.

## Run The Backend

From `/Users/merong/Developer/my-app`:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 9090
```

Use `--host 0.0.0.0` when testing from a phone. It lets other devices on your Wi-Fi reach the API.

Check it from your Mac:

```bash
curl http://localhost:9090/api
```

Find your Mac's Wi-Fi IP:

```bash
ipconfig getifaddr en0
```

If that prints `192.168.1.25`, your phone should use:

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.25:9090/api
```

Your phone and Mac must be on the same Wi-Fi. If the phone cannot connect, check macOS firewall settings and make sure MongoDB and the backend are running.

## Run The Frontend On A Phone

From `/Users/merong/Developer/my-app`:

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`.

For an iOS simulator, this is fine:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:9090/api
```

For a physical phone, use your Mac's LAN IP:

```bash
EXPO_PUBLIC_API_BASE_URL=http://YOUR_MAC_WIFI_IP:9090/api
```

Log in to Expo/EAS:

```bash
npx eas login
```

Configure EAS if the project has not been connected yet:

```bash
npx eas build:configure
```

Build a development client.

Android phone:

```bash
npx eas build --profile development --platform android
```

When the build finishes, open the install link or QR code from EAS on your Android phone and install the `froke` development client.

iPhone:

```bash
npx eas build --profile development --platform ios
```

When the build finishes, install the `froke` development client from the EAS link. Physical iPhone installation requires the Apple account/device provisioning flow that EAS guides you through.

Start the dev server:

```bash
npm start
```

Open the installed `froke` development client on your phone and connect to the Expo dev server. If the QR code does not connect, make sure the phone and Mac are on the same Wi-Fi and that `EXPO_PUBLIC_API_BASE_URL` uses the Mac LAN IP.

## Run Backend Tests

```bash
cd backend
source .venv/bin/activate
pytest
```

## API Routes

- `GET /api`
- `GET /api/locations`
- `GET /api/locations/:location_id`
- `POST /api/locations`
- `GET /api/locations/:location_id/reviews`
- `POST /api/locations/:location_id/reviews`
- `PATCH /api/reviews/:review_id`
- `DELETE /api/reviews/:review_id`

## Data Notes

The migrated backend preserves the original MongoDB document style and numeric `location_id` / `review_id` contract. It does not include an automatic seed command yet, so point `MONGO_URL` at a database with the expected `locations` and `reviews` collections or insert test data manually while developing.
