import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

const AssignmentListScreen = ({ navigation }) => {
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
  ]

  return (
    <SafeAreaView style={styles.container}>
      

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {assignments.map((assignment, index) => (
          <TouchableOpacity
            key={assignment.id}
            style={styles.assignmentItem}
            onPress={() => navigation.navigate("AssignmentDetail", { assignment })}
          >
            <View style={styles.assignmentIcon}>
              <Icon name="document-text" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.assignmentContent}>
              <Text style={styles.assignmentTitle}>{assignment.title}</Text>
              <Text style={styles.assignmentInstructor}>{assignment.instructor}</Text>
              <Text style={styles.assignmentDeadline}>{assignment.deadline}</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>{assignment.status}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 20,
    paddingTop: 20,
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
})

export default AssignmentListScreen
