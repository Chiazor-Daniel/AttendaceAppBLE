import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

import { useState } from "react";

const AssignmentListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("100 LEVEL");

  const assignments = [
    {
      id: 1,
      title: "COM 201 Assignment",
      instructor: "Prof James Judith",
      deadline: "Deadline 2nd June 2025",
      status: "View",
    },
    {
      id: 2,
      title: "MTH 201 Assignment",
      instructor: "Prof James Judith",
      deadline: "Deadline 5th June 2025",
      status: "View",
    },
    {
      id: 3,
      title: "COM 201 Assignment",
      instructor: "Prof James Judith",
      deadline: "Deadline 8th June 2025",
      status: "View",
    },
    {
      id: 4,
      title: "COM 201 Assignment",
      instructor: "Prof James Judith",
      deadline: "Deadline 2nd June 2025",
      status: "View",
    },
    {
      id: 5,
      title: "COM 201 Assignment",
      instructor: "Prof James Judith",
      deadline: "Deadline 2nd June 2025",
      status: "View",
    },
    {
      id: 6,
      title: "COM 201 Assignment",
      instructor: "Prof James Judith",
      deadline: "Deadline 2nd June 2025",
      status: "View",
    },
    {
      id: 7,
      title: "COM 201 Assignment",
      instructor: "Prof James Judith",
      deadline: "Deadline 2nd June 2025",
      status: "View",
    },
  ];

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assignment</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          List of all assignments that have been created
        </Text>

        <View style={styles.filterSearchContainer}>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>{selectedLevel}</Text>
            <Icon name="chevron-down" size={16} color="#6b7280" />
          </View>
          <View style={styles.searchContainer}>
            <Icon name="search" size={16} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Q Search by name/matric no"
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView
          style={styles.assignmentList}
          showsVerticalScrollIndicator={false}
        >
          {filteredAssignments.map((assignment) => (
            <TouchableOpacity
              key={assignment.id}
              style={styles.assignmentItem}
              onPress={() =>
                navigation.navigate("AssignmentDetail", { assignment })
              }
            >
              <View style={styles.assignmentIcon}>
                <Icon name="document-text" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.assignmentContent}>
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <Text style={styles.assignmentInstructor}>
                  {assignment.instructor}
                </Text>
                <Text style={styles.assignmentDeadline}>
                  {assignment.deadline}
                </Text>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>{assignment.status}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
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
  content: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  filterSearchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "white",
  },
  dropdownText: {
    fontSize: 14,
    color: "#1f2937",
    marginRight: 8,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "white",
    flex: 1,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#1f2937",
  },
  assignmentList: {
    flex: 1,
    paddingBottom: 100,
  },
  assignmentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  assignmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  assignmentContent: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  assignmentInstructor: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  assignmentDeadline: {
    fontSize: 12,
    color: "#6b7280",
  },
  viewButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default AssignmentListScreen;
