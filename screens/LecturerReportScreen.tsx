import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

const LecturerReportScreen = ({ navigation }) => {
  const weeklyStats = [
    { label: "Total Student Registered", count: 89, color: "#8B5CF6" },
    { label: "Total Student Present", count: 59, color: "#10b981" },
    { label: "Total Student Late", count: 18, color: "#f59e0b" },
    { label: "Total Student Absent", count: 12, color: "#ef4444" },
  ];

  const students = [
    {
      name: "James Josephine",
      mon: "absent",
      tue: "",
      wed: "present",
      thu: "",
    },
    {
      name: "John Phillips Samuel",
      mon: "present",
      tue: "",
      wed: "absent",
      thu: "",
    },
    { name: "James Josephine", mon: "late", tue: "", wed: "present", thu: "" },
    {
      name: "John Phillips Samuel",
      mon: "present",
      tue: "",
      wed: "present",
      thu: "",
    },
    {
      name: "John Phillips Samuel",
      mon: "late",
      tue: "",
      wed: "present",
      thu: "",
    },
    {
      name: "James Josephine",
      mon: "present",
      tue: "",
      wed: "present",
      thu: "",
    },
    { name: "James Josephine", mon: "present", tue: "", wed: "late", thu: "" },
    {
      name: "John Phillips Samuel",
      mon: "present",
      tue: "",
      wed: "absent",
      thu: "",
    },
    {
      name: "John Phillips Samuel",
      mon: "present",
      tue: "",
      wed: "late",
      thu: "",
    },
    { name: "James Josephine", mon: "present", tue: "", wed: "late", thu: "" },
    {
      name: "John Phillips Samuel",
      mon: "present",
      tue: "",
      wed: "late",
      thu: "",
    },
    {
      name: "James Josephine",
      mon: "present",
      tue: "",
      wed: "present",
      thu: "",
    },
    {
      name: "James Josephine",
      mon: "present",
      tue: "",
      wed: "present",
      thu: "",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return { icon: "✓", color: "#10b981" };
      case "late":
        return { icon: "⚠", color: "#f59e0b" };
      case "absent":
        return { icon: "✕", color: "#ef4444" };
      default:
        return { icon: "—", color: "#d1d5db" };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weekly Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statsHeader}>
            <Text style={styles.sectionTitle}>Weekly Threshold Per Course</Text>
            <TouchableOpacity style={styles.exportButton}>
              <Icon name="download" size={16} color="white" />
              <Text style={styles.exportText}>Export Data</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.courseSelector}>
            <View style={styles.dropdownContainer}>
              <Text style={styles.courseText}>BIO 102</Text>
              <Icon name="chevron-down" size={16} color="#6b7280" />
            </View>
            <View style={styles.dropdownContainer}>
              <Text style={styles.weekText}>Week 1</Text>
              <Icon name="chevron-down" size={16} color="#6b7280" />
            </View>
          </View>

          <View style={styles.statsGrid}>
            {weeklyStats.map((stat, index) => (
              <View
                key={index}
                style={[styles.statCard, { backgroundColor: stat.color }]}
              >
                <Text style={styles.statCount}>{stat.count}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Attendance Table */}
        <View style={styles.tableSection}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.nameColumn]}>
              Student Name
            </Text>
            <Text style={styles.tableHeaderText}>MON</Text>
            <Text style={styles.tableHeaderText}>TUE</Text>
            <Text style={styles.tableHeaderText}>WED</Text>
            <Text style={styles.tableHeaderText}>THUR</Text>
          </View>

          {students.map((student, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.studentName, styles.nameColumn]}>
                {student.name}
              </Text>
              {["mon", "tue", "wed", "thu"].map((day) => {
                const status = getStatusIcon(student[day]);
                return (
                  <View
                    key={day}
                    style={[
                      styles.statusCell,
                      { backgroundColor: status.color },
                    ]}
                  >
                    <Text style={styles.statusText}>{status.icon}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  notificationButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  statsSection: {
    padding: 20,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  courseSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "white",
  },
  courseText: {
    fontSize: 14,
    color: "#1f2937",
    marginRight: 8,
    fontWeight: "600",
  },
  weekText: {
    fontSize: 14,
    color: "#6b7280",
    marginRight: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  statCount: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  tableSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 8,
    backgroundColor: "#f9fafb",
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7280",
    flex: 1,
    textAlign: "center",
  },
  nameColumn: {
    flex: 2,
    textAlign: "left",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 4,
  },
  studentName: {
    fontSize: 12,
    color: "#1f2937",
    flex: 1,
    fontWeight: "500",
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
});

export default LecturerReportScreen;
