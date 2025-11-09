export interface AttendanceData {
  studentId: string;
  name: string;
  timestamp: string;
  verificationMethod: 'facial' | 'fingerprint' | 'pin';
  meetingId: string;
  courseCode: string;
}

export interface SessionData {
  sessionId: string;
  courseCode: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  attendanceWindow: number; // in minutes
  attendees: AttendanceData[];
  isOnline?: boolean;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  schedule?: {
    day: string;
    time: string;
  }[];
}

export interface SessionConfig {
  courseCode: string;
  duration: number;
  attendanceWindow: number;
  isOnline?: boolean;
}

export type VerificationMethod = 'facial' | 'fingerprint' | 'pin';

export type SessionStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface SessionStats {
  totalStudents: number;
  attendedStudents: number;
  verificationMethods: {
    [key in VerificationMethod]: number;
  };
  attendanceRate: number;
}
