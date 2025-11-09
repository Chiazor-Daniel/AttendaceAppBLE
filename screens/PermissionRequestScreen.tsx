'use client';

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  SafeAreaView,
} from 'react-native';
import PermissionsManager from '../utils/Permissions';

interface PermissionStatus {
  bluetooth: boolean;
  location: boolean;
  backgroundLocation?: boolean;
}

const PermissionRequestScreen = ({ navigation }) => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>({
    bluetooth: false,
    location: false,
  });

  const checkPermissions = async () => {
    const status = await PermissionsManager.checkAndRequestPermissions();
    setPermissionStatus(status);

    if (status.bluetooth && status.location) {
      // Background location is optional
      // All permissions granted, navigate to main app
      navigation.replace('LecturerDashboard');
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/*<Image
          source={require('../assets/bluetooth-icon.png')}
          style={styles.icon}
        />*/}

        <Text style={styles.title}>Permission Required</Text>
        <Text style={styles.description}>
          To use the attendance system, we need the following permissions:
        </Text>

        <View style={styles.permissionList}>
          <View style={styles.permissionItem}>
            <Text style={styles.permissionTitle}>Bluetooth</Text>
            <Text style={styles.permissionStatus}>
              {permissionStatus.bluetooth ? '✓ Granted' : '✗ Required'}
            </Text>
          </View>

          {Platform.OS === 'android' && (
            <>
              <View style={styles.permissionItem}>
                <Text style={styles.permissionTitle}>Location</Text>
                <Text style={styles.permissionStatus}>
                  {permissionStatus.location ? '✓ Granted' : '✗ Required'}
                </Text>
              </View>
              <View style={styles.permissionItem}>
                <Text style={styles.permissionTitle}>Background Location</Text>
                <Text style={styles.permissionStatus}>
                  {permissionStatus.backgroundLocation
                    ? '✓ Granted'
                    : '○ Optional'}
                </Text>
              </View>
            </>
          )}
        </View>

        <Text style={styles.note}>
          {Platform.OS === 'android'
            ? 'Location permission is required for Bluetooth functionality. Background location is optional but recommended for better performance.'
            : 'Bluetooth is required to broadcast attendance sessions.'}
        </Text>

        <TouchableOpacity style={styles.button} onPress={checkPermissions}>
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 30,
    tintColor: '#8B5CF6',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionList: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  permissionStatus: {
    fontSize: 16,
    color: '#6b7280',
  },
  note: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PermissionRequestScreen;
