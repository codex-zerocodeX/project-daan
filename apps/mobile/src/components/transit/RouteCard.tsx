import { Check, ChevronRight, Repeat, Star } from "lucide-react-native";
import { Fragment } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { RouteSummary } from "../../lib/mockRoutes";
import { color, font, radius, shadow, text, tone } from "../../lib/theme";
import { Pill } from "../ui/Pill";
import { CrowdMeter } from "./CrowdMeter";
import { ModeBadge } from "./ModeBadge";

type Props = { route: RouteSummary; onPress: () => void };

export function RouteCard({ route, onPress }: Props) {
  const rel = tone[route.reliabilityTone];
  return (
    <Pressable
      accessibilityLabel={`${route.duration}, ${route.fare}, ${route.reliability}, rated ${route.score}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        route.recommended && styles.recommended,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.legs}>
          {route.legs.map((leg, i) => (
            <Fragment key={i}>
              {leg.mode === "transfer" ? (
                <Repeat size={14} color={color.textMuted} />
              ) : (
                <ModeBadge mode={leg.mode} label={leg.label} />
              )}
              {i < route.legs.length - 1 && leg.mode !== "transfer" && (
                <Text style={styles.chevron}>›</Text>
              )}
            </Fragment>
          ))}
        </View>
        <View style={styles.fareBox}>
          <Text style={styles.duration}>{route.duration}</Text>
          <Text style={styles.fare}>{route.fare}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.signalRow}>
        <CrowdMeter level={route.crowd} size="sm" />
        <View style={styles.relRow}>
          <View style={[styles.relDot, { backgroundColor: rel.fg }]} />
          <Text style={[styles.relText, { color: rel.text }]}>
            {route.reliability}
          </Text>
        </View>
        <View style={styles.scoreRow}>
          <Star size={14} color={color.warn} fill={color.warn} />
          <Text style={styles.score}>{route.score}</Text>
          <Text style={styles.scoreCount}>({route.reviewCount})</Text>
        </View>
      </View>

      {(route.recommended || !route.exact) && (
        <View style={styles.pillRow}>
          {route.recommended && (
            <Pill bg={color.primarySoft} fg={color.p700}>
              Best balance
            </Pill>
          )}
          {!route.exact && route.near && (
            <Pill bg={color.sunken} fg={color.textMuted}>
              {route.near}
            </Pill>
          )}
        </View>
      )}

      {route.recommended ? (
        <View style={styles.reasonRow}>
          <Check size={15} color={color.p700} />
          <Text style={styles.reasonText}>
            Low fare · {route.reliability.toLowerCase()} · {route.walk} walk
          </Text>
          <ChevronRight size={18} color={color.p600} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: color.borderSubtle,
    paddingVertical: 16,
    paddingHorizontal: 4,
    gap: 12,
  },
  recommended: {
    backgroundColor: color.card,
    borderBottomWidth: 0,
    borderRadius: radius.xl,
    padding: 16,
    ...shadow.card,
  },
  pressed: { opacity: 0.9 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  legs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  chevron: { color: color.n400, fontSize: text.bodyMd },
  fareBox: { alignItems: "flex-end" },
  duration: { fontFamily: font.monoMedium, fontSize: 22, color: color.textStrong },
  fare: { fontFamily: font.mono, fontSize: text.sm, color: color.textMuted },
  divider: { height: 1, backgroundColor: color.borderSubtle },
  signalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  relRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  relDot: { width: 7, height: 7, borderRadius: 4 },
  relText: { fontSize: text.sm, fontFamily: font.sansSemiBold },
  scoreRow: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  score: {
    fontSize: text.sm,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  scoreCount: {
    fontSize: text.sm,
    fontFamily: font.sansMedium,
    color: color.textMuted,
  },
  pillRow: { flexDirection: "row", gap: 6 },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingTop: 2,
  },
  reasonText: {
    flex: 1,
    fontSize: text.sm,
    lineHeight: text.sm * 1.35,
    fontFamily: font.sansSemiBold,
    color: color.p700,
  },
});
