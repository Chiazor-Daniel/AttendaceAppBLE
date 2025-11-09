import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

const FacialDetectionSuccessScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Facial Detection</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Face Detection Frame with Success */}
        <View style={styles.detectionContainer}>
          <View style={styles.successFrame}>
            <View style={styles.faceImageContainer}>
              {/* Placeholder for actual face image */}
              <View style={styles.faceImage}>
                <Icon name="person" size={60} color="#6b7280" />
              </View>
            </View>

            {/* Success Checkmark */}
            <View style={styles.successIcon}>
              <Icon name="checkmark-circle" size={40} color="#10b981" />
            </View>
          </View>
        </View>

        <Text style={styles.successTitle}>Identity Successfully Verified</Text>

        <Text style={styles.successDescription}>
          Your face has been successfully verified and recorded for this class
          session. Enjoy the lecture!
        </Text>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("SessionConnected")}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  successFrame: {
    width: 280,
    height: 200,
    borderWidth: 3,
    borderColor: "#10b981",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    position: "relative",
  },
  faceImageContainer: {
    alignItems: "center",
  },
  faceImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
    textAlign: "center",
  },
  successDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  continueButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FacialDetectionSuccessScreen;
