# Quick Test Guide - Message Reception

## ✅ What Changed

The app now has:
- **Fixed channel**: `#general` (locked, can't be changed)
- **Better warnings**: Clear alerts when no peers are connected
- **Improved UI**: Shows peer count and connection status prominently
- **Debug tools**: Test Echo button to verify your message handler works

## 🚀 Quick Test (2 Devices)

### Device A Setup
1. Open app
2. Enter nickname: **"Alice"**
3. Press **"▶️ Start Chat"**
4. Wait for status: `✅ Running - Waiting for peers...`
5. Check console for: `🎉 Bitchat fully started and listening`

### Device B Setup
1. Open app
2. Enter nickname: **"Bob"**
3. Press **"▶️ Start Chat"**
4. Wait for status: `✅ Running - Waiting for peers...`
5. Check console for: `🎉 Bitchat fully started and listening`

### Verify Peer Discovery
**Both devices should show:**
- Connected Peers: `(1)` or higher
- Green checkmark next to peer nickname

**Console logs should show:**
```
🆕 Peer connected: Alice (or Bob)
📋 Peers fetched: { "peer-id-xxx": "Alice" }
```

### Send Test Message
**On Device A:**
1. Type: **"Hello from Alice"**
2. Press **"📤 Send"**
3. Console shows: `📤 Sending message to #general: Hello from Alice`
4. Console shows: `✅ sendMessage() completed`

**On Device B:**
1. Console shows: `📨 MESSAGE RECEIVED: {...}`
2. Console shows: `🔔 Message listener fired!`
3. **Message appears in Messages list**

---

## 🧪 Test Without Second Device

Press the **"🧪 Test"** button to send a local echo message. This verifies:
- Message handler works ✅
- UI updates correctly ✅
- Problem is peer discovery, not message handling ✅

---

## ⚠️ Common Issues

### Issue: Peers list stays empty `(0)`

**Checklist:**
- [ ] Both devices pressed "Start Chat"
- [ ] Bluetooth is ON (system settings)
- [ ] Devices within 10-30 meters
- [ ] **Android only**: Location permission granted
- [ ] **Android only**: Location services enabled (Settings → Location → ON)
- [ ] Apps are in foreground (not minimized)

**Fix for Android:**
```bash
# Grant permission via adb
adb shell pm grant com.chiazordaniel.blecch android.permission.ACCESS_FINE_LOCATION

# Enable location
# Settings → Location → ON
```

**Rebuild after permission changes:**
```bash
npx expo prebuild --clean
npm run android
```

### Issue: Messages send but other device doesn't receive

**If peers list shows `(0)`:**
- This is a **peer discovery** issue, not a messaging issue
- Devices aren't finding each other over Bluetooth
- See checklist above

**If peers list shows `(1)` or more:**
- Press "ℹ️" button to see debug info
- Check console logs on BOTH devices
- Ensure both show `🔔 Message listener fired!`

---

## 📊 Understanding Console Logs

### Good startup sequence:
```
▶️ Starting Bitchat with nickname: Alice
🧹 Pre-start cleanup done
✅ startServices() completed
📡 Setting up message listener...
✅ Message listener added
📡 Setting up peer connected listener...
📡 Setting up peer disconnected listener...
🔄 Starting peer polling...
📋 Peers fetched: {}
🎉 Bitchat fully started and listening
```

### When peer connects:
```
🆕 Peer connected: Bob
📋 Peers fetched: { "abc123": "Bob" }
```

### When message is sent:
```
📤 Sending message to #general: Hello
✅ sendMessage() completed
```

### When message is received:
```
📨 MESSAGE RECEIVED: {
  "id": "msg-123",
  "sender": "Bob",
  "content": "Hello",
  ...
}
🔔 Message listener fired!
```

---

## 🔍 Debugging Commands

### Android - View logs:
```bash
adb logcat | grep -E "🔔|📨|📤|✅|🆕"
```

### Android - Check Bluetooth state:
```bash
adb shell dumpsys bluetooth_manager
```

### iOS - View logs:
1. Open Xcode
2. Window → Devices and Simulators
3. Select device → View Console
4. Filter for emoji: 🔔 📨 📤

---

## 💡 Pro Tips

1. **Test Local Echo first**: Press "🧪 Test" to verify UI works
2. **Keep apps in foreground**: Background operation needs extra setup
3. **Place devices close**: Start with 1-2 meters apart
4. **Check battery optimization**: Disable for this app on Android
5. **Watch the peer count**: `(0)` = not discovered, `(1+)` = ready to chat

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ Peer count shows `(1)` or more on both devices
2. ✅ Sending a message shows `✅ sendMessage() completed`
3. ✅ Other device console shows `📨 MESSAGE RECEIVED`
4. ✅ Message appears in the Messages list on other device
5. ✅ No warning alert when pressing Send

---

## 🆘 Still Not Working?

The logs show your issue is **peer discovery** - devices aren't finding each other via Bluetooth.

**Root cause**: Empty peer list `📋 Peers fetched: {}`

**Most common fixes**:
1. **Android**: Enable Location services (Settings → Location → ON)
2. **Android**: Grant Location permission to app
3. Rebuild after changing permissions: `npx expo prebuild --clean`
4. Disable battery optimization for the app
5. Try different physical locations (away from WiFi routers)
6. Test with devices 1-2 meters apart initially

The channel is now **locked to #general** so channel mismatch is impossible! 🎉