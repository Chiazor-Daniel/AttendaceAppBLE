import React, { use } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = ({ name }: any) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Calculate status bar height (top inset)
  const statusBarHeight = insets.top || (Platform.OS === 'ios' ? 44 : 24);

  return (
    !name ? <View style={styles.container}>
      <View style={[styles.header, { paddingTop: statusBarHeight + 14 }]}>
        <View style={styles.profileSection}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }} style={styles.avatar} />
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Good Morning!</Text>
            <Text style={styles.userName}>Raymond Joe</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")} style={styles.notificationButton}>
            <Ionicons name="notifications" size={20} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>4</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.syncSection}>
        <Text style={styles.scheduleTitle}>Day's Schedule: 12th June,2025</Text>
        <TouchableOpacity style={styles.syncButton}>
          <Ionicons name="sync-outline" size={16} color="white" />
          <Text style={styles.syncText}>Sync Data</Text>
        </TouchableOpacity>
      </View>
    </View> : <View style={[styles.header2, { paddingTop: statusBarHeight + 16 }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{name}</Text>
      <View style={{ width: 24 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
    borderWidth: 1.2,
    borderColor: '#ec4899',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
  },
  syncSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginVertical: 4,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#8B5CF6',
    borderRadius: 7,
    padding: 7,
  },
  scheduleTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: '#4167F914',
    padding: 4,
    borderRadius: 7,
    color: '#1f2937',
  },
  syncText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 12,
  },
  headerRight: {
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    backgroundColor: '#8B5CF6',
    borderRadius: 7,
    padding: 7,
    paddingHorizontal: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: 1,
    right: 1,
    backgroundColor: '#E92C7E',
    borderRadius: 50,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  header2: {
    backgroundColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
});

export default Header;