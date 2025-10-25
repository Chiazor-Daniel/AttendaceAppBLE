import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, TextInput } from "react-native";
import BitchatAPI from "expo-bitchat";

const ATTENDANCE_CHANNEL = "#attendance";

export default function AttendanceApp() {
  const [isLecturer, setIsLecturer] = useState(false);
  const [attendanceCode, setAttendanceCode] = useState("");
  const [responses, setResponses] = useState([]);
  const [nickname, setNickname] = useState("User");

  // Start Bitchat on mount
  useEffect(() => {
    const init = async () => {
      try {
        await BitchatAPI.startServices(nickname);
        console.log("✅ Bitchat started as", nickname);

        // Listen for messages
        const msgSub = BitchatAPI.addMessageListener(handleMessage);
        const peerSub = BitchatAPI.addPeerConnectedListener(({ nickname }) =>
          console.log("Peer joined:", nickname),
        );

        return () => {
          msgSub.remove();
          peerSub.remove();
          BitchatAPI.stopServices();
        };
      } catch (err) {
        console.error("❌ Bitchat init error:", err);
        Alert.alert("Error", "Failed to start Bluetooth mesh");
      }
    };
    init();
  }, [nickname]);

  const handleMessage = async (msg) => {
    if (msg.channel === ATTENDANCE_CHANNEL) {
      if (isLecturer) {
        // Lecturer: collect student responses (if public)
        if (msg.content.startsWith("PRESENT:")) {
          setResponses((prev) => [...prev, msg.sender]);
        }
      } else {
        // Student: check if message is an attendance request
        if (msg.content.startsWith("ATTENDANCE_CODE:")) {
          const code = msg.content.split(":")[1];
          Alert.alert("Attendance Request", `Code: ${code}\nMark present?`, [
            { text: "No" },
            {
              text: "Yes",
              onPress: async () => {
                // Option 1: Public reply
                await BitchatAPI.sendMessage(
                  `PRESENT:${code}`,
                  [],
                  ATTENDANCE_CHANNEL,
                );
                Alert.alert("✅", "Attendance sent!");
              },
            },
          ]);
        }
      }
    }
  };

  const startLecture = async () => {
    const code = `LEC-${Date.now().toString(36).toUpperCase()}`;
    setAttendanceCode(code);
    await BitchatAPI.sendMessage(
      `ATTENDANCE_CODE:${code}`,
      [],
      ATTENDANCE_CHANNEL,
    );
    Alert.alert("📢", `Attendance started!\nCode: ${code}`);
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <TextInput
        placeholder="Your nickname"
        value={nickname}
        onChangeText={setNickname}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button
        title={isLecturer ? "I'm a Student" : "I'm a Lecturer"}
        onPress={() => setIsLecturer(!isLecturer)}
      />

      {isLecturer ? (
        <>
          <Button title="Start Attendance" onPress={startLecture} />
          {attendanceCode ? (
            <Text style={{ marginTop: 10 }}>Code: {attendanceCode}</Text>
          ) : null}
          <Text style={{ marginTop: 20 }}>Responses: {responses.length}</Text>
          {responses.map((r, i) => (
            <Text key={i}>✅ {r}</Text>
          ))}
        </>
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Waiting for attendance request...
        </Text>
      )}
    </View>
  );
}
