import { Platform, PermissionsAndroid } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export interface PermissionStatus {
  bluetooth: boolean;
  location: boolean;
  backgroundLocation?: boolean;
}

class PermissionsManager {
  static async checkAndRequestPermissions(): Promise<PermissionStatus> {
    if (Platform.OS === 'android') {
      return await this.checkAndroidPermissions();
    } else {
      return await this.checkIosPermissions();
    }
  }

  private static async checkAndroidPermissions(): Promise<PermissionStatus> {
    const status: PermissionStatus = {
      bluetooth: false,
      location: false,
    };

    // For Android 12 and above
    if (Platform.Version >= 31) {
      const bluetoothScanResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: 'Bluetooth Scan Permission',
          message:
            'App needs bluetooth scan permission for attendance sessions',
          buttonPositive: 'Allow',
        },
      );

      const bluetoothAdvertiseResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        {
          title: 'Bluetooth Advertise Permission',
          message:
            'App needs bluetooth advertise permission for attendance sessions',
          buttonPositive: 'Allow',
        },
      );

      const bluetoothConnectResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: 'Bluetooth Connect Permission',
          message:
            'App needs bluetooth connect permission for attendance sessions',
          buttonPositive: 'Allow',
        },
      );

      status.bluetooth =
        bluetoothScanResult === PermissionsAndroid.RESULTS.GRANTED &&
        bluetoothAdvertiseResult === PermissionsAndroid.RESULTS.GRANTED &&
        bluetoothConnectResult === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      // For Android < 12, request legacy Bluetooth permissions
      const legacyBluetoothResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH,
        {
          title: 'Bluetooth Permission',
          message: 'App needs bluetooth permission for attendance sessions',
          buttonPositive: 'Allow',
        },
      );

      const legacyBluetoothAdminResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
        {
          title: 'Bluetooth Admin Permission',
          message:
            'App needs bluetooth admin permission for attendance sessions',
          buttonPositive: 'Allow',
        },
      );

      status.bluetooth =
        legacyBluetoothResult === PermissionsAndroid.RESULTS.GRANTED &&
        legacyBluetoothAdminResult === PermissionsAndroid.RESULTS.GRANTED;
    }

    // Location permissions (required for BLE scanning on Android)
    // First request FINE and COARSE location
    const fineLocationResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message:
          'App needs precise location permission for Bluetooth functionality',
        buttonPositive: 'Allow',
      },
    );

    const coarseLocationResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Approximate Location Permission',
        message: 'App needs location permission for Bluetooth functionality',
        buttonPositive: 'Allow',
      },
    );

    // Only request background location if the other location permissions are granted
    let backgroundLocationResult = PermissionsAndroid.RESULTS.DENIED;
    if (
      fineLocationResult === PermissionsAndroid.RESULTS.GRANTED &&
      coarseLocationResult === PermissionsAndroid.RESULTS.GRANTED
    ) {
      backgroundLocationResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Background Location Permission',
          message:
            'App needs background location access to scan for nearby devices even when the app is in background',
          buttonPositive: 'Allow',
          buttonNegative: 'Cancel',
          buttonNeutral: 'Maybe Later',
        },
      );
    }

    status.location =
      fineLocationResult === PermissionsAndroid.RESULTS.GRANTED &&
      coarseLocationResult === PermissionsAndroid.RESULTS.GRANTED;
    // Make background location optional since it's not critical for foreground operation
    status.backgroundLocation =
      backgroundLocationResult === PermissionsAndroid.RESULTS.GRANTED;

    return status;
  }

  private static async checkIosPermissions(): Promise<PermissionStatus> {
    const status: PermissionStatus = {
      bluetooth: false,
      location: false,
    };

    // Check Bluetooth permission
    const bluetoothResult = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
    if (bluetoothResult === RESULTS.DENIED) {
      const requestResult = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
      status.bluetooth = requestResult === RESULTS.GRANTED;
    } else {
      status.bluetooth = bluetoothResult === RESULTS.GRANTED;
    }

    // iOS doesn't need location permission for BLE
    status.location = true;

    return status;
  }

  static async hasRequiredPermissions(): Promise<boolean> {
    const status = await this.checkAndRequestPermissions();
    return status.bluetooth && status.location;
  }
}

export default PermissionsManager;
