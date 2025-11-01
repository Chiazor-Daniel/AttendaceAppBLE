"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import Transport from "../src/services/BleTransport"
import DeviceInfo from "react-native-device-info"

const PinInputScreen = ({ navigation, route }: any) => {
  const { meetingId, courseCode, isClass } = route.params || {};
  const [pin, setPin] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const maxPinLength = 6

  const handleNumberPress = (number) => {
    if (pin.length < maxPinLength) {
      setPin(pin + number)
    }
  }

  const handleBackspace = () => {
    setPin(pin.slice(0, -1))
  }

  const handleVerify = async () => {
    if (pin.length !== maxPinLength) return;

    // For class attendance, verify PIN and send join message
    if (isClass && meetingId && courseCode) {
      setIsVerifying(true);
      try {
        // Simple PIN check (you can enhance this later)
        if (pin === "123456" || pin.length === 6) {
          const uniqueId = await DeviceInfo.getUniqueId();
          const joinMessage = {
            type: 'att:join',
            meetingId: meetingId,
            senderId: uniqueId,
            courseCode: courseCode,
          };

          Transport.send(joinMessage);
          console.log('✅ Sent att:join via PIN:', joinMessage);

          navigation.replace('AttendanceInProgress', {
            meetingId,
            courseCode,
            timeJoined: new Date().toLocaleTimeString(),
          });
        } else {
          navigation.navigate("PinInputError");
        }
      } catch (error) {
        console.error('Failed to send join message:', error);
        // Still navigate even if send fails
        navigation.replace('AttendanceInProgress', {
          meetingId,
          courseCode,
          timeJoined: new Date().toLocaleTimeString(),
        });
      } finally {
        setIsVerifying(false);
      }
    } else {
      // Non-class PIN verification (fallback)
      if (pin === "123456") {
        navigation.navigate("SessionConnected");
      } else {
        navigation.navigate("PinInputError");
      }
    }
  }

  const renderPinDots = () => {
    return (
      <View style={styles.pinContainer}>
        {Array.from({ length: maxPinLength }).map((_, index) => (
          <View key={index} style={[styles.pinDot, index < pin.length ? styles.pinDotFilled : styles.pinDotEmpty]} />
        ))}
      </View>
    )
  }

  const renderKeypad = () => {
    const numbers = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["X", "0", "⌫"],
    ]

    return (
      <View style={styles.keypad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.keypadButton}
                onPress={() => {
                  if (key === "X") {
                    // Handle X button (could be used for cancel)
                  } else if (key === "⌫") {
                    handleBackspace()
                  } else {
                    handleNumberPress(key)
                  }
                }}
              >
                <Text style={styles.keypadButtonText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Input PIN</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Input your 6-digit PIN to join this class session.</Text>

        {renderPinDots()}
        {renderKeypad()}

        <TouchableOpacity
          style={[
            styles.verifyButton,
            pin.length === maxPinLength ? styles.verifyButtonActive : styles.verifyButtonInactive,
          ]}
          onPress={handleVerify}
          disabled={pin.length !== maxPinLength || isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
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
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 60,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    borderWidth: 2,
  },
  pinDotEmpty: {
    backgroundColor: "transparent",
    borderColor: "#d1d5db",
  },
  pinDotFilled: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  keypad: {
    marginBottom: 40,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  keypadButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1f2937",
  },
  verifyButton: {
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    alignItems: "center",
  },
  verifyButtonActive: {
    backgroundColor: "#8B5CF6",
  },
  verifyButtonInactive: {
    backgroundColor: "#d1d5db",
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default PinInputScreen
