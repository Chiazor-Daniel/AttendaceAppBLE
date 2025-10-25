# Troubleshooting Guide - Message Reception Issues

## Quick Diagnostics

### 1. Check Module Availability
After starting the app, check the console logs for:
```
🔍 Checking BitchatAPI availability...
BitchatAPI: [object Object]
BitchatAPI.startServices: function
BitchatAPI.sendMessage: function
BitchatAPI.addMessageListener: function
```

If you see `undefined` for any of these, the native module is not properly linked.

### 2. Test Local Echo
Press the **🧪 Test Echo** button to verify the message handling pipeline works without requiring a second device. If this works, the issue is with Bluetooth connectivity, not the message handler.

### 3. Check Debug Status
Press the **🔍 Debug** button to see the internal state of the mesh service (if available on your platform).

## Common Issues

### Messages Not Being Received

#### Issue: No messages appear when sent from another device

**Checklist:**
- [ ] Both devices have pressed "Start"
- [ ] Both devices are using the **same channel** (default: `#general`)
- [ ] Bluetooth is enabled on both devices
- [ ] Devices are within Bluetooth range (typically 10-30 meters)
- [ ] Both apps are in the **foreground** (background operation requires additional setup)
- [ ] On Android: Location permission granted AND Location services enabled
- [ ] On iOS: Bluetooth permission granted

**Console Logs to Check:**
```
✅ startServices() completed
✅ Message listener added
📋 Peers fetched: { "peer-id-123": "OtherNickname" }
```

If you don't see these logs, the service didn't start properly.

#### Issue: Peers list is empty

**This means devices aren't discovering each other:**

**Android:**
1. Go to Settings → Location → Enable Location services
2. Grant Location permission to the app
3. Disable battery optimization for the app:
   - Settings → Apps → blecch → Battery → Unrestricted
4. Ensure Bluetooth is ON in system settings
5. Rebuild the app after any permission changes:
   ```bash
   npx expo prebuild --clean
   npm run android
   ```

**iOS:**
1. Grant Bluetooth permission when prompted
2. Test on a **physical device** (simulators don't support BLE)
3. Keep the app in the foreground
4. Check Settings → Privacy → Bluetooth → Enable for blecch

**Debug Steps:**
```bash
# Android: Check logcat for Bluetooth errors
adb logcat | grep -i "bluetooth\|bitchat"

# iOS: Check console in Xcode for errors
```

#### Issue: Message listener not firing

**Console should show:**
```
📨 MESSAGE RECEIVED: {...}
🔔 Message listener fired!
```

If you see messages sent but no listener firing:

1. **Verify listener is added**: Look for `✅ Message listener added` in logs
2. **Check if delegate is being called**: 
   - Android: Search logs for `didReceiveMessage`
   - iOS: Search Xcode console for `didReceiveMessage`
3. **Ensure services started**: Look for `🎉 Bitchat fully started and listening`

**Possible causes:**
- Services stopped unexpectedly (check for `⏹️ Stopping services...` in logs)
- Native module not properly rebuilt after code changes
- Event emitter not working (check Expo SDK version compatibility)

### Messages Sent But Not Delivered

#### Console shows `📤 Sending message` but recipient doesn't receive

**This is a mesh networking issue:**

1. **Check TTL (Time To Live)**: Messages expire after a certain number of hops
2. **Verify intermediate peers**: If devices are far apart, you need peers in between to relay
3. **Check channel matching**: Sender and receiver must be on the same channel
4. **Bluetooth interference**: Move away from WiFi routers, microwaves, other BLE devices

**Test with devices close together:**
- Place both devices within 1 meter
- Ensure no obstacles between them
- Try sending again

## Build Issues

### Module Not Found or Native Errors

```bash
# Clean rebuild
rm -rf node_modules
npm install
npx expo prebuild --clean
npm run android  # or npm run ios
```

### Android Build Failures

```bash
# Clean Gradle cache
cd android
./gradlew clean
cd ..
npx expo prebuild --clean
npm run android
```

### iOS Build Failures

```bash
# Clean pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

## Advanced Debugging

### Enable Verbose Logging

The app already has comprehensive logging. Use your device's console:

**Android:**
```bash
adb logcat | grep -E "🔔|📨|📤|📋|BitchatModule"
```

**iOS (Xcode):**
1. Connect device
2. Window → Devices and Simulators
3. Select your device
4. View Console
5. Filter for "Bitchat" or emoji markers

### Check Native Module Loading

Add this to your App.js temporarily:
```javascript
import { NativeModules } from 'react-native';
console.log('Native Bitchat module:', NativeModules.Bitchat);
```

If `undefined`, the module isn't linked properly.

### Verify Bluetooth Service UUIDs

Check if your devices are advertising/scanning for the correct UUIDs:

**Android (using nRF Connect app):**
1. Install nRF Connect from Play Store
2. Scan for devices
3. Look for service UUID: Check expo-bitchat source for the expected UUID

## Permission Issues

### Android Location Required

Bluetooth Low Energy scanning on Android **requires** location permission due to platform policy (not our choice). This is because BLE can be used to infer location.

**Grant permission:**
```bash
adb shell pm grant com.chiazordaniel.blecch android.permission.ACCESS_FINE_LOCATION
```

**Enable location services:**
Settings → Location → ON

### iOS Bluetooth Permission

First launch will prompt for permission. If denied:
Settings → Privacy → Bluetooth → Enable for blecch

## Testing Checklist

Use this checklist when testing message reception:

```
Device A (Sender):
[ ] App installed and launched
[ ] Bluetooth ON
[ ] Location ON (Android)
[ ] Permissions granted
[ ] Nickname entered: "Alice"
[ ] Channel set to: "#test"
[ ] Pressed "Start"
[ ] Console shows: "🎉 Bitchat fully started and listening"
[ ] Peers list shows Device B

Device B (Receiver):
[ ] App installed and launched
[ ] Bluetooth ON
[ ] Location ON (Android)
[ ] Permissions granted
[ ] Nickname entered: "Bob"
[ ] Channel set to: "#test"
[ ] Pressed "Start"
[ ] Console shows: "🎉 Bitchat fully started and listening"
[ ] Peers list shows Device A

Send Test:
[ ] Device A: Type "Hello from Alice"
[ ] Device A: Press "Send"
[ ] Device A console: "📤 Sending message to #test: Hello from Alice"
[ ] Device A console: "✅ sendMessage() completed"
[ ] Device B console: "📨 MESSAGE RECEIVED: {...}"
[ ] Device B console: "🔔 Message listener fired!"
[ ] Device B UI: Message appears in message list
```

If any step fails, refer to the relevant section above.

## Still Not Working?

1. **Try the Test Echo button** to verify the UI pipeline works
2. **Check that expo-bitchat is version 0.1.0 or later** in package.json
3. **Verify Expo SDK version**: This app requires SDK 50+
4. **Rebuild from scratch**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npx expo prebuild --clean
   npm run android  # or ios
   ```
5. **Test on different devices**: Some devices have better Bluetooth radios than others
6. **Check for OS-level Bluetooth issues**: Try pairing a Bluetooth headset to verify BLE works

## Getting Help

When reporting issues, include:
- Device models (both sender and receiver)
- OS versions
- Console logs from both devices (especially lines with 📨, 📤, 🔔)
- Whether "Test Echo" button works
- Peer list contents on both devices
- Distance between devices when testing