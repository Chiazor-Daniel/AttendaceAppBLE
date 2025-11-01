import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { Ionicons as Icon } from '@expo/vector-icons'

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
  ]

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
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </View>
                  <Text style={styles.notificationDescription}>{notification.description}</Text>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>{notification.type}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
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
    paddingTop: 30,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  iconCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#d1d5db",
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: "#6b7280",
  },
  notificationDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },
  actionButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
})

export default NotificationScreen
