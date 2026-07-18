import type { Thread } from "@alitaptap/shared";
import { Image, StyleSheet, Text, View } from "react-native";
import { color, font, radius, shadow, text } from "../lib/theme";
import { Pill } from "./ui/Pill";

const CATEGORY_STYLE: Record<Thread["category"], { bg: string; fg: string }> = {
  route: { bg: color.primarySoft, fg: color.p700 },
  terminal: { bg: color.warnBg, fg: color.warnFg },
  hazard: { bg: color.alertBg, fg: color.alert },
  walkability: { bg: color.goodBg, fg: color.good },
  general: { bg: color.sunken, fg: color.textMuted },
};

export function ThreadCard({ thread }: { thread: Thread }) {
  const cat = CATEGORY_STYLE[thread.category];
  return (
    <View style={styles.card}>
      <Pill bg={cat.bg} fg={cat.fg}>
        {thread.category.toUpperCase()}
      </Pill>
      <Text style={styles.title}>{thread.title}</Text>
      <Text style={styles.body} numberOfLines={3}>
        {thread.body}
      </Text>
      {thread.image_url && (
        <Image
          source={{ uri: thread.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    borderRadius: radius.lg,
    padding: 16,
    gap: 8,
    ...shadow.card,
  },
  title: {
    fontSize: text.h3,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  body: {
    fontSize: text.bodyMd,
    fontFamily: font.sans,
    lineHeight: text.bodyMd * 1.5,
    color: color.textBody,
  },
  image: {
    height: 160,
    borderRadius: radius.md,
    marginTop: 4,
    backgroundColor: color.sunken,
  },
});
