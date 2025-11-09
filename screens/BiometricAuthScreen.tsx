import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import RNBiometrics from 'react-native-biometrics';
import MeshService from '../src/services/meshservice';

const BiometricAuthScreen = ({ navigation, route }: any) => {
  const { meshMode, session, verificationType } = route.params || {};
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricType, setBiometricType] = useState<'FaceID' | 'TouchID' | 'Biometrics' | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);
  const pulseValue = new Animated.Value(1);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  // Auto-start authentication when screen loads (optional)
  // Or wait for button press - your choice

  const checkBiometricAvailability = async () => {
    try {
      const rnBiometrics = new RNBiometrics();
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      
      if (available) {
        // Map biometry types - react-native-biometrics returns strings
        if (biometryType === 'FaceID' || biometryType === 'Face') {
          setBiometricType('FaceID');
        } else if (biometryType === 'TouchID' || biometryType === 'Fingerprint') {
          setBiometricType('TouchID');
        } else {
          // Fallback to platform-based detection
          setBiometricType(Platform.OS === 'ios' ? 'FaceID' : 'TouchID');
        }
      } else {
        Alert.alert(
          'Biometric Unavailable',
          'Biometric authentication is not available on this device.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Biometric check error:', error);
      // Fallback to platform-based detection on error
      setBiometricType(Platform.OS === 'ios' ? 'FaceID' : 'TouchID');
    }
  };

  const startBiometricAuth = async () => {
    if (!biometricType) {
      Alert.alert('Error', 'Biometric authentication not available.');
      return;
    }

    setIsAuthenticating(true);

    try {
      const rnBiometrics = new RNBiometrics();
      
      // Determine prompt message based on device
      const promptMessage = 
        Platform.OS === 'ios' 
          ? 'Use Face ID to verify your attendance'
          : 'Use your fingerprint to verify your attendance';

      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel',
        fallbackPromptMessage: 'Use your device passcode',
      });

      if (success) {
        // Authentication successful - broadcast attendance if mesh mode
        if (meshMode && session) {
          await handleMeshAttendanceBroadcast();
        } else {
          // Navigate to success screen
          navigation.navigate('SessionConnected', {
            meshMode: meshMode || false,
          });
        }
      } else {
        // User cancelled or failed
        if (error !== 'UserCancel') {
          Alert.alert(
            'Authentication Failed',
            'Biometric authentication was unsuccessful. Please try again.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error: any) {
      console.error('Biometric auth error:', error);
      Alert.alert(
        'Authentication Error',
        error.message || 'An error occurred during authentication.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Broadcast attendance via mesh after successful verification
  const handleMeshAttendanceBroadcast = async () => {
    if (!meshMode || !session) {
      navigation.navigate('SessionConnected');
      return;
    }

    try {
      setIsBroadcasting(true);
      setBroadcastStatus('Broadcasting attendance...');

      // Ensure mesh service is running
      if (!MeshService.getStatus().isRunning) {
        await MeshService.initialize(`Student-${Date.now()}`);
      }

      // Determine verification type based on device
      const verification = Platform.OS === 'ios' ? 'faceid' : 'fingerprint';

      // Broadcast attendance data
      const attendanceData = {
        studentId: 'STU123', // TODO: Get from actual user data
        studentName: 'Student Name', // TODO: Get from actual user data
        course: session.course,
        meetingId: session.meetingId,
        verification,
        channel: session.channel,
      };

      const result = await MeshService.sendAttendanceData(attendanceData);

      setBroadcastStatus(`✅ Attendance shared with ${result.peerCount} peers`);

      Alert.alert(
        'Attendance Recorded',
        `Successfully verified and broadcasted attendance to ${result.peerCount} peers.`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('SessionConnected', {
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
              navigation.navigate('SessionConnected', {
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

  const getBiometricIcon = () => {
    if (Platform.OS === 'ios') {
      return 'face-recognition';
    }
    return 'finger-print';
  };

  const getBiometricLabel = () => {
    if (biometricType === 'FaceID') {
      return 'Face ID';
    } else if (biometricType === 'TouchID') {
      return 'Touch ID';
    }
    return Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Mesh Status */}
        {meshMode && session && (
          <View style={styles.meshInfoContainer}>
            <Text style={styles.meshInfoText}>
              📡 Joining: {session.course} by {session.lecturer}
            </Text>
          </View>
        )}

        {/* Biometric Icon */}
        <View style={styles.biometricContainer}>
          <View style={styles.biometricIconWrapper}>
            <Icon
              name={getBiometricIcon()}
              size={80}
              color="#8B5CF6"
            />
          </View>
          
          <Text style={styles.biometricLabel}>
            {getBiometricLabel()}
          </Text>
          <Text style={styles.biometricSubtext}>
            {Platform.OS === 'ios'
              ? 'Use Face ID to verify your identity'
              : 'Use your fingerprint to verify your identity'}
          </Text>
        </View>

        {/* Broadcasting Status */}
        {isBroadcasting && broadcastStatus && (
          <View style={styles.broadcastingContainer}>
            <ActivityIndicator size="small" color="#8B5CF6" />
            <Text style={styles.broadcastingText}>{broadcastStatus}</Text>
          </View>
        )}

        {/* Authenticate Button */}
        {!isAuthenticating && !isBroadcasting && (
          <TouchableOpacity
            style={styles.authenticateButton}
            onPress={startBiometricAuth}
            disabled={!biometricType}
          >
            <Text style={styles.authenticateButtonText}>
              Verify with {getBiometricLabel()}
            </Text>
          </TouchableOpacity>
        )}

        {/* Authenticating Indicator */}
        {isAuthenticating && (
          <View style={styles.authenticatingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.authenticatingText}>
              Authenticating...
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
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  meshInfoContainer: {
    backgroundColor: '#e0e7ff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  meshInfoText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
    textAlign: 'center',
  },
  biometricContainer: {
    alignItems: 'center',
    marginBottom: 60,
    marginTop: 40,
  },
  biometricIconWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  biometricLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  biometricSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  authenticateButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
    marginBottom: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  authenticateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  authenticatingContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  authenticatingText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  broadcastingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  broadcastingText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BiometricAuthScreen;

