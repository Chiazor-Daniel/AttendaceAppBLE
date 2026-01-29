import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { Image } from 'react-native';

const SignInScreen = ({ navigation }: any) => {
  const [metroNumber, setMetroNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // if (!metroNumber || !password) {
    //   Alert.alert('Please fill in all fields');
    //   return;
    // }
    navigation.navigate('Dashboard');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"#8B5CF6"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>SIGN IN</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Metro Number</Text>
              <TextInput
                style={styles.input}
                value={metroNumber}
                onChangeText={setMetroNumber}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignUp} style={styles.linkContainer}>
              <Text style={styles.linkText}>
                Don't have an account? <Text style={styles.linkHighlight}>SIGN UP</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f0ff', // Light purple background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoWrapper: {
    width: 70,
    height: 70,
    backgroundColor: '#8B5CF6',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  appName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '400',
  },
  formContainer: {
    flex: 1,
    paddingTop: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    fontSize: 13,
    color: '#1f2937',
    paddingVertical: 9,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    backgroundColor: 'transparent',
  },
  signInButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  linkContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  linkText: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  linkHighlight: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
});

export default SignInScreen;