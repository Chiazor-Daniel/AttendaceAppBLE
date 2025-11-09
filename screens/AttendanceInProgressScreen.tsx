import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

import { useEffect, useState, useCallback } from "react";
import BackgroundTimer from "react-native-background-timer";
import Clipboard from "@react-native-clipboard/clipboard";
import SessionManager from "../services/SessionManager";
import { AttendanceData } from "../types/session";

const AttendanceInProgressScreen = ({ navigation, route }) => {
  const { courseCode, duration, attendanceWindow, sessionStarts } =
    route.params;
  const [sessionManager] = useState(() => new SessionManager());
  const [sessionId, setSessionId] = useState("");
  const [attendees, setAttendees] = useState<AttendanceData[]>([]);
  const [remainingTime, setRemainingTime] = useState(duration * 60);
  const [remainingWindow, setRemainingWindow] = useState(attendanceWindow * 60);
  const [isOnline, setIsOnline] = useState(true);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const session = await sessionManager.startSession(
          courseCode,
          duration,
          attendanceWindow,
        );
        setSessionId(session.sessionId);
      } catch (error) {
        Alert.alert("Error", "Failed to start session");
        navigation.goBack();
      }
    };

    initializeSession();

    if (sessionId) {
      const timer = BackgroundTimer.setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 0) {
            handleEndSession();
            return 0;
          }
          return prev - 1;
        });

        setRemainingWindow((prev) => Math.max(0, prev - 1));
      }, 1000);

      return () => {
        BackgroundTimer.clearInterval(timer);
      };
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      const subscription = sessionManager.onAttendanceUpdate((data) => {
        setAttendees((prev) => [...prev, data]);
      });

      return () => subscription?.remove();
    }
  }, [sessionId]);

  const handleEndSession = useCallback(async () => {
    try {
      const sessionData = await sessionManager.endSession();
      if (sessionData) {
        navigation.replace("SessionSuccess", { sessionData });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to end session");
    }
  }, [sessionManager, navigation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const copySessionId = () => {
    Clipboard.setString(sessionId);
    Alert.alert("Copied", "Session ID copied to clipboard");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance in Progress</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Attendance in Progress</Text>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
          </View>
        </View>

        <View style={styles.windowContainer}>
          <Text style={styles.windowLabel}>
            Attendance Window: {formatTime(remainingWindow)}
          </Text>
          <Text style={styles.attendeeCount}>
            Students Present: {attendees.length}
          </Text>
        </View>

        <Text style={styles.description}>
          Meeting ID generated. Copy and share with students to join this
          session. Meeting ID expires after the set duration. Attendance is
          being noted in the background and will be synced when internet
          connection is back.
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Meeting ID</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{sessionId}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copySessionId}
              >
                <Icon name="copy" size={16} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Course</Text>
            <Text style={styles.detailValue}>{courseCode}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Session Duration</Text>
            <Text style={styles.detailValue}>{duration} Minutes</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Time</Text>
            <Text style={styles.detailValue}>08:00 am</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Attendance Window</Text>
            <Text style={styles.detailValue}>{attendanceWindow} Minutes</Text>
          </View>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Switch to online mode</Text>
          <TouchableOpacity
            style={[styles.switch, isOnline && styles.switchActive]}
            onPress={() => setIsOnline(!isOnline)}
          >
            <View
              style={[styles.switchThumb, isOnline && styles.switchThumbActive]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              Alert.alert(
                "Cancel Session",
                "Are you sure you want to cancel this session? All attendance data will be lost.",
                [
                  { text: "No", style: "cancel" },
                  {
                    text: "Yes",
                    style: "destructive",
                    onPress: () => navigation.goBack(),
                  },
                ],
              );
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel Session</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            disabled={isEnding}
            onPress={handleEndSession}
          >
            {isEnding ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>End Session</Text>
            )}
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
    backgroundColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 30,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  greeting: {
    color: "white",
    fontSize: 12,
    opacity: 0.8,
  },
  lecturerName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  statusContainer: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    opacity: 0.8,
    marginBottom: 4,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  syncText: {
    color: "white",
    fontSize: 10,
    marginLeft: 4,
  },
  notificationButton: {
    padding: 4,
  },
  windowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  windowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
  },
  attendeeCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  timerContainer: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 32,
  },
  detailsContainer: {
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
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
  detailValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
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
    marginTop: "auto",
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fecaca",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginLeft: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AttendanceInProgressScreen;
