import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import MeshService from "../src/services/meshservice";

const JoinClassSelectionScreen = ({ navigation, route }: any) => {
  const { course } = route.params || {};

  const [meshStatus, setMeshStatus] = useState<
    "idle" | "initializing" | "searching" | "found" | "error"
  >("idle");
  const [detectedSession, setDetectedSession] = useState<any>(null);
  const [peerCount, setPeerCount] = useState(0);

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Initialize mesh service
  useEffect(() => {

    const initMesh = async () => {
      try {
        setMeshStatus("initializing");

        // Initialize mesh service with student nickname
        const nickname = `Student-${Date.now()}`;
        await MeshService.initialize(nickname);

        setMeshStatus("searching");
        setPeerCount(MeshService.getPeerCount());

        // Start searching animations
        startSearchingAnimations();

        // Listen for session detection
        const sessionHandler = (session: any) => {
          console.log("✅ Class found!", session);
          setDetectedSession(session);
          setMeshStatus("found");

          Alert.alert(
            "Class Found!",
            `Detected ${session.course} class by ${session.lecturer}. Ready to verify.`
          );
        };

        const unsubscribeSession = MeshService.onSessionDetected(sessionHandler);

        // Listen for course if specified
        if (course) {
          await MeshService.listenForCourse(course);
        }

        // Update peer count periodically
        const peerInterval = setInterval(() => {
          setPeerCount(MeshService.getPeerCount());
        }, 2000);

        return () => {
          unsubscribeSession();
          clearInterval(peerInterval);
        };
      } catch (error: any) {
        console.error("Mesh initialization failed:", error);
        setMeshStatus("error");
        Alert.alert(
          "Connection Required",
          "Please enable Bluetooth and Location services to join class sessions.\n\nSteps:\n1. Open Settings\n2. Enable Bluetooth\n3. Enable Location Services\n4. Return to the app",
          [
            { text: "OK", style: "default" }
          ]
        );
      }
    };

    initMesh();

    return () => {
      // Cleanup on unmount
      MeshService.cleanup();
    };
  }, [course]);

  // Search animation
  useEffect(() => {
    if (meshStatus === "searching") {
      startSearchingAnimations();
    } else {
      stopSearchingAnimations();
    }

    return () => stopSearchingAnimations();
  }, [meshStatus]);

  const startSearchingAnimations = () => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotate animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopSearchingAnimations = () => {
    pulseAnim.stopAnimation();
    rotateAnim.stopAnimation();
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleStartVerification = () => {
    if (!detectedSession && meshStatus !== "found") {
      Alert.alert(
        "Class Not Found",
        "Please wait for the class session to be detected. Make sure the lecturer has started the session.",
        [{ text: "OK" }]
      );
      return;
    }

    const navigationParams: any = {
      isClass: true,
      meshMode: true,
      session: detectedSession,
    };

    // Navigate to biometric auth screen (auto-detects device type)
    navigation.navigate("BiometricAuth", navigationParams);
  };

  const renderMeshStatus = () => {
    return (
      <View style={styles.meshStatusContainer}>
        {meshStatus === "initializing" && (
          <View style={[styles.statusBox, styles.statusInitializing]}>
            <ActivityIndicator size="small" color="#8B5CF6" />
            <Text style={styles.statusText}>Initializing connection...</Text>
          </View>
        )}

        {meshStatus === "searching" && (
          <View style={[styles.statusBox, styles.statusSearching]}>
            <View style={styles.searchingContent}>
              <View style={styles.iconWrapper}>
                <Animated.View
                  style={[
                    styles.searchIconContainer,
                    {
                      transform: [
                        { scale: pulseAnim },
                        { rotate: rotateInterpolate },
                      ],
                    },
                  ]}
                >
                  <Icon name="radio" size={32} color="#8B5CF6" />
                </Animated.View>
                {[0, 1, 2].map((index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.wave,
                      {
                        transform: [
                          {
                            scale: pulseAnim.interpolate({
                              inputRange: [1, 1.2],
                              outputRange: [1 + index * 0.3, 1.2 + index * 0.3],
                            }),
                          },
                        ],
                        opacity: pulseAnim.interpolate({
                          inputRange: [1, 1.2],
                          outputRange: [0.4 - index * 0.15, 0.7 - index * 0.15],
                        }),
                      },
                    ]}
                  />
                ))}
              </View>
              <View style={styles.searchingTextContainer}>
                <Text style={styles.statusText}>
                  🔍 Searching for {course || "class"}...
                </Text>
                <View style={styles.peerInfo}>
                  <Icon name="people" size={14} color="#8B5CF6" />
                  <Text style={styles.statusSubtext}>
                    {peerCount} peer{peerCount !== 1 ? 's' : ''} connected
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {meshStatus === "found" && detectedSession && (
          <View style={[styles.statusBox, styles.statusFound]}>
            <Icon name="checkmark-circle" size={24} color="#10b981" />
            <Text style={styles.statusText}>
              ✅ Class found! Ready to verify
            </Text>
            <Text style={styles.statusSubtext}>
              {detectedSession.course} by {detectedSession.lecturer}
            </Text>
            <Text style={styles.statusSubtext}>
              Connected to {peerCount} peers
            </Text>
          </View>
        )}

        {meshStatus === "error" && (
          <View style={[styles.statusBox, styles.statusError]}>
            <Icon name="alert-circle" size={20} color="#ef4444" />
            <View style={styles.errorContent}>
              <Text style={styles.statusText}>
                Connection Unavailable
              </Text>
              <Text style={styles.statusSubtext}>
                Please enable Bluetooth and Location in your device settings to join class sessions.
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Join Class Session</Text>
        <Text style={styles.subtitle}>
          Your class will be detected automatically via Bluetooth. Once found, verify your identity to mark attendance.
        </Text>

        {renderMeshStatus()}

        {/* Helpful Tips */}
        {meshStatus === "searching" && (
          <View style={styles.tipsContainer}>
            <Icon name="information-circle-outline" size={16} color="#6b7280" />
            <Text style={styles.tipsText}>
              Make sure you're near the classroom and Bluetooth is enabled
            </Text>
          </View>
        )}

        {/* Start Verification Button */}
        <TouchableOpacity
          style={[
            styles.startButton,
            meshStatus !== "found" && styles.startButtonDisabled,
          ]}
          onPress={handleStartVerification}
          disabled={meshStatus !== "found"}
        >
          <Text style={styles.startButtonText}>
            {meshStatus === "found" ? "Start Verification" : "Searching for Class..."}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 20,
    lineHeight: 19,
  },
  meshStatusContainer: {
    marginBottom: 20,
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    gap: 10,
  },
  statusInitializing: {
    backgroundColor: "#e9d5ff",
  },
  statusSearching: {
    backgroundColor: "white",
    flexWrap: "wrap",
    borderWidth: 2,
    borderColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  searchingContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 14,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  searchIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#8B5CF6",
    position: "absolute",
    zIndex: 10,
  },
  searchingTextContainer: {
    flex: 1,
    gap: 6,
  },
  peerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  wave: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  statusFound: {
    backgroundColor: "#d1fae5",
    flexWrap: "wrap",
  },
  statusError: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  errorContent: {
    flex: 1,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 11,
    color: "#6b7280",
    lineHeight: 16,
  },
  tipsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tipsText: {
    flex: 1,
    fontSize: 11,
    color: "#6b7280",
    lineHeight: 16,
  },
  startButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
    width: "100%",
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonDisabled: {
    opacity: 0.6,
    backgroundColor: "#d1d5db",
    shadowOpacity: 0,
  },
  startButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default JoinClassSelectionScreen;
