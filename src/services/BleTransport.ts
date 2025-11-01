// src/services/BleTransport.ts
import BitchatAPI from 'expo-bitchat';
import * as Location from 'expo-location';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

class BleTransport {
  isRunning = false;

  async requestPermissions() {
    try {
      if (Platform.OS === 'android') {
        console.log('🔐 Requesting Android 12+ Bluetooth permissions...');
        const permissions = [
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ];

        const granted = await PermissionsAndroid.requestMultiple(permissions);

        const allGranted = Object.values(granted).every(
          (res) => res === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) throw new Error('Bluetooth permissions denied');
        console.log('✅ Android 12+ Bluetooth permissions granted');
      } else {
        console.log('🔐 Requesting iOS location permission...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error('Location permission denied');
        console.log('✅ iOS location permission granted');
      }
    } catch (error) {
      console.error('🚨 Bluetooth permission error:', error);
      Alert.alert('Permission Error', String(error));
      throw error;
    }
  }

  async start(nickname: string) {
    try {
      await this.requestPermissions();

      console.log('🔥 Starting mesh service as:', nickname);
      await BitchatAPI.start(nickname);

      if (BitchatAPI.onMessage) {
        BitchatAPI.onMessage((msg: any) => console.log('📩 Message:', msg));
      } else {
        console.warn('⚠️ BitchatAPI.onMessage not found');
      }

      if (BitchatAPI.onPeerConnected) {
        BitchatAPI.onPeerConnected((peer: any) => console.log('🤝 Peer:', peer));
      }

      this.isRunning = true;
      console.log('🔥 Mesh service started');
    } catch (error) {
      console.error('Failed to start Transport:', error);
      Alert.alert('Bluetooth Error', String(error));
    }
  }

  async stop() {
    if (!this.isRunning) return;
    try {
      await BitchatAPI.stop();
      this.isRunning = false;
      console.log('🛑 Transport stopped');
    } catch (error) {
      console.error('Error stopping Transport:', error);
    }
  }

  async send(message: string) {
    if (!this.isRunning) return console.warn('⚠️ Transport not running');
    try {
      await BitchatAPI.send(message);
      console.log('📤 Message sent:', message);
    } catch (error) {
      console.error('Send failed:', error);
    }
  }
}

export default new BleTransport();
