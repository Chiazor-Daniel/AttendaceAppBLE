import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native"
import { Ionicons as Icon } from '@expo/vector-icons'
import Transport from "../src/services/BleTransport"
import DeviceInfo from "react-native-device-info"
import { useState } from "react"

const FingerprintVerificationSuccessScreen = ({ navigation, route }: any) => {
  const [isJoining, setIsJoining] = useState(false);
  const { meetingId, courseCode } = route.params || {};

  const handleContinue = async () => {
    if (!meetingId || !courseCode) {
      // If no meetingId/courseCode, navigate to SessionConnected (fallback)
      navigation.navigate("SessionConnected");
      return;
    }

    setIsJoining(true);
    
    try {
      const uniqueId = await DeviceInfo.getUniqueId();
      const joinMessage = {
        type: 'att:join',
        meetingId: meetingId,
        senderId: uniqueId,
        courseCode: courseCode,
      };

      Transport.send(joinMessage);
      console.log('✅ Sent att:join:', joinMessage);

      // Navigate to AttendanceInProgress with session info
      navigation.replace('AttendanceInProgress', {
        meetingId,
        courseCode,
        timeJoined: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error('Failed to send join message:', error);
      // Still navigate even if send fails
      navigation.replace('AttendanceInProgress', {
        meetingId,
        courseCode,
        timeJoined: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsJoining(false);
    }
  };

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
        {/* Fingerprint Detection Frame with Success */}
        <View style={styles.detectionContainer}>
          <View style={styles.successFrame}>
            <View style={styles.fingerprintContainer}>
              <Icon name="finger-print" size={80} color="#8B5CF6" />
            </View>

            {/* Success Checkmark */}
            <View style={styles.successIcon}>
              <Icon name="checkmark-circle" size={40} color="#10b981" />
            </View>
          </View>
        </View>

        <Text style={styles.successTitle}>Fingerprint Successfully Verified</Text>

        <Text style={styles.successDescription}>
          Your fingerprint has been successfully verified and recorded for this class session. Enjoy the lecture!
        </Text>

        <TouchableOpacity 
          style={[styles.continueButton, isJoining && styles.continueButtonDisabled]} 
          onPress={handleContinue}
          disabled={isJoining}
        >
          {isJoining ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
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
    alignItems: "center",
  },
  detectionContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  successFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: "#10b981",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    position: "relative",
  },
  fingerprintContainer: {
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
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default FingerprintVerificationSuccessScreen
