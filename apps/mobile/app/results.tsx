import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, ChevronLeft } from "lucide-react-native";
import { useState } from "react";
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

const FILTERS = ["Fastest", "Fewest transfers", "Cheapest", "Least crowded"];

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ dest?: string }>();
  const dest = params.dest || DEFAULT_DESTINATION;
  const [filter, setFilter] = useState(0);

  const openRoute = (id: string) =>
    router.push({ pathname: "/route/[id]", params: { id, dest } });

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View style={styles.headerRow}>
          <Pressable
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
          {FILTERS.map((label, i) => (
            <Pressable
              key={label}
              onPress={() => setFilter(i)}
              style={[styles.filterChip, i === filter && styles.filterActive]}
            >
              <Text
                style={[
                  styles.filterText,
                  i === filter && styles.filterTextActive,
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
        <Text style={styles.sectionLabel}>
          {EXACT_ROUTES.length} routes to {dest}
        </Text>
        {EXACT_ROUTES.map((route) => (
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
