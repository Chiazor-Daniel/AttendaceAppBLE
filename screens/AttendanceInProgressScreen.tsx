import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';

const AttendanceInProgressScreen = ({ navigation }) => {
  const [isOnlineMode, setIsOnlineMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Progress Details */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Attendance in Progress</Text>
          
          <Text style={styles.progressDescription}>
            Meeting ID expires after every session. Your attendance is being saved in the background and will be synced once internet connection is back.
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Meeting ID</Text>
              <Text style={styles.detailValue}>123456789FR</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Course</Text>
              <Text style={styles.detailValue}>BIO 101</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time Joined</Text>
              <Text style={styles.detailValue}>08:10 am</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>12-02-2025</Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Attendance Status</Text>
              <Text style={styles.statusNote}>
                Attendance Status will be recorded when back online
              </Text>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Switch to online mode</Text>
              <Switch
                value={isOnlineMode}
                onValueChange={setIsOnlineMode}
                trackColor={{ false: '#d1d5db', true: '#8B5CF6' }}
                thumbColor={isOnlineMode ? '#ffffff' : '#ffffff'}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.leaveButton}
            onPress={() => navigation.goBack()}
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
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