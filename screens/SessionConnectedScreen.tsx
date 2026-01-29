import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

import { Image } from "react-native";

const SessionConnectedScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Network Diagram */}
      <View style={styles.networkContainer}>
        <View style={styles.networkDiagram}>
          <Image
            source={require("../assets/net.png")}
            style={{ width: 200, height: 200 }}
          />
        </View>
      </View>

      {/* Status Message */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          You are connected. Class in session
        </Text>
      </View>

      {/* Session Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Session Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Course</Text>
          <Text style={styles.detailValue}>BIO 101</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Start Time</Text>
          <Text style={styles.detailValue}>08:00 am</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time Joined</Text>
          <Text style={styles.detailValue}>08:45 am</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time Ended</Text>
          <Text style={styles.detailValue}>--:-- am</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Attendance Status</Text>
          <Text style={[styles.detailValue, styles.presentStatus]}>
            Present
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Lecturer</Text>
          <Text style={styles.detailValue}>Dr Phillips James</Text>
        </View>
      </View>

      {/* Back to Home Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Icon name="home" size={16} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  networkContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  networkDiagram: {
    width: 180,
    height: 180,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  userNode: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e5e7eb",
    borderWidth: 2,
    borderColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  centerUser: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  activeUser: {
    backgroundColor: "#8B5CF6",
  },
  surroundingUser: {
    top: -70,
  },
  connectionLine: {
    position: "absolute",
    width: 2,
    height: 50,
    backgroundColor: "#8B5CF6",
    top: -25,
  },
  statusContainer: {
    backgroundColor: "#e0e7ff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 24,
  },
  statusText: {
    color: "#8B5CF6",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 13,
  },
  detailsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1f2937",
  },
  presentStatus: {
    color: "#10b981",
  },
  backButton: {
    backgroundColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: "auto",
    marginBottom: 16,
  },
  backButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SessionConnectedScreen;
