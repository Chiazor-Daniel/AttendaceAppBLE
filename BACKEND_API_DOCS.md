# 🚀 Backend API Documentation - Offline Attendance System

This document outlines the expected API endpoints for the Attendance App, covering Student, Lecturer, and Admin flows. The system is designed to support offline attendance via BLE/Mesh and later synchronization to the backend.

---

## 🔐 1. Authentication & Identity
Handles user registration, login, and multi-factor/biometric setup.

### **Endpoints**
- `POST /auth/signup`
  - **Body**: `{ email, password, fullName, matricNumber/staffId, role: 'student'|'lecturer'|'admin' }`
  - **Description**: Registers a new user.
- `POST /auth/signin`
  - **Body**: `{ email, password }`
  - **Response**: `{ token, user: { id, role, ... } }`
- `POST /auth/otp/send`
  - **Body**: `{ email }`
  - **Description**: Sends OTP for verification.
- `POST /auth/otp/verify`
  - **Body**: `{ email, otp }`
- `POST /auth/pin/set`
  - **Body**: `{ pin }` (Securely hashed)
- `POST /auth/biometrics/register`
  - **Body**: `{ publicKey, deviceId }`
  - **Description**: Registers device biometrics for future local verification.
- `POST /auth/password/change`
  - **Body**: `{ oldPassword, newPassword }`

---

## 📊 2. Student Dashboard & Courses
Provides data for the [DashboardScreen.tsx](file:///c:/Users/USER/Documents/AttendaceAppBLE/screens/DashboardScreen.tsx) and course-related views.

### **Endpoints**
- `GET /student/dashboard`
  - **Response**: Today's active classes, overall attendance percentage, and weekly summary.
- `GET /student/courses`
  - **Response**: List of courses the student is enrolled in.
- `GET /student/courses/:courseId`
  - **Response**: Detailed info including lecturer name, schedule, and course materials.
- `GET /student/attendance/stats`
  - **Response**: Detailed breakdown of attendance per course for the chart and table.

---

## 📝 3. Assignments & Submissions
Handles assignment flow for students and lecturers.

### **Endpoints**
- `GET /assignments`
  - **Query**: `?courseId=xxx` (Optional)
  - **Description**: List of assignments for the student or posted by the lecturer.
- `GET /assignments/:assignmentId`
  - **Response**: Questions, deadline, and instructions.
- `POST /assignments/:assignmentId/submit`
  - **Body**: `{ submissionData, files: [] }`
  - **Description**: Submit student answers/files.
- `GET /assignments/:assignmentId/submissions` (Lecturer Only)
  - **Response**: List of student submissions for a specific assignment.

---

## 📡 4. Attendance (Offline & Sync)
The core logic where offline data meets the backend.

### **Flow Overview**
1. **Lecturer** starts a session offline.
2. **Students** mark attendance offline (broadcast to lecturer).
3. **Lecturer** saves the session data locally.
4. **Lecturer** syncs the session data to the backend when online.

### **Endpoints**
- `POST /attendance/sessions/sync` (Lecturer Only)
  - **Body**: 
    ```json
    {
      "courseId": "PHY202",
      "meetingId": "2025W10",
      "startTime": 1730899200000,
      "endTime": 1730902800000,
      "attendees": [
        { "studentId": "S-1001", "timestamp": 1730899235000, "verification": "biometric" },
        { "studentId": "S-1002", "timestamp": 1730899245000, "verification": "pin" }
      ]
    }
    ```
  - **Description**: Uploads the offline collected attendance data to the server.
- `GET /attendance/history`
  - **Query**: `?studentId=xxx&courseId=xxx`
  - **Description**: Returns verified attendance records.

---

## ⚙️ 5. Admin & Management
Management of the school hierarchy and assignments.

### **Faculties & Departments**
- `GET/POST/PUT/DELETE /admin/faculties`
- `GET/POST/PUT/DELETE /admin/departments`
  - **Body**: `{ name, facultyId }`

### **Course & User Management**
- `POST /admin/courses`
  - **Body**: `{ code, name, departmentId }`
- `POST /admin/assign/student-to-course`
  - **Body**: `{ studentId, courseId }`
- `POST /admin/assign/lecturer-to-course`
  - **Body**: `{ lecturerId, courseId }`
- `GET /admin/users`
  - **Query**: `?role=student|lecturer`

---

## 🔔 6. Notifications & Reports
General system utilities.

### **Endpoints**
- `GET /notifications`
  - **Response**: List of alerts (new assignment, attendance marked, etc.).
- `POST /notifications/send` (Admin/Lecturer Only)
  - **Body**: `{ target: 'course'|'student', targetId, message }`
- `GET /reports/attendance/export`
  - **Query**: `?courseId=xxx&format=csv|pdf`
  - **Description**: Generates downloadable attendance reports.

---

## 👤 7. Profile
- `GET /profile`
  - **Response**: Name, matric number, department, level, profile image.
- `PATCH /profile`
  - **Body**: `{ profileImage, contactDetails }`

---

## 🔄 Summary of Flows

### **1. Student Join Class Flow**
1. Fetch `GET /student/dashboard` to see active classes.
2. Local BLE Mesh detection for session (Offline).
3. Local Biometric/PIN verification (Offline).
4. Broadcast attendance to Lecturer (Offline).
5. Later, Student can see verified status via `GET /attendance/history` once Lecturer syncs.

### **2. Lecturer Attendance Flow**
1. Select course from `GET /lecturer/courses`.
2. Start Session (Offline - broadcasts `session_started`).
3. Collect Student IDs (Offline - receives `attendance`).
4. End Session & Save locally.
5. Once online, call `POST /attendance/sessions/sync`.

### **3. Assignment Flow**
1. Lecturer posts via `POST /assignments`.
2. Students receive notification and see in `GET /assignments`.
3. Student submits via `POST /assignments/:id/submit`.
4. Lecturer views via `GET /assignments/:id/submissions`.
