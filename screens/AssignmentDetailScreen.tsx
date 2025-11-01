import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

const AssignmentDetailScreen = ({ navigation, route }) => {
  const { assignment } = route.params || {}

  const questions = [
    "What is the relationship between Communication and speaking when it comes to public speaking?",
    "What is the relationship between Communication and speaking when it comes to public speaking?",
    "What is the relationship between Communication and speaking when it comes to public speaking?",
    "What is the relationship between Communication and speaking when it comes to public speaking?",
  ]

  return (
    <SafeAreaView style={styles.container}>
     

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.assignmentTitle}>COM 201 Assignment</Text>

        <View style={styles.questionsSection}>
          {questions.map((question, index) => (
            <View key={index} style={styles.questionItem}>
              <Text style={styles.questionNumber}>{index + 1}.</Text>
              <Text style={styles.questionText}>{question}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Course</Text>
            <Text style={styles.detailValue}>BIO 101</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lecturer</Text>
            <Text style={styles.detailValue}>Dr Phillips James</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Deadline</Text>
            <Text style={styles.detailValue}>10/06/2025</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 24,
  },
  questionsSection: {
    marginBottom: 32,
  },
  questionItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginRight: 8,
    marginTop: 2,
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    color: "#1f2937",
    lineHeight: 20,
  },
  detailsSection: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 20,
    marginBottom: 100,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
})

export default AssignmentDetailScreen
