import { Star, ThumbsUp } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import type { RouteReview, Tone } from "../../lib/mockRoutes";
import { color, font, radius, shadow, text, tone } from "../../lib/theme";
import { CrowdMeter } from "./CrowdMeter";

function MiniSignal({ label, value, t }: { label: string; value: string; t: Tone }) {
  return (
    <View style={[styles.chip, { backgroundColor: tone[t].bg }]}>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={[styles.chipValue, { color: tone[t].text }]}>{value}</Text>
    </View>
  );
}

export function ReviewCard({ review }: { review: RouteReview }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{review.author[0]}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.author}>{review.author}</Text>
          <Text style={styles.timeAgo}>{review.timeAgo}</Text>
        </View>
        <View style={styles.rating}>
          <Star size={14} color={color.warn} fill={color.warn} />
          <Text style={styles.ratingText}>{review.rating}</Text>
        </View>
      </View>

      <Text style={styles.comment}>{review.comment}</Text>

      <View style={styles.chips}>
        <View style={[styles.chip, { backgroundColor: color.sunken }]}>
          <Text style={styles.chipLabel}>Crowd</Text>
          <CrowdMeter level={review.crowd} size="sm" label={false} />
        </View>
        <MiniSignal
          label="Reliability"
          value={review.reliability.label}
          t={review.reliability.tone}
        />
        <MiniSignal
          label="Walkability"
          value={review.walkability.label}
          t={review.walkability.tone}
        />
      </View>

      <View style={styles.helpful}>
        <ThumbsUp size={14} color={color.textMuted} />
        <Text style={styles.helpfulText}>Helpful · {review.helpful}</Text>
      </View>
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
    gap: 12,
    ...shadow.xs,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: color.p200,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: font.sansBold, color: color.p700 },
  headerText: { flex: 1 },
  author: { fontFamily: font.sansSemiBold, color: color.textStrong },
  timeAgo: { fontSize: text.sm, color: color.textMuted, fontFamily: font.sans },
  rating: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontFamily: font.sansBold, color: color.textStrong },
  comment: {
    fontSize: text.bodyMd,
    lineHeight: text.bodyMd * 1.5,
    color: color.textBody,
    fontFamily: font.sans,
  },
  chips: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    gap: 4,
  },
  chipLabel: {
    fontSize: 10,
    fontFamily: font.sansBold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: color.textMuted,
  },
  chipValue: { fontSize: text.sm, fontFamily: font.sansBold },
  helpful: { flexDirection: "row", alignItems: "center", gap: 6 },
  helpfulText: {
    fontSize: text.sm,
    fontFamily: font.sansSemiBold,
    color: color.textMuted,
  },
});
