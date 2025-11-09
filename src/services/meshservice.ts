// MeshService.js
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import * as Location from 'expo-location';
import BitchatAPI from 'expo-bitchat';

class MeshService {
  constructor() {
    this.subscriptions = [];
    this.isRunning = false;
    this.peers = {};
    this.messageHandlers = new Set();
    this.sessionHandlers = new Set();
    this.attendanceHandlers = new Set();
    this.nickname = '';
    this.detectedSession = null; // Current detected session info
  }

  async initialize(nickname) {
    try {
      this.nickname = nickname;
      
      // Request permissions
      if (Platform.OS === 'android') {
        const permissionsGranted = await this.requestAndroidPermissions();
        if (!permissionsGranted) {
          throw new Error('Bluetooth permissions denied');
        }
      }

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Check if location services are enabled (Android)
      if (Platform.OS === 'android') {
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        if (!isLocationEnabled) {
          throw new Error('Location services must be enabled for Bluetooth scanning');
        }
      }

      // Start Bitchat service
      await BitchatAPI.startServices(nickname);
      this.isRunning = true;
      
      this.setupListeners();
      return true;
    } catch (error) {
      console.error('Mesh service initialization failed:', error);
      throw error;
    }
  }

  async requestAndroidPermissions() {
    if (Platform.Version >= 31) {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        ];

        const results = await PermissionsAndroid.requestMultiple(permissions);
        
        return Object.values(results).every(
          result => result === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (error) {
        console.error('Permission request error:', error);
        return false;
      }
    }
    return true;
  }

  setupListeners() {
    // Clear existing listeners
    this.subscriptions.forEach(sub => sub.remove());
    this.subscriptions = [];

    // Message listener
    this.subscriptions.push(
      BitchatAPI.addMessageListener((message) => {
        console.log('Received message:', message);
        this.handleIncomingMessage(message);
      })
    );

    // Peer connection listeners
    this.subscriptions.push(
      BitchatAPI.addPeerConnectedListener(({ nickname }) => {
        console.log(`Peer connected: ${nickname}`);
        this.updatePeers();
      })
    );

    this.subscriptions.push(
      BitchatAPI.addPeerDisconnectedListener(({ nickname }) => {
        console.log(`Peer disconnected: ${nickname}`);
        this.updatePeers();
      })
    );

    // Peer list updated listener
    this.subscriptions.push(
      BitchatAPI.addPeerListUpdatedListener(() => {
        this.updatePeers();
      })
    );
  }

  async updatePeers() {
    try {
      this.peers = await BitchatAPI.getConnectedPeers();
      console.log('Updated peers:', this.peers);
    } catch (error) {
      console.error('Error updating peers:', error);
    }
  }

