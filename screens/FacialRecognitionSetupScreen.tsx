import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

const FacialRecognitionSetupScreen = ({ navigation, route }: any) => {
  const { meetingId, courseCode } = route.params || {};
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Facial Recognition</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Align your face to verify your identity and join the class.</Text>

        {/* Face Detection Frame */}
        <View style={styles.detectionContainer}>
          <View style={styles.detectionFrame}>
            <View style={styles.faceOutline}>
              {/* Face outline with dashed border */}
              <View style={styles.dashedCircle} />
              <View style={styles.dashedRect} />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.startButton} 
          onPress={() => navigation.navigate("FacialDetectionScanning", { meetingId, courseCode })}
        >
          <Text style={styles.startButtonText}>Start Facial detection</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

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
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 60,
    lineHeight: 20,
  },
  detectionContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  detectionFrame: {
    width: 280,
    height: 200,
    borderWidth: 3,
    borderColor: "#10b981",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
  },
  faceOutline: {
    alignItems: "center",
  },
  dashedCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    marginBottom: 20,
  },
  dashedRect: {
    width: 120,
    height: 60,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default FacialRecognitionSetupScreen
