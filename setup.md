# froke Setup Guide

This project is one mobile app split into two separate parts:

- `backend/`: a FastAPI API written in Python. It talks to MongoDB.
- `frontend/`: an Expo React Native app. It talks to the backend and uses Firebase for login and image uploads.

Run the backend and frontend in two separate terminal windows.

## 1. What You Need Installed

Install these first:

1. Python 3.11 or newer
2. Node.js 18 or newer
3. npm, which normally comes with Node.js
4. MongoDB, either local MongoDB on your Mac or a hosted MongoDB Atlas database
5. An Expo account
6. A Firebase project
7. For a real iPhone: an Apple Developer Program membership, because this app uses a custom Expo development build instead of Expo Go

Useful sites:

- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/
- MongoDB Atlas: https://www.mongodb.com/atlas
- Firebase console: https://console.firebase.google.com/
- Expo: https://expo.dev/
- Apple Developer Program: https://developer.apple.com/programs/

## 2. Services You Need To Create

### MongoDB

The backend stores locations and reviews in MongoDB.

You have two options:

#### Option A: Local MongoDB

Use this if you want the simplest local development setup.

Your backend env value will be:

```bash
MONGO_URL=mongodb://localhost:27017/froke
DATABASE_NAME=froke
```

#### Option B: MongoDB Atlas

Use this if you want a hosted database.

Steps:

1. Go to https://www.mongodb.com/atlas
2. Create or sign in to your account.
3. Create a cluster.
4. Create a database user.
5. Allow your IP address in Network Access.
6. Click Connect.
7. Choose Drivers / Connect your application.
8. Copy the connection string.

It will look roughly like this:

```bash
mongodb+srv://USERNAME:PASSWORD@cluster-name.xxxxx.mongodb.net/froke
```

Use that as `MONGO_URL`.

MongoDB official connection docs: https://www.mongodb.com/docs/atlas/driver-connection/

### Firebase

The frontend uses Firebase for:

- Email/password login and signup
- Firebase Storage image uploads
- Firestore initialization, although this codebase does not currently use much Firestore data directly

Steps:

1. Go to https://console.firebase.google.com/
2. Create a Firebase project.
3. In the project overview, add a Web app.
4. Firebase will show a config object with values like `apiKey`, `authDomain`, `projectId`, and `appId`.
5. Copy those values into `frontend/.env`.
6. In Firebase Authentication, enable Email/Password sign-in.
7. In Firebase Storage, create a storage bucket.

Firebase official setup docs: https://firebase.google.com/docs/web/setup

### Expo / EAS

The app uses `expo-dev-client`, so it is not meant to run inside Expo Go. You need to build and install a custom development client.

Steps:

1. Create an Expo account at https://expo.dev/
2. Log in from the terminal with `npx eas login`.
3. Use EAS Build to create an iOS development build.

Expo development build docs: https://docs.expo.dev/develop/development-builds/create-a-build/

Expo internal distribution docs: https://docs.expo.dev/build/internal-distribution/

## 3. Backend Environment Variables

Create this file:

```bash
backend/.env
```

You can copy the example:

```bash
cd /Users/merong/Developer/my-app/backend
cp .env.example .env
```

The file should contain:

```bash
MONGO_URL=mongodb://localhost:27017/froke
DATABASE_NAME=froke
PORT=9090
ENVIRONMENT=development
```

What each one means:

- `MONGO_URL`: the MongoDB connection string. Use local MongoDB or MongoDB Atlas.
- `DATABASE_NAME`: the database name inside MongoDB. The app expects `froke`.
- `PORT`: the backend port. The frontend is set up to call port `9090`.
- `ENVIRONMENT`: currently only informational. Use `development` locally.

If you use MongoDB Atlas, `MONGO_URL` should be your Atlas connection string instead of the localhost value.

## 4. Frontend Environment Variables

Create this file:

```bash
frontend/.env
```

Copy the example:

```bash
cd /Users/merong/Developer/my-app/frontend
cp .env.example .env
```

The file should contain:

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

Where to get each value:

