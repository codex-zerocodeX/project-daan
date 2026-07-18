import type { LatLng, ThreadSearchResult } from "@komyut/shared";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, ChevronLeft } from "lucide-react-native";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AskPrompt } from "../src/components/transit/AskPrompt";
import { ComposedRouteCard } from "../src/components/transit/ComposedRouteCard";
import { ThreadResultCard } from "../src/components/transit/ThreadResultCard";
import { Button } from "../src/components/ui/Button";
import { useComposeRoute } from "../src/hooks/useComposeRoute";
import { useThreadSearch } from "../src/hooks/useThreadSearch";
import { color, font, radius, text } from "../src/lib/theme";

/** Expo Router hands params back as `string | string[]` when a key repeats. */
function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseCoord(value: string | undefined, max: number): number | null {
  if (value === undefined || value.trim() === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < -max || n > max) return null;
  return n;
}

/** `null` whenever either half is missing or unparseable - never a NaN LatLng. */
function toLatLng(
  rawLat: string | undefined,
  rawLng: string | undefined,
): LatLng | null {
  const lat = parseCoord(rawLat, 90);
  const lng = parseCoord(rawLng, 180);
  if (lat === null || lng === null) return null;
  return { lat, lng };
}

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    originName?: string;
    destName?: string;
    oLat?: string;
    oLng?: string;
    dLat?: string;
    dLng?: string;
  }>();

  const originName = firstParam(params.originName) ?? "Your location";
  const destName = firstParam(params.destName) ?? "Destination";

  const origin = useMemo(
    () => toLatLng(firstParam(params.oLat), firstParam(params.oLng)),
    [params.oLat, params.oLng],
  );
  const destination = useMemo(
    () => toLatLng(firstParam(params.dLat), firstParam(params.dLng)),
    [params.dLat, params.dLng],
  );
  const coordsOk = origin !== null && destination !== null;

  const threads = useThreadSearch(origin, destination);

  const { exact, partial } = useMemo(() => {
    const results: ThreadSearchResult[] = threads.data ?? [];
    return {
      exact: results.filter((r) => r.match === "exact"),
      partial: results.filter((r) => r.match === "partial"),
    };
  }, [threads.data]);

  // Only stitch a route once we know the community has no direct answer.
  // Firing this eagerly would present a machine-made route next to real ones.
  const composeEnabled = threads.isSuccess && exact.length === 0;
  const compose = useComposeRoute(origin, destination, composeEnabled);

  const openThread = (id: string) =>
    router.push({ pathname: "/thread/[id]", params: { id } });

  const openAsk = () =>
    router.push({ pathname: "/ask", params: { originName, destName } });

  // "Weak" means the community has no direct answer, so asking is the strongest
  // action left on the screen - even when partials or a stitched route exist.
  const resultsAreWeak = exact.length === 0;

  const header = (
    <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <ChevronLeft size={20} color={color.textBody} />
        </Pressable>
        <View style={styles.headerText}>
          <View style={styles.originRow}>
            <Text style={styles.origin} numberOfLines={1}>
              {originName}
            </Text>
            <ArrowRight size={12} color={color.textMuted} />
          </View>
          <Text style={styles.dest} numberOfLines={1}>
            {destName}
          </Text>
        </View>
      </View>
    </View>
  );

  if (!coordsOk) {
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.center}>
          <Text style={styles.stateTitle}>
            We couldn&apos;t understand that place
          </Text>
          <Text style={styles.stateBody}>
            One of the pins is missing or invalid, so we can&apos;t search for
            trips between them. Try picking the places again.
          </Text>
          <View style={styles.stateActions}>
            <Button variant="outline" onPress={() => router.back()}>
              Back to search
            </Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {header}

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {threads.isPending && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={color.p500} />
            <Text style={styles.stateBody}>Looking for community answers…</Text>
          </View>
        )}

        {threads.isError && (
          <View style={styles.center}>
            <Text style={styles.stateTitle}>Couldn&apos;t load threads</Text>
            <Text style={styles.errorText}>{threads.error.message}</Text>
            <View style={styles.stateActions}>
              <Button variant="outline" onPress={() => threads.refetch()}>
                Retry
              </Button>
            </View>
          </View>
        )}

        {threads.isSuccess && (
          <>
            {exact.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Answers for this trip</Text>
                <Text style={styles.sectionNote}>
                  Commuters answered this exact origin and destination.
                </Text>
                {exact.map((result) => (
                  <ThreadResultCard
                    key={result.thread.id}
                    result={result}
                    onPress={() => openThread(result.thread.id)}
                  />
                ))}
              </View>
            )}

            {partial.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Related threads nearby</Text>
                <Text style={styles.sectionNote}>
                  These cover only part of your trip. They are not answers to
                  your question — read the distances before you rely on them.
                </Text>
                {partial.map((result) => (
                  <ThreadResultCard
                    key={result.thread.id}
                    result={result}
                    onPress={() => openThread(result.thread.id)}
                  />
                ))}
              </View>
            )}

            {composeEnabled && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Generated from threads</Text>

                {compose.isPending && (
                  <View style={styles.inlineState}>
                    <ActivityIndicator color={color.p500} />
                    <Text style={styles.stateBody}>
                      Stitching a route from other threads…
                    </Text>
                  </View>
                )}

                {compose.isError && (
                  <View style={styles.inlineState}>
                    <Text style={styles.errorText}>
                      {compose.error.message}
                    </Text>
                    <Button variant="outline" onPress={() => compose.refetch()}>
                      Retry
                    </Button>
                  </View>
                )}

                {compose.isSuccess && compose.data !== null && (
                  <ComposedRouteCard route={compose.data} />
                )}

                {compose.isSuccess && compose.data === null && (
                  <View style={styles.inlineState}>
                    <Text style={styles.stateBody}>
                      {partial.length > 0
                        ? "We couldn't stitch a full route out of the nearby threads either."
                        : "No community nodes connect these two places yet."}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <AskPrompt prominent={resultsAreWeak} onPress={openAsk} />
          </>
        )}
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
    flexShrink: 1,
    fontSize: text.sm,
    color: color.textMuted,
    fontFamily: font.sansSemiBold,
  },
  dest: {
    fontSize: text.h3,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  list: { padding: 16, gap: 20, flexGrow: 1 },
  section: { gap: 12 },
  sectionLabel: {
    fontSize: text.xs,
    fontFamily: font.sansBold,
    textTransform: "uppercase",
    letterSpacing: 0.44,
    color: color.textMuted,
  },
  sectionNote: {
    fontSize: text.sm,
    fontFamily: font.sansMedium,
    lineHeight: text.sm * 1.45,
    color: color.textMuted,
    marginTop: -6,
  },
  center: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 10,
  },
  inlineState: {
    alignItems: "center",
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    borderRadius: radius.lg,
    padding: 20,
    gap: 12,
  },
  stateTitle: {
    fontSize: text.h3,
    fontFamily: font.sansBold,
    color: color.textStrong,
    textAlign: "center",
  },
  stateBody: {
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    lineHeight: text.bodyMd * 1.45,
    color: color.textMuted,
    textAlign: "center",
  },
  stateActions: { marginTop: 4 },
  errorText: {
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    color: color.alert,
    textAlign: "center",
  },
});
