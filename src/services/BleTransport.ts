import BitchatAPI from 'expo-bitchat';
import { EventEmitter } from 'events';
import * as Location from 'expo-location';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

class BleTransport extends EventEmitter {
  private isRunning = false;
  private subscriptions: any[] = [];

  // Request Android 12+ Bluetooth Permissions
  private async requestBluetoothPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    try {
      if (Platform.Version >= 31) {
        console.log('🔐 Requesting Android 12+ Bluetooth permissions...');

        const scanGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: 'Bluetooth Scan Permission',
            message: 'App needs Bluetooth scan permission to discover nearby devices',
            buttonPositive: 'OK',
          },
        );

        const connectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: 'Bluetooth Connect Permission',
            message: 'App needs Bluetooth connect permission to communicate with devices',
            buttonPositive: 'OK',
          },
        );

        const advertiseGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          {
            title: 'Bluetooth Advertise Permission',
            message: 'App needs Bluetooth advertise permission to be discoverable',
            buttonPositive: 'OK',
          },
        );

        if (
          scanGranted !== PermissionsAndroid.RESULTS.GRANTED ||
          connectGranted !== PermissionsAndroid.RESULTS.GRANTED ||
          advertiseGranted !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('🚨 Bluetooth permissions denied!');
          Alert.alert(
            'Permissions Required',
            'Bluetooth permissions are required for attendance. Please grant them in Settings.',
            [{ text: 'OK' }],
          );
          return false;
        }

        console.log('✅ Android 12+ Bluetooth permissions granted');
        return true;
      } else {
        console.log('✅ Android < 12, using legacy permissions');
        return true;
      }
    } catch (err: any) {
      console.error(`🚨 Bluetooth permission error: ${err.message}`);
      return false;
    }
  }

  async start(nickname: string): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Transport already running');
      return;
    }

    try {
      // 1. Check/Request Bluetooth Permissions (Android 12+)
      const bluetoothPermGranted = await this.requestBluetoothPermissions();
      if (!bluetoothPermGranted) {
        throw new Error('Bluetooth permissions denied');
      }

      // 2. Check/Request Location Permissions
      const { status: locationPermissionStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (locationPermissionStatus !== 'granted') {
        const msg = '🚨 PERMISSION DENIED: Location/BLE access is required to scan for peers.';
        console.error(msg);
        Alert.alert('Permission Required', msg);
        throw new Error(msg);
      }
      console.log('✅ Location permissions granted.');

      // 3. Check Location Services (GPS Toggle - Android Only)
      if (Platform.OS === 'android') {
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        if (!isLocationEnabled) {
          const msg = '🚨 GPS Required: Location (GPS) Services must be ON for Bluetooth scanning.';
          Alert.alert('Location Services Required', msg + ' Please enable it manually in your device settings.');
          throw new Error(msg);
        }
        console.log('✅ Android Location/GPS enabled.');
      }

      // 4. Start Bitchat Service
      console.log(`🔥 Starting mesh service as: ${nickname}...`);
      await BitchatAPI.startServices(nickname);
      this.isRunning = true;
      console.log('🔥 Mesh services STARTED successfully.');

      // Setup listeners
      this.setupListeners();
    } catch (error: any) {
      let errorMsg = error.message || String(error);

      // Handle specific Bluetooth OFF error
      if (
        errorMsg.includes('Bluetooth') ||
        errorMsg.includes('adapter') ||
        errorMsg.includes('powered off')
      ) {
        errorMsg = '🚨 Bluetooth Adapter is OFF. Please manually turn on Bluetooth in your device settings.';
        Alert.alert('Bluetooth Required', errorMsg);
      }

      console.error(`🚨 ${errorMsg}`);
      this.isRunning = false;
      throw error;
    }
  }

  private setupListeners(): void {
    // Clear old listeners
    this.subscriptions.forEach((sub) => sub.remove());
    this.subscriptions = [];

    // Message Listener
    this.subscriptions.push(
      BitchatAPI.addMessageListener((message) => {
        try {
          // Parse JSON content from messages
          const parsed = JSON.parse(message.content);
          this.emit('m', parsed);
        } catch (e) {
          // If not JSON, emit raw message
          console.log('Received non-JSON message:', message.content);
        }
      }),
    );

    // Peer Connected Listener
    this.subscriptions.push(
      BitchatAPI.addPeerConnectedListener(({ nickname }) => {
        console.log(`🆕 Peer Connected: ${nickname}`);
      }),
    );

    // Peer Disconnected Listener
    this.subscriptions.push(
      BitchatAPI.addPeerDisconnectedListener(({ nickname }) => {
        console.log(`👋 Peer Disconnected: ${nickname}`);
      }),
    );

    console.log('✅ Event listeners setup.');
  }

  send(payload: any): void {
    if (!this.isRunning) {
      console.warn('⚠️ Transport not running, cannot send message');
      return;
    }

    try {
      BitchatAPI.sendMessage(JSON.stringify(payload), [], '#att');
      console.log('📤 Sent message:', payload);
    } catch (error: any) {
      console.error('🚨 Failed to send message:', error.message);
      throw error;
    }
  }

  stop(): void {
    if (!this.isRunning) return;

    console.log('🛑 Stopping Transport...');
    this.subscriptions.forEach((sub) => sub.remove());
    this.subscriptions = [];
    
    BitchatAPI.stopServices().catch((e) =>
      console.error(`Error stopping service: ${e.message}`),
    );
    
    this.isRunning = false;
    console.log('✅ Transport stopped.');
  }

  isActive(): boolean {
    return this.isRunning;
  }
}

export default new BleTransport();

