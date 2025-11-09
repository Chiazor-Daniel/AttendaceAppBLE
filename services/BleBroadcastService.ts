import BLEAdvertiser from 'react-native-ble-advertiser';
import { NativeEventEmitter, NativeModules, Platform, PermissionsAndroid } from 'react-native';

export interface BleAdvertiseOptions {
  advertiseMode?: number;
  txPowerLevel?: number;
  connectable?: boolean;
  includeDeviceName?: boolean;
}

class BleBroadcastService {
  private static instance: BleBroadcastService;
  private readonly SERVICE_UUID = '0000AB00-0000-1000-8000-00805F9B34FB';
  private isAdvertising = false;
  private eventEmitter: NativeEventEmitter;

  private constructor() {
    BLEAdvertiser.setCompanyId(0x0000);
    this.eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);
  }

  public static getInstance(): BleBroadcastService {
    if (!BleBroadcastService.instance) {
      BleBroadcastService.instance = new BleBroadcastService();
    }
    return BleBroadcastService.instance;
  }

  async checkPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (apiLevel >= 31) { // Android 12 or higher
        const results = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return Object.values(results).every(
          result => result === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return result === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true; // iOS handles permissions differently
  }

  async startBroadcast(sessionToken: string): Promise<void> {
    try {
      if (this.isAdvertising) {
        await this.stopBroadcast();
      }

      const hasPermissions = await this.checkPermissions();
      if (!hasPermissions) {
        throw new Error('Required permissions not granted');
      }

      // Configure advertising options
      const options: BleAdvertiseOptions = {
        advertiseMode: BLEAdvertiser.ADVERTISE_MODE_LOW_LATENCY,
        txPowerLevel: BLEAdvertiser.ADVERTISE_TX_POWER_HIGH,
        connectable: false,
        includeDeviceName: false,
      };

      // Start broadcasting
      await BLEAdvertiser.broadcast(
        [this.SERVICE_UUID],
        [sessionToken],
        options
      );

      this.isAdvertising = true;
      console.log('Broadcasting started with session token:', sessionToken);
    } catch (error) {
      console.error('Failed to start broadcasting:', error);
      throw error;
    }
  }

  async stopBroadcast(): Promise<void> {
    try {
      if (this.isAdvertising) {
        await BLEAdvertiser.stopBroadcast();
        this.isAdvertising = false;
        console.log('Broadcasting stopped');
      }
    } catch (error) {
      console.error('Failed to stop broadcasting:', error);
      throw error;
    }
  }

  onDeviceFound(callback: (deviceData: any) => void): () => void {
    const subscription = this.eventEmitter.addListener('onDeviceFound', callback);
    return () => subscription.remove();
  }

  async startScanning(): Promise<void> {
    try {
      const hasPermissions = await this.checkPermissions();
      if (!hasPermissions) {
        throw new Error('Required permissions not granted');
      }

      await BLEAdvertiser.scanByService([this.SERVICE_UUID], {
        scanMode: BLEAdvertiser.SCAN_MODE_LOW_LATENCY,
      });

      console.log('Scanning started');
    } catch (error) {
      console.error('Failed to start scanning:', error);
      throw error;
    }
  }

  async stopScanning(): Promise<void> {
    try {
      await BLEAdvertiser.stopScan();
      console.log('Scanning stopped');
    } catch (error) {
      console.error('Failed to stop scanning:', error);
      throw error;
    }
  }

  destroy(): void {
    this.stopBroadcast().catch(console.error);
    this.stopScanning().catch(console.error);
  }
}

export default BleBroadcastService;
