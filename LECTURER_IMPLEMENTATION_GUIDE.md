# Lecturer App Implementation Guide

This guide outlines what needs to be implemented on the **Lecturer's side** to complete the BLE attendance system. The lecturer app should be in a **separate codebase**.

## Overview

The lecturer app needs to:
1. **Advertise sessions** (`att:advertise`) - Broadcast session details to nearby students
2. **Collect joins** (`att:join`) - Receive student join requests
3. **Send acknowledgments** (`att:ack`) - Confirm student attendance with status
4. **End sessions** (`att:end`) - Terminate the session

---

## 1. Install Dependencies

Same as student app:
```bash
npm i expo-bitchat react-native-device-info @react-native-async-storage/async-storage
```

---

## 2. Copy BleTransport.ts Service

Copy the same `src/services/BleTransport.ts` file from the student app.

**OR** create a simplified version with the same structure:
- `start(nickname)` - Start BLE service
- `send(payload)` - Send JSON messages on `#att` channel
- `stop()` - Stop service
- EventEmitter with `on('m', handler)` for receiving messages

---

## 3. App.tsx Bootstrap (Lecturer Mode)

```typescript
import Transport from './src/services/BleTransport';
import DeviceInfo from 'react-native-device-info';
import { useEffect } from 'react';

useEffect(() => {
  const initTransport = async () => {
    try {
      const uniqueId = await DeviceInfo.getUniqueId();
      const nickname = `L-${uniqueId}`; // 👈 L- prefix for Lecturer
      await Transport.start(nickname);
      console.log(`✅ Transport started as lecturer: ${nickname}`);
    } catch (error) {
      console.error('Failed to start Transport:', error);
    }
  };

  initTransport();

  return () => {
    Transport.stop();
  };
}, []);
```

**Key difference:** Use `L-{uniqueId}` instead of `S-{uniqueId}`

---

## 4. SetupSessionRulesScreen (Create Session)

After lecturer enters course code, duration, etc. and validates:

```typescript
import Transport from '../src/services/BleTransport';

// Generate unique meetingId
const meetingId = Math.random().toString(36).slice(2, 8).toUpperCase();

// Send att:advertise message
const advertiseMessage = {
  type: 'att:advertise',
  meetingId: meetingId,
  courseCode: courseCode, // e.g., "PHY 202"
  duration: duration, // minutes (optional)
  window: window, // late window in minutes (optional)
};

Transport.send(advertiseMessage);

// Navigate to AttendanceInSessionScreen with session info
navigation.navigate('AttendanceInSession', {
  meetingId,
  courseCode,
  duration,
  window,
  startTime: new Date(),
});
```

---

## 5. AttendanceInSessionScreen (Main Session View)

### State Management

```typescript
const [students, setStudents] = useState<Array<{
  id: string; // senderId from att:join
  name: string; // Display name (e.g., "St-{last4chars}")
  timeJoined: string; // Time student joined
  status: 'present' | 'late'; // Calculated based on window
}>>([]);
```

### Listen for att:join Messages

```typescript
useEffect(() => {
  if (!Transport.isActive()) return;

  const handleMessage = (m: any) => {
    if (m.type === 'att:join' && m.meetingId === meetingId) {
      // Check if student already in list (dedupe)
      if (students.some(s => s.id === m.senderId)) {
        console.log('⚠️ Duplicate join from:', m.senderId);
        return;
      }

      // Calculate if student is late
      const joinTime = new Date();
      const elapsed = (joinTime.getTime() - startTime.getTime()) / 1000 / 60; // minutes
      const status = elapsed > window ? 'late' : 'present';

      // Add student to list
      const newStudent = {
        id: m.senderId,
        name: `St-${m.senderId.slice(-4)}`, // Use last 4 chars as display name
        timeJoined: joinTime.toLocaleTimeString(),
        status: status,
      };

      setStudents(prev => [...prev, newStudent]);

      // Send acknowledgment
      const ackMessage = {
        type: 'att:ack',
        meetingId: meetingId,
        senderId: m.senderId, // Send to the student who joined
        status: status, // 'present' or 'late'
      };

      Transport.send(ackMessage);
      console.log('✅ Sent ack to student:', ackMessage);
    }
  };

  Transport.on('m', handleMessage);

  return () => {
    Transport.off('m', handleMessage);
  };
}, [meetingId, students, window, startTime]);
```

