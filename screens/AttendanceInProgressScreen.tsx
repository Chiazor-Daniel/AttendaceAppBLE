import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Transport from '../src/services/BleTransport';
import DeviceInfo from 'react-native-device-info';
import { Ionicons } from '@expo/vector-icons';

type AttendanceStatus = 'waiting' | 'present' | 'late';

const AttendanceInProgressScreen = ({ navigation, route }: any) => {
  const { meetingId, courseCode, timeJoined } = route.params || {
    meetingId: 'N/A',
    courseCode: 'N/A',
    timeJoined: new Date().toLocaleTimeString(),
  };

  const [status, setStatus] = useState<AttendanceStatus>('waiting');
  const [deviceId, setDeviceId] = useState<string>('');

  // Get device ID on mount
  useEffect(() => {
    DeviceInfo.getUniqueId().then(setDeviceId);
  }, []);

  // Listen for att:ack and att:end messages
  useEffect(() => {
    if (!Transport.isActive()) {
      console.warn('⚠️ Transport not active');
      return;
    }

    const handleMessage = (m: any) => {
      if (m.type === 'att:ack' && m.senderId === deviceId && m.meetingId === meetingId) {
        console.log('✅ Received attendance acknowledgment:', m);
        setStatus(m.status === 'late' ? 'late' : 'present');
      }

      if (m.type === 'att:end' && m.meetingId === meetingId) {
        console.log('📢 Session ended by lecturer');
        navigation.replace('SessionOver', {
          meetingId,
          courseCode,
          status,
        });
      }
    };

    Transport.on('m', handleMessage);
    console.log('👂 Listening for attendance updates...');

    return () => {
      Transport.off('m', handleMessage);
    };
  }, [meetingId, deviceId, status, navigation, courseCode]);

  const getStatusDisplay = () => {
    switch (status) {
      case 'waiting':
        return { text: 'Waiting for confirmation...', color: '#f59e0b', icon: 'time-outline' };
      case 'present':
        return { text: 'Present ✓', color: '#10b981', icon: 'checkmark-circle' };
      case 'late':
        return { text: 'Late ⚠', color: '#f59e0b', icon: 'time-outline' };
      default:
        return { text: 'Unknown', color: '#6b7280', icon: 'help-circle-outline' };
    }
  };

  const statusDisplay = getStatusDisplay();
  const currentDate = new Date().toLocaleDateString();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Attendance in Progress</Text>

          <Text style={styles.progressDescription}>
            Your attendance request has been sent. Waiting for lecturer confirmation.
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Meeting ID</Text>
              <Text style={styles.detailValue}>{meetingId}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Course</Text>
              <Text style={styles.detailValue}>{courseCode}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time Joined</Text>
              <Text style={styles.detailValue}>{timeJoined}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{currentDate}</Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Attendance Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${statusDisplay.color}15` }]}>
                <Ionicons name={statusDisplay.icon} size={20} color={statusDisplay.color} />
                <Text style={[styles.statusText, { color: statusDisplay.color }]}>
                  {statusDisplay.text}
                </Text>
              </View>
              {status === 'waiting' && (
                <View style={styles.waitingIndicator}>
                  <ActivityIndicator size="small" color="#8B5CF6" />
                  <Text style={styles.waitingText}>
                    Waiting for lecturer to confirm your attendance...
                  </Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.leaveButton}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.leaveButtonText}>Leave Session</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  syncButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  syncIcon: {
    color: 'white',
    fontSize: 12,
    marginRight: 4,
  },
  syncText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  statusSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  progressDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 32,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  detailRow: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  statusRow: {
    marginBottom: 24,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  statusNote: {
    fontSize: 12,
    color: '#8B5CF6',
    fontStyle: 'italic',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  waitingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  waitingText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  leaveButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  leaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default AttendanceInProgressScreen;