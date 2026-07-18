import type { ComposeResponse } from "@komyut/shared";
import { Sparkles } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { color, font, radius, text } from "../../lib/theme";
import { Pill } from "../ui/Pill";
import { formatDistance } from "./distance";

type ComposedRoute = ComposeResponse["route"];

function sourceLabel(threadCount: number): string {
  if (threadCount <= 0) return "community threads";
  return threadCount === 1 ? "1 community thread" : `${threadCount} community threads`;
}

type Props = { route: ComposedRoute };

/**
 * The fallback answer. This route was assembled by the server from nodes that
 * belong to *other people's* answers to *other* questions - nobody wrote it as
 * a reply to this trip. The dashed border, the pill and the copy all exist to
 * keep that distinction impossible to miss.
 */
export function ComposedRouteCard({ route }: Props) {
  const { existing, distance_m, thread_ids, steps, summary } = route.properties;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Sparkles size={16} color={color.warnFg} />
        <Text style={styles.heading}>
          {existing ? "From one community answer" : "Auto-generated route"}
        </Text>
        <Pill bg={color.warnBg} fg={color.warnFg}>
          {existing ? "NOT WRITTEN FOR YOU" : "AUTO-GENERATED"}
        </Pill>
      </View>

      <Text style={styles.disclaimer}>
        {existing
          ? `Reused from ${sourceLabel(thread_ids.length)} that already covers this trip. It was written as an answer to a different question, so double-check the details.`
          : `Stitched together from ${sourceLabel(thread_ids.length)}. No one wrote this as a single answer to your trip - treat each step as a separate tip.`}
      </Text>

      {summary.length > 0 && <Text style={styles.summary}>{summary}</Text>}

      <View style={styles.statRow}>
        <Text style={styles.statValue}>{formatDistance(distance_m)}</Text>
        <Text style={styles.statLabel}>total distance</Text>
      </View>

      {steps.length > 0 && (
        <View style={styles.steps}>
          {steps.map((step, i) => (
            <View key={step.node_id} style={styles.stepRow}>
              <View style={styles.stepIndex}>
                <Text style={styles.stepIndexText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepLabel}>{step.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.sunken,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: color.borderStrong,
    borderRadius: radius.lg,
    padding: 16,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  heading: {
    fontSize: text.bodyLg,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  disclaimer: {
    fontSize: text.sm,
    fontFamily: font.sansMedium,
    lineHeight: text.sm * 1.5,
    color: color.textBody,
  },
  summary: {
    fontSize: text.bodyMd,
    fontFamily: font.sans,
    lineHeight: text.bodyMd * 1.45,
    color: color.textBody,
  },
  statRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  statValue: {
    fontFamily: font.monoMedium,
    fontSize: text.h3,
    color: color.textStrong,
  },
  statLabel: {
    fontFamily: font.sansMedium,
    fontSize: text.sm,
    color: color.textMuted,
  },
  steps: {
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: color.borderSubtle,
    paddingTop: 12,
  },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  stepIndex: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIndexText: {
    fontFamily: font.sansBold,
    fontSize: text.xs,
    color: color.textBody,
  },
  stepLabel: {
    flex: 1,
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    lineHeight: text.bodyMd * 1.4,
    color: color.textBody,
    paddingTop: 1,
  },
});
