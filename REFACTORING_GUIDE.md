# Code Refactoring Guide - Attendance App

## 🎯 Refactoring Goals
1. **Organize code for scalability** - Separate concerns, create reusable components
2. **Prepare for API integration** - Create service layer, data models
3. **Remove legacy code** - Delete unused screens and clean up navigation
4. **Improve maintainability** - Better file structure, TypeScript types, documentation

---

## 📁 Phase 1: Reorganize File Structure

### Current Structure
```
screens/ (39 files - all mixed together)
components/ (1 file)
navigation/ (1 file)
src/services/ (1 file)
```

### Proposed Structure
```
src/
├── screens/
│   ├── auth/
│   │   ├── SplashScreen.tsx
│   │   ├── LogoScreen.tsx
│   │   ├── SignInScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── OTPVerificationScreen.tsx
│   │   ├── CreatePinScreen.tsx
│   │   ├── SetPinScreen.tsx
│   │   └── PinCreatedSuccessScreen.tsx
│   ├── dashboard/
│   │   └── DashboardScreen.tsx
│   ├── attendance/
│   │   ├── JoinClassSelectionScreen.tsx
│   │   ├── BiometricAuthScreen.tsx
│   │   ├── SessionConnectedScreen.tsx
│   │   ├── SessionFailedScreen.tsx
│   │   └── SessionOverScreen.tsx
│   ├── profile/
│   │   ├── ProfileScreen.tsx
│   │   ├── ChangePasswordScreen.tsx
│   │   └── NotificationScreen.tsx
│   ├── reports/
│   │   └── ReportScreen.tsx
│   ├── assignments/
│   │   ├── AssignmentListScreen.tsx
│   │   └── AssignmentDetailScreen.tsx
│   └── calendar/
│       ├── CalendarScreen.tsx
│       └── CalendarUpcomingScreen.tsx
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── StatusBadge.tsx
│   │   └── LoadingSpinner.tsx
│   ├── attendance/
│   │   ├── ClassCard.tsx
│   │   ├── AttendanceTable.tsx
│   │   └── MeshStatusIndicator.tsx
│   ├── charts/
│   │   ├── BarChart.tsx
│   │   └── AttendanceChart.tsx
│   └── layout/
│       ├── Header.tsx (existing)
│       └── TabBar.tsx
├── services/
│   ├── api/
│   │   ├── client.ts          # Axios/Fetch client
│   │   ├── auth.service.ts
│   │   ├── attendance.service.ts
│   │   ├── classes.service.ts
│   │   ├── assignments.service.ts
│   │   └── profile.service.ts
│   ├── mesh/
│   │   └── meshservice.ts (existing)
│   ├── biometric/
│   │   └── biometric.service.ts
│   └── storage/
│       └── storage.service.ts  # AsyncStorage wrapper
├── navigation/
│   ├── TabNavigator.tsx (existing)
│   ├── AuthNavigator.tsx       # Auth flow navigation
│   ├── MainNavigator.tsx       # Main app navigation
│   └── types.ts                # Navigation types
├── hooks/
│   ├── useAuth.ts
│   ├── useAttendance.ts
│   ├── useMesh.ts
│   └── useBiometric.ts
├── utils/
│   ├── validators.ts
│   ├── formatters.ts
│   └── helpers.ts
├── constants/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── config.ts
├── types/
│   ├── models.ts               # Data models
│   ├── api.ts                  # API types
│   └── navigation.ts           # Navigation types
└── theme/
    ├── index.ts
    ├── colors.ts
    ├── typography.ts
    └── spacing.ts
```

---

## 🗑️ Phase 2: Remove Legacy Screens

