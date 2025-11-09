import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

const LecturerProfileScreen = ({ navigation }) => {
  const menuItems = [
    { id: 1, title: "Notification", icon: "notifications", onPress: () => {} },
    { id: 2, title: "Change Password", icon: "lock-closed", onPress: () => {} },
    { id: 3, title: "Support Center", icon: "headset", onPress: () => {} },
    {
      id: 4,
      title: "Logout",
      icon: "log-out",
      onPress: () => {
        navigation.navigate("LecturerSignIn");
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: "https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=PJ",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Professor James Judith</Text>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>ID NO: 0123456789</Text>
          </View>
          <Text style={styles.department}>BUSINESS ADMINISTRATION</Text>
          <View style={styles.qualificationBadge}>
            <Text style={styles.qualificationText}>B. Sc, M.Sc, PhD</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <Icon name={item.icon} size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Icon name="chevron-forward" size={16} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  idBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  idText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  department: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  qualificationBadge: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  qualificationText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  menuSection: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
});

export default LecturerProfileScreen;
