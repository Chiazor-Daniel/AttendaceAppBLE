import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import * as Location from "expo-location";
import BitchatAPI from "expo-bitchat";

// --- Configuration ---
const YourNickname = "MeshUser-" + Math.floor(Math.random() * 10000);

export default function App() {
  const [logs, setLogs] = useState([]);
  const [peers, setPeers] = useState({});
  const [isServiceRunning, setIsServiceRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [messageInput, setMessageInput] = useState("");

  // Ref to hold all Bitchat subscriptions for cleanup
  const subscriptions = useRef([]);

  // --- Utility Logging Function ---
  const logMessage = useCallback((message, isError = false) => {
    const prefix = isError ? "🚨" : message.startsWith("🔥") ? "" : "💬";
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prevLogs) => [
      `[${time}] ${prefix} ${message}`,
      ...prevLogs.slice(0, 100),
    ]);
    if (isError) console.error(message);
    else console.log(message);
  }, []);

  // --- Request Android 12+ Bluetooth Permissions ---
  const requestBluetoothPermissions = async () => {
    if (Platform.OS !== "android") return true;

    try {
      if (Platform.Version >= 31) {
        logMessage("🔐 Requesting Android 12+ Bluetooth permissions...");

        const scanGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: "Bluetooth Scan Permission",
            message:
              "App needs Bluetooth scan permission to discover nearby devices",
            buttonPositive: "OK",
          },
        );

        const connectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: "Bluetooth Connect Permission",
            message:
              "App needs Bluetooth connect permission to communicate with devices",
            buttonPositive: "OK",
          },
        );

        const advertiseGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          {
            title: "Bluetooth Advertise Permission",
            message:
              "App needs Bluetooth advertise permission to be discoverable",
            buttonPositive: "OK",
          },
        );

        if (
          scanGranted !== PermissionsAndroid.RESULTS.GRANTED ||
          connectGranted !== PermissionsAndroid.RESULTS.GRANTED ||
          advertiseGranted !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          logMessage("🚨 Bluetooth permissions denied!", true);
          Alert.alert(
            "Permissions Required",
            "Bluetooth permissions are required for mesh networking. Please grant them in Settings.",
            [{ text: "OK" }],
          );
          return false;
        }

        logMessage("✅ Android 12+ Bluetooth permissions granted");
        return true;
      } else {
        logMessage("✅ Android < 12, using legacy permissions");
        return true;
      }
    } catch (err) {
      logMessage(`🚨 Bluetooth permission error: ${err.message}`, true);
      return false;
    }
  };

  // --- BITCHAT EVENT LISTENERS ---
  const setupListeners = useCallback(() => {
    // Clear old listeners if they exist
    subscriptions.current.forEach((sub) => sub.remove());
    subscriptions.current = [];

    // 1. New Message Listener
    subscriptions.current.push(
      BitchatAPI.addMessageListener((message) => {
        logMessage(
          `[${message.channel || "Public"}] ${message.sender}: ${message.content}`,
        );
      }),
    );

    // 2. Peer Connected Listener
    subscriptions.current.push(
      BitchatAPI.addPeerConnectedListener(({ nickname }) => {
        logMessage(`Peer Connected: ${nickname}`, false, "success");
        BitchatAPI.getConnectedPeers().then(setPeers);
      }),
    );

    // 3. Peer Disconnected Listener
    subscriptions.current.push(
      BitchatAPI.addPeerDisconnectedListener(({ nickname }) => {
        logMessage(`Peer Disconnected: ${nickname}`, true);
        BitchatAPI.getConnectedPeers().then(setPeers);
      }),
    );

    // 4. Peer List Updated Listener (for more comprehensive peer changes)
    subscriptions.current.push(
      BitchatAPI.addPeerListUpdatedListener(() => {
        BitchatAPI.getConnectedPeers().then(setPeers);
      }),
    );

    logMessage("Event listeners setup.");
  }, [logMessage]);

  // --- CORE STARTUP LOGIC ---
  const startMeshService = useCallback(async () => {
    setStatusMessage("Checking system requirements...");

    // 1. Check/Request Bluetooth Permissions (Android 12+)
    const bluetoothPermGranted = await requestBluetoothPermissions();
    if (!bluetoothPermGranted) {
      setStatusMessage("🚨 Bluetooth permissions denied");
      return;
    }

    // 2. Check/Request Location Permissions
    let { status: locationPermissionStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (locationPermissionStatus !== "granted") {
      const msg =
        "🚨 PERMISSION DENIED: Location/BLE access is required to scan for peers.";
      logMessage(msg, true);
      setStatusMessage(msg);
      Alert.alert("Permission Required", msg);
      return;
    }
    logMessage("✅ Location permissions granted.");

    // 3. Check Location Services (GPS Toggle - Android Only)
    if (Platform.OS === "android") {
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        const msg =
          "🚨 GPS Required: Location (GPS) Services must be ON for Bluetooth scanning.";
        Alert.alert(
          "Location Services Required",
          msg + " Please enable it manually in your device settings.",
        );
        setStatusMessage(msg);
        return;
      }
      logMessage("✅ Android Location/GPS enabled.");
    }

    // 4. Start Bitchat Service (This is where the Bluetooth Adapter check happens)
    setStatusMessage(`Attempting to start mesh service as: ${YourNickname}...`);

    try {
      await BitchatAPI.startServices(YourNickname);
      setIsServiceRunning(true);
      logMessage("🔥 Mesh services STARTED successfully.");
      setStatusMessage("Mesh Network Active! Looking for peers...");

      // Setup listeners now that the service is running
      setupListeners();

      // Get initial peer list
      const initialPeers = await BitchatAPI.getConnectedPeers();
      setPeers(initialPeers);
    } catch (error) {
      let errorMsg = error.message || String(error);

      // Handle specific Bluetooth OFF error
      if (
        errorMsg.includes("Bluetooth") ||
        errorMsg.includes("adapter") ||
        errorMsg.includes("powered off")
      ) {
        errorMsg =
          "🚨 Bluetooth Adapter is OFF. Please manually turn on Bluetooth in your device settings.";
        Alert.alert("Bluetooth Required", errorMsg);
      } else {
        errorMsg = `FATAL STARTUP ERROR: ${errorMsg}. Check native logs.`;
      }

      logMessage(`🚨 ${errorMsg}`, true);
      setStatusMessage(errorMsg);
      setIsServiceRunning(false);
    }
  }, [logMessage, setupListeners]);

  // --- CORE SENDING LOGIC ---
  const handleSendMessage = async (isPrivate = false) => {
    if (!isServiceRunning || !messageInput.trim()) return;

    const messageContent = messageInput.trim();
    setMessageInput("");

    try {
      if (isPrivate) {
        // Placeholder: Select the first peer for a demo private message
        const peerIDs = Object.keys(peers);
        if (peerIDs.length === 0) {
          Alert.alert(
            "No Peers",
            "Cannot send private message: No connected peers found.",
          );
          logMessage(
            "Attempted private message, but no peers connected.",
            true,
          );
          return;
        }
        const recipientPeerID = peerIDs[0];
        const recipientNickname = peers[recipientPeerID];

        await BitchatAPI.sendPrivateMessage(
          messageContent,
          recipientPeerID,
          recipientNickname,
        );
        logMessage(
          `Sent PRIVATE message to ${recipientNickname}: ${messageContent}`,
        );
      } else {
        // Send public message to default channel
        await BitchatAPI.sendMessage(messageContent, [], "#buzz");
        logMessage(`Sent PUBLIC message: ${messageContent}`);
      }
    } catch (e) {
      logMessage(`Message failed to send: ${e.message}`, true);
      Alert.alert("Send Error", `Failed to send message: ${e.message}`);
    }
  };

  // --- EFFECT: STARTUP AND CLEANUP ---
  useEffect(() => {
    // 1. Initial attempt to start service on mount
    startMeshService();

    // 2. Cleanup function
    return async () => {
      logMessage("Cleaning up Bitchat services and listeners...");
      // Remove all event listeners
      subscriptions.current.forEach((sub) => sub.remove());
      // Stop the native service
      await BitchatAPI.stopServices().catch((e) =>
        logMessage(`Error stopping service: ${e.message}`, true),
      );
      setIsServiceRunning(false);
    };
  }, [startMeshService, logMessage]);

  const peerCount = Object.keys(peers).length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Mesh</Text>
        <Text style={styles.nickname}>Nickname: {YourNickname}</Text>
      </View>

      <View
        style={[
          styles.statusContainer,
          { backgroundColor: isServiceRunning ? "#e6ffe6" : "#ffe6e6" },
        ]}
      >
        <ActivityIndicator
          size="small"
          color={isServiceRunning ? "green" : "red"}
          animating={!isServiceRunning && statusMessage.includes("Attempting")}
        />
        <Text
          style={[
            styles.statusText,
            { color: isServiceRunning ? "green" : "red" },
          ]}
        >
          {statusMessage}
        </Text>
      </View>

      <Text style={styles.peerCount}>Connected Peers: {peerCount}</Text>

      <Text style={styles.logHeader}>Activity Log:</Text>
      <ScrollView style={styles.logContainer}>
        {logs.map((log, index) => (
          <Text
            key={index}
            style={[
              styles.logText,
              log.includes("🚨")
                ? styles.errorText
                : log.includes("🔥")
                  ? styles.successText
                  : {},
            ]}
          >
            {log}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="Type your message..."
          editable={isServiceRunning}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !isServiceRunning && styles.disabledButton,
          ]}
          onPress={() => handleSendMessage(false)}
          disabled={!isServiceRunning || !messageInput.trim()}
        >
          <Text style={styles.sendButtonText}>Send Public</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.privateButton,
            (!isServiceRunning || peerCount === 0) && styles.disabledButton,
          ]}
          onPress={() => handleSendMessage(true)}
          disabled={
            !isServiceRunning || peerCount === 0 || !messageInput.trim()
          }
        >
          <Text style={styles.sendButtonText}>Private ({peerCount})</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Restart Service" onPress={startMeshService} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  headerContainer: {
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  nickname: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  statusText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  peerCount: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#007AFF",
  },
  logHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5,
    color: "#333",
  },
  logContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    minHeight: 150,
    marginBottom: 10,
  },
  logText: {
    fontSize: 12,
    marginBottom: 3,
    color: "#000",
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
  },
  successText: {
    color: "green",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  privateButton: {
    backgroundColor: "#FF9500",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  buttonContainer: {
    marginTop: 5,
    marginBottom: 20,
  },
});
