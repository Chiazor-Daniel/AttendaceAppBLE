import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

const CalendarUpcomingScreen = ({ navigation }) => {
  const upcomingEvents = [
    {
      title: "MEETING WITH VICE CHANCELLOR",
      subtitle: "Compulsory for all 300 Level Pharmacology Department",
      date: "Date: 5th July, 2025",
      time: "Time: 10:00 am-2hours",
      location: "Venue: Cooperative Building",
      color: "#8B5CF6",
    },
    {
      title: "MEETING WITH VICE CHANCELLOR",
      subtitle: "Compulsory for all 300 Level Pharmacology Department",
      date: "Date: 5th July, 2025",
      time: "Time: 10:00 am-2hours",
      location: "Venue: Cooperative Building",
      color: "#ec4899",
    },
    {
      title: "CULTURAL DAY EVENT",
      subtitle: "All Student Level",
      date: "Date: 9th July, 2025",
      time: "",
      location: "",
      color: "#f59e0b",
    },
    {
      title: "MEETING WITH VICE CHANCELLOR",
      subtitle: "Compulsory for all 300 Level Pharmacology Department",
      date: "Date: 20th July, 2025",
      time: "Time: 10:00 am-2hours",
      location: "Venue: Cooperative Building",
      color: "#f59e0b",
    },
    {
      title: "MEETING WITH VICE CHANCELLOR",
      subtitle: "Compulsory for all 300 Level Pharmacology Department",
      date: "Date: 28th July, 2025",
      time: "Time: 10:00 am-2hours",
      location: "Venue: Cooperative Building",
      color: "#8B5CF6",
    },
    {
      title: "MEETING WITH VICE CHANCELLOR",
      subtitle: "Compulsory for all 300 Level Pharmacology Department",
      date: "Date: 30th August, 2025",
      time: "Time: 10:00 am-2hours",
      location: "Venue: Cooperative Building",
      color: "#8B5CF6",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.upcomingTitle}>Upcoming Events</Text>
        <ScrollView
          style={styles.upcomingList}
          showsVerticalScrollIndicator={false}
        >
          {upcomingEvents.map((event, index) => (
            <View
              key={index}
              style={[
                styles.upcomingEventItem,
                { backgroundColor: event.color },
              ]}
            >
              <Text style={styles.upcomingEventTitle}>{event.title}</Text>
              <Text style={styles.upcomingEventSubtitle}>{event.subtitle}</Text>
              <Text style={styles.upcomingEventDate}>{event.date}</Text>
              {event.time && (
                <Text style={styles.upcomingEventTime}>{event.time}</Text>
              )}
              {event.location && (
                <Text style={styles.upcomingEventLocation}>
                  {event.location}
                </Text>
              )}
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
  upcomingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  upcomingList: {
    flex: 1,
  },
  upcomingEventItem: {
    borderRadius: 10,
    padding: 13,
    marginBottom: 12,
  },
  upcomingEventTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "white",
    marginBottom: 3,
  },
  upcomingEventSubtitle: {
    fontSize: 11,
    color: "white",
    opacity: 0.9,
    marginBottom: 6,
  },
  upcomingEventDate: {
    fontSize: 11,
    color: "white",
    opacity: 0.9,
    marginBottom: 3,
  },
  upcomingEventTime: {
    fontSize: 11,
    color: "white",
    opacity: 0.9,
    marginBottom: 3,
  },
  upcomingEventLocation: {
    fontSize: 11,
    color: "white",
    opacity: 0.9,
  },
});

export default CalendarUpcomingScreen;
