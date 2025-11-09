"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

const StudentListScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("100 LEVEL");

  const students = [
    {
      id: 1,
      name: "James Josephine",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JJ",
    },
    {
      id: 2,
      name: "John Phillips Samuel",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JS",
    },
    {
      id: 3,
      name: "James Josephine",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JJ",
    },
    {
      id: 4,
      name: "John Phillips Samuel",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JS",
    },
    {
      id: 5,
      name: "James Josephine",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JJ",
    },
    {
      id: 6,
      name: "John Phillips Samuel",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JS",
    },
    {
      id: 7,
      name: "James Josephine",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JJ",
    },
    {
      id: 8,
      name: "John Phillips Samuel",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JS",
    },
    {
      id: 9,
      name: "James Josephine",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JJ",
    },
    {
      id: 10,
      name: "John Phillips Samuel",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JS",
    },
    {
      id: 11,
      name: "James Josephine",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JJ",
    },
    {
      id: 12,
      name: "John Phillips Samuel",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JS",
    },
    {
      id: 13,
      name: "James Josephine",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JJ",
    },
    {
      id: 14,
      name: "John Phillips Samuel",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JS",
    },
    {
      id: 15,
      name: "James Josephine",
      matricNo: "2021/03/1234",
      profilePic: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=JJ",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student List</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          List of all students that have registered the course
        </Text>

        {/* Search and Filter Section */}
        <View style={styles.searchSection}>
          <View style={styles.levelDropdown}>
            <Text style={styles.levelText}>{selectedLevel}</Text>
            <Icon name="chevron-down" size={16} color="#6b7280" />
          </View>

          <View style={styles.searchContainer}>
            <Icon name="search" size={16} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Q Search by name/matric no"
              placeholderTextColor="#9ca3af"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.nameColumn]}>
            Student Name
          </Text>
          <Text style={styles.tableHeaderText}>Matric No</Text>
          <Text style={styles.tableHeaderText}>Profile Picture</Text>
        </View>

        {/* Students List */}
        <ScrollView
          style={styles.studentsList}
          showsVerticalScrollIndicator={false}
        >
          {students.map((student) => (
            <View key={student.id} style={styles.studentRow}>
              <Text style={[styles.studentName, styles.nameColumn]}>
                {student.name}
              </Text>
              <Text style={styles.matricNo}>{student.matricNo}</Text>
              <Image
                source={{ uri: student.profilePic }}
                style={styles.profilePicture}
              />
            </View>
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
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 16,
    marginBottom: 20,
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  levelDropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "white",
  },
  levelText: {
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
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1f2937",
    marginLeft: 8,
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
  studentsList: {
    flex: 1,
  },
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  studentName: {
    fontSize: 14,
    color: "#1f2937",
    flex: 1,
    fontWeight: "500",
  },
  matricNo: {
    fontSize: 12,
    color: "#6b7280",
    flex: 1,
    textAlign: "center",
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    flex: 1,
  },
});

export default StudentListScreen;
