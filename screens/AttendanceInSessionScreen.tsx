import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import { Share } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { Ionicons as Icon } from "@expo/vector-icons";

import MeshService from "../src/services/meshservice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AttendanceInSessionScreen = ({ navigation, route }) => {
  const [manualMode, setManualMode] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [remainingTime, setRemainingTime] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(30 * 60);
  const [peerCount, setPeerCount] = useState(0);
  const {
    course,
    meetingId,
    lecturer,
    channel,
    rebroadcastIntervalMs,
    intervalId,
  } = route.params;

  useEffect(() => {
    const attendeesById = new Map();

    const unsubscribe = MeshService.onAttendance((msg) => {
      try {
        if (msg.type !== "attendance") return;
        if (msg.course !== course || msg.meetingId !== meetingId) return;
        if (!attendeesById.has(msg.studentId)) {
          attendeesById.set(msg.studentId, msg);
          setAttendees(Array.from(attendeesById.values()));
        }
      } catch (_) {}
    });

    // Poll status for peer count and simple ticking timer
    const statusTimer = setInterval(() => {
      const status = MeshService.getStatus?.() || {
        peerCount: MeshService.getPeerCount(),
      };
      setPeerCount(status.peerCount || 0);
    }, 2000);

    // Countdown timer (30m default mock)
    const countdown = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setRemainingTime("00:00");
          return 0;
        }
        const next = prev - 1;
        const m = Math.floor(next / 60)
          .toString()
          .padStart(2, "0");
        const s = (next % 60).toString().padStart(2, "0");
        setRemainingTime(`${m}:${s}`);
        return next;
      });
    }, 1000);

    return () => {
      unsubscribe?.();
      clearInterval(statusTimer);
      clearInterval(countdown);
    };
  }, [course, meetingId]);

  const saveAttendanceRecord = async () => {
    try {
      const key = "attendance_records";
      const existingRaw = await AsyncStorage.getItem(key);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const record = {
        course,
        meetingId,
        channel,
        lecturer,
        endedAt: Date.now(),
        attendees,
      };
      const updated = [record, ...existing];
      await AsyncStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      // non-fatal
    }
  };

  const handleEndSession = async () => {
    try {
      if (intervalId) {
        clearInterval(intervalId);
      }
      await saveAttendanceRecord();
      // Optional: stop services
      // await MeshService.cleanup();
      navigation.navigate("LecturerDashboard");
    } catch (error) {
      Alert.alert("Error", "Failed to end session: " + (error?.message || ""));
    }
  };

  const students = attendees.map((attendee, index) => ({
    id: index + 1,
    name: attendee.studentName || attendee.name,
    time: new Date(attendee.timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    status: "present",
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B5CF6" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            try {
              if (intervalId) clearInterval(intervalId);
            } catch {}
            navigation.goBack();
          }}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance in Session</Text>
        <View style={styles.timerContainer}>
          <Icon name="radio" size={14} color="#fff" />
          <Text style={styles.timerText}>{remainingTime || "30:00"}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Session Header Card */}
        <View style={styles.sessionCard}>
          <View style={styles.sessionRow}>
            <Text style={styles.sessionLabel}>Course</Text>
            <Text style={styles.sessionValue}>{course}</Text>
          </View>
          <View style={styles.sessionRow}>
            <Text style={styles.sessionLabel}>Channel</Text>
            <View style={styles.sessionValueRow}>
              <Text style={styles.sessionValue}>{channel}</Text>
              <TouchableOpacity
                onPress={() => {
                  try {
                    Clipboard.setString(channel);
                  } catch {}
                }}
                style={styles.copyPill}
              >
                <Icon name="copy" size={14} color="#8B5CF6" />
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sessionRow}>
            <Text style={styles.sessionLabel}>Lecturer</Text>
            <Text style={styles.sessionValue}>{lecturer}</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Icon name="people" size={16} color="#6b7280" />
              <Text style={styles.progressLabel}>% of student in session</Text>
            </View>
            <Text style={styles.progressValue}>{`${Math.round(
              (attendees.length / 69) * 100,
            )}% (${attendees.length}/69)`}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "70%" }]} />
          </View>
        </View>

        {/* Students Grid */}
        <ScrollView
          style={styles.studentsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.studentList}>
            {students.map((student) => (
              <View key={student.id} style={styles.studentRow}>
                <View style={styles.studentAvatar}>
                  <Text style={styles.studentAvatarText}>
                    {(student.name || "?").slice(0, 1)}
                  </Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <View style={styles.badgeRow}>
                    <View style={styles.badge}>
                      <Icon name="checkmark-circle" size={12} color="white" />
                      <Text style={styles.badgeText}>present</Text>
                    </View>
                    <View style={[styles.badge, styles.badgeMuted]}>
                      <Icon name="time" size={12} color="#4f46e5" />
                      <Text style={[styles.badgeText, styles.badgeTextMuted]}>
                        {student.time}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.paginationDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </ScrollView>

        {/* Removed Manual Mode Switch */}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonGhost]}
            onPress={async () => {
              try {
                if (intervalId) clearInterval(intervalId);
                navigation.goBack();
              } catch (error) {
                Alert.alert(
                  "Error",
                  "Failed to cancel session: " + (error?.message || ""),
                );
              }
            }}
          >
            <Icon name="close" size={16} color="#374151" />
            <Text style={styles.buttonGhostText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={async () => {
              try {
                const header = "studentId,studentName,verification,timestamp\n";
                const rows = attendees
                  .map(
                    (a) =>
                      `${a.studentId},${a.studentName},${a.verification},${a.timestamp}`,
                  )
                  .join("\n");
                const csv = header + rows;
                await Share.share({ message: csv });
              } catch (e) {
                Alert.alert("Export Error", "Failed to export CSV");
              }
            }}
          >
            <Icon name="download" size={16} color="#111827" />
            <Text style={styles.buttonSecondaryText}>Export CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleEndSession}
          >
            <Icon name="stop" size={16} color="#fff" />
            <Text style={styles.buttonPrimaryText}>End Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#8B5CF6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  timerContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  sessionCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sessionLabel: {
    color: "#6b7280",
    fontSize: 12,
  },
  sessionValue: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "600",
  },
  sessionValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  copyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#eef2ff",
    marginLeft: 8,
  },
  copyText: {
    color: "#4f46e5",
    fontSize: 12,
    fontWeight: "700",
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8B5CF6",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: 4,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  studentsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  studentList: {},
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  studentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  studentAvatarText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  badge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  badgeMuted: {
    backgroundColor: "#eef2ff",
  },
  badgeTextMuted: {
    color: "#4f46e5",
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8B5CF6",
    marginHorizontal: 4,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 14,
    color: "#8B5CF6",
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: "#8B5CF6",
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    alignSelf: "flex-start",
  },
  switchThumbActive: {
    alignSelf: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  buttonGhost: {
    backgroundColor: "#f3f4f6",
  },
  buttonGhostText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "700",
  },
  buttonSecondary: {
    backgroundColor: "#e5e7eb",
  },
  buttonSecondaryText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
  },
  buttonPrimary: {
    backgroundColor: "#8B5CF6",
  },
  buttonPrimaryText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default AttendanceInSessionScreen;
