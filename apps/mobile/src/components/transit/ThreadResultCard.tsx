import type { Thread, ThreadSearchResult } from "@komyut/shared";
import { ChevronRight, MessageSquare } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { color, font, radius, shadow, text } from "../../lib/theme";
import { Pill } from "../ui/Pill";
import { formatDistance } from "./distance";

const CATEGORY_STYLE: Record<Thread["category"], { bg: string; fg: string }> = {
  route: { bg: color.primarySoft, fg: color.p700 },
  terminal: { bg: color.warnBg, fg: color.warnFg },
  hazard: { bg: color.alertBg, fg: color.alert },
  walkability: { bg: color.goodBg, fg: color.good },
  general: { bg: color.sunken, fg: color.textMuted },
};

function answerLabel(count: number): string {
  if (count <= 0) return "No answers yet";
  return count === 1 ? "1 answer" : `${count} answers`;
}

/**
 * Honest proximity: we only claim what the API measured. A null distance means
 * no node on this thread's answers was near that endpoint, so we say nothing
 * rather than implying the thread covers it.
 */
function proximityHint(result: ThreadSearchResult): string | null {
  const parts: string[] = [];
  if (result.origin_distance_m !== null) {
    parts.push(`starts ${formatDistance(result.origin_distance_m)} away`);
  }
  if (result.destination_distance_m !== null) {
    parts.push(`ends ${formatDistance(result.destination_distance_m)} away`);
  }
  return parts.length > 0 ? parts.join("  ·  ") : null;
}

type Props = { result: ThreadSearchResult; onPress: () => void };

export function ThreadResultCard({ result, onPress }: Props) {
  const { thread, match } = result;
  const cat = CATEGORY_STYLE[thread.category];
  const hint = proximityHint(result);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${thread.title}. ${answerLabel(result.answer_count)}.`}
      style={({ pressed }) => [
        styles.card,
        match === "exact" && styles.exact,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.pillRow}>
        <Pill bg={cat.bg} fg={cat.fg}>
          {thread.category.toUpperCase()}
        </Pill>
        {match === "partial" && (
          <Pill bg={color.sunken} fg={color.textMuted}>
            PARTIAL MATCH
          </Pill>
        )}
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={2}>
          {thread.title}
        </Text>
        <ChevronRight size={18} color={color.n400} />
      </View>

      {thread.body.length > 0 && (
        <Text style={styles.body} numberOfLines={2}>
          {thread.body}
        </Text>
      )}

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MessageSquare size={13} color={color.textMuted} />
          <Text style={styles.metaText}>{answerLabel(result.answer_count)}</Text>
        </View>
        {hint !== null && (
          <Text style={styles.hint} numberOfLines={1}>
            {hint}
          </Text>
        )}
      </View>
    </Pressable>
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
  exact: { borderColor: color.p200 },
  pressed: { opacity: 0.9 },
  pillRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: text.h3,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  body: {
    fontSize: text.bodyMd,
    fontFamily: font.sans,
    lineHeight: text.bodyMd * 1.45,
    color: color.textBody,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: {
    fontSize: text.sm,
    fontFamily: font.sansSemiBold,
    color: color.textMuted,
  },
  hint: {
    flexShrink: 1,
    fontSize: text.sm,
    fontFamily: font.sansMedium,
    color: color.textMuted,
  },
});
