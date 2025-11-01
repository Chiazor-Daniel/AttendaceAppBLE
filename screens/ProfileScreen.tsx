import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from "react-native"
import { Ionicons as Icon } from '@expo/vector-icons'

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
  ]

  return (
    <SafeAreaView style={styles.container}>
     

      <View style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: "/young-woman-profile.png" }} style={styles.profileImage} />
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
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => navigation.navigate(item.screen)}>
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
  )
}

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
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#ec4899",
    padding: 4,
    marginBottom: 20,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 56,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  matricNumber: {
    fontSize: 12,
    color: "#8B5CF6",
    marginBottom: 4,
  },
  department: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
})

export default ProfileScreen
