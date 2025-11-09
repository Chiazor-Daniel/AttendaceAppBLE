import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PermissionRequestScreen from './screens/PermissionRequestScreen';
import { GlobalProvider } from './context/GlobalContext';

// Auth screens
import LecturerSignUpScreen from './screens/LecturerSignUpScreen';
import LecturerSignInScreen from './screens/LecturerSignInScreen';
import SetupClassSessionScreen from './screens/SetupClassSessionScreen';
import SetupSessionRulesScreen from './screens/SetupSessionRulesScreen';
import AttendanceInProgressScreen from './screens/AttendanceInProgressScreen';
import SessionSuccessScreen from './screens/SessionSuccessScreen';
import AttendanceInSessionScreen from './screens/AttendanceInSessionScreen';
import LecturerReportScreen from './screens/LecturerReportScreen';
import AttendanceHistoryScreen from './screens/AttendanceHistoryScreen';

// Navigation
import LecturerTabNavigator from './navigation/LecturerTabNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <GlobalProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            id={undefined}
            screenOptions={{
              headerShown: false
            }}
            initialRouteName="PermissionRequest"
          >
            {/* Permission Screen */}
            <Stack.Screen
              name="PermissionRequest"
              component={PermissionRequestScreen}
            />

            {/* Auth Screens */}
            <Stack.Screen
              name="LecturerSignUp"
              component={LecturerSignUpScreen}
            />
            <Stack.Screen
              name="LecturerSignIn"
              component={LecturerSignInScreen}
            />

            {/* Main App */}
            <Stack.Screen
              name="LecturerDashboard"
              component={LecturerTabNavigator}
            />

            {/* Session Management */}
            <Stack.Screen
              name="SetupClassSession"
              component={SetupClassSessionScreen}
            />
            <Stack.Screen
              name="SetupSessionRules"
              component={SetupSessionRulesScreen}
            />
            <Stack.Screen
              name="AttendanceInProgress"
              component={AttendanceInProgressScreen}
            />
            <Stack.Screen
              name="SessionSuccess"
              component={SessionSuccessScreen}
            />
            <Stack.Screen
              name="AttendanceInSession"
              component={AttendanceInSessionScreen}
            />

            {/* Reports */}
            <Stack.Screen
              name="LecturerReport"
              component={LecturerReportScreen}
            />
            <Stack.Screen
              name="AttendanceHistory"
              component={AttendanceHistoryScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      
        </SafeAreaProvider>
      </GlobalProvider>
    </SafeAreaProvider>
  );
}
