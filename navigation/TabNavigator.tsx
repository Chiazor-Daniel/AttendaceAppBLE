import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import { Ionicons } from '@expo/vector-icons';
import ReportScreen from '../screens/ReportScreen';
import AssignmentListScreen from '../screens/AssignmentListScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Screen to icon mapping
const screenConfig = {
  Home: { icon: 'home' },
  Report: { icon: 'stats-chart' },
  Assignment: { icon: 'book' },
  Calendar: { icon: 'calendar' },
  Profile: { icon: 'person' },
};

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const config = screenConfig[name as keyof typeof screenConfig];
  const iconName = config?.icon || 'home';
  const color = focused ? '#8B5CF6' : '#6b7280';
  
  return (
    <View style={styles.tabItem}>
      {/* Dot indicator above active tab */}
      {focused && <View style={styles.dotIndicator} />}
      {/* Icon */}
      <Ionicons name={iconName} size={28} color={color} />
    </View>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="Assignment" component={AssignmentListScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    height: 70, // Reduced height since no labels
    paddingBottom: 15,
    paddingTop: 15,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
    position: 'absolute',
    top: -12,
    zIndex: 1,
  },
});