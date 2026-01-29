import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
  const menuItems = [
    {
      icon: "notifications-outline",
      title: "Notification",
      screen: "Notification",
    },
    {
      icon: "lock-closed-outline",
      title: "Change Password",
      screen: "ChangePassword",
    },
    {
      icon: "help-circle-outline",
      title: "Support Center",
      screen: "SupportCenter",
    },
    {
      icon: "log-out-outline",
      title: "Logout",
      screen: "Splash",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: "/young-woman-profile.png" }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>Raymond Joe</Text>
          <Text style={styles.matricNumber}>MATRIC NO: 2023/09/24356</Text>
          <Text style={styles.department}>COMPUTER SCIENCE</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>300 LEVEL</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Icon name={item.icon} size={20} color="#8B5CF6" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#6b7280" />
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
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    paddingTop: 48,
  },
  headerTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 26,
    paddingHorizontal: 14,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ec4899",
    padding: 3,
    marginBottom: 12,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 47,
  },
  profileName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
    textAlign: "center",
  },
  matricNumber: {
    fontSize: 11,
    color: "#8B5CF6",
    marginBottom: 3,
  },
  department: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelText: {
    color: "white",
    fontSize: 9,
    fontWeight: "600",
  },
  menuSection: {
    paddingHorizontal: 14,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1f2937",
  },
});

export default ProfileScreen;
