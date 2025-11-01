import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const [isOnline, setIsOnline] = useState(true);

  const classes = [
    {
      code: "PHY 202",
      time: "10am",
      color: "#8B5CF6",
      status: "active",
      statusText: "30:59",
      buttonText: "Join Class",
      buttonColor: "#8B5CF6",
    },
    {
      code: "CHM 202",
      time: "10am",
      color: "#8B5CF6",
      status: "upcoming",
      statusText: "Up Next",
      buttonText: "Join Class",
      buttonColor: "#8B5CF6",
    },
    {
      code: "BIO 202",
      time: "10am",
      color: "#8B5CF6",
      status: "active",
      statusText: "30:59",
      buttonText: "Join Class",
      buttonColor: "#8B5CF6",
    },
    {
      code: "MTH 104",
      time: "8am - 10am",
      color: "#f59e0b",
      status: "ended",
      statusText: "Absent",
      buttonText: "Class Over",
      buttonColor: "#CCCCCC99",
    },
  ];

  const attendanceData = [
    { course: 'PHY 101', mon: 'present', tue: 'late', wed: 'present', thu: 'present', fri: 'present' },
    { course: 'BIO 101', mon: 'present', tue: 'absent', wed: 'present', thu: 'present', fri: 'absent' },
    { course: 'CHM 101', mon: 'late', tue: 'present', wed: 'absent', thu: 'present', fri: 'present' },
    { course: 'PHS 101', mon: 'absent', tue: 'present', wed: 'absent', thu: 'absent', fri: 'present' },
  ];

  const chartData = [
    { week: 'BIO 101', percentage: 85, color: '#8B5CF6' },
    { week: 'PHY 101', percentage: 92, color: '#ec4899' },
    { week: 'CHM 101', percentage: 78, color: '#1f2937' },
    { week: 'PHS 101', percentage: 88, color: '#8B5CF6' },
    { week: 'MTH 101', percentage: 95, color: '#ec4899' },
    { week: 'MTH 102', percentage: 82, color: '#1f2937' },
    { week: 'MTH 103', percentage: 90, color: '#8B5CF6' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#10b981';
      case 'late': return '#f59e0b';
      case 'absent': return '#ef4444';
      default: return '#d1d5db';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return '✓';
      case 'late': return '⚠';
      case 'absent': return '✕';
      default: return '-';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Class Cards - All four in one row */}
        <View style={styles.classRow}>
          {classes.map((classItem, index) => (
            <View key={index} style={styles.classCard}>
              <Text style={styles.classTime}>{classItem.time}</Text>
              <Text style={styles.classCode}>{classItem.code}</Text>
              
              <View style={styles.statusContainer}>
                {classItem.status === "active" ? (
                  <Text style={styles.timerText}>{classItem.statusText}</Text>
                ) : classItem.status === "upcoming" ? (
                  <Text style={styles.upNextText}>{classItem.statusText}</Text>
                ) : (
                  <Text style={styles.absentText}>{classItem.statusText}</Text>
                )}
              </View>
              
              <TouchableOpacity
                style={[styles.classActionButton, { 
                  backgroundColor: classItem.buttonColor,
                }]}
                onPress={() => {
                  if (classItem.status !== "ended") {
                    navigation.navigate("AttendanceSession")
                  }
                }}
                disabled={classItem.status === "ended"}
              >
                <Text style={styles.classActionText}>{classItem.buttonText}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Attendance Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>% Attendance Per Course</Text>
            <Text style={styles.weekDropdown}>Week 1 ▼</Text>
          </View>
          
          <View style={styles.chartContainer}>
            <View style={styles.chartYAxis}>
              {[100, 80, 60, 40, 20, 0].map((value) => (
                <Text key={value} style={styles.yAxisLabel}>{value}</Text>
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
                          backgroundColor: item.color 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.week}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
              <Text style={styles.legendText}>Excellent (80%+)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ec4899' }]} />
              <Text style={styles.legendText}>Good (60-79%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#1f2937' }]} />
              <Text style={styles.legendText}>Needs Improvement {'(<60%)'}</Text>
            </View>
          </View>
        </View>

        {/* Current Week Attendance */}
        <View style={styles.attendanceSection}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.attendanceTitle}>Current Week Attendance</Text>
            <Text style={styles.weekDropdown}>Week 10</Text>
          </View>

          <View style={styles.attendanceLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.legendText}>Late</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.legendText}>Absent</Text>
            </View>
          </View>
          
          <View style={styles.attendanceTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.courseColumn]}>Course</Text>
              <Text style={styles.tableHeaderText}>MON</Text>
              <Text style={styles.tableHeaderText}>TUE</Text>
              <Text style={styles.tableHeaderText}>WED</Text>
              <Text style={styles.tableHeaderText}>THUR</Text>
              <Text style={styles.tableHeaderText}>FRI</Text>
            </View>
            
            {attendanceData.map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.courseText, styles.courseColumn]}>{row.course}</Text>
                {['mon', 'tue', 'wed', 'thu', 'fri'].map((day) => (
                  <View key={day} style={[styles.statusCell, { backgroundColor: getStatusColor(row[day]) }]}>
                    <Text style={styles.statusText}>{getStatusIcon(row[day])}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

        
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: 10
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  syncButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  syncText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  scheduleTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginVertical: 8,
  },
  classRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  classCard: {
    width: width * 0.22,
    backgroundColor: "white",
    borderRadius: 8,
    // padding: 10,
    overflow: 'hidden',
    paddingTop: 10,
    alignItems: "center",
    borderWidth: 0.2,
    borderColor: '#7303C0',
  },
  classTime: {
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 4,
  },
  classCode: {
    color: "#404040",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },
  statusContainer: {
    justifyContent: 'center',
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
  lateText: {
    color: '#FCCFCF',
    backgroundColor: '#FCCFCF',
    fontSize: 10,
    padding: 2,
    marginBottom: 2,
    borderRadius: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
  classActionButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: '100%',
  },
  classActionText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  chartSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
    backgroundColor: '',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
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
    marginBottom: 4,
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
  attendanceSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  attendanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  attendanceTable: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 10
    // marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
    flex: 1,
    textAlign: 'center',
  },
  courseColumn: {
    flex: 1.2,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  statusCell: {
    width: 15,
    height: 25,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: 'white',
  },
  attendanceLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});