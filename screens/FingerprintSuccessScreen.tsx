import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Transport from '../src/services/BleTransport';
import DeviceInfo from 'react-native-device-info';

const FingerprintSuccessScreen = ({ navigation, route }: any) => {
  const scaleValue = new Animated.Value(0);
  const { isClass, meetingId, courseCode } = route.params || {};
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 50,
      friction: 3,
      useNativeDriver: true,
    }).start();

    // Auto-navigate after 2 seconds only if not joining class
    if (!isClass) {
      const timer = setTimeout(() => {
        navigation.navigate('SetPin');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isClass, navigation]);

  const handleContinue = async () => {
    if (!isClass) {
      navigation.navigate('SetPin');
      return;
    }

    // For class attendance, send join message
    if (!meetingId || !courseCode) {
      navigation.navigate('SessionConnected');
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
      console.log('✅ Sent att:join via FingerprintSuccess:', joinMessage);

      navigation.replace('AttendanceInProgress', {
        meetingId,
        courseCode,
        timeJoined: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error('Failed to send join message:', error);
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
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Animated.View
            style={[styles.successIcon, { transform: [{ scale: scaleValue }] }]}
          >
            <View style={styles.fingerprintIcon}>
              <Text style={styles.fingerprintText}>👆</Text>
            </View>
          </Animated.View>
        </View>

        {isClass ? (
          <>
            <Text style={[styles.title, { color: '#10b981' }]}>
              CLASS SESSION
            </Text>
            <Text style={styles.subtitle}>JOINED SUCCESSFULLY</Text>
            <Text style={styles.description}>
              You've been verified and added to the class session.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>FINGERPRINT SCANNED</Text>
            <Text style={styles.subtitle}>SUCCESSFUL</Text>
            <Text style={styles.description}>
              Your fingerprint has been successfully captured and verified.
            </Text>
          </>
        )}

        <TouchableOpacity
          style={[styles.continueButton, isJoining && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={isJoining}
        >
          {isJoining ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.continueButtonText}>
              {isClass ? 'Go to Session' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f0ff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 40,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  fingerprintIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerprintText: {
    fontSize: 35,
    color: '#10b981',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 60,
    paddingHorizontal: 40,
  },
  continueButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default FingerprintSuccessScreen;
