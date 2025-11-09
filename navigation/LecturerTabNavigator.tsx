import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/Ionicons"
import LecturerDashboardScreen from "../screens/LecturerDashboardScreen"
import LecturerReportScreen from "../screens/LecturerReportScreen"
import StudentListScreen from "../screens/StudentListScreen"
import LecturerCalendarScreen from "../screens/LecturerCalendarScreen"
import LecturerProfileScreen from "../screens/LecturerProfileScreen"

const Tab = createBottomTabNavigator()

export default function LecturerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Report") {
            iconName = focused ? "bar-chart" : "bar-chart-outline"
          } else if (route.name === "Student List") {
            iconName = focused ? "people" : "people-outline"
          } else if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#8B5CF6",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          paddingBottom: 5,
          paddingTop: 5,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen name="Home" component={LecturerDashboardScreen} />
      <Tab.Screen name="Report" component={LecturerReportScreen} />
      <Tab.Screen name="Student List" component={StudentListScreen} />
      <Tab.Screen name="Calendar" component={LecturerCalendarScreen} />
      <Tab.Screen name="Profile" component={LecturerProfileScreen} />
    </Tab.Navigator>
  )
}
