import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

const LecturerCalendarScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState("10");
  const [activeTab, setActiveTab] = useState("Events");

  const events = [
    {
      id: 1,
      title: "MEETING WITH VICE CHANCELLOR",
      description: "Compulsory for all Head of Department",
      venue: "Venue: Cooperative Building",
      time: "10:00 am",
      type: "meeting",
    },
    {
      id: 2,
      title: "ANNUAL CULTURAL DAY",
      description: "All Student",
      time: "All Day",
      type: "cultural",
    },
  ];

  const calendarDays = [
    { day: "Sun", date: "6" },
    { day: "Mon", date: "7" },
    { day: "Tue", date: "8" },
    { day: "Wed", date: "9" },
    { day: "Thu", date: "10", selected: true },
    { day: "Fri", date: "11" },
    { day: "Sat", date: "12" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar Widget */}
        <View style={styles.calendarWidget}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity>
              <Icon name="chevron-back" size={20} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.monthYear}>April 2025</Text>
            <TouchableOpacity>
              <Icon name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.daysOfWeek}>
            {["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"].map((day) => (
              <Text key={day} style={styles.dayLabel}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.calendarDay, day.selected && styles.selectedDay]}
                onPress={() => setSelectedDate(day.date)}
              >
                <Text
                  style={[
                    styles.dayText,
                    day.selected && styles.selectedDayText,
                  ]}
                >
                  {day.date}
                </Text>
                {day.date === "11" ||
                day.date === "14" ||
                day.date === "15" ||
                day.date === "21" ||
                day.date === "22" ||
                day.date === "23" ||
                day.date === "25" ||
                day.date === "28" ||
                day.date === "29" ? (
                  <View style={styles.eventDot} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Events" && styles.activeTab]}
            onPress={() => setActiveTab("Events")}
          >
            <Icon
              name="calendar"
              size={16}
              color={activeTab === "Events" ? "#8B5CF6" : "#6b7280"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "Events" && styles.activeTabText,
              ]}
            >
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Lectures" && styles.activeTab]}
            onPress={() => setActiveTab("Lectures")}
          >
            <Icon
              name="book"
              size={16}
              color={activeTab === "Lectures" ? "#8B5CF6" : "#6b7280"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "Lectures" && styles.activeTabText,
              ]}
            >
              Lectures
            </Text>
          </TouchableOpacity>
        </View>

        {/* Events List */}
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>Thur, April 10</Text>

          {events.map((event) => (
            <View
              key={event.id}
              style={[
                styles.eventCard,
                {
                  backgroundColor:
                    event.type === "meeting" ? "#f3f4f6" : "#fef3c7",
                },
              ]}
            >
              <View
                style={[
                  styles.eventIndicator,
                  {
                    backgroundColor:
                      event.type === "meeting" ? "#8B5CF6" : "#f59e0b",
                  },
                ]}
              />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
                {event.venue && (
                  <Text style={styles.eventVenue}>{event.venue}</Text>
                )}
              </View>
              <View style={styles.eventTimeContainer}>
                <Text
                  style={[
                    styles.eventTime,
                    {
                      backgroundColor:
                        event.type === "meeting" ? "#8B5CF6" : "#f59e0b",
                    },
                  ]}
                >
                  {event.time}
                </Text>
                <TouchableOpacity style={styles.remindButton}>
                  <Icon name="notifications" size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
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
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  calendarWidget: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  daysOfWeek: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textAlign: "center",
    flex: 1,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  calendarDay: {
    width: "14%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  selectedDay: {
    backgroundColor: "#8B5CF6",
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  selectedDayText: {
    color: "white",
    fontWeight: "700",
  },
  eventDot: {
    position: "absolute",
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#8B5CF6",
  },
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#8B5CF6",
  },
  eventsSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },
  eventCard: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  eventIndicator: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  eventVenue: {
    fontSize: 12,
    color: "#6b7280",
  },
  eventTimeContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  eventTime: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  remindButton: {
    padding: 4,
  },
});

export default LecturerCalendarScreen;
