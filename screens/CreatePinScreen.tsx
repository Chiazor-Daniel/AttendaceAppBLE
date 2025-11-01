import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const CreatePinScreen = ({ navigation }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNumberPress = (number) => {
    if (currentIndex < 4) {
      const newPin = [...pin];
      newPin[currentIndex] = number;
      setPin(newPin);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBackspace = () => {
    if (currentIndex > 0) {
      const newPin = [...pin];
      newPin[currentIndex - 1] = '';
      setPin(newPin);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const createPin = () => {
    if (pin.every(digit => digit !== '')) {
      navigation.navigate('SetPin', { firstPin: pin.join('') });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepText}>Step 3 of 3</Text>
          <Text style={styles.title}>Create Passcode</Text>
          <Text style={styles.subtitle}>
            Create a passcode you can easily remember and use it to join your class sessions when facial capturing fails.
          </Text>
        </View>

        {/* PIN Display */}
        <View style={styles.pinContainer}>
          <View style={styles.pinFrame}>
            <View style={styles.pinRow}>
              <View style={styles.pinDigit}>
                <Text style={styles.pinDigitText}>{pin[0] || '1'}</Text>
              </View>
              <View style={styles.pinDigit}>
                <Text style={styles.pinDigitText}>{pin[1] || '2'}</Text>
              </View>
            </View>
            <View style={styles.pinRow}>
              <View style={styles.pinDigit}>
                <Text style={styles.pinDigitText}>{pin[2] || '3'}</Text>
              </View>
              <View style={styles.pinDigit}>
                <Text style={styles.pinDigitText}>{pin[3] || '4'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Do not cancel or exit screen when creating pin
          </Text>
          <Text style={styles.noteText}>
            <Text style={styles.noteBold}>NOTE:</Text> The passcode pin is only used for verification purposes.
          </Text>
        </View>

        {/* Create PIN Button */}
        <TouchableOpacity 
          style={[styles.createButton, pin.every(digit => digit !== '') && styles.createButtonActive]} 
          onPress={createPin}
          disabled={!pin.every(digit => digit !== '')}
        >
          <Text style={styles.createButtonText}>Create PIN</Text>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  pinContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  pinFrame: {
    borderWidth: 3,
    borderColor: '#10b981',
    borderRadius: 20,
    padding: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  pinRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  pinDigit: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pinDigitText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d1d5db',
  },
  instructions: {
    alignItems: 'center',
    marginBottom: 60,
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  noteText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  noteBold: {
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#d1d5db',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  createButtonActive: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default CreatePinScreen;