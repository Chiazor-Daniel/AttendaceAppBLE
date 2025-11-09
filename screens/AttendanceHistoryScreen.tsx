import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AttendanceRecord = {
  course: string;
  meetingId: string;
  channel: string;
  lecturer: string;
  endedAt: number;
  attendees: Array<any>;
};

const AttendanceHistoryScreen = ({ navigation }: any) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem("attendance_records");
        const parsed: AttendanceRecord[] = raw ? JSON.parse(raw) : [];
        setRecords(parsed);
      } catch (e) {
        Alert.alert("Error", "Failed to load attendance history");
      } finally {
        setLoading(false);
      }
    };
    const unsubscribe = navigation.addListener("focus", load);
    load();
    return unsubscribe;
  }, [navigation]);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const renderItem = ({
    item,
    index,
  }: {
    item: AttendanceRecord;
    index: number;
  }) => {
    const ended = new Date(item.endedAt);
    const endedStr = `${ended.toLocaleDateString()} ${ended.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() =>
            setExpandedIndex(expandedIndex === index ? null : index)
          }
        >
          <View style={styles.cardRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.attendees?.length ?? 0}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>
                {item.course} • {item.meetingId}
              </Text>
              <View style={styles.metaRow}>
                <Ionicons name="radio" size={14} color="#6b7280" />
                <Text style={styles.metaText}>{item.channel}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="person" size={14} color="#6b7280" />
                <Text style={styles.metaText}>{item.lecturer}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="time" size={14} color="#6b7280" />
                <Text style={styles.metaText}>{endedStr}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedIndex === index ? "chevron-up" : "chevron-down"}
              size={18}
              color="#6b7280"
            />
          </View>
        </TouchableOpacity>
        {expandedIndex === index && (
          <View style={styles.attendeeList}>
            {item.attendees?.length ? (
              item.attendees.map((a: any, i: number) => (
                <View key={i} style={styles.attendeeRow}>
                  <View style={styles.attendeeAvatar}>
                    <Text style={styles.attendeeAvatarText}>
                      {(a.studentName || "?").slice(0, 1)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.attendeeName}>
                      {a.studentName || a.studentId}
                    </Text>
                    <View style={styles.attendeeMetaRow}>
                      <View style={styles.attendeeBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={12}
                          color="#fff"
                        />
                        <Text style={styles.attendeeBadgeText}>
                          {a.verification || "present"}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.attendeeBadge,
                          styles.attendeeBadgeMuted,
                        ]}
                      >
                        <Ionicons name="time" size={12} color="#4f46e5" />
                        <Text
                          style={[
                            styles.attendeeBadgeText,
                            styles.attendeeBadgeTextMuted,
                          ]}
                        >
                          {new Date(a.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                No attendees saved for this session.
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B5CF6" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance History</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : records.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="documents" size={28} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptyText}>End a session to save it here.</Text>
          </View>
        ) : (
          <FlatList
            data={records}
            keyExtractor={(_, idx) => String(idx)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#8B5CF6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontWeight: "700",
  },
  cardTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  metaText: {
    color: "#6b7280",
    fontSize: 12,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  emptyText: {
    fontSize: 13,
    color: "#6b7280",
  },
  attendeeList: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 10,
    gap: 10,
  },
  attendeeRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 10,
  },
  attendeeAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  attendeeAvatarText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  attendeeName: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "600",
  },
  attendeeMetaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  attendeeBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  attendeeBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  attendeeBadgeMuted: {
    backgroundColor: "#eef2ff",
  },
  attendeeBadgeTextMuted: {
    color: "#4f46e5",
  },
});

export default AttendanceHistoryScreen;
