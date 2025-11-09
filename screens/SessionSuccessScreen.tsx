import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

import { SessionData } from "../services/SessionManager";

const SessionSuccessScreen = ({ navigation, route }) => {
  const { sessionData } = route.params as { sessionData: SessionData };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <View style={styles.content}>
        <View style={styles.successContainer}>
          <View style={styles.checkmarkContainer}>
            <View style={styles.checkmarkCircle}>
              <Icon name="checkmark" size={40} color="#10b981" />
            </View>
          </View>

          <Text style={styles.successTitle}>Session Completed</Text>
          <Text style={styles.successSubtitle}>
            Attendance Saved Successfully!
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Students</Text>
              <Text style={styles.statValue}>
                {sessionData.attendees.length}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Course Code</Text>
              <Text style={styles.statValue}>{sessionData.courseCode}</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{sessionData.duration} mins</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Time Window</Text>
              <Text style={styles.statValue}>
                {sessionData.attendanceWindow} mins
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("LecturerDashboard")}
          >
            <Text style={styles.backButtonText}>Back to Home</Text>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  notificationButton: {
    padding: 4,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  successContainer: {
    alignItems: "center",
  },
  checkmarkContainer: {
    marginBottom: 40,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 32,
    textAlign: "center",
  },
  statsContainer: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  backButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default SessionSuccessScreen;
