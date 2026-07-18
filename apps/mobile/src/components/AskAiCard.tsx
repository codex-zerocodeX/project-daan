import { useRouter } from "expo-router";
import { ChevronRight, Sparkles } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { color, font, radius, shadow, space, text } from "../lib/theme";

/**
 * Entry point to the AI thread search. Deliberately one quiet row above the
 * feed - the AI is an extra, not the main event, so it stays out of the way
 * until tapped.
 */
export function AskAiCard() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/ai")}
      accessibilityRole="button"
      accessibilityLabel="Ask AI about the community threads"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <Sparkles size={16} color={color.p600} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Ask AI</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          Search these threads in plain language
        </Text>
      </View>
      <ChevronRight size={18} color={color.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.s3,
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.p200,
    borderRadius: radius.lg,
    paddingVertical: space.s3,
    paddingHorizontal: space.s4,
    ...shadow.xs,
  },
  pressed: { opacity: 0.85 },
  icon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.primarySoft,
  },
  copy: { flex: 1, gap: 2 },
  title: {
    fontSize: text.bodyMd,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  subtitle: {
    fontSize: text.sm,
    fontFamily: font.sans,
    color: color.textMuted,
  },
});
