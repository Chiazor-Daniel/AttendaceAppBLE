import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

const NotificationScreen = ({ navigation }) => {
  const notifications = [
    {
      date: "Today",
      items: [
        {
          title: "Attendance in Progress",
          description: "You have successfully joined this class",
          time: "2 mins ago",
          type: "View",
        },
        {
          title: "BIO 102 in session",
          description: "Dr James Philip informed the start of the lecture",
          time: "5 mins ago",
          type: "Join Class",
        },
        {
          title: "CMS 212 Assignment",
          description: "Deadline gradually approaching",
          time: "15 mins ago",
          type: "View",
        },
      ],
    },
    {
      date: "Yesterday",
      items: [
        {
          title: "Attendance in Progress",
          description: "You have successfully joined this class",
          time: "4 mins ago",
          type: "View",
        },
        {
          title: "BIO 102 in session",
          description: "Dr James Philip informed the start of the lecture",
          time: "1 hour ago",
          type: "Join Class",
        },
        {
          title: "CMS 212 Assignment",
          description: "Deadline gradually approaching",
          time: "3 hours ago",
          type: "View",
        },
      ],
    },
    {
      date: "30 June 2025",
      items: [
        {
          title: "Attendance in Progress",
          description: "You have successfully joined this class",
          time: "2 mins ago",
          type: "View",
        },
        {
          title: "BIO 102 in session",
          description: "Dr James Philip informed the start of the lecture",
          time: "4 mins ago",
          type: "Join Class",
        },
        {
          title: "CMS 212 Assignment",
          description: "Deadline gradually approaching",
          time: "4 mins ago",
          type: "View",
        },
        {
          title: "Attendance in Progress",
          description: "You have successfully joined this class",
          time: "2 mins ago",
          type: "View",
        },
        {
          title: "BIO 102 in session",
          description: "Dr James Philip informed the start of the lecture",
          time: "4 mins ago",
          type: "Join Class",
        },
        {
          title: "CMS 212 Assignment",
          description: "Deadline gradually approaching",
          time: "4 mins ago",
          type: "View",
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.date}</Text>
            {section.items.map((notification, index) => (
              <View key={index} style={styles.notificationItem}>
                <View style={styles.notificationIcon}>
                  <View style={styles.iconCircle} />
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {notification.time}
                    </Text>
                  </View>
                  <Text style={styles.notificationDescription}>
                    {notification.description}
                  </Text>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>
                    {notification.type}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
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
    paddingTop: 28,
  },
  headerTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  section: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  notificationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  iconCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d5db",
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  notificationTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  notificationTime: {
    fontSize: 9,
    color: "#6b7280",
  },
  notificationDescription: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 13,
  },
  actionButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  },
  actionButtonText: {
    color: "white",
    fontSize: 9,
    fontWeight: "500",
  },
});

export default NotificationScreen;
