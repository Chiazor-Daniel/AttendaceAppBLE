'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { Ionicons as Icon } from '@expo/vector-icons';
import MeshService from '../src/services/meshservice';

const FacialDetectionScanningScreen = ({ navigation, route }: any) => {
  const { meshMode, session, verificationType } = route.params || {};
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [faceDetected, setFaceDetected] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);
  const [progress] = useState(new Animated.Value(0));
  const pulseValue = new Animated.Value(1);
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('front');

  // Request camera permission on mount
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Handle pulse animation when scanning
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation | null = null;
    if (isScanning) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseAnimation.start();
    }
    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [isScanning]);

  // Face detection callback
  const handleFacesDetected = (faces: any) => {
    if (faces.length > 0) {
      setFaceDetected(true);
    }
  };

  // Start facial verification with camera
  const startFacialVerification = () => {
    if (!hasPermission || !device) {
      // Optionally show error
      navigation.replace('Dashboard');
      return;
    }

    setIsScanning(true);
    setFaceDetected(false); // Reset detection state

    // Run 5-second capture
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(async () => {
      if (faceDetected) {
        // If mesh mode, broadcast attendance
        if (meshMode && session) {
          await handleMeshAttendanceBroadcast();
        } else {
          navigation.navigate('FacialDetectionSuccess');
        }
      } else {
        navigation.replace('FacialDetectionFailed');
      }
      setIsScanning(false);
      progress.setValue(0);
    });
  };

  // Broadcast attendance via mesh after successful verification
  const handleMeshAttendanceBroadcast = async () => {
    if (!meshMode || !session) {
      navigation.navigate('FacialDetectionSuccess');
      return;
    }

    try {
      setIsBroadcasting(true);
      setBroadcastStatus('Broadcasting attendance...');

      // Ensure mesh service is running
      if (!MeshService.getStatus().isRunning) {
        await MeshService.initialize(`Student-${Date.now()}`);
      }

      // Broadcast attendance data
      const attendanceData = {
        studentId: 'STU123', // TODO: Get from actual user data
        studentName: 'Student Name', // TODO: Get from actual user data
        course: session.course,
        meetingId: session.meetingId,
        verification: 'facial',
        channel: session.channel,
      };

      const result = await MeshService.sendAttendanceData(attendanceData);

      setBroadcastStatus(
        `✅ Attendance shared with ${result.peerCount} peers`
      );

      Alert.alert(
        'Attendance Recorded',
        `Successfully broadcasted attendance to ${result.peerCount} peers via mesh network.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to success screen with mesh info
              navigation.navigate('FacialDetectionSuccess', {
                meshMode: true,
                peerCount: result.peerCount,
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Mesh broadcast error:', error);
      setBroadcastStatus('Failed to broadcast');
      Alert.alert(
        'Broadcast Failed',
        error.message || 'Failed to broadcast attendance. Attendance will sync when online.',
        [
          {
            text: 'Continue',
            onPress: () => {
              // Still navigate to success - attendance will sync later
              navigation.navigate('FacialDetectionSuccess', {
                meshMode: true,
                broadcastFailed: true,
              });
            },
          },
        ]
      );
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="close"
          size={24}
          color="#333"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Facial Verification</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Face Detection Frame with Camera */}
        <View style={styles.detectionContainer}>
          <Animated.View
            style={[
              styles.detectionFrame,
              isScanning && styles.scanningFrame,
              { transform: [{ scale: isScanning ? pulseValue : 1 }] },
            ]}
          >
            {hasPermission && device ? (
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isScanning}
                faceDetectionCallback={handleFacesDetected}
                faceDetectionOptions={{
                  performanceMode: 'fast',
                }}
              />
            ) : (
              <View style={styles.noCameraView}>
                <Text style={styles.noCameraText}>
                  {hasPermission === false
                    ? 'Camera permission denied'
                    : 'No front camera'}
                </Text>
              </View>
            )}
          </Animated.View>

          {isScanning && (
            <View style={styles.progressContainer}>
              <Text style={styles.scanningText}>
                {faceDetected ? 'Face detected!' : 'Looking for your face...'}
              </Text>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        <Text style={styles.instructionText}>
          Please keep your face centered inside the frame and keep facing
          forward.
        </Text>

        {/* Mesh Status */}
        {meshMode && session && (
          <View style={styles.meshInfoContainer}>
            <Text style={styles.meshInfoText}>
              📡 Joining: {session.course} by {session.lecturer}
            </Text>
            {isBroadcasting && broadcastStatus && (
              <Text style={styles.meshStatusText}>{broadcastStatus}</Text>
            )}
          </View>
        )}

        {/* Start Button */}
        {!isScanning && !isBroadcasting && (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={startFacialVerification}
            disabled={!hasPermission || !device}
          >
            <Text style={styles.captureButtonText}>Verify with Face</Text>
          </TouchableOpacity>
        )}

        {/* Broadcasting Indicator */}
        {isBroadcasting && (
          <View style={styles.broadcastingContainer}>
            <ActivityIndicator size="small" color="#8B5CF6" />
            <Text style={styles.broadcastingText}>
              Broadcasting attendance via mesh...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  detectionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  detectionFrame: {
    width: 280,
    height: 200,
    borderWidth: 3,
    borderColor: '#10b981',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    overflow: 'hidden', // Important: clips camera preview
  },
  scanningFrame: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  noCameraView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCameraText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 16,
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  captureButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  meshInfoContainer: {
    backgroundColor: '#e0e7ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  meshInfoText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
    textAlign: 'center',
  },
  meshStatusText: {
    fontSize: 11,
    color: '#10b981',
    marginTop: 4,
    fontWeight: '600',
  },
  broadcastingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  broadcastingText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FacialDetectionScanningScreen;
