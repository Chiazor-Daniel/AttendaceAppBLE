import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/header';
import MeshService from "../src/services/meshservice";
import PermissionsManager from "../utils/Permissions";
const { width } = Dimensions.get('window');

const LecturerDashboardScreen = ({ navigation }) => {
  const upcomingClasses = [
    {
      time: '10am',
      course: 'BIO 202',
      status: 'active',
      statusText: '30:59',
      color: '#8B5CF6',
      action: 'Start Class',
      startTime: new Date().toISOString(),
    },
    {
      time: '12pm',
      course: 'BIO 412',
      status: 'upcoming',
      statusText: 'Up Next',
      color: '#8B5CF6',
      action: 'Start Class',
      startTime: new Date().toISOString(),
    },
    {
      time: '3pm',
      course: 'BIO 308',
      status: 'upcoming',
      statusText: 'Up Next',
      color: '#8B5CF6',
      action: 'Start Class',
      startTime: new Date().toISOString(),
    },
    {
      time: '8am - 10am',
      course: 'MTH 104',
      status: 'ended',
      statusText: 'Pending',
      color: '#CCCCCC99',
      action: 'Class Over',
      startTime: new Date().toISOString(),
    },
  ];

  const studentCounts = [
    { course: 'BIO 101', count: 78 },
    { course: 'BIO 203', count: 44 },
    { course: 'BIO 311', count: 56 },
    { course: 'PHA 215', count: 62 },
  ];

  const pendingAssignments = [
    { title: 'BIO 101 Assignment', date: '21/06/2025', status: 'View' },
    { title: 'BIO 101 Assignment', date: '21/06/2025', status: 'View' },
  ];

  const chartData = [
    { course: 'BIO 101', percentage: 85, color: '#8B5CF6' },
    { course: 'BIO 203', percentage: 45, color: '#ec4899' },
    { course: 'BIO 311', percentage: 95, color: '#1f2937' },
    { course: 'BIO 415', percentage: 80, color: '#8B5CF6' },
    { course: 'PHA 215', percentage: 65, color: '#ec4899' },
    { course: 'BIO 517', percentage: 90, color: '#1f2937' },
  ];

  const [showPreflight, setShowPreflight] = useState(false);
  const [preflightMessage, setPreflightMessage] = useState('Please turn on Bluetooth and Location to start a class session.');

  const handleStartClass = async (course: string, time: string) => {
    try {
      const ok = await PermissionsManager.hasRequiredPermissions();
      if (!ok) {
        setPreflightMessage('Bluetooth and/or Location are disabled. Turn them on to continue.');
        setShowPreflight(true);
        return;
      }

      const lecturerName = 'Dr. Ada Lovelace';
      const nickname = 'Lecturer-Ada';
      const meetingId = '2025W10';

      await MeshService.initialize(nickname);
      const sessionInfo = { course, meetingId, lecturer: lecturerName } as const;
      const { channel } = await MeshService.broadcastSessionStart(sessionInfo);

      const rebroadcastIntervalMs = 15000;
      const intervalId = setInterval(() => {
        MeshService.broadcastSessionStart(sessionInfo).catch(() => {});
      }, rebroadcastIntervalMs);

      (navigation as any).navigate('AttendanceInSession', {
        course,
        meetingId,
        lecturer: lecturerName,
        channel,
        rebroadcastIntervalMs,
        intervalId,
      });
    } catch (e) {
      setPreflightMessage('Unable to start session. Check Bluetooth/Location and try again.');
      setShowPreflight(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B5CF6" barStyle="light-content" />
      <Header />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Upcoming Classes - Match student classRow */}
        <View style={styles.classRow}>
          {upcomingClasses.map((classItem, index) => (
            <View key={index} style={styles.classCard}>
              <Text style={styles.classTime}>{classItem.time}</Text>
              <Text style={styles.classCode}>{classItem.course}</Text>

              <View style={styles.statusContainer}>
                {classItem.status === 'active' ? (
                  <Text style={styles.timerText}>{classItem.statusText}</Text>
                ) : classItem.status === 'upcoming' ? (
                  <Text style={styles.upNextText}>{classItem.statusText}</Text>
                ) : (
                  <Text style={styles.absentText}>{classItem.statusText}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.classActionButton,
                  { backgroundColor: classItem.color },
                ]}
                onPress={async () => {
                  if (classItem.status === 'ended') return;
                  await handleStartClass(classItem.course, classItem.time);
                }}
                disabled={classItem.status === 'ended'}
              >
                <Ionicons name="play" size={10} color="white" />
                <Text style={styles.classActionText}>{classItem.action}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Student Count Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Student Count</Text>
          <View style={styles.studentCountContainer}>
            {studentCounts.map((item, index) => (
              <View key={index} style={styles.studentCountCard}>
                <Text style={styles.courseCode}>{item.course}</Text>
                <Text style={styles.studentCount}>{item.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Attendance Chart - Match student chart style */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>
              % Attendance Overview Per Course
            </Text>
            <Text style={styles.weekDropdown}>Week 1 ▼</Text>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.chartYAxis}>
              {[100, 80, 60, 40, 20, 0].map(value => (
                <Text key={value} style={styles.yAxisLabel}>
                  {value}
                </Text>
              ))}
            </View>

            <View style={styles.chartBars}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: (item.percentage / 100) * 120,
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.course}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]}
              />
              <Text style={styles.legendText}>Excellent (80%+)</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: '#ec4899' }]}
              />
              <Text style={styles.legendText}>Good (60-79%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: '#1f2937' }]}
              />
              <Text style={styles.legendText}>
                Needs Improvement {'(<60%)'}
              </Text>
            </View>
          </View>
        </View>

        {/* Pending Assignments */}
        <View style={styles.section}>
          <View style={styles.assignmentHeader}>
            <Text style={styles.sectionTitle}>Pending Assignments</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity onPress={() => (navigation as any).navigate('AttendanceHistory')}>
                <Text style={styles.viewAllText}>Attendance History</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.assignmentsContainer}>
            {pendingAssignments.map((assignment, index) => (
              <View key={index} style={styles.assignmentCard}>
                <View style={styles.assignmentIcon}>
                  <Ionicons name="document-text" size={20} color="#8B5CF6" />
                </View>
                <View style={styles.assignmentInfo}>
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                  <Text style={styles.assignmentDate}>{assignment.date}</Text>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>{assignment.status}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Last Class Attendance Overview */}
        <View style={styles.attendanceSection}>
          <Text style={styles.attendanceTitle}>
            Last Class Attendance Overview
          </Text>
          <View style={styles.attendanceOverview}>
            <View style={styles.attendanceCircle}>
              <Text style={styles.attendanceNumber}>50</Text>
              <Text style={styles.attendanceLabel}>MTH 104</Text>
            </View>
            <View style={styles.attendanceLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: '#10b981' }]}
                />
                <Text style={styles.legendText}>Present (28)</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: '#f59e0b' }]}
                />
                <Text style={styles.legendText}>Late (17)</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: '#ef4444' }]}
                />
                <Text style={styles.legendText}>Absent (5)</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showPreflight} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Ionicons name="bluetooth" size={24} color="#8B5CF6" />
            <Text style={styles.modalTitle}>Enable Services</Text>
            <Text style={styles.modalText}>{preflightMessage}</Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.modalSecondary} onPress={() => setShowPreflight(false)}>
                <Text style={styles.modalSecondaryText}>Not now</Text>
              </Pressable>
              <Pressable
                style={styles.modalPrimary}
                onPress={async () => {
                  try {
                    // Opens app settings; user can enable permissions/services there
                    await (require('react-native').Linking.openSettings());
                  } catch {}
                }}
              >
                <Text style={styles.modalPrimaryText}>Open Settings</Text>
              </Pressable>
              <Pressable
                style={styles.modalPrimaryOutline}
                onPress={async () => {
                  setShowPreflight(false);
                }}
              >
                <Text style={styles.modalPrimaryOutlineText}>Retry</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 12,
  },
  classRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  classCard: {
    width: width * 0.22,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingTop: 10,
    alignItems: 'center',
    borderWidth: 0.2,
    borderColor: '#e5e7eb',
  },
  classTime: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 4,
  },
  classCode: {
    color: '#404040',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  statusContainer: {
    justifyContent: 'center',
    marginBottom: 6,
  },
  timerText: {
    color: '#8B5CF6',
    fontSize: 12,
    padding: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
  upNextText: {
    color: '#1F1F1F',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: '#4167F94A',
    padding: 2,
    marginBottom: 2,
    borderRadius: 2,
  },
  absentText: {
    color: '#FD1D1D',
    backgroundColor: '#FCCFCF',
    fontSize: 10,
    padding: 2,
    marginBottom: 2,
    borderRadius: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
  classActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: '100%',
    borderRadius: 4,
  },
  classActionText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  startSessionButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 12,
  },
  startSessionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  studentCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studentCountCard: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  courseCode: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  studentCount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  chartSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  weekDropdown: {
    fontSize: 12,
    color: '#6b7280',
  },
  chartContainer: {
    flexDirection: 'row',
    backgroundColor: '',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  chartYAxis: {
    justifyContent: 'space-between',
    height: 120,
    marginRight: 12,
  },
  yAxisLabel: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'right',
    width: 20,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 10,
    borderRadius: 20,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    color: '#6b7280',
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 12,
    color: '#8B5CF6',
  },
  assignmentsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assignmentCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  assignmentIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#f3f4f6',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  assignmentInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  assignmentTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  assignmentDate: {
    fontSize: 10,
    color: '#6b7280',
  },
  viewButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  attendanceSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  attendanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  attendanceOverview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 16,
  },
  attendanceNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  attendanceLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  attendanceLegend: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  modalText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalActions: {
    width: '100%',
    gap: 8,
  },
  modalSecondary: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSecondaryText: {
    color: '#374151',
    fontWeight: '600',
  },
  modalPrimary: {
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalPrimaryText: {
    color: 'white',
    fontWeight: '700',
  },
  modalPrimaryOutline: {
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalPrimaryOutlineText: {
    color: '#8B5CF6',
    fontWeight: '700',
  },
});

export default LecturerDashboardScreen;
