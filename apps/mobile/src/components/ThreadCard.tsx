import { StyleSheet, Text, View } from "react-native";
import type { Thread } from "@komyut/shared";

export function ThreadCard({ thread }: { thread: Thread }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.category}>{thread.category.toUpperCase()}</Text>
      </View>
      <Text style={styles.title}>{thread.title}</Text>
      <Text style={styles.body} numberOfLines={3}>
        {thread.body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  header: { flexDirection: "row", marginBottom: 6 },
  category: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0a7ea4",
    backgroundColor: "#e6f4f9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  body: { fontSize: 14, color: "#555" },
});
