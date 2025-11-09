import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

import { Picker } from "@react-native-picker/picker";
import MeshService from "../src/services/meshservice";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

const SetupClassSessionScreen = ({ navigation }) => {
  const { courses } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState("");
  const [courseList, setCourseList] = useState(courses || []);
  const [sessionStarts, setSessionStarts] = useState("08:00 am");
  const [sessionDuration, setSessionDuration] = useState("");
  const [attendanceWindow, setAttendanceWindow] = useState("");
  const [onlineMode, setOnlineMode] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        if (courses) {
          setCourseList(courses);
        }
      } catch (error) {
        setError("Failed to load courses");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup Session Rules</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Setup Session Rules</Text>
        <Text style={styles.subtitle}>
          Set up class duration and attendance window
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={course}
                onValueChange={(itemValue) => setCourse(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select a course" value="" />
                {courseList.map((courseItem) => (
                  <Picker.Item
                    key={courseItem.id}
                    label={`${courseItem.code} - ${courseItem.name}`}
                    value={courseItem.code}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Session Starts</Text>
            <TextInput
              style={[styles.input, styles.inputFilled]}
              value={sessionStarts}
              onChangeText={setSessionStarts}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Session Duration</Text>
            <View style={styles.dropdownContainer}>
              <TextInput
                style={styles.input}
                placeholder="Select the session duration"
                placeholderTextColor="#9ca3af"
                value={sessionDuration}
                onChangeText={setSessionDuration}
              />
              <Icon name="chevron-down" size={20} color="#9ca3af" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Attendance Window</Text>
            <View style={styles.dropdownContainer}>
              <TextInput
                style={styles.input}
                placeholder="Select the attendance window opportunity"
                placeholderTextColor="#9ca3af"
                value={attendanceWindow}
                onChangeText={setAttendanceWindow}
              />
              <Icon name="chevron-down" size={20} color="#9ca3af" />
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.startButton,
              (!course || !sessionDuration || !attendanceWindow) &&
                styles.startButtonDisabled,
            ]}
            disabled={
              !course || !sessionDuration || !attendanceWindow || isLoading
            }
            onPress={async () => {
              try {
                setIsLoading(true);
                setError("");

                const duration = parseInt(sessionDuration, 10);
                const window = parseInt(attendanceWindow, 10);

                if (isNaN(duration) || duration <= 0) {
                  throw new Error("Invalid session duration");
                }

                if (isNaN(window) || window <= 0 || window >= duration) {
                  throw new Error("Invalid attendance window");
                }

                // Initialize mesh and broadcast session start
                const lecturerName = "Dr. Ada Lovelace";
                const nickname = "Lecturer-Ada";
                const meetingId = "2025W10"; // mock as specified

                await MeshService.initialize(nickname);
                const sessionInfo = {
                  course,
                  meetingId,
                  lecturer: lecturerName,
                } as const;

                const { channel } =
                  await MeshService.broadcastSessionStart(sessionInfo);

                // Optional rebroadcast for discoverability
                const rebroadcastIntervalMs = 15000;
                const intervalId = setInterval(() => {
                  MeshService.broadcastSessionStart(sessionInfo).catch(
                    () => {},
                  );
                }, rebroadcastIntervalMs);

                navigation.replace("AttendanceInSession", {
                  course,
                  meetingId,
                  lecturer: lecturerName,
                  channel,
                  rebroadcastIntervalMs,
                  intervalId,
                });
              } catch (error) {
                setError(error.message);
                Alert.alert("Error", error.message);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.startButtonText}>Start Class Session</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "white",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  startButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
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
  content: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1f2937",
    backgroundColor: "white",
  },
  inputFilled: {
    backgroundColor: "#f3f4f6",
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "white",
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
    fontWeight: "700",
  },
});

export default SetupClassSessionScreen;
