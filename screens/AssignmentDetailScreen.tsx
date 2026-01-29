import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

const AssignmentDetailScreen = ({ navigation, route }) => {
  const { assignment } = route.params || {};

  const questions = [
    "What is the relationship between Communication and speaking when it comes to public speaking?",
    "What is the relationship between Communication and speaking when it comes to public speaking?",
    "What is the relationship between Communication and speaking when it comes to public speaking?",
    "What is the relationship between Communication and speaking when it comes to public speaking?",
  ];

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
  );
};

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
    paddingHorizontal: 18,
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
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 20,
  },
  questionsSection: {
    marginBottom: 26,
  },
  questionItem: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-start",
  },
  questionNumber: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
    marginRight: 7,
    marginTop: 2,
  },
  questionText: {
    flex: 1,
    fontSize: 13,
    color: "#1f2937",
    lineHeight: 18,
  },
  detailsSection: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 80,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1f2937",
  },
});

export default AssignmentDetailScreen;
