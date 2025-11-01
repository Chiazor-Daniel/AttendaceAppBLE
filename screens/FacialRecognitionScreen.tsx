import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

const FacialRecognitionScreen = ({ navigation }: any) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [progress] = useState(new Animated.Value(0));
  const [faceDetected, setFaceDetected] = useState(false);

  const device = useCameraDevice('front');
  const cameraRef = useRef<Camera>(null);

  // Ask camera permission on mount
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const startFacialCapturing = () => {
    if (!hasPermission || !device) return;

    setIsCapturing(true);
    setFaceDetected(true);

    // Animate progress
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(() => {
      if (faceDetected) {
        navigation.navigate('FacialCaptureSuccess');
        console.log('Facial Capture Success!');
      } else {
        navigation.navigate('FacialCaptureFailed');
        console.log('Facial Capture Failed!');
      }
      // Reset
      setIsCapturing(false);
      progress.setValue(0);
    });
  };

  const handleFacesDetected = (faces: any) => {
    if (faces.length > 0) {
      setFaceDetected(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepText}>Step 1 of 3</Text>
          <Text style={styles.title}>Facial Recognition Capturing</Text>
          <Text style={styles.subtitle}>
            Position your face within the frame and remain still during the
            capture process.
          </Text>
        </View>

        {/* Face Frame */}
        <View style={styles.captureArea}>
          <View
            style={[styles.faceFrame, isCapturing && styles.capturingFrame]}
          >
            {hasPermission && device && (
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isCapturing}
                faceDetectionCallback={handleFacesDetected}
                faceDetectionOptions={{ performanceMode: 'fast' }}
              />
            )}
          </View>

          {isCapturing && (
            <View style={styles.progressContainer}>
              <Text style={styles.capturingText}>Scanning your face</Text>
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

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Make sure your face is well-lit and clearly visible in the frame.
          </Text>
        </View>

        {/* Button */}
        {!isCapturing && (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={startFacialCapturing}
          >
            <Text style={styles.captureButtonText}>Start Facial Capturing</Text>
          </TouchableOpacity>
        )}
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
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  stepText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  captureArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: 280,
    height: 350,
    borderWidth: 3,
    borderColor: '#10b981',
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    overflow: 'hidden', // clip camera preview into circle
  },
  capturingFrame: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  progressContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  capturingText: {
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
  instructions: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  captureButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
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
});

export default FacialRecognitionScreen;
