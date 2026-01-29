# Attendance App - Complete Flow & Architecture Documentation

## 📱 App Overview
A Bluetooth Low Energy (BLE) based attendance tracking system for students that uses biometric verification (Face ID/Fingerprint) and mesh networking for offline attendance marking.

---

## 🎯 Core User Flows

### 1. **Authentication Flow** (First Time Users)
```
SplashScreen 
  ↓
LogoScreen
  ↓
SignUpScreen (New users) / SignInScreen (Returning users)
  ↓
OTPVerificationScreen
  ↓
FacialRecognitionScreen (Setup biometrics)
  ↓
FingerprintCaptureScreen (Setup fingerprint)
  ↓
CreatePinScreen / SetPinScreen (Backup authentication)
  ↓
PinCreatedSuccessScreen
  ↓
Dashboard (TabNavigator)
```

**Screens Used:**
- ✅ `SplashScreen.tsx` - Initial app loading
- ✅ `LogoScreen.tsx` - Branding screen
- ✅ `SignUpScreen.tsx` - New user registration
- ✅ `SignInScreen.tsx` - Existing user login
- ✅ `OTPVerificationScreen.tsx` - Phone/email verification
- ✅ `FacialRecognitionScreen.tsx` - Face ID setup (legacy)
- ✅ `FingerprintCaptureScreen.tsx` - Fingerprint setup (legacy)
- ✅ `CreatePinScreen.tsx` - PIN creation
- ✅ `SetPinScreen.tsx` - PIN confirmation
- ✅ `PinCreatedSuccessScreen.tsx` - Success confirmation

---

### 2. **Main Dashboard Flow** (Logged In Users)
```
Dashboard (Home Tab)
  ├── View Today's Classes
  ├── Attendance Chart (% per course)
  ├── Weekly Attendance Table
  └── Quick Actions
      └── Join Class → JoinClassSelectionScreen
```

**Screens Used:**
- ✅ `DashboardScreen.tsx` - Main home screen with class cards, charts, and attendance overview

---

### 3. **Join Class & Mark Attendance Flow** (PRIMARY FLOW)
```
DashboardScreen
  ↓ (Click "Join Class" on active class card)
JoinClassSelectionScreen
  ├── Initialize Bluetooth Mesh
  ├── Search for active class sessions
  ├── Detect lecturer's broadcast
  └── Show connection status
  ↓ (Class found)
BiometricAuthScreen
  ├── Auto-detect device type (iOS/Android)
  ├── Show Face ID or Fingerprint prompt
  └── Verify student identity
  ↓ (Biometric success)
Broadcast Attendance via Mesh
  ↓
SessionConnectedScreen (Success)
  OR
SessionFailedScreen (If verification fails)
  OR
SessionOverScreen (If class ended)
```

**Screens Used:**
- ✅ `JoinClassSelectionScreen.tsx` - Mesh network detection & class finding
- ✅ `BiometricAuthScreen.tsx` - Unified biometric verification (Face ID/Fingerprint)
- ✅ `SessionConnectedScreen.tsx` - Attendance marked successfully
- ✅ `SessionFailedScreen.tsx` - Verification failed
- ✅ `SessionOverScreen.tsx` - Class session ended

**Legacy Screens (NOT USED - Can be removed):**
- ❌ `FacialRecognitionSetupScreen.tsx` - Replaced by BiometricAuthScreen
- ❌ `FacialDetectionScanningScreen.tsx` - Replaced by BiometricAuthScreen
- ❌ `FacialDetectionSuccessScreen.tsx` - Replaced by SessionConnectedScreen
- ❌ `FacialDetectionFailedScreen.tsx` - Replaced by SessionFailedScreen
- ❌ `FingerprintScanningScreen.tsx` - Replaced by BiometricAuthScreen
- ❌ `FingerprintVerificationSuccessScreen.tsx` - Replaced by SessionConnectedScreen
- ❌ `FingerprintVerificationFailedScreen.tsx` - Replaced by SessionFailedScreen
- ❌ `FingerprintSuccessScreen.tsx` - Old setup flow
- ❌ `FingerprintFailedScreen.tsx` - Old setup flow
- ❌ `FacialCaptureSuccessScreen.tsx` - Old setup flow
- ❌ `FacialCaptureFailedScreen.tsx` - Old setup flow
- ❌ `AttendanceSessionScreen.tsx` - Replaced by JoinClassSelectionScreen
- ❌ `AttendanceInProgressScreen.tsx` - Replaced by BiometricAuthScreen
- ❌ `PinInputScreen.tsx` - Not currently used
- ❌ `PinInputErrorScreen.tsx` - Not currently used

