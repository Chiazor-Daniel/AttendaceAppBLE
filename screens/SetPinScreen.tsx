import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ToastAndroid,
} from 'react-native';

const SetPinScreen = ({ navigation, route }: any) => {
  const [pin, setPin] = useState('');
  const { firstPin } = route.params || {};

  const handleNumberPress = (number: string) => {
    if (pin.length < 4) {
      setPin(pin + number);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const createPin = () => {
    if (firstPin === undefined) {
      navigation.navigate('PinCreatedSuccess');
    }
    if (pin.length === 4) {
      if (pin === firstPin) {
        navigation.navigate('PinCreatedSuccess');
      } else {
        // Handle PIN mismatch
        ToastAndroid.show('PINs do not match. Please try again.', ToastAndroid.LONG);
        setPin('');
      }
    }
  };

  const renderKeypadButton = (number: string) => (
    <TouchableOpacity
      key={number}
      style={styles.keypadButton}
      onPress={() => handleNumberPress(number)}
    >
      <Text style={styles.keypadButtonText}>{number}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Set PIN</Text>
          <Text style={styles.subtitle}>
            Input a 4-digit PIN to set up your pin.
          </Text>
        </View>

        {/* PIN Dots */}
        <View style={styles.pinDotsContainer}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.pinDot,
                pin.length > index && styles.pinDotFilled
              ]}
            />
          ))}
        </View>

        {/* Keypad */}
        <View style={styles.keypad}>
          <View style={styles.keypadRow}>
            {renderKeypadButton(1)}
            {renderKeypadButton(2)}
            {renderKeypadButton(3)}
          </View>
          <View style={styles.keypadRow}>
            {renderKeypadButton(4)}
            {renderKeypadButton(5)}
            {renderKeypadButton(6)}
          </View>
          <View style={styles.keypadRow}>
            {renderKeypadButton(7)}
            {renderKeypadButton(8)}
            {renderKeypadButton(9)}
          </View>
          <View style={styles.keypadRow}>
            <TouchableOpacity style={styles.keypadButton} onPress={handleBackspace}>
              <Text style={styles.keypadButtonText}>✕</Text>
            </TouchableOpacity>
            {renderKeypadButton(0)}
            <TouchableOpacity style={styles.keypadButton} onPress={createPin}>
              <Text style={styles.keypadButtonText}>✓</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create PIN Button */}
        <TouchableOpacity 
          style={[styles.createButton, pin.length === 4 && styles.createButtonActive]} 
          onPress={createPin}
          disabled={pin.length !== 4}
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
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 60,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  pinDotFilled: {
    backgroundColor: '#8B5CF6',
  },
  keypad: {
    alignItems: 'center',
    marginBottom: 40,
  },
  keypadRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  keypadButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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

export default SetPinScreen;