### Render Students List

```typescript
<ScrollView>
  <Text style={styles.studentsCount}>
    Students Joined: {students.length}
  </Text>
  
  {students.map((student, index) => (
    <View key={student.id} style={styles.studentCard}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.studentTime}>{student.timeJoined}</Text>
      </View>
      <View style={[
        styles.statusBadge,
        { backgroundColor: student.status === 'present' ? '#10b981' : '#f59e0b' }
      ]}>
        <Text style={styles.statusText}>
          {student.status === 'present' ? 'Present' : 'Late'}
        </Text>
      </View>
    </View>
  ))}
</ScrollView>
```

---

## 6. End Session Button

```typescript
import Transport from '../src/services/BleTransport';

const handleEndSession = () => {
  // Send att:end message to all students
  const endMessage = {
    type: 'att:end',
    meetingId: meetingId,
  };

  Transport.send(endMessage);
  console.log('📢 Session ended:', endMessage);

  // Navigate to session summary screen
  navigation.replace('SessionSuccess', {
    students: students,
    meetingId: meetingId,
    courseCode: courseCode,
  });
};
```

---

## 7. Message Flow Summary

### Lecturer Actions:

1. **Start Session:**
   ```json
   {
     "type": "att:advertise",
     "meetingId": "ABC123",
     "courseCode": "PHY 202",
     "duration": 60,
     "window": 15
   }
   ```

2. **When Student Joins:**
   - Receive: `att:join` from student
   - Send: `att:ack` with status ('present' or 'late')

3. **End Session:**
   ```json
   {
     "type": "att:end",
     "meetingId": "ABC123"
   }
   ```

---

## 8. Required Screens

1. **SetupSessionRulesScreen**
   - Input: Course code, duration, late window
   - Action: Generate meetingId, send `att:advertise`
   - Navigate to: `AttendanceInSession`

2. **AttendanceInSessionScreen**
   - Display: Live list of joined students
   - Actions: 
     - Receive `att:join` → Add to list → Send `att:ack`
     - "End Session" button → Send `att:end`
   - Navigate to: `SessionSuccess` (summary screen)

3. **SessionSuccessScreen** (optional)
   - Display: Final attendance list, statistics
   - Show: Total students, present vs late count

---

## 9. Testing Checklist

- [ ] Lecturer can start a session with course code
- [ ] Students can discover the session via BLE
- [ ] Students can join and lecturer receives `att:join`
- [ ] Lecturer sends `att:ack` and student status updates
- [ ] Late students are marked correctly based on time window
- [ ] Lecturer can end session and students receive `att:end`
- [ ] Multiple students can join simultaneously
- [ ] Duplicate joins from same student are ignored

---

## 10. Example Student Object

```typescript
{
  id: "device-unique-id-12345",
  name: "St-2345", // Last 4 chars for display
  timeJoined: "10:30 AM",
  status: "present" // or "late"
}
```

---

## Notes

- **Channel:** All messages use `#att` channel (handled by BleTransport)
- **MeetingId:** Must be unique per session (use random string)
- **Deduplication:** Check `senderId` to prevent duplicate entries
- **Late Calculation:** Compare join time vs start time + window
- **Nickname:** Lecturer uses `L-{uniqueId}`, Student uses `S-{uniqueId}` for easy identification

---

This completes the lecturer-side implementation! The lecturer app should work seamlessly with the student app you've already built.