  handleIncomingMessage(message) {
    console.log('Handling incoming message:', message);
    
    // Try to parse message content as JSON
    try {
      const parsed = JSON.parse(message.content || message);
      
      // Handle session_started messages
      if (parsed.type === 'session_started') {
        console.log('📢 Session detected:', parsed);
        this.detectedSession = {
          course: parsed.course,
          meetingId: parsed.meetingId,
          lecturer: parsed.lecturer,
          channel: parsed.channel || `#${parsed.course}-${parsed.meetingId}`,
          timestamp: parsed.timestamp
        };
        this.sessionHandlers.forEach(handler => {
          try {
            handler(this.detectedSession);
          } catch (error) {
            console.error('Error in session handler:', error);
          }
        });
      }
      
      // Handle attendance messages
      if (parsed.type === 'attendance') {
        this.attendanceHandlers.forEach(handler => {
          try {
            handler(parsed);
          } catch (error) {
            console.error('Error in attendance handler:', error);
          }
        });
      }
    } catch (e) {
      // Not JSON, handle as regular message
    }
    
    // Call general message handlers
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  onMessage(handler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  // Listen for session_started events (lecturer broadcasting class)
  onSessionDetected(handler) {
    this.sessionHandlers.add(handler);
    return () => this.sessionHandlers.delete(handler);
  }

  // Listen for attendance events
  onAttendance(handler) {
    this.attendanceHandlers.add(handler);
    return () => this.attendanceHandlers.delete(handler);
  }

  // Get currently detected session
  getDetectedSession() {
    return this.detectedSession;
  }

  // FIXED: Proper sendMessage method
  async sendMessage(content, recipients = [], channel = '#attendance') {
    if (!this.isRunning) {
      throw new Error('Mesh service not running');
    }

    try {
      console.log('Sending message:', { content, channel });
      await BitchatAPI.sendMessage(content, recipients, channel);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async sendAttendanceData(attendanceData) {
    if (!this.isRunning) throw new Error('Mesh service not running');

    const attendanceMessage = {
      type: 'attendance',
      studentId: attendanceData.studentId || this.nickname,
      studentName: attendanceData.studentName || this.nickname,
      course: attendanceData.course,
      meetingId: attendanceData.meetingId,
      verification: attendanceData.verification || 'unknown', // 'facial', 'fingerprint', 'pin'
      timestamp: Date.now(),
      status: 'present',
      sender: this.nickname
    };

    // Use course-specific channel if available, otherwise use default
    const channel = attendanceData.channel || `#${attendanceData.course}-${attendanceData.meetingId}` || '#attendance';
    
    console.log('📤 Broadcasting attendance:', attendanceMessage);
    await this.sendMessage(JSON.stringify(attendanceMessage), [], channel);
    
    return {
      success: true,
      peerCount: this.getPeerCount(),
      channel
    };
  }

  async sendSessionData(sessionData) {
    if (!this.isRunning) throw new Error('Mesh service not running');

    const message = {
      type: 'session',
      data: sessionData,
      timestamp: Date.now(),
      sender: this.nickname
    };

    await this.sendMessage(JSON.stringify(message));
  }

  // Lecturer: Broadcast session start
  async broadcastSessionStart(sessionInfo) {
    if (!this.isRunning) throw new Error('Mesh service not running');

    const sessionMessage = {
      type: 'session_started',
      course: sessionInfo.course,
      meetingId: sessionInfo.meetingId,
      lecturer: sessionInfo.lecturer || this.nickname,
      channel: `#${sessionInfo.course}-${sessionInfo.meetingId}`,
      timestamp: Date.now(),
      sender: this.nickname
    };

    const channel = sessionMessage.channel;
    console.log('📢 Broadcasting session start:', sessionMessage);
    await this.sendMessage(JSON.stringify(sessionMessage), [], channel);
    
    return {
      success: true,
      channel,
      sessionMessage
    };
  }

  // Student: Listen for specific course session
  async listenForCourse(courseCode) {
    if (!this.isRunning) {
      throw new Error('Mesh service not running');
    }
    
    // The message handler will automatically detect session_started messages
    // for the specified course via onSessionDetected handlers
    console.log(`🔍 Listening for course: ${courseCode}`);
  }

  async cleanup() {
    console.log('Cleaning up MeshService...');
    this.subscriptions.forEach(sub => sub.remove());
    this.subscriptions = [];
    this.messageHandlers.clear();
    this.sessionHandlers.clear();
    this.attendanceHandlers.clear();
    this.detectedSession = null;
    
    if (this.isRunning) {
      try {
        await BitchatAPI.stopServices();
        this.isRunning = false;
        console.log('Mesh service stopped');
      } catch (error) {
        console.error('Error stopping service:', error);
      }
    }
  }

  // Utility methods
  getStatus() {
    return {
      isRunning: this.isRunning,
      peerCount: Object.keys(this.peers).length,
      nickname: this.nickname
    };
  }

  getPeerCount() {
    return Object.keys(this.peers).length;
  }
}

// Create a singleton instance
const meshServiceInstance = new MeshService();

// Export the instance as default
export default meshServiceInstance;