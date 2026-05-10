import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { Language } from "../i18n/translations";

const options: Language[] = ["en", "es"];

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => setLanguage(option)}
          style={[styles.option, language === option && styles.activeOption]}
        >
          <Text style={[styles.text, language === option && styles.activeText]}>
            {option === "en" ? t("language.english") : t("language.spanish")}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 3,
    marginBottom: 18,
  },
  option: {
    minWidth: 84,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  activeOption: {
    backgroundColor: "#fff",
  },
  text: {
    color: "#bbb",
    fontWeight: "700",
  },
  activeText: {
    color: "#121212",
  },
});
