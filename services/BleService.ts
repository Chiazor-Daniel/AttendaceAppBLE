import {
  BleManager,
  State,
  Characteristic,
  BleError,
} from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { PermissionsAndroid, Platform } from 'react-native';

export interface AttendanceData {
  studentId: string;
  name: string;
  timestamp: string;
  verificationMethod: 'facial' | 'fingerprint' | 'pin';
  meetingId: string;
  courseCode: string;
}

export class BleService {
  private manager: BleManager;
  private readonly SERVICE_UUID = 'F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C';
  private readonly CHARACTERISTIC_UUID = 'F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5D';
  private isAdvertising = false;

  constructor() {
    this.manager = new BleManager({
      restoreStateIdentifier: 'lecturerAttendanceApp',
      restoreStateFunction: this.handleRestoredState.bind(this),
    });
  }

  private handleRestoredState(restoredState: any) {
    console.log('BLE State restored:', restoredState);
  }

  async checkPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (apiLevel >= 31) {
        // Android 12 or higher
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        ]);

        return Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED,
        );
      }
    }

    const state = await this.manager.state();
    if (state !== State.PoweredOn) {
      throw new Error('Bluetooth is not powered on');
    }
    return true;
  }

  async startAdvertising(sessionId: string, courseCode: string): Promise<void> {
    try {
      const hasPermissions = await this.checkPermissions();
      if (!hasPermissions) {
        throw new Error('Bluetooth permissions not granted');
      }

      // Create advertising data
      const advertisingName = `Lecturer_${sessionId}_${courseCode}`;
      const manufacturerData = Buffer.from(
        JSON.stringify({
          sessionId,
          courseCode,
          type: 'lecturer',
        }),
      ).toString('base64');

      if (Platform.OS === 'ios') {
        await this.manager.startAdvertising({
          serviceUUIDs: [this.SERVICE_UUID],
          localName: advertisingName,
        });
      } else {
        // Android requires different approach
        await this.manager.startAdvertising({
          serviceUUIDs: [this.SERVICE_UUID],
          manufacturerData,
          localName: advertisingName,
          includeTxPowerLevel: true,
        });
      }

      this.isAdvertising = true;
      console.log('Started advertising:', advertisingName);
    } catch (error) {
      console.error('Failed to start advertising:', error);
      if (error instanceof BleError) {
        console.error('BLE Error:', error.message, error.errorCode);
      }
      throw error;
    }
  }

  async stopAdvertising(): Promise<void> {
    try {
      if (this.isAdvertising) {
        await this.manager.stopAdvertising();
        this.isAdvertising = false;
      }
    } catch (error) {
      console.error('Failed to stop advertising:', error);
      throw error;
    }
  }

  onStudentAttendance(callback: (data: AttendanceData) => void): void {
    this.manager.monitorCharacteristicForService(
      this.SERVICE_UUID,
      this.CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
          console.error('Error monitoring characteristic:', error);
          return;
        }

        if (characteristic?.value) {
          try {
            const decodedValue = Buffer.from(
              characteristic.value,
              'base64',
            ).toString();
            const attendanceData = JSON.parse(decodedValue) as AttendanceData;
            callback(attendanceData);
          } catch (parseError) {
            console.error('Error parsing attendance data:', parseError);
          }
        }
      },
    );
  }

  destroy(): void {
    this.stopAdvertising().catch(console.error);
    this.manager.destroy();
  }
}

export default BleService;
