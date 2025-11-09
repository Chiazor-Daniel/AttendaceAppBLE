import BleService, { AttendanceData } from './BleService';

export interface SessionData {
  sessionId: string;
  courseCode: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  attendanceWindow: number; // in minutes
  attendees: Array<{
    studentId: string;
    name: string;
    verificationMethod: 'facial' | 'fingerprint' | 'pin';
    timestamp: string;
  }>;
}

export class SessionManager {
  private bleService: BleService;
  private activeSession: SessionData | null = null;
  private sessionTimeout?: NodeJS.Timeout;
  private attendanceCallback?: (data: AttendanceData) => void;

  constructor() {
    this.bleService = new BleService();
  }

  private generateSessionId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  public async startSession(
    courseCode: string,
    duration: number,
    attendanceWindow: number,
  ): Promise<SessionData> {
    if (this.activeSession) {
      throw new Error('A session is already in progress');
    }

    try {
      const sessionId = this.generateSessionId();
      const startTime = new Date();

      // Create new session
      this.activeSession = {
        sessionId,
        courseCode,
        startTime,
        duration,
        attendanceWindow,
        attendees: [],
      };

      // Initialize BLE advertising
      console.log('Starting BLE advertising for session:', sessionId);
      await this.bleService.startAdvertising(sessionId, courseCode);

      // Set up attendance monitoring
      this.bleService.onStudentAttendance((data: AttendanceData) => {
        this.handleStudentAttendance(data);
        if (this.attendanceCallback) {
          this.attendanceCallback(data);
        }
      });

      // Set session timeout
      this.sessionTimeout = setTimeout(() => {
        this.endSession();
      }, duration * 60 * 1000); // Convert minutes to milliseconds

      return this.activeSession;
    } catch (error) {
      console.error('Error starting session:', error);
      this.activeSession = null;
      throw error;
    }
  }

  public async endSession(): Promise<SessionData | null> {
    if (!this.activeSession) {
      return null;
    }

    try {
      // Stop BLE advertising
      await this.bleService.stopAdvertising();

      // Clear session timeout
      if (this.sessionTimeout) {
        clearTimeout(this.sessionTimeout);
      }

      // Update session end time
      this.activeSession.endTime = new Date();

      // Store the completed session data
      const completedSession = { ...this.activeSession };
      this.activeSession = null;

      return completedSession;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }

  public getActiveSession(): SessionData | null {
    return this.activeSession;
  }

  private handleStudentAttendance(data: AttendanceData): void {
    if (!this.activeSession) {
      console.warn('Received attendance data but no active session');
      return;
    }

    // Validate session ID
    if (data.meetingId !== this.activeSession.sessionId) {
      console.warn('Invalid session ID in attendance data');
      return;
    }

    // Check if student already marked attendance
    const existingAttendance = this.activeSession.attendees.find(
      a => a.studentId === data.studentId,
    );

    if (existingAttendance) {
      console.warn('Student already marked attendance');
      return;
    }

    // Check if within attendance window
    const now = new Date();
    const sessionStart = this.activeSession.startTime;
    const windowEnd = new Date(
      sessionStart.getTime() + this.activeSession.attendanceWindow * 60 * 1000,
    );

    if (now > windowEnd) {
      console.warn('Attendance window has closed');
      return;
    }

    // Add attendance record
    this.activeSession.attendees.push({
      studentId: data.studentId,
      name: data.name,
      verificationMethod: data.verificationMethod,
      timestamp: data.timestamp,
    });
  }

  public onAttendanceUpdate(
    callback: (data: AttendanceData) => void,
  ): () => void {
    this.attendanceCallback = callback;
    return () => {
      this.attendanceCallback = undefined;
    };
  }

  public destroy(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
    this.bleService.destroy();
    this.attendanceCallback = undefined;
  }
}

export default SessionManager;
