import { Platform, PermissionsAndroid } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

class PermissionsService {
  async checkAndRequestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      return this.checkAndroidPermissions();
    } else {
      return this.checkIosPermissions();
    }
  }

  private async checkAndroidPermissions(): Promise<boolean> {
    try {
      // For Android 12 and above
      if (Platform.Version >= 31) {
        const results = await Promise.all([
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
              title: 'Bluetooth Scan Permission',
              message:
                'We need access to Bluetooth to find nearby attendance sessions.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          ),
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
              title: 'Bluetooth Connect Permission',
              message:
                'We need access to Bluetooth to connect to attendance sessions.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          ),
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message:
                'We need location access to scan for nearby Bluetooth devices.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          ),
        ]);

        return results.every(result => result === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        // For Android 11 and below
        const locationResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'We need location access to scan for nearby Bluetooth devices.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        return locationResult === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Permission request failed:', err);
      return false;
    }
  }

  private async checkIosPermissions(): Promise<boolean> {
    try {
      // Check Bluetooth permission
      const bluetoothResult = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);

      if (bluetoothResult === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
        if (requestResult !== RESULTS.GRANTED) {
          return false;
        }
      } else if (bluetoothResult === RESULTS.BLOCKED) {
        await this.showPermissionSettings();
        return false;
      }

      // Check location permission
      const locationResult = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (locationResult === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (requestResult !== RESULTS.GRANTED) {
          return false;
        }
      } else if (locationResult === RESULTS.BLOCKED) {
        await this.showPermissionSettings();
        return false;
      }

      return true;
    } catch (err) {
      console.warn('Permission request failed:', err);
      return false;
    }
  }

  private async showPermissionSettings(): Promise<void> {
    try {
      await openSettings();
    } catch (err) {
      console.warn('Failed to open settings:', err);
    }
  }
}

export default new PermissionsService();