### Files to Delete (18 screens)
```bash
# Legacy biometric setup screens (replaced by BiometricAuthScreen)
screens/FacialRecognitionSetupScreen.tsx
screens/FacialDetectionScanningScreen.tsx
screens/FacialDetectionSuccessScreen.tsx
screens/FacialDetectionFailedScreen.tsx
screens/FingerprintScanningScreen.tsx
screens/FingerprintVerificationSuccessScreen.tsx
screens/FingerprintVerificationFailedScreen.tsx

# Old setup flow screens
screens/FingerprintSuccessScreen.tsx
screens/FingerprintFailedScreen.tsx
screens/FacialCaptureSuccessScreen.tsx
screens/FacialCaptureFailedScreen.tsx

# Replaced attendance screens
screens/AttendanceSessionScreen.tsx
screens/AttendanceInProgressScreen.tsx

# Unused PIN screens (if not needed)
screens/PinInputScreen.tsx
screens/PinInputErrorScreen.tsx

# Check if these are used in signup flow, if not, remove:
screens/FacialRecognitionScreen.tsx
screens/FingerprintCaptureScreen.tsx
```

### Update App.tsx
Remove all imports and screen definitions for deleted screens.

---

## 🏗️ Phase 3: Create Service Layer

### 1. API Client Setup
```typescript
// src/services/api/client.ts
import axios from 'axios';
import { getToken } from '../storage/storage.service';

const API_BASE_URL = 'https://your-api.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401, 403, etc.
    return Promise.reject(error);
  }
);
```

### 2. Auth Service
```typescript
// src/services/api/auth.service.ts
import { apiClient } from './client';
import { User, LoginCredentials, RegisterData } from '../../types/models';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  verifyOTP: async (otp: string): Promise<boolean> => {
    const response = await apiClient.post('/auth/verify-otp', { otp });
    return response.data.verified;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
```

### 3. Attendance Service
```typescript
// src/services/api/attendance.service.ts
import { apiClient } from './client';
import { AttendanceRecord, AttendanceReport } from '../../types/models';

export const attendanceService = {
  markAttendance: async (data: {
    classId: string;
    verificationType: 'faceid' | 'fingerprint';
    timestamp: Date;
  }): Promise<AttendanceRecord> => {
    const response = await apiClient.post('/attendance/mark', data);
    return response.data;
  },

  getHistory: async (filters?: {
    startDate?: Date;
    endDate?: Date;
    courseId?: string;
  }): Promise<AttendanceRecord[]> => {
    const response = await apiClient.get('/attendance/history', { params: filters });
    return response.data;
  },

  getReport: async (period: 'week' | 'month' | 'semester'): Promise<AttendanceReport> => {
    const response = await apiClient.get(`/attendance/report/${period}`);
    return response.data;
  },
};
```

---

## 📊 Phase 4: Define Data Models

```typescript
// src/types/models.ts

export interface User {
  id: string;
  metroNumber: string;
  fullName: string;
  email: string;
  department: string;
  level: number;
  profileImage?: string;
}

export interface Class {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  time: string;
  venue: string;
  status: 'active' | 'upcoming' | 'ended';
  duration: number; // minutes
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  timestamp: Date;
  status: 'present' | 'late' | 'absent';
  verificationType: 'faceid' | 'fingerprint' | 'pin';
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface AttendanceReport {
  totalClasses: number;
  present: number;
  late: number;
  absent: number;
  percentage: number;
  byCourse: {
    courseId: string;
    courseName: string;
    percentage: number;
  }[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  type: 'lecture' | 'event' | 'reminder';
}

// API Request/Response types
export interface LoginCredentials {
  metroNumber: string;
  password: string;
}

export interface RegisterData {
  metroNumber: string;
  fullName: string;
  email: string;
  password: string;
  department: string;
  level: number;
}
```

---

## 🎨 Phase 5: Create Design System

```typescript
// src/theme/colors.ts
export const colors = {
  primary: '#8B5CF6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  accent: '#ec4899',
  
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
  },
  
  background: {
    primary: '#ffffff',
    secondary: '#f3f4f6',
    tertiary: '#f9fafb',
  },
  
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#9ca3af',
  },
};

// src/theme/typography.ts
export const typography = {
  sizes: {
    xs: 9,
    sm: 11,
    base: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 22,
  },
  
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// src/theme/spacing.ts
export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
};
```

