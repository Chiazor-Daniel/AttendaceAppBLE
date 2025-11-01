import { Image } from "react-native"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"
import { Ionicons as Icon } from '@expo/vector-icons'

const SessionOverScreen = ({ navigation }: any) => {
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
         <Image source={require('../assets/net.png')} style={{width: 200, height: 200}} />"
        </View>
      </View>

      {/* Status Message */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Class Over</Text>
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
          <Text style={styles.detailLabel}>Attendance Status</Text>
          <Text style={[styles.detailValue, styles.presentStatus]}>Present</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time Ended</Text>
          <Text style={styles.detailValue}>--:-- am</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Lecturer</Text>
          <Text style={styles.detailValue}>Dr. Phillips James</Text>
        </View>
      </View>

      {/* Back to Home Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Dashboard")}>
        <Icon name="home" size={16} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  networkContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  networkDiagram: {
    width: 200,
    height: 200,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  userNode: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    borderWidth: 2,
    borderColor: "#6b7280",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  centerUser: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  activeUser: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  surroundingUser: {
    top: -80,
  },
  statusContainer: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 30,
  },
  statusText: {
    color: "#374151",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 20,
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
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: "auto",
    marginBottom: 20,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default SessionOverScreen
