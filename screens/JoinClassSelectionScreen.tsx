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
          "Connection Error",
          error.message || "Failed to start mesh networking. Please check Bluetooth and Location permissions."
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
            <Icon name="alert-circle" size={24} color="#ef4444" />
            <Text style={styles.statusText}>
              Connection unavailable
            </Text>
            <Text style={styles.statusSubtext}>
              Check Bluetooth and Location permissions
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Join Class session</Text>
        <Text style={styles.subtitle}>
          Class will be detected automatically. Once found, verify your identity with your device biometric.
        </Text>

        {renderMeshStatus()}

        {/* Start Verification Button */}
        <TouchableOpacity
          style={[
            styles.startButton,
            meshStatus !== "found" && styles.startButtonDisabled,
          ]}
          onPress={handleStartVerification}
          disabled={meshStatus !== "found"}
        >
          <Text style={styles.startButtonText}>Start Verification</Text>
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
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    lineHeight: 20,
  },
  meshStatusContainer: {
    marginBottom: 24,
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
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
    gap: 16,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  searchIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    gap: 8,
  },
  peerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  wave: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  statusFound: {
    backgroundColor: "#d1fae5",
    flexWrap: "wrap",
  },
  statusError: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  statusSubtext: {
    width: "100%",
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  startButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
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
    opacity: 0.5,
    backgroundColor: "#d1d5db",
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default JoinClassSelectionScreen;
