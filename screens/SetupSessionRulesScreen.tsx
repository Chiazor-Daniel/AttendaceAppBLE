import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

import FormField from "../components/FormField";

interface FormErrors {
  sessionDuration?: string;
  attendanceWindow?: string;
}

const SESSION_DURATIONS = [
  "1 hour",
  "1.5 hours",
  "2 hours",
  "2.5 hours",
  "3 hours",
];

const ATTENDANCE_WINDOWS = [
  "5 minutes",
  "10 minutes",
  "15 minutes",
  "20 minutes",
  "30 minutes",
];

const SetupSessionRulesScreen = ({ navigation, route }) => {
  const { courseCode, startTime } = route.params;
  const [sessionStarts] = useState(startTime || "08:00 am");
  const [sessionDuration, setSessionDuration] = useState("");
  const [attendanceWindow, setAttendanceWindow] = useState("");
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showWindowModal, setShowWindowModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!sessionDuration)
      newErrors.sessionDuration = "Session duration is required";
    if (!attendanceWindow)
      newErrors.attendanceWindow = "Attendance window is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartSession = async () => {
    setIsSubmitting(true);
    if (validateForm()) {
      try {
        // Convert duration string to minutes
        const durationInMinutes = parseInt(sessionDuration.split(" ")[0]) * 60;
        // Convert window string to minutes
        const windowInMinutes = parseInt(attendanceWindow.split(" ")[0]);

        navigation.navigate("AttendanceInProgress", {
          courseCode,
          duration: durationInMinutes,
          attendanceWindow: windowInMinutes,
          sessionStarts,
        });
      } catch (error) {
        console.error("Error starting session:", error);
        Alert.alert("Error", "Failed to start session");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Setup Session Rules</Text>
        <Text style={styles.subtitle}>
          Set up class duration and attendance window
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Session Starts</Text>
            <View style={styles.timeInput}>
              <Text style={styles.timeText}>{sessionStarts}</Text>
            </View>
          </View>

          <FormField
            label="Session Duration"
            value={sessionDuration}
            placeholder="Select the session duration"
            error={errors.sessionDuration}
            isRequired={true}
            helperText="How long will this class session last?"
            onPress={() => {
              setShowDurationModal(true);
              if (errors.sessionDuration) {
                const newErrors = { ...errors };
                delete newErrors.sessionDuration;
                setErrors(newErrors);
              }
            }}
          />

          <FormField
            label="Attendance Window"
            value={attendanceWindow}
            placeholder="Select the attendance window"
            error={errors.attendanceWindow}
            isRequired={true}
            helperText="Time allowed for students to mark attendance"
            onPress={() => {
              setShowWindowModal(true);
              if (errors.attendanceWindow) {
                const newErrors = { ...errors };
                delete newErrors.attendanceWindow;
                setErrors(newErrors);
              }
            }}
          />

          <TouchableOpacity
            style={[
              styles.startButton,
              (isSubmitting || !sessionDuration || !attendanceWindow) &&
                styles.startButtonDisabled,
            ]}
            disabled={isSubmitting || !sessionDuration || !attendanceWindow}
            onPress={handleStartSession}
          >
            <Text style={styles.startButtonText}>
              {isSubmitting ? "Starting Session..." : "Start Class Session"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Session Duration Modal */}
        <Modal
          visible={showDurationModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Session Duration</Text>
                <TouchableOpacity onPress={() => setShowDurationModal(false)}>
                  <Icon name="close" size={24} color="#1f2937" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalList}>
                {SESSION_DURATIONS.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={styles.modalItem}
                    onPress={() => {
                      setSessionDuration(duration);
                      setShowDurationModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{duration}</Text>
                    {sessionDuration === duration && (
                      <Icon name="checkmark" size={24} color="#8B5CF6" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Attendance Window Modal */}
        <Modal
          visible={showWindowModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Attendance Window</Text>
                <TouchableOpacity onPress={() => setShowWindowModal(false)}>
                  <Icon name="close" size={24} color="#1f2937" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalList}>
                {ATTENDANCE_WINDOWS.map((window) => (
                  <TouchableOpacity
                    key={window}
                    style={styles.modalItem}
                    onPress={() => {
                      setAttendanceWindow(window);
                      setShowWindowModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{window}</Text>
                    {attendanceWindow === window && (
                      <Icon name="checkmark" size={24} color="#8B5CF6" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Matches AttendanceInProgress background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
  // No need for separate timeInput style — reuse FormField pattern or keep simple
  timeInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
  },
  timeText: {
    fontSize: 14,
    color: "#1f2937",
  },
  startButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  startButtonDisabled: {
    backgroundColor: "#c4b5fd",
    opacity: 0.7,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  modalList: {
    padding: 20,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalItemText: {
    fontSize: 16,
    color: "#1f2937",
  },
  // Keep these for FormField error handling (optional but safe)
  errorText: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 4,
  },
  dropdownError: {
    borderColor: "#dc2626",
    borderWidth: 1,
  },
});
export default SetupSessionRulesScreen;
