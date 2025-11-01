import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { Ionicons as Icon } from '@expo/vector-icons'

const ReportScreen = ({ navigation }) => {
  const attendanceData = [
    { course: "PHY 101", mon: "present", tue: "present", wed: "present", thu: "present", fri: "present" },
    { course: "BIO 101", mon: "present", tue: "absent", wed: "present", thu: "present", fri: "absent" },
    { course: "CHM 101", mon: "late", tue: "present", wed: "absent", thu: "present", fri: "present" },
    { course: "ENG 101", mon: "present", tue: "present", wed: "present", thu: "late", fri: "present" },
    { course: "GNS 101", mon: "present", tue: "present", wed: "present", thu: "present", fri: "present" },
    { course: "COM 101", mon: "present", tue: "absent", wed: "present", thu: "present", fri: "absent" },
    { course: "MTH 101", mon: "late", tue: "present", wed: "absent", thu: "present", fri: "present" },
    { course: "PHY 101", mon: "present", tue: "present", wed: "present", thu: "present", fri: "present" },
    { course: "GNS 101", mon: "present", tue: "present", wed: "present", thu: "present", fri: "present" },
    { course: "COM 101", mon: "present", tue: "absent", wed: "present", thu: "present", fri: "absent" },
    { course: "MTH 101", mon: "late", tue: "present", wed: "absent", thu: "present", fri: "present" },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "#10b981"
      case "late":
        return "#f59e0b"
      case "absent":
        return "#ef4444"
      default:
        return "#d1d5db"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return "✓"
      case "late":
        return "⚠"
      case "absent":
        return "✕"
      default:
        return "-"
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
     

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Attendance Overview */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Attendance Overview</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartCircle}>
              <Text style={styles.chartNumber}>50</Text>
              <Text style={styles.chartLabel}>Classes</Text>
            </View>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#10b981" }]} />
                <Text style={styles.legendText}>Present (68)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#f59e0b" }]} />
                <Text style={styles.legendText}>Late (17)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#ef4444" }]} />
                <Text style={styles.legendText}>Absent (15)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Attendance */}
        <View style={styles.weeklySection}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.sectionTitle}>Your Weekly Attendance</Text>
            <View style={styles.weekSelector}>
              <Text style={styles.weekText}>Week 1</Text>
              <Icon name="chevron-down" size={16} color="#6b7280" />
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
                {["mon", "tue", "wed", "thu", "fri"].map((day) => (
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    backgroundColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  overviewSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  chartNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
  },
  chartLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  legendContainer: {
    flex: 1,
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#1f2937",
  },
  weeklySection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  weeklyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  weekSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  weekText: {
    fontSize: 14,
    color: "#6b7280",
    marginRight: 4,
  },
  attendanceTable: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    flex: 1,
    textAlign: "center",
  },
  courseColumn: {
    flex: 1.5,
    textAlign: "left",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  courseText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1f2937",
    flex: 1,
    textAlign: "center",
  },
  statusCell: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
})

export default ReportScreen
