import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import userService from "../services/userService";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../context/LanguageContext";

export default function EcoStatsScreen() {
  const [stats, setStats] = useState<any>(null);
  const { t } = useLanguage();

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        try {
          const data = await userService.getWeeklyEnvironmentalStats();
          setStats(data);
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };

      fetchStats();
    }, [])
  );

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>{t("eco.loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LanguageSelector />
      <Text style={styles.title}>{t("eco.title")}</Text>
      <Text style={styles.motto}>
        From the Mobility Sharing team: as an incentive to promote
        sustainability, weekly rupees are granted based on your eco-friendly
        contributions.{" "}
      </Text>
      <ScrollView contentContainerStyle={styles.container}>
        <Ionicons
          name="leaf-outline"
          size={200}
          color="#00e676"
          style={styles.icon}
        />
        <Text style={styles.subtitle}>{t("eco.weekly")}</Text>

        <View style={styles.card}>
          <Text style={styles.stat}>
            👥 Avg. Passengers per Trip:{" "}
            <Text style={styles.value}>
              {stats.averagePassengersPerCompletedTrip.toFixed(2)}
            </Text>
          </Text>
          <Text style={styles.stat}>
            🧍 Confirmed Rides as Passenger:{" "}
            <Text style={styles.value}>{stats.confirmedRides}</Text>
          </Text>
          <Text style={styles.stat}>
            💰 Rupees to earn this week:{" "}
            <Text style={styles.value}>{stats.weeklyRupees} </Text>
          </Text>
          <Text style={styles.stat}>
            🌍 CO₂ Saved this Week:{" "}
            <Text style={styles.value}>{stats.co2SavedKg.toFixed(2)} kg</Text>
          </Text>
          <Text style={styles.stat}>
            ♻️ CO₂ Saved in Total:{" "}
            <Text style={styles.value}>
              {stats.co2SavedKgTotal.toFixed(2)} kg
            </Text>
          </Text>
        </View>

        <Text style={styles.motivation}>
          Keep it up! 🌟 Every ride makes a difference.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121212",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  subtitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 10,
  },

  stat: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  value: {
    fontWeight: "bold",
    color: "#4caf50",
  },
  loading: {
    color: "#ccc",
    fontSize: 18,
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
  },
  motivation: {
    fontSize: 16,
    color: "#00e676",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  icon: {
    marginBottom: 15,
  },
  motto: {
    fontSize: 16,
    color: "#888",
    marginBottom: 0,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
