import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import PermissionsService from '../services/PermissionsService';
import BleService from '../services/BleService';

interface PermissionProviderProps {
  children: React.ReactNode;
}

const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);

  useEffect(() => {
    checkPermissions();
    const subscription = BleService.manager.onStateChange(state => {
      setBluetoothEnabled(state === 'PoweredOn');
      if (state !== 'PoweredOn' && permissionsGranted) {
        setShowModal(true);
      }
    }, true);
    return () => subscription.remove();
  }, [permissionsGranted]);

  const checkPermissions = async () => {
    const granted = await PermissionsService.checkAndRequestPermissions();
    if (!granted) {
      setShowModal(true);
    } else {
      setPermissionsGranted(true);
    }
  };

  const handleRetryPermissions = async () => {
    const granted = await PermissionsService.checkAndRequestPermissions();
    if (granted) {
      setShowModal(false);
      setPermissionsGranted(true);
    }
  };

  if (!permissionsGranted || !bluetoothEnabled) {
    return (
      <>
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          statusBarTranslucent
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Permissions Required</Text>
              <Text style={styles.description}>
                To use the attendance feature, we need:
                {'\n\n'}• Bluetooth {bluetoothEnabled ? '✓' : '✗'}
                {'\n'}• Location Permission {permissionsGranted ? '✓' : '✗'}
                {'\n\n'}
                {!bluetoothEnabled
                  ? 'Please enable Bluetooth in your device settings.'
                  : ''}
                {!permissionsGranted
                  ? '\nPlease grant the required permissions.'
                  : ''}
              </Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  if (!bluetoothEnabled) {
                    Linking.openSettings();
                  } else {
                    handleRetryPermissions();
                  }
                }}
              >
                <Text style={styles.retryButtonText}>
                  {!bluetoothEnabled ? 'Open Settings' : 'Grant Permissions'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.helpText}>
                You can also enable permissions in your device settings.
              </Text>
            </View>
          </View>
        </Modal>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Checking permissions...</Text>
        </View>
      </>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24,
    lineHeight: 24,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  retryButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    fontSize: 16,
    color: '#4b5563',
  },
});

export default PermissionProvider;
