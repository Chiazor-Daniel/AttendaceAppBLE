import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

const ReportScreen = ({ navigation }) => {
  const attendanceData = [
    {
      course: "PHY 101",
      mon: "present",
      tue: "present",
      wed: "present",
      thu: "present",
      fri: "present",
    },
    {
      course: "BIO 101",
      mon: "present",
      tue: "absent",
      wed: "present",
      thu: "present",
      fri: "absent",
    },
    {
      course: "CHM 101",
      mon: "late",
      tue: "present",
      wed: "absent",
      thu: "present",
      fri: "present",
    },
    {
      course: "ENG 101",
      mon: "present",
      tue: "present",
      wed: "present",
      thu: "late",
      fri: "present",
    },
    {
      course: "GNS 101",
      mon: "present",
      tue: "present",
      wed: "present",
      thu: "present",
      fri: "present",
    },
    {
      course: "COM 101",
      mon: "present",
      tue: "absent",
      wed: "present",
      thu: "present",
      fri: "absent",
    },
    {
      course: "MTH 101",
      mon: "late",
      tue: "present",
      wed: "absent",
      thu: "present",
      fri: "present",
    },
    {
      course: "PHY 101",
      mon: "present",
      tue: "present",
      wed: "present",
      thu: "present",
      fri: "present",
    },
    {
      course: "GNS 101",
      mon: "present",
      tue: "present",
      wed: "present",
      thu: "present",
      fri: "present",
    },
    {
      course: "COM 101",
      mon: "present",
      tue: "absent",
      wed: "present",
      thu: "present",
      fri: "absent",
    },
    {
      course: "MTH 101",
      mon: "late",
      tue: "present",
      wed: "absent",
      thu: "present",
      fri: "present",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "#10b981";
      case "late":
        return "#f59e0b";
      case "absent":
        return "#ef4444";
      default:
        return "#d1d5db";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return "✓";
      case "late":
        return "⚠";
      case "absent":
        return "✕";
      default:
        return "-";
    }
  };

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
                <View
                  style={[styles.legendDot, { backgroundColor: "#10b981" }]}
                />
                <Text style={styles.legendText}>Present (68)</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#f59e0b" }]}
                />
                <Text style={styles.legendText}>Late (17)</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#ef4444" }]}
                />
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
              <Text style={[styles.tableHeaderText, styles.courseColumn]}>
                Course
              </Text>
              <Text style={styles.tableHeaderText}>MON</Text>
              <Text style={styles.tableHeaderText}>TUE</Text>
              <Text style={styles.tableHeaderText}>WED</Text>
              <Text style={styles.tableHeaderText}>THUR</Text>
              <Text style={styles.tableHeaderText}>FRI</Text>
            </View>

            {attendanceData.map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.courseText, styles.courseColumn]}>
                  {row.course}
                </Text>
                {["mon", "tue", "wed", "thu", "fri"].map((day) => (
                  <View
                    key={day}
                    style={[
                      styles.statusCell,
                      { backgroundColor: getStatusColor(row[day]) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusIcon(row[day])}
                    </Text>
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
    backgroundColor: "#f3f4f6",
  },
  header: {
    backgroundColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingTop: 48,
  },
  headerTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  overviewSection: {
    padding: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 7,
    borderColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  chartNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
  },
  chartLabel: {
    fontSize: 11,
    color: "#6b7280",
  },
  legendContainer: {
    flex: 1,
    marginLeft: 18,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },
  legendDot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    marginRight: 7,
  },
  legendText: {
    fontSize: 13,
    color: "#1f2937",
  },
  weeklySection: {
    paddingHorizontal: 18,
    paddingBottom: 100,
  },
  weeklyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  weekSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  weekText: {
    fontSize: 13,
    color: "#6b7280",
    marginRight: 4,
  },
  attendanceTable: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableHeaderText: {
    fontSize: 9,
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
    marginBottom: 6,
  },
  courseText: {
    fontSize: 9,
    fontWeight: "500",
    color: "#1f2937",
    flex: 1,
    textAlign: "center",
  },
  statusCell: {
    width: 22,
    height: 22,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  statusText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
  },
});

export default ReportScreen;
