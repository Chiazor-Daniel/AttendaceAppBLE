import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Transport from "./src/services/BleTransport";
import DeviceInfo from "react-native-device-info";
import SplashScreen from "./screens/SplashScreen";
import LogoScreen from "./screens/LogoScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SignInScreen from "./screens/SignInScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import FacialRecognitionScreen from "./screens/FacialRecognitionScreen";
import FacialCaptureSuccessScreen from "./screens/FacialCaptureSuccessScreen";
import FacialCaptureFailedScreen from "./screens/FacialCaptureFailedScreen";
import FingerprintCaptureScreen from "./screens/FingerprintCaptureScreen";
import FingerprintSuccessScreen from "./screens/FingerprintSuccessScreen";
import FingerprintFailedScreen from "./screens/FingerprintFailedScreen";
import CreatePinScreen from "./screens/CreatePinScreen";
import SetPinScreen from "./screens/SetPinScreen";
import PinCreatedSuccessScreen from "./screens/PinCreatedSuccessScreen";
import TabNavigator from "./navigation/TabNavigator";
import AttendanceSessionScreen from "./screens/AttendanceSessionScreen";
import AttendanceInProgressScreen from "./screens/AttendanceInProgressScreen";

import SessionConnectedScreen from "./screens/SessionConnectedScreen";
import SessionFailedScreen from "./screens/SessionFailedScreen";
import SessionOverScreen from "./screens/SessionOverScreen";

// New biometric screens
import JoinClassSelectionScreen from "./screens/JoinClassSelectionScreen";
import FacialRecognitionSetupScreen from "./screens/FacialRecognitionSetupScreen";
import FacialDetectionScanningScreen from "./screens/FacialDetectionScanningScreen";
import FacialDetectionSuccessScreen from "./screens/FacialDetectionSuccessScreen";
import FacialDetectionFailedScreen from "./screens/FacialDetectionFailedScreen";
import FingerprintScanningScreen from "./screens/FingerprintScanningScreen";
import FingerprintVerificationSuccessScreen from "./screens/FingerprintVerificationSuccessScreen";
import FingerprintVerificationFailedScreen from "./screens/FingerprintVerificationFailedScreen";
import PinInputScreen from "./screens/PinInputScreen";
import PinInputErrorScreen from "./screens/PinInputErrorScreen";

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

const Stack = createStackNavigator();

// 👇 ALL SCREENS WHERE HEADER SHOULD BE HIDDEN (even if auth: false)
const hiddenHeaderScreens = [
  // Auth flows
  "Splash",
  "Logo",
  "SignUp",
  "SignIn",
  "OTPVerification",

  // Facial recognition flows
  "FacialRecognition",
  "FacialCaptureSuccess",
  "FacialCaptureFailed",
  "FacialRecognitionSetup",
  "FacialDetectionScanning",
  "FacialDetectionSuccess",
  "FacialDetectionFailed",
  "AdvancedFacialDetection",

  // Fingerprint flows
  "FingerprintCapture",
  "FingerprintSuccess",
  "FingerprintFailed",
  "FingerprintScanning",
  "FingerprintVerificationSuccess",
  "FingerprintVerificationFailed",

  // PIN flows
  "CreatePin",
  "SetPin",
  "PinCreatedSuccess",
  "PinInput",
  "PinInputError",

  // Session flows
  "SessionConnected",
  "SessionFailed",
  "SessionOver",

  // Class join flow
  "JoinClassSelection",
  "Notification",
];

export default function App() {
  // Bootstrap Transport on app start
  useEffect(() => {
    const initTransport = async () => {
      try {
        const uniqueId = await DeviceInfo.getUniqueId();
        const nickname = `S-${uniqueId}`;
        await Transport.start(nickname);
        console.log(`✅ Transport started as: ${nickname}`);
      } catch (error) {
        console.error('Failed to start Transport:', error);
      }
    };

    initTransport();

    // Cleanup on unmount
    return () => {
      Transport.stop();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
        initialRouteName="Splash"
      >
        {screens.map(({ name, component, auth }) => (
          <Stack.Screen
            key={name}
            name={name}
            children={(props) => (
              <>
                {/* Only show Header if screen is NOT in hidden list */}
                {!hiddenHeaderScreens.includes(name) && <Header />}
                {React.createElement(component, props)}
              </>
            )}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 👇 Your screens array — unchanged, just moved outside for clarity
const screens = [
  { name: "Splash", component: SplashScreen, auth: true },
  { name: "Logo", component: LogoScreen, auth: true },
  { name: "SignUp", component: SignUpScreen, auth: true },
  { name: "SignIn", component: SignInScreen, auth: true },
  { name: "OTPVerification", component: OTPVerificationScreen, auth: true },
  { name: "FacialRecognition", component: FacialRecognitionScreen, auth: true },
  {
    name: "FacialCaptureSuccess",
    component: FacialCaptureSuccessScreen,
    auth: true,
  },
  {
    name: "FacialCaptureFailed",
    component: FacialCaptureFailedScreen,
    auth: true,
  },
  {
    name: "FingerprintCapture",
    component: FingerprintCaptureScreen,
    auth: true,
  },
  {
    name: "FingerprintSuccess",
    component: FingerprintSuccessScreen,
    auth: true,
  },
  { name: "FingerprintFailed", component: FingerprintFailedScreen, auth: true },
  { name: "CreatePin", component: CreatePinScreen, auth: true },
  { name: "SetPin", component: SetPinScreen, auth: true },
  { name: "PinCreatedSuccess", component: PinCreatedSuccessScreen, auth: true },
  { name: "Dashboard", component: TabNavigator },
  { name: "AttendanceSession", component: AttendanceSessionScreen },
  { name: "AttendanceInProgress", component: AttendanceInProgressScreen },

  // New session screens
  { name: "SessionConnected", component: SessionConnectedScreen },
  { name: "SessionFailed", component: SessionFailedScreen },
  { name: "SessionOver", component: SessionOverScreen },

  // New biometric screens
  { name: "JoinClassSelection", component: JoinClassSelectionScreen },
  { name: "FacialRecognitionSetup", component: FacialRecognitionSetupScreen },
  { name: "FacialDetectionScanning", component: FacialDetectionScanningScreen },
  { name: "FacialDetectionSuccess", component: FacialDetectionSuccessScreen },
  { name: "FacialDetectionFailed", component: FacialDetectionFailedScreen },
  { name: "FingerprintScanning", component: FingerprintScanningScreen },
  {
    name: "FingerprintVerificationSuccess",
    component: FingerprintVerificationSuccessScreen,
  },
  {
    name: "FingerprintVerificationFailed",
    component: FingerprintVerificationFailedScreen,
  },
  { name: "PinInput", component: PinInputScreen },
  { name: "PinInputError", component: PinInputErrorScreen },

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
