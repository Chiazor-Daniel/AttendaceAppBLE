import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Transport from '../src/services/BleTransport';
import { Ionicons } from '@expo/vector-icons';

interface SessionAd {
  meetingId: string;
  courseCode: string;
  duration?: number;
  window?: number;
  timestamp: number;
}

const AttendanceSessionScreen = ({ navigation }: any) => {
  const [ads, setAds] = useState<SessionAd[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Listen for att:advertise messages
  useEffect(() => {
    const handleMessage = (m: any) => {
      if (m.type === 'att:advertise') {
        console.log('📡 Received session ad:', m);
        setAds((prevAds) => {
          // Remove old entries with same meetingId and add new one
          const filtered = prevAds.filter((x) => x.meetingId !== m.meetingId);
          return [
            ...filtered,
            {
              meetingId: m.meetingId,
              courseCode: m.courseCode,
              duration: m.duration,
              window: m.window,
              timestamp: Date.now(),
            },
          ];
        });
        setIsScanning(false);
      }
    };

    if (Transport.isActive()) {
      Transport.on('m', handleMessage);
      console.log('🔍 Started scanning for attendance sessions...');
    } else {
      console.warn('⚠️ Transport not active, cannot scan for sessions');
      setIsScanning(false);
    }

    return () => {
      Transport.off('m', handleMessage);
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setAds([]);
    setIsScanning(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleSelectSession = (session: SessionAd) => {
    navigation.navigate('JoinClassSelection', {
      meetingId: session.meetingId,
      courseCode: session.courseCode,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.sessionSection}>
          <Text style={styles.sessionTitle}>Available Sessions</Text>

          <Text style={styles.sessionDescription}>
            Select an available class session to join. Sessions are discovered via Bluetooth from nearby lecturers.
          </Text>

          {isScanning && ads.length === 0 && (
            <View style={styles.scanningContainer}>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={styles.scanningText}>Scanning for sessions...</Text>
              <Text style={styles.scanningHint}>
                Make sure Bluetooth is ON and lecturer has started a session
              </Text>
            </View>
          )}

          {ads.length === 0 && !isScanning && (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No sessions found</Text>
              <Text style={styles.emptySubtext}>
                Pull down to refresh and scan again
              </Text>
            </View>
          )}

          {ads.length > 0 && (
            <View style={styles.sessionsList}>
              {ads.map((session, index) => (
                <TouchableOpacity
                  key={`${session.meetingId}-${index}`}
                  style={styles.sessionCard}
                  onPress={() => handleSelectSession(session)}
                >
                  <View style={styles.sessionCardHeader}>
                    <View style={styles.courseBadge}>
                      <Text style={styles.courseCode}>{session.courseCode}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#8B5CF6" />
                  </View>
                  <View style={styles.sessionCardDetails}>
                    <View style={styles.sessionDetailRow}>
                      <Text style={styles.sessionDetailLabel}>Meeting ID:</Text>
                      <Text style={styles.sessionDetailValue}>
                        {session.meetingId}
                      </Text>
                    </View>
                    {session.duration && (
                      <View style={styles.sessionDetailRow}>
                        <Text style={styles.sessionDetailLabel}>Duration:</Text>
                        <Text style={styles.sessionDetailValue}>
                          {session.duration} min
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
  sessionSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  sessionDescription: {
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
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#6b7280',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  scanningContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: 20,
  },
  scanningText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
    marginTop: 16,
  },
  scanningHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  sessionsList: {
    marginTop: 20,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  courseCode: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  sessionCardDetails: {
    gap: 8,
  },
  sessionDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDetailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
  },
  sessionDetailValue: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: '500',
  },
});

export default AttendanceSessionScreen;