import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

const FingerprintVerificationFailedScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fingerprint Capturing</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Fingerprint Detection Frame with Failure */}
        <View style={styles.detectionContainer}>
          <View style={styles.failureFrame}>
            <View style={styles.fingerprintContainer}>
              <Icon name="finger-print" size={80} color="#ef4444" />
            </View>

            {/* Failure X Icon */}
            <View style={styles.failureIcon}>
              <Icon name="close-circle" size={40} color="#ef4444" />
            </View>
          </View>
        </View>

        <Text style={styles.failureTitle}>Facial Recognition Failed</Text>

        <Text style={styles.failureDescription}>
          We were unable to capture your fingerprint properly. Please try again.
        </Text>

        <TouchableOpacity
          style={styles.tryAgainButton}
          onPress={() => navigation.navigate("FingerprintScanning")}
        >
          <Text style={styles.tryAgainButtonText}>Try Again</Text>
        </TouchableOpacity>
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
  failureFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: "#ef4444",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    position: "relative",
  },
  fingerprintContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  failureIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  failureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
    textAlign: "center",
  },
  failureDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  tryAgainButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    alignItems: "center",
  },
  tryAgainButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FingerprintVerificationFailedScreen;
