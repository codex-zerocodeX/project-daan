import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, ChevronLeft, Sparkles } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteCard } from "../src/components/transit/RouteCard";
import {
  DEFAULT_DESTINATION,
  EXACT_ROUTES,
  MOCK_ORIGIN,
  SIMILAR_ROUTES,
} from "../src/lib/mockRoutes";
import { color, font, radius, text } from "../src/lib/theme";

const filterOption = [
  "Best match",
  "Fastest",
  "Fewest transfers",
  "Cheapest",
  "Least crowded",
] as const;

type FilterOption = (typeof filterOption)[number];

function numericValue(value: string) {
  return Number(value.replace(/[^0-9.]/g, ""));
}

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ dest?: string }>();
  const dest = params.dest || DEFAULT_DESTINATION;
  const [filter, setFilter] = useState<FilterOption>("Best match");

  const exactRoute = useMemo(() => {
    const route = [...EXACT_ROUTES];

    if (filter === "Fastest")
      return route.sort(
        (first, second) =>
          numericValue(first.duration) - numericValue(second.duration),
      );
    if (filter === "Fewest transfers")
      return route.sort(
        (first, second) =>
          first.legs.filter((leg) => leg.mode === "transfer").length -
          second.legs.filter((leg) => leg.mode === "transfer").length,
      );
    if (filter === "Cheapest")
      return route.sort(
        (first, second) => numericValue(first.fare) - numericValue(second.fare),
      );
    if (filter === "Least crowded")
      return route.sort((first, second) => first.crowd - second.crowd);

    return route.sort(
      (first, second) => Number(second.recommended) - Number(first.recommended),
    );
  }, [filter]);

  const recommendedRoute = EXACT_ROUTES.find((route) => route.recommended)!;
  const fastestRoute = [...EXACT_ROUTES].sort(
    (first, second) =>
      numericValue(first.duration) - numericValue(second.duration),
  )[0];
  const minuteDifference =
    numericValue(recommendedRoute.duration) - numericValue(fastestRoute.duration);
  const fareDifference =
    numericValue(fastestRoute.fare) - numericValue(recommendedRoute.fare);

  const openRoute = (id: string) =>
    router.push({ pathname: "/route/[id]", params: { id, dest } });

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View style={styles.headerRow}>
          <Pressable
            accessibilityLabel="Back to trip planner"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          >
            <ChevronLeft size={20} color={color.textBody} />
          </Pressable>
          <View style={styles.headerText}>
            <View style={styles.originRow}>
              <Text style={styles.origin}>{MOCK_ORIGIN}</Text>
              <ArrowRight size={12} color={color.textMuted} />
            </View>
            <Text style={styles.dest} numberOfLines={1}>
              {dest}
            </Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filterOption.map((label) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityState={{ selected: label === filter }}
              onPress={() => setFilter(label)}
              style={[
                styles.filterChip,
                label === filter && styles.filterActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  label === filter && styles.filterTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.decisionIntro}>
          <View style={styles.decisionIcon}>
            <Sparkles size={18} color={color.p700} />
          </View>
          <View style={styles.decisionCopy}>
            <Text style={styles.decisionTitle}>Pick your trade-off</Text>
            <Text style={styles.decisionText}>
              Best balance saves ₱{fareDifference}; fastest saves {minuteDifference} min.
            </Text>
          </View>
        </View>
        <Text style={styles.sectionLabel}>
          {EXACT_ROUTES.length} routes · sorted by {filter.toLowerCase()}
        </Text>
        {exactRoute.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            onPress={() => openRoute(route.id)}
          />
        ))}

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>No exact match nearby?</Text>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.fallbackNote}>
          <Text style={styles.fallbackText}>
            Same start, nearby drop-offs. These reviews come from routes ending
            close to your destination.
          </Text>
        </View>
        {SIMILAR_ROUTES.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            onPress={() => openRoute(route.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgApp },
  header: {
    backgroundColor: color.card,
    borderBottomWidth: 1,
    borderBottomColor: color.borderSubtle,
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    backgroundColor: color.card,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.7 },
  headerText: { flex: 1 },
  originRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  origin: {
    fontSize: text.sm,
    color: color.textMuted,
    fontFamily: font.sansSemiBold,
  },
  dest: {
    fontSize: text.h3,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  filterRow: { gap: 8 },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: color.sunken,
  },
  filterActive: { backgroundColor: color.p500 },
  filterText: {
    fontSize: text.sm,
    fontFamily: font.sansSemiBold,
    color: color.textBody,
  },
  filterTextActive: { color: color.textOnPrimary },
  list: { padding: 16, gap: 12 },
  decisionIntro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  decisionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: color.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  decisionCopy: { flex: 1, gap: 2 },
  decisionTitle: {
    fontSize: text.bodyLg,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  decisionText: {
    fontSize: text.sm,
    lineHeight: text.sm * 1.4,
    fontFamily: font.sansMedium,
    color: color.textMuted,
  },
  sectionLabel: {
    fontSize: text.xs,
    fontFamily: font.sansBold,
    textTransform: "uppercase",
    letterSpacing: 0.44,
    color: color.textMuted,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
    marginBottom: 2,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: color.borderSubtle },
  dividerText: {
    fontSize: text.sm,
    fontFamily: font.sansSemiBold,
    color: color.textMuted,
  },
  fallbackNote: {
    backgroundColor: color.primarySoft,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  fallbackText: {
    fontSize: text.sm,
    fontFamily: font.sansMedium,
    color: color.p700,
    lineHeight: text.sm * 1.4,
  },
});
