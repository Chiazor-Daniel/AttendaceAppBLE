"use client";

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Animated, Alert, ActivityIndicator } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import MeshService from "../src/services/meshservice";

const FingerprintScanningScreen = ({ navigation, route }) => {
  const { meshMode, session, verificationType } = route.params || {};
  const [scanAnimation] = useState(new Animated.Value(0));
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);

  useEffect(() => {
    // Start scanning animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    ).start();

    // Navigate to success screen after 4 seconds, with mesh broadcast if needed
    const timer = setTimeout(async () => {
      if (meshMode && session) {
        await handleMeshAttendanceBroadcast();
      } else {
        navigation.navigate("FingerprintVerificationSuccess");
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Broadcast attendance via mesh after successful verification
  const handleMeshAttendanceBroadcast = async () => {
    if (!meshMode || !session) {
      navigation.navigate("FingerprintVerificationSuccess");
      return;
    }

    try {
      setIsBroadcasting(true);
      setBroadcastStatus("Broadcasting attendance...");

      // Ensure mesh service is running
      if (!MeshService.getStatus().isRunning) {
        await MeshService.initialize(`Student-${Date.now()}`);
      }

      // Broadcast attendance data
      const attendanceData = {
        studentId: "STU123", // TODO: Get from actual user data
        studentName: "Student Name", // TODO: Get from actual user data
        course: session.course,
        meetingId: session.meetingId,
        verification: "fingerprint",
        channel: session.channel,
      };

      const result = await MeshService.sendAttendanceData(attendanceData);

      setBroadcastStatus(`✅ Attendance shared with ${result.peerCount} peers`);

      Alert.alert(
        "Attendance Recorded",
        `Successfully broadcasted attendance to ${result.peerCount} peers via mesh network.`,
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("FingerprintVerificationSuccess", {
                meshMode: true,
                peerCount: result.peerCount,
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Mesh broadcast error:", error);
      setBroadcastStatus("Failed to broadcast");
      Alert.alert(
        "Broadcast Failed",
        error.message || "Failed to broadcast attendance. Attendance will sync when online.",
        [
          {
            text: "Continue",
            onPress: () => {
              navigation.navigate("FingerprintVerificationSuccess", {
                meshMode: true,
                broadcastFailed: true,
              });
            },
          },
        ]
      );
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="close" size={24} color="#333" />
        <Text style={styles.headerTitle}>Fingerprint Capturing</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Fingerprint Detection Frame */}
        <View style={styles.detectionContainer}>
          <View style={styles.detectionFrame}>
            <View style={styles.fingerprintContainer}>
              {/* Fingerprint Icon */}
              <Icon name="finger-print" size={80} color="#8B5CF6" />

              {/* Scanning animation overlay */}
              <Animated.View
                style={[
                  styles.scanOverlay,
                  {
                    opacity: scanAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.3, 0.8, 0.3],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <Text style={styles.scanningText}>Scanning your finger</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: scanAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["20%", "80%"],
                }),
              },
            ]}
          />
        </View>

        <Text style={styles.instructionText}>
          Place your finger on your fingerprint reader to initiate scan.
        </Text>

        {/* Mesh Status */}
        {meshMode && session && (
          <View style={styles.meshInfoContainer}>
            <Text style={styles.meshInfoText}>
              📡 Joining: {session.course} by {session.lecturer}
            </Text>
            {isBroadcasting && broadcastStatus && (
              <Text style={styles.meshStatusText}>{broadcastStatus}</Text>
            )}
          </View>
        )}

        {/* Broadcasting Indicator */}
        {isBroadcasting && (
          <View style={styles.broadcastingContainer}>
            <ActivityIndicator size="small" color="#8B5CF6" />
            <Text style={styles.broadcastingText}>
              Broadcasting attendance via mesh...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  detectionContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  detectionFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: "#10b981",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
  },
  fingerprintContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  scanOverlay: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#8B5CF6",
  },
  scanningText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 20,
  },
  progressContainer: {
    width: "80%",
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    marginBottom: 30,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: 2,
  },
  instructionText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  meshInfoContainer: {
    backgroundColor: "#e0e7ff",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  meshInfoText: {
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "500",
    textAlign: "center",
  },
  meshStatusText: {
    fontSize: 11,
    color: "#10b981",
    marginTop: 4,
    fontWeight: "600",
  },
  broadcastingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
    marginTop: 20,
  },
  broadcastingText: {
    color: "#8B5CF6",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default FingerprintScanningScreen;
