import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { logout } from "../services/authService";
import { useEffect, useState } from "react";
import userService from "../services/userService";
import { UserModel } from "../models/Users";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Alert } from "react-native";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../context/LanguageContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const [user, setUser] = useState<UserModel | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const fetchUser = async () => {
    try {
      const fetchedUser = await userService.getMyUser();
      setUser(fetchedUser);
      setFormData({
        name: fetchedUser.name,
        email: fetchedUser.email,
        username: fetchedUser.username,
        password: "",
      });
    } catch (error) {
      console.error("Error while fetching user:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleUpdate = async () => {
    if (!formData.password.trim()) {
      Alert.alert(
        t("profile.passwordRequired"),
        t("profile.passwordRequiredMessage")
      );
      return;
    }

    try {
      const updatedUser = await userService.updateMyUser(formData);
      setUser(updatedUser);
      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        password: "",
      });

      Alert.alert(
        "Success",
        t("profile.updateSuccess"),
        [
          {
            text: "OK",
            onPress: async () => {
              await handleLogout();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <View style={styles.container}>
      <LanguageSelector />
      <Text style={styles.title}>{t("profile.title")}</Text>
      {user?.rating != null && (
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ Rating: {user.rating}/5</Text>
        </View>
      )}
      {user?.ecoRank && (
        <View style={styles.ecoRankContainer}>
          <Text style={styles.ecoRankText}>
            🌿 EcoRank: {user.ecoRank.name}
          </Text>
        </View>
      )}
      {user && (
        <View style={styles.profileContainer}>
          <Text style={styles.label}>{t("profile.nameLabel")}</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            placeholder={t("auth.name")}
            placeholderTextColor="#aaa"
            maxLength={100}
          />
          <Text style={styles.label}>{t("profile.emailLabel")}</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder={t("auth.email")}
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            maxLength={150}
          />
          <Text style={styles.label}>{t("profile.usernameLabel")}</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
            placeholder={t("auth.username")}
            placeholderTextColor="#aaa"
            maxLength={15}
          />
          <Text style={styles.label}>{t("profile.passwordLabel")}</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            placeholder={t("auth.password")}
            placeholderTextColor="#aaa"
            secureTextEntry
          />
          <Text style={styles.label}>{t("profile.wallet")}</Text>
          <View style={styles.readonlyContainer}>
            <Text style={styles.readonlyText}>{user.rupeeWallet}</Text>
          </View>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>{t("profile.logout")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.buttonText}>{t("profile.update")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  profileContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  readonlyContainer: {
    width: "100%",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  readonlyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  updateButton: {
    marginTop: 10,
    backgroundColor: "#5bc0de",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingContainer: {
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 20,
  },

  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f39c12",
  },
  ecoRankContainer: {
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#e0f7ec",
    borderRadius: 12,
  },

  ecoRankText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
});