- `EXPO_PUBLIC_API_BASE_URL`: your backend API URL.
- `EXPO_PUBLIC_FIREBASE_API_KEY`: Firebase Web app config, `apiKey`.
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase Web app config, `authDomain`.
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`: Firebase Web app config, `projectId`.
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase Web app config, `storageBucket`.
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase Web app config, `messagingSenderId`.
- `EXPO_PUBLIC_FIREBASE_APP_ID`: Firebase Web app config, `appId`.
- `EXPO_PUBLIC_EAS_PROJECT_ID`: Expo/EAS project ID. The current `app.config.js` has a fallback project ID, so this can be blank at first, but it is better to let EAS configure it for your own Expo project.

Important: because these variables start with `EXPO_PUBLIC_`, they are bundled into the mobile app. Do not put private server secrets in frontend env variables.

## 5. Run The Backend

Open terminal window 1:

```bash
cd /Users/merong/Developer/my-app/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 9090
```

If `backend/.env` already exists, do not overwrite it unless you mean to. Just edit it.

Check that the backend is running:

```bash
curl http://localhost:9090/api
```

You should see a JSON list of API endpoints.

## 6. Run The Frontend

Open terminal window 2:

```bash
cd /Users/merong/Developer/my-app/frontend
npm install
cp .env.example .env
npm start
```

Again, if `frontend/.env` already exists, do not overwrite it unless you mean to. Edit it instead.

`npm start` runs:

```bash
expo start --dev-client
```

That means the QR code is for the custom `froke` development client, not Expo Go.

## 7. Run It On Your iPhone

There are two separate connections to think about:

1. Your iPhone connects to the Expo dev server on your Mac.
2. The app running on your iPhone connects to the FastAPI backend on your Mac.

For a physical iPhone, `localhost` means the phone itself, not your Mac. So this will not work on a real phone:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:9090/api
```

You need your Mac's Wi-Fi IP address.

Find it with:

```bash
ipconfig getifaddr en0
```

If that prints:

```bash
192.168.1.25
```

then put this in `frontend/.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.25:9090/api
```

Now run the backend with this host:

```bash
cd /Users/merong/Developer/my-app/backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 9090
```

Then build the iPhone development client:

```bash
cd /Users/merong/Developer/my-app/frontend
npx eas login
npx eas build:configure
npx eas build --profile development --platform ios
```

EAS will guide you through Apple credentials and device registration. For a physical iPhone, Apple requires the Apple Developer Program for normal internal development distribution. Apple currently lists the membership as `$99 annual membership` on its program page.

When the build finishes:

1. Open the EAS install link on your iPhone.
2. Install the `froke` development client.
3. On your Mac, run `npm start` inside `frontend/`.
4. Open the installed `froke` app on your iPhone.
5. Connect it to the Expo dev server.

Your Mac and iPhone must be on the same Wi-Fi network.

## 8. Running On iOS Simulator Instead

If you have Xcode installed and only want to use the iOS simulator, this is easier than a real iPhone.

Use this frontend env value:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:9090/api
```

Then run:

```bash
cd /Users/merong/Developer/my-app/frontend
npm install
npx expo run:ios
```

If the native iOS project has not been generated yet, Expo will generate it.

## 9. Backend Tests

Run:

```bash
cd /Users/merong/Developer/my-app/backend
source .venv/bin/activate
pytest
```

The tests use a fake in-memory database, so they do not require your real MongoDB database to be running.

## 10. What Is Missing Or Easy To Trip Over

### No seed script

The backend expects MongoDB collections named:

- `locations`
- `reviews`

There is no seed command in this repo. If your database is empty, the app can still run, but screens that list locations or reviews may look empty.

You will either need to:

- Add data manually in MongoDB, or
- Create a seed script later.

### Frontend `.env` is not currently present

This repo has `frontend/.env.example`, but no `frontend/.env` yet. You need to create it.

### Firebase must be configured

The app imports Firebase immediately. Empty Firebase values can cause login, signup, and upload flows to fail.

Make sure you enabled:

- Firebase Authentication with Email/Password
- Firebase Storage

### This is not an Expo Go app

The project includes native dependencies like `expo-dev-client`, `react-native-maps`, `expo-location`, image picker, SQLite, and video. Use a custom development client.

### Localhost changes on a real phone

Use `localhost` only for your Mac or simulator.

Use your Mac's Wi-Fi IP address for a physical iPhone.

### Backend must bind to all network interfaces for phone testing

Use:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 9090
```

If you use `127.0.0.1`, your iPhone will not be able to reach the backend.

### macOS firewall can block the phone

If the iPhone cannot load data:

1. Confirm backend is running.
2. Confirm phone and Mac are on the same Wi-Fi.
3. Confirm `EXPO_PUBLIC_API_BASE_URL` uses the Mac Wi-Fi IP.
4. Check macOS firewall settings.
5. Try opening `http://YOUR_MAC_WIFI_IP:9090/api` in Safari on the iPhone.

### Firebase Storage rules may block uploads

During early development, uploads can fail if Firebase Storage rules reject the request. Keep rules secure, but make sure authenticated users can upload if that is the intended behavior.

### The app uses public Firebase config

Firebase Web app config is okay to expose in a client app, but Firebase Security Rules are what protect your data. Do not rely on `.env` secrecy for frontend values.

## 11. Quick Start Summary

Terminal 1:

```bash
cd /Users/merong/Developer/my-app/backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 9090
```

Terminal 2:

```bash
cd /Users/merong/Developer/my-app/frontend
npm install
npm start
```

For a real iPhone, set:

```bash
EXPO_PUBLIC_API_BASE_URL=http://YOUR_MAC_WIFI_IP:9090/api
```

Then build/install the development client:

```bash
npx eas build --profile development --platform ios
```
