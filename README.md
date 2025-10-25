# blecch

Bluetooth mesh attendance app built with Expo (React Native). A lecturer starts an attendance session that broadcasts a code to nearby devices; students respond over Bluetooth mesh to mark themselves present.

This project depends on a native module (expo-bitchat) for Bluetooth mesh, so you must run a native build (Expo Dev Client or prebuilt app). It will not work in Expo Go.

## Features

- Toggle role: Lecturer or Student
- Nickname input
- Lecturer broadcasts an attendance code to a shared channel (#attendance)
- Students receive a prompt and can respond to mark themselves present
- Live list of connected peers
- Simple dedupe of attendance responses

## Prerequisites

- Node.js LTS (18+ recommended)
- Java 17 (for Android builds)
- Android Studio (SDKs, emulator, device bridge)
- Xcode (for iOS builds, physical device recommended for Bluetooth)
- A physical device is strongly recommended for Bluetooth testing (emulators/simulators typically do not support BLE)

## Install

From the project root:

```bash
npm install
# Align dependency versions with your Expo SDK (very important)
npx expo install
```

This aligns `react`, `react-native`, and other Expo-managed packages to versions compatible with your Expo SDK.

## Run (native/dev client)

Because Bluetooth requires native modules, you must run with a native build:

```bash
# Generate native projects (ios/ and android/)
npx expo prebuild

# Build and run on a device/emulator
npm run android
# or
npm run ios
```

Alternatively, if you use an existing Dev Client:

```bash
# Start the bundler for Dev Client
npx expo start --dev-client
```

Then open the app in your Dev Client on the device.

Note: Running with `expo start` in Expo Go will not load the native Bluetooth module; the mesh features won’t work.

## Usage

1. Launch the app on two or more devices.
2. Enter your nickname in the text field.
3. Toggle role:
   - Lecturer:
     - Tap “Start Attendance”
     - A code like `LEC-XXXX` is generated and broadcast
     - The UI shows the code and a list of responders
   - Student:
     - Wait for an “Attendance Request” prompt
     - Tap “Yes” to send your presence back to the lecturer
4. The “Connected” section shows nearby peers discovered via the mesh library.

## Bluetooth and Location notes

- Android:
  - Foreground location permission is required for Bluetooth scanning by platform policy.
  - Location services must be enabled (Settings > Location). The app checks this state and logs a warning if disabled.
  - Required permissions (already set in `app.json`): `BLUETOOTH`, `BLUETOOTH_ADMIN`, `BLUETOOTH_ADVERTISE`, `BLUETOOTH_CONNECT`, `BLUETOOTH_SCAN`, and `ACCESS_FINE_LOCATION`.
- iOS:
  - The appropriate usage descriptions are provided in `app.json` → `ios.infoPlist`:
    - `NSBluetoothAlwaysUsageDescription`
    - `NSBluetoothPeripheralUsageDescription`
    - `NSLocationWhenInUseUsageDescription`
  - Test on a physical device for BLE functionality.

## Project structure

- `App.js` — Main app and UI. Starts/stops the mesh, asks for permissions, broadcasts and receives attendance messages.
- `index.js` — Expo entry registering the root component.
- `app.json` — Expo config (icons, bundle IDs, permissions).
- `package.json` — Scripts and dependencies.
- `examples/AttendancePrototype.js` — An earlier/simpler prototype of the attendance screen (kept for reference).

## Development tips

- Dependency alignment
  - Ensure `react`, `react-native`, and other Expo-managed packages match your Expo SDK versions:
    ```bash
    npx expo install
    ```
- Native changes require a rebuild
  - If you change native-related config (e.g., `app.json` permissions), reinstall your Dev Client or rebuild the native app:
    ```bash
    # Recreate native projects and rebuild
    npx expo prebuild --clean
    npm run android
    # or
    npm run ios
    ```
- Bluetooth won’t work on web or in Expo Go
  - Mesh requires native code. Use a Dev Client or a prebuilt app.

## Troubleshooting

- “Failed to start mesh. Check Bluetooth & location.”
  - Ensure Bluetooth is ON and allowed for the app.
  - On Android, ensure Location permission is granted and Location services are enabled.
  - Rebuild the Dev Client/app after changing native dependencies or permissions.
- Build failures after SDK changes
  - Clean and regenerate native projects:
    ```bash
    npx expo prebuild --clean
    ```
  - Clear Gradle/Xcode caches if necessary and rebuild.
- Peers list or responses not updating
  - Ensure devices are physically close enough and have Bluetooth enabled.
  - Keep the app in the foreground while testing.
  - Test with at least two physical devices.

## Known limitations

- Student responses are sent publicly on channel `#attendance`. If you need private responses, implement a unicast send (depends on expo-bitchat capabilities).
- Simple deduping based on “sender|code”.
- No persistence; data resets when the app restarts.
- Mesh connectivity is best-effort and proximity-based.

## Scripts

- Start bundler (web won’t support BLE): `npm run start`
- Android: `npm run android`
- iOS: `npm run ios`
- Web (for UI preview only; BLE will not work): `npm run web`

## License

MIT (or your preferred license)

---
Built with Expo. See:
- https://docs.expo.dev/
- https://docs.expo.dev/workflow/prebuild/# ble-core