---

### 4. **Bottom Tab Navigation** (Main App Sections)
```
TabNavigator
  ├── Home (DashboardScreen)
  ├── Report (ReportScreen)
  ├── Assignment (AssignmentListScreen)
  ├── Calendar (CalendarScreen)
  └── Profile (ProfileScreen)
```

**Screens Used:**
- ✅ `DashboardScreen.tsx` - Home tab
- ✅ `ReportScreen.tsx` - Attendance reports & analytics
- ✅ `AssignmentListScreen.tsx` - View assignments
- ✅ `CalendarScreen.tsx` - Class schedule & events
- ✅ `ProfileScreen.tsx` - User profile & settings

---

### 5. **Profile & Settings Flow**
```
ProfileScreen
  ├── Notification → NotificationScreen
  ├── Change Password → ChangePasswordScreen
  ├── Support Center (Not implemented)
  └── Logout → SplashScreen
```

**Screens Used:**
- ✅ `ProfileScreen.tsx` - User profile
- ✅ `NotificationScreen.tsx` - Push notifications & alerts
- ✅ `ChangePasswordScreen.tsx` - Password update

---

### 6. **Calendar & Events Flow**
```
CalendarScreen
  ├── View Monthly Calendar
  ├── Filter: Events / Lectures / Reminders
  ├── View Day Events
  └── View All Upcoming → CalendarUpcomingScreen
```

**Screens Used:**
- ✅ `CalendarScreen.tsx` - Calendar view with events
- ✅ `CalendarUpcomingScreen.tsx` - Full list of upcoming events

---

### 7. **Assignments Flow**
```
AssignmentListScreen
  ├── View All Assignments
  └── Click Assignment → AssignmentDetailScreen
```

**Screens Used:**
- ✅ `AssignmentListScreen.tsx` - List of assignments
- ✅ `AssignmentDetailScreen.tsx` - Assignment details

---

## 🏗️ Technical Architecture

### **Core Technologies**
- **React Native** - Cross-platform mobile framework
- **React Navigation** - Navigation & routing
- **Bluetooth Low Energy (BLE)** - Mesh networking via `expo-bitchat`
- **Biometrics** - `react-native-biometrics` for Face ID/Touch ID
- **Location Services** - `expo-location` for proximity detection

### **Key Services**
1. **MeshService** (`src/services/meshservice.ts`)
   - Handles BLE mesh networking
   - Broadcasts/receives attendance data
   - Manages peer connections
   - Offline-first architecture

2. **Biometric Service** (Built into screens)
   - Auto-detects device capabilities (Face ID vs Fingerprint)
   - Handles authentication prompts
   - Fallback to PIN if biometrics unavailable

---

## 📊 Data Flow

### **Attendance Marking Process**
```
1. Student opens app → Dashboard shows active classes
2. Student clicks "Join Class" → JoinClassSelectionScreen
3. App initializes BLE mesh → Searches for lecturer's broadcast
4. Lecturer's session detected → Shows class info
5. Student clicks "Start Verification" → BiometricAuthScreen
6. Biometric prompt appears → Student verifies identity
7. Success → Attendance data broadcast via mesh
8. Lecturer receives attendance → Stored locally/synced to server
9. Student sees SessionConnectedScreen → Returns to Dashboard
```

### **Offline Support**
- Attendance data stored locally if no internet
- Mesh network allows peer-to-peer communication
- Auto-sync when connection restored

---

## 🎨 Design System