---

## 🔧 Phase 6: Create Reusable Components

### Example: ClassCard Component
```typescript
// src/components/attendance/ClassCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { Class } from '../../types/models';

interface ClassCardProps {
  class: Class;
  onJoin: () => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ class: classItem, onJoin }) => {
  const getStatusBadge = () => {
    switch (classItem.status) {
      case 'active':
        return <Text style={styles.activeStatus}>Active</Text>;
      case 'upcoming':
        return <Text style={styles.upcomingStatus}>Up Next</Text>;
      case 'ended':
        return <Text style={styles.endedStatus}>Ended</Text>;
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.time}>{classItem.time}</Text>
      <Text style={styles.code}>{classItem.code}</Text>
      {getStatusBadge()}
      <TouchableOpacity
        style={[
          styles.button,
          classItem.status === 'ended' && styles.buttonDisabled,
        ]}
        onPress={onJoin}
        disabled={classItem.status === 'ended'}
      >
        <Text style={styles.buttonText}>
          {classItem.status === 'ended' ? 'Class Over' : 'Join Class'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: spacing.sm,
    borderWidth: 0.5,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  time: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  code: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  activeStatus: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  upcomingStatus: {
    fontSize: typography.sizes.xs,
    color: colors.text.primary,
    backgroundColor: '#4167F94A',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  endedStatus: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    backgroundColor: '#FCCFCF',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
    width: '100%',
    borderRadius: 4,
    marginTop: spacing.xs,
  },
  buttonDisabled: {
    backgroundColor: colors.border.medium,
  },
  buttonText: {
    color: '#fff',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
});
```

---

## 🔄 Phase 7: Create Custom Hooks

### Example: useAttendance Hook
```typescript
// src/hooks/useAttendance.ts
import { useState, useEffect } from 'react';
import { attendanceService } from '../services/api/attendance.service';
import { AttendanceRecord, AttendanceReport } from '../types/models';

export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AttendanceReport | null>(null);

  const markAttendance = async (classId: string, verificationType: 'faceid' | 'fingerprint') => {
    setLoading(true);
    setError(null);
    try {
      const record = await attendanceService.markAttendance({
        classId,
        verificationType,
        timestamp: new Date(),
      });
      return record;
    } catch (err: any) {
      setError(err.message || 'Failed to mark attendance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async (period: 'week' | 'month' | 'semester') => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getReport(period);
      setReport(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    report,
    markAttendance,
    fetchReport,
  };
};
```

---

## ✅ Implementation Checklist

### Week 1: Cleanup & Organization
- [ ] Delete 18 legacy screens
- [ ] Update App.tsx navigation
- [ ] Create new folder structure
- [ ] Move existing screens to new folders
- [ ] Update all imports

### Week 2: Design System
- [ ] Create theme files (colors, typography, spacing)
- [ ] Extract common styles
- [ ] Create reusable components (Button, Input, Card, etc.)
- [ ] Update screens to use design system

### Week 3: Service Layer
- [ ] Set up API client
- [ ] Create all service files
- [ ] Define data models (TypeScript interfaces)
- [ ] Create custom hooks

### Week 4: Integration & Testing
- [ ] Connect screens to API services
- [ ] Replace mock data with real API calls
- [ ] Test all flows end-to-end
- [ ] Update documentation

---

## 🚀 Benefits After Refactoring

1. **Easier Onboarding** - New developers can understand structure quickly
2. **Faster Development** - Reusable components and hooks
3. **Better Testing** - Isolated services and components
4. **Scalability** - Easy to add new features
5. **Maintainability** - Clear separation of concerns
6. **Type Safety** - TypeScript interfaces prevent bugs
7. **Consistency** - Design system ensures uniform UI

---

## 📝 Next Steps

1. Review this plan with the team
2. Create a GitHub project board with tasks
3. Assign tasks to developers
4. Set up code review process
5. Begin implementation week by week
6. Document as you go

This refactoring will transform the codebase from a prototype to a production-ready application! 🎉
