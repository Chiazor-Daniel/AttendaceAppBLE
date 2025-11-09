import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import BleService, { SessionInfo } from "../services/BleService";
import { State } from "react-native-ble-plx";

const AttendanceSessionScreen = ({ navigation }: any) => {
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const [availableSessions, setAvailableSessions] = useState<SessionInfo[]>([]);
  const [scanning, setScanning] = useState(false);
  const [bluetoothState, setBluetoothState] = useState<State>("Unknown");

  useEffect(() => {
    // Monitor Bluetooth state changes
    const subscription = BleService.manager.onStateChange((state) => {
      console.log("Bluetooth state changed:", state);
      setBluetoothState(state);

      if (state !== "PoweredOn" && isOnlineMode) {
        setIsOnlineMode(false);
        BleService.stopScan();
        Alert.alert(
          "Bluetooth Error",
          "Please enable Bluetooth to scan for sessions",
        );
      }
    }, true);

    return () => {
      subscription.remove();
      BleService.stopScan();
    };
  }, [isOnlineMode]);

  const handleOnlineModeToggle = async (value: boolean) => {
    if (value && bluetoothState !== "PoweredOn") {
      Alert.alert(
        "Bluetooth Required",
        "Please enable Bluetooth to scan for sessions",
      );
      return;
    }

    setIsOnlineMode(value);
    if (value) {
      try {
        setScanning(true);
        BleService.scanForSessions((session) => {
          setAvailableSessions((prev) => {
            if (!prev.find((s) => s.id === session.id)) {
              return [...prev, session];
            }
            return prev;
          });
        });
      } catch (error: any) {
        Alert.alert("Error", error.message);
        setIsOnlineMode(false);
      }
    } else {
      BleService.stopScan();
      setScanning(false);
      setAvailableSessions([]);
    }
  };

  const handleSessionSelect = async (session: SessionInfo) => {
    try {
      if (bluetoothState !== "PoweredOn") {
        throw new Error("Bluetooth must be enabled to connect to a session");
      }
      const device = await BleService.connectToSession(session.id);
      navigation.navigate("JoinClassSelection", {
        device,
        meetingId: session.meetingId,
        courseCode: session.courseCode,
      });
    } catch (error: any) {
      Alert.alert("Connection Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Session Details */}
        <View style={styles.sessionSection}>
          <Text style={styles.sessionTitle}>Attendance Session</Text>

          <Text style={styles.sessionDescription}>
            Join class session with the meeting ID provided by the lecturer.
            Meeting ID expires after every session. Your attendance is being
            saved in the background and will be synced once internet connection
            is back.
          </Text>

          <View style={styles.detailsContainer}>
            {!isOnlineMode ? (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Meeting ID</Text>
                  <Text style={styles.detailValue}>Type in meeting ID</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Course</Text>
                  <Text style={styles.detailValue}>Input course code</Text>
                </View>
              </>
            ) : (
              <>
                {availableSessions.map((session) => (
                  <TouchableOpacity
                    key={session.id}
                    style={styles.sessionItem}
                    onPress={() => handleSessionSelect(session)}
                  >
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Meeting ID</Text>
                      <Text style={styles.detailValue}>
                        {session.meetingId}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Course</Text>
                      <Text style={styles.detailValue}>
                        {session.courseCode}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {scanning && availableSessions.length === 0 && (
                  <Text style={styles.scanningText}>
                    Scanning for available sessions...
                  </Text>
                )}
              </>
            )}

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Switch to online mode</Text>
              <Switch
                value={isOnlineMode}
                onValueChange={handleOnlineModeToggle}
                trackColor={{ false: "#d1d5db", true: "#8B5CF6" }}
                thumbColor={isOnlineMode ? "#ffffff" : "#ffffff"}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.joinButton,
              !isOnlineMode && styles.joinButtonEnabled,
            ]}
            onPress={() =>
              isOnlineMode ? null : navigation.navigate("JoinClassSelection")
            }
            disabled={isOnlineMode}
          >
            <Text style={styles.joinButtonText}>Join Session</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: 50,
  },
  scrollView: {
    flex: 1,
  },
  sessionSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },
  sessionDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 32,
  },
  detailsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  detailRow: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 14,
    color: "#6b7280",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sessionItem: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  joinButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    opacity: 0.5,
  },
  joinButtonEnabled: {
    opacity: 1,
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  scanningText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
    marginTop: 8,
  },
});

export default AttendanceSessionScreen;