### **Color Palette**
- **Primary**: `#8B5CF6` (Purple) - Buttons, accents, active states
- **Success**: `#10b981` (Green) - Present status, success messages
- **Warning**: `#f59e0b` (Amber) - Late status, warnings
- **Error**: `#ef4444` (Red) - Absent status, errors
- **Pink Accent**: `#ec4899` - Charts, highlights
- **Dark**: `#1f2937` - Primary text
- **Gray**: `#6b7280` - Secondary text
- **Light Gray**: `#f3f4f6` - Backgrounds

### **Typography Scale**
- **Titles**: 20-22px, weight 700
- **Headings**: 15-17px, weight 600
- **Body**: 11-13px, weight 400-500
- **Small**: 9-10px, weight 500-600

### **Spacing System**
- **Tight**: 6-8px
- **Normal**: 10-14px
- **Relaxed**: 16-20px
- **Loose**: 24-32px

---

## 🔄 State Management
Currently using **React Hooks** (useState, useEffect)

**Future Recommendation**: 
- Implement Context API or Redux for global state
- Separate API calls into dedicated service layer
- Add TypeScript interfaces for all data models

---

## 📁 Recommended Code Structure (For Refactoring)

```
src/
├── screens/           # All screen components
│   ├── auth/         # Authentication screens
│   ├── dashboard/    # Main dashboard
│   ├── attendance/   # Attendance flow screens
│   ├── profile/      # Profile & settings
│   └── shared/       # Shared screens
├── components/        # Reusable components
│   ├── common/       # Buttons, inputs, cards
│   ├── attendance/   # Attendance-specific components
│   └── charts/       # Chart components
├── services/          # Business logic & API
│   ├── api/          # API client & endpoints
│   ├── mesh/         # Mesh networking service
│   ├── biometric/    # Biometric auth service
│   └── storage/      # Local storage service
├── navigation/        # Navigation configuration
├── hooks/             # Custom React hooks
├── utils/             # Helper functions
├── constants/         # App constants & config
├── types/             # TypeScript types/interfaces
└── theme/             # Design system (colors, fonts, spacing)
```

---

## 🚀 Next Steps for API Integration

### **1. Create API Service Layer**
```typescript
// src/services/api/client.ts
export const apiClient = {
  auth: { login, register, verifyOTP },
  attendance: { mark, getHistory, getReport },
  classes: { getSchedule, getActive },
  assignments: { getAll, getDetails },
  profile: { get, update, changePassword }
}
```

### **2. Add Environment Configuration**
```typescript
// src/config/env.ts
export const config = {
  API_BASE_URL: process.env.API_BASE_URL,
  MESH_CHANNEL: process.env.MESH_CHANNEL,
  // ... other config
}
```

### **3. Implement Data Models**
```typescript
// src/types/models.ts
export interface User { ... }
export interface Class { ... }
export interface Attendance { ... }
export interface Assignment { ... }
```

---

## 🧹 Cleanup Recommendations

### **Screens to Remove** (18 legacy screens)
1. FacialRecognitionSetupScreen.tsx
2. FacialDetectionScanningScreen.tsx
3. FacialDetectionSuccessScreen.tsx
4. FacialDetectionFailedScreen.tsx
5. FingerprintScanningScreen.tsx
6. FingerprintVerificationSuccessScreen.tsx
7. FingerprintVerificationFailedScreen.tsx
8. FingerprintSuccessScreen.tsx
9. FingerprintFailedScreen.tsx
10. FacialCaptureSuccessScreen.tsx
11. FacialCaptureFailedScreen.tsx
12. AttendanceSessionScreen.tsx
13. AttendanceInProgressScreen.tsx
14. PinInputScreen.tsx
15. PinInputErrorScreen.tsx
16. FacialRecognitionScreen.tsx (if not used in signup)
17. FingerprintCaptureScreen.tsx (if not used in signup)

### **After Cleanup**
- Remove imports from App.tsx
- Remove from navigation stack
- Delete physical files
- Update documentation

---

## 📝 Summary

**Total Screens**: 39
**Active Screens**: ~21
**Legacy/Unused**: ~18
**Core Flow**: Auth → Dashboard → Join Class → Biometric → Success
**Key Innovation**: Offline BLE mesh networking for attendance

This app has a solid foundation with modern biometric authentication and innovative offline capabilities. The main opportunity is code organization and removing legacy screens to improve maintainability.
