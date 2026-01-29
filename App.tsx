import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/SplashScreen";
import LogoScreen from "./screens/LogoScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SignInScreen from "./screens/SignInScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import CreatePinScreen from "./screens/CreatePinScreen";
import SetPinScreen from "./screens/SetPinScreen";
import PinCreatedSuccessScreen from "./screens/PinCreatedSuccessScreen";
import TabNavigator from "./navigation/TabNavigator";

import SessionConnectedScreen from "./screens/SessionConnectedScreen";
import SessionFailedScreen from "./screens/SessionFailedScreen";
import SessionOverScreen from "./screens/SessionOverScreen";

// New biometric screens
import JoinClassSelectionScreen from "./screens/JoinClassSelectionScreen";
import BiometricAuthScreen from "./screens/BiometricAuthScreen";

// Profile and settings screens
import ProfileScreen from "./screens/ProfileScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import NotificationScreen from "./screens/NotificationScreen";

// Report screen
import ReportScreen from "./screens/ReportScreen";

// Assignment screens
import AssignmentListScreen from "./screens/AssignmentListScreen";
import AssignmentDetailScreen from "./screens/AssignmentDetailScreen";

// Calendar screens
import CalendarScreen from "./screens/CalendarScreen";
import CalendarUpcomingScreen from "./screens/CalendarUpcomingScreen";
import { CardStyleInterpolators } from "@react-navigation/stack";
import Header from "./components/header";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createStackNavigator();

// 👇 ALL SCREENS WHERE HEADER SHOULD BE HIDDEN (even if auth: false)
const hiddenHeaderScreens = [
  // Auth flows
  "Splash",
  "Logo",
  "SignUp",
  "SignIn",
  "OTPVerification",

  // PIN flows
  "CreatePin",
  "SetPin",
  "PinCreatedSuccess",

  // Session flows
  "SessionConnected",
  "SessionFailed",
  "SessionOver",

  // Class join flow
  "Notification",
];

export default function App() {


  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
          }}
          initialRouteName="Splash"
        >
          {screens.map(({ name, component }) => (
            <Stack.Screen
              key={name}
              name={name}
              children={(props) => (
                <>
                  {!hiddenHeaderScreens.includes(name) && <Header />}
                  {React.createElement(component, props)}
                </>
              )}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


// 👇 Your screens array — unchanged, just moved outside for clarity
const screens = [
  { name: "Splash", component: SplashScreen, auth: true },
  { name: "Logo", component: LogoScreen, auth: true },
  { name: "SignUp", component: SignUpScreen, auth: true },
  { name: "SignIn", component: SignInScreen, auth: true },
  { name: "OTPVerification", component: OTPVerificationScreen, auth: true },
  { name: "CreatePin", component: CreatePinScreen, auth: true },
  { name: "SetPin", component: SetPinScreen, auth: true },
  { name: "PinCreatedSuccess", component: PinCreatedSuccessScreen, auth: true },
  { name: "Dashboard", component: TabNavigator },

  // New session screens
  { name: "SessionConnected", component: SessionConnectedScreen },
  { name: "SessionFailed", component: SessionFailedScreen },
  { name: "SessionOver", component: SessionOverScreen },

  // New biometric screens
  { name: "JoinClassSelection", component: JoinClassSelectionScreen },
  { name: "BiometricAuth", component: BiometricAuthScreen },

  // Profile and settings screens → SHOW HEADER
  { name: "Profile", component: ProfileScreen },
  { name: "ChangePassword", component: ChangePasswordScreen },
  { name: "Notification", component: NotificationScreen },

  // Report screen → SHOW HEADER
  { name: "Report", component: ReportScreen },

  // Assignment screens → SHOW HEADER
  { name: "AssignmentList", component: AssignmentListScreen },
  { name: "AssignmentDetail", component: AssignmentDetailScreen },

  // Calendar screens → SHOW HEADER
  { name: "Calendar", component: CalendarScreen },
  { name: "CalendarUpcoming", component: CalendarUpcomingScreen },
];
