# Android Setup Guide - Bluetooth & Location

## Why Location Permission is Required

Android requires **Location Permission** for Bluetooth Low Energy (BLE) scanning. This is a platform requirement, not our choice.

**Why?** BLE beacons can be used to determine location, so Android treats BLE scanning as a location-sensitive feature.

## Required Permissions

The app needs these permissions (already configured in `app.json`):

```xml
ACCESS_FINE_LOCATION
BLUETOOTH
BLUETOOTH_ADMIN
BLUETOOTH_ADVERTISE
BLUETOOTH_CONNECT
BLUETOOTH_SCAN
```

## Setup Steps

### 1. Grant Location Permission

**Method A: When prompted**
- Launch the app
- When prompted "Allow blecch to access this device's location?"
- Tap **"Allow"** or **"While using the app"**

**Method B: Via Settings**
```
Settings → Apps → blecch → Permissions → Location → Allow
```

**Method C: Via ADB (for testing)**
```bash
adb shell pm grant com.chiazordaniel.blecch android.permission.ACCESS_FINE_LOCATION
```

### 2. Enable Location Services

**This is separate from app permissions!**

```
Settings → Location → Toggle ON
```

Or use quick settings:
- Swipe down from top
- Tap Location icon to enable

**Verify it's enabled:**
```bash
adb shell settings get secure location_mode
# Should return: 3 (high accuracy) or 1/2 (battery saving/device only)
# 0 = location off
```

### 3. Disable Battery Optimization (Recommended)

Battery optimization can interfere with Bluetooth scanning.

```
Settings → Apps → blecch → Battery → Unrestricted
```

Or via ADB:
```bash
adb shell dumpsys deviceidle whitelist +com.chiazordaniel.blecch
```

### 4. Rebuild After Permission Changes

If you modify `app.json` permissions:

```bash
npx expo prebuild --clean
npm run android
```

## Troubleshooting

### Permission Granted but Still Not Working

**Check if Location Services are enabled:**
```bash
adb shell settings get secure location_providers_allowed
# Should show: gps,network or similar
```

**Check permission status:**
```bash
adb shell dumpsys package com.chiazordaniel.blecch | grep -i permission
```

### App Crashes on Start

**Check logcat for errors:**
```bash
adb logcat | grep -i "bluetooth\|location\|bitchat"
```

Common errors:
- `SecurityException: Need ACCESS_FINE_LOCATION permission` → Grant permission
- `BluetoothAdapter.enable()` errors → Turn on Bluetooth in system settings

### Peers Not Discovered

Even with permissions granted, check:

1. **Bluetooth is ON**
   ```bash
   adb shell settings get global bluetooth_on
   # Should return: 1
   ```

2. **Location Services are ON**
   ```bash
   adb shell settings get secure location_mode
   # Should NOT return: 0
   ```

3. **App has permission**
   ```bash
   adb shell pm list permissions -g -d | grep -i location
   ```

### Background Scanning (Advanced)

For background BLE scanning, you need:

1. Foreground service notification
2. Additional manifest changes
3. Background location permission (Android 10+)

The current app is designed for **foreground use only**.

## Testing Checklist

```
[ ] Bluetooth enabled in system settings
[ ] Location services enabled (Settings → Location → ON)
[ ] Location permission granted to app
[ ] Battery optimization disabled for app
[ ] App rebuilt after permission changes
[ ] Both test devices meet above requirements
[ ] Devices within 10-30 meters
[ ] Apps in foreground
```

## Device-Specific Issues

### Samsung Devices
- Some Samsung devices have aggressive power management
- Go to: Settings → Device Care → Battery → App Power Management
- Add blecch to "Apps that won't be put to sleep"

### Xiaomi/MIUI
- MIUI has strict background restrictions
- Settings → Apps → Manage Apps → blecch → Autostart → Enable
- Settings → Battery → Unlock → blecch

### Huawei/EMUI
- Settings → Battery → App Launch → blecch → Manage Manually
- Enable all three options (Auto-launch, Secondary launch, Run in background)

### OnePlus
- Settings → Battery → Battery Optimization → blecch → Don't Optimize

## ADB Quick Reference

```bash
# Check if device is connected
adb devices

# Install APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# View live logs
adb logcat | grep -i bitchat

# Clear app data (fresh start)
adb shell pm clear com.chiazordaniel.blecch

# Force stop app
adb shell am force-stop com.chiazordaniel.blecch

# Launch app
adb shell am start -n com.chiazordaniel.blecch/.MainActivity

# Check Bluetooth adapter state
adb shell dumpsys bluetooth_manager

# Take bug report (comprehensive diagnostic)
adb bugreport
```

## Common Error Messages

### "Location must be enabled for Bluetooth scanning"
- **Fix**: Settings → Location → ON

### "Location required"
- **Fix**: Grant location permission to app

### "Bluetooth permission required"
- **Fix**: Grant Bluetooth permissions (Android 12+)
  ```bash
  adb shell pm grant com.chiazordaniel.blecch android.permission.BLUETOOTH_SCAN
  adb shell pm grant com.chiazordaniel.blecch android.permission.BLUETOOTH_CONNECT
  adb shell pm grant com.chiazordaniel.blecch android.permission.BLUETOOTH_ADVERTISE
  ```

### Empty peer list but no errors
- Usually means Location Services are off
- Check: Settings → Location → Ensure it's ON
- Not just permission - the system location must be enabled!

## Summary

**Two separate things needed:**

1. **App Permission**: ACCESS_FINE_LOCATION granted to blecch
2. **System Setting**: Location Services enabled in system settings

Both must be enabled for BLE scanning to work!

## Still Having Issues?

1. Run full diagnostic:
   ```bash
   adb logcat -c  # clear logs
   # Start the app, press "Start Chat"
   adb logcat | grep -E "Bitchat|Bluetooth|Location|BLE"
   ```

2. Check for crashes:
   ```bash
   adb logcat | grep -i "fatal\|crash\|exception"
   ```

3. Verify native module loaded:
   ```bash
   adb logcat | grep -i "BitchatModule"
   ```

If you see no Bluetooth-related logs at all, the native module may not be loaded. Rebuild:
```bash
cd android
./gradlew clean
cd ..
npx expo prebuild --clean
npm run android
```
