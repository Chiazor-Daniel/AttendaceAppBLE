import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

import { useState } from "react";

const CalendarScreen = ({ navigation }: any) => {
  const [selectedDate, setSelectedDate] = useState(10);
  const [activeTab, setActiveTab] = useState("Events");

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, null, null, null],
  ];

  const events = [
    {
      title: "CULTURAL DAY EVENT",
      location: "All Student",
      time: "All Day",
      color: "#f59e0b",
    },
    {
      title: "MEETING WITH VICE CHANCELLOR",
      subtitle: "Compulsory for all 300 Level Pharmacology Department",
      location: "Venue: Cooperative Building",
      time: "10:00 am",
      color: "#ec4899",
    },
    {
      title: "CULTURAL DAY EVENT",
      location: "All Student Level",
      time: "09:00 am",
      color: "#8B5CF6",
    },
  ];

  const lectures = [
    {
      title: "MEETING WITH VICE CHANCELLOR",
      subtitle: "Compulsory for all 300 Level Pharmacology Department",
      location: "Venue: Cooperative Building",
      time: "10:00 am",
      color: "#8B5CF6",
    },
    {
      title: "CULTURAL DAY EVENT",
      location: "All Student",
      time: "All Day",
      color: "#f59e0b",
    },
    {
      title: "MEETING WITH VICE CHANCELLOR",
      subtitle: "Compulsory for all 300 Level Pharmacology Department",
      location: "Venue: Cooperative Building",
      time: "10:00 am",
      color: "#ec4899",
    },
    {
      title: "CULTURAL DAY EVENT",
      location: "All Student Level",
      time: "09:00 am",
      color: "#8B5CF6",
    },
  ];

  const mthEvents = [
    {
      title: "MTH 203",
      instructor: "Dr James John",
      location: "Cooperative Building",
      time: "10:00 am",
      color: "#8B5CF6",
    },
    {
      title: "MTH 203",
      instructor: "Dr James John",
      location: "Department Class",
      time: "12:00 pm",
      color: "#f59e0b",
    },
    {
      title: "MTH 203",
      instructor: "Dr James John",
      location: "Department Class",
      time: "04:00 pm",
      color: "#ec4899",
    },
    {
      title: "MTH 203",
      instructor: "Dr James John",
      location: "Department Class",
      time: "03:00 pm",
      color: "#8B5CF6",
    },
  ];

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

  const getCurrentEvents = () => {
    switch (activeTab) {
      case "Events":
        return events;
      case "Lectures":
        return lectures;
      case "Reminder":
        return mthEvents;
      default:
        return events;
    }
  };

  const renderCalendarView = () => (
    <View style={styles.calendarContainer}>
      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity>
          <Icon name="chevron-back" size={20} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.monthYear}>April 2025</Text>
        <TouchableOpacity>
          <Icon name="chevron-forward" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Days of Week */}
      <View style={styles.daysOfWeekContainer}>
        {daysOfWeek.map((day) => (
          <Text key={day} style={styles.dayOfWeek}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.calendarWeek}>
            {week.map((day, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.calendarDay,
                  day === selectedDate && styles.selectedDay,
                ]}
                onPress={() => day && setSelectedDate(day)}
              >
                {day && (
                  <Text
                    style={[
                      styles.calendarDayText,
                      day === selectedDate && styles.selectedDayText,
                    ]}
                  >
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {["Events", "Lectures", "Reminder"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected Date Events */}
      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle}>Thur, April {selectedDate}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("CalendarUpcoming")}
        >
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.eventsList}
        showsVerticalScrollIndicator={false}
      >
        {getCurrentEvents().map((event, index) => (
          <View
            key={index}
            style={[styles.eventItem, { borderLeftColor: event.color }]}
          >
            <Text style={styles.eventTitle}>{event.title}</Text>
            {event.subtitle && (
              <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
            )}
            <Text style={styles.eventLocation}>{event.location}</Text>
            <View style={styles.eventTimeContainer}>
              <Text
                style={[styles.eventTime, { backgroundColor: event.color }]}
              >
                {event.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderUpcomingView = () => (
    <View style={styles.upcomingContainer}>
      <Text style={styles.upcomingTitle}>Upcoming Events</Text>
      <ScrollView
        style={styles.upcomingList}
        showsVerticalScrollIndicator={false}
      >
        {upcomingEvents.map((event, index) => (
          <View
            key={index}
            style={[styles.upcomingEventItem, { backgroundColor: event.color }]}
          >
            <Text style={styles.upcomingEventTitle}>{event.title}</Text>
            <Text style={styles.upcomingEventSubtitle}>{event.subtitle}</Text>
            <Text style={styles.upcomingEventDate}>{event.date}</Text>
            {event.time && (
              <Text style={styles.upcomingEventTime}>{event.time}</Text>
            )}
            {event.location && (
              <Text style={styles.upcomingEventLocation}>{event.location}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {navigation.getState().routes[navigation.getState().index].name ===
        "CalendarUpcoming"
        ? renderUpcomingView()
        : renderCalendarView()}
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
  calendarContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  monthYear: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
  },
  daysOfWeekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 6,
  },
  dayOfWeek: {
    fontSize: 9,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
    width: 36,
  },
  calendarGrid: {
    marginBottom: 12,
  },
  calendarWeek: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 4,
  },
  calendarDay: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },
  selectedDay: {
    backgroundColor: "#8B5CF6",
  },
  calendarDayText: {
    fontSize: 11,
    color: "#1f2937",
  },
  selectedDayText: {
    color: "white",
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 3,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: "#8B5CF6",
  },
  tabText: {
    fontSize: 9,
    color: "#6b7280",
  },
  activeTabText: {
    color: "white",
    fontWeight: "500",
  },
  eventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  eventsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
  },
  viewAllText: {
    fontSize: 9,
    color: "#8B5CF6",
  },
  eventsList: {
    flex: 1,
  },
  eventItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  eventTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  eventSubtitle: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 4,
  },
  eventTimeContainer: {
    alignSelf: "flex-start",
  },
  eventTime: {
    fontSize: 8,
    color: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontWeight: "500",
  },
  upcomingContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  upcomingTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  upcomingList: {
    flex: 1,
  },
  upcomingEventItem: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  upcomingEventTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
    marginBottom: 2,
  },
  upcomingEventSubtitle: {
    fontSize: 9,
    color: "white",
    opacity: 0.9,
    marginBottom: 4,
  },
  upcomingEventDate: {
    fontSize: 9,
    color: "white",
    opacity: 0.9,
    marginBottom: 2,
  },
  upcomingEventTime: {
    fontSize: 9,
    color: "white",
    opacity: 0.9,
    marginBottom: 2,
  },
  upcomingEventLocation: {
    fontSize: 9,
    color: "white",
    opacity: 0.9,
  },
});

export default CalendarScreen;
