import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const JoinClassSelectionScreen = ({ navigation, route }: any) => {
  const { meetingId, courseCode } = route.params || {};

  const verificationOptions = [
    {
      title: 'Facial Recognition',
      icon: 'person',
      screen: 'FacialRecognitionSetup',
      params: { meetingId, courseCode, isClass: true },
    },
    {
      title: 'Fingerprint Scan',
      icon: 'finger-print',
      screen: 'FingerprintCapture',
      params: { meetingId, courseCode, isClass: true },
    },
    {
      title: 'PIN Verification',
      icon: 'lock-closed',
      screen: 'PinInput',
      params: { meetingId, courseCode, isClass: true },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Join Class session</Text>
        {courseCode && (
          <Text style={styles.courseLabel}>{courseCode}</Text>
        )}
        <Text style={styles.subtitle}>
          Verify your identity using any of these verification methods
        </Text>

        <View style={styles.optionsContainer}>
          {verificationOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => {
                navigation.navigate(option.screen, option.params || {});
              }}
            >
              <View style={styles.optionIcon}>
                <Icon name={option.icon} size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.optionText}>{option.title}</Text>
              <Icon name="chevron-forward" size={20} color="#8B5CF6" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  courseLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 40,
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  startButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JoinClassSelectionScreen;
