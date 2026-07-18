import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Bus,
  ChevronLeft,
  Circle,
  Heart,
  MapPin,
  Navigation,
  Plus,
  Star,
} from "lucide-react-native";
import { Fragment, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlitaptapMap } from "../../src/components/AlitaptapMap";
import { CrowdMeter } from "../../src/components/transit/CrowdMeter";
import { ReviewCard } from "../../src/components/transit/ReviewCard";
import { SignalBox } from "../../src/components/transit/SignalBox";
import { Button } from "../../src/components/ui/Button";
import { Pill } from "../../src/components/ui/Pill";
import {
  DEFAULT_DESTINATION,
  EXACT_ROUTES,
  MOCK_REVIEWS,
  findRoute,
  type TripStep,
} from "../../src/lib/mockRoutes";
import { color, font, radius, shadow, text, tone } from "../../src/lib/theme";

function stepIcon(kind: TripStep["kind"]) {
  if (kind === "origin")
    return <Circle size={14} color={color.good} fill={color.good} />;
  if (kind === "bus") return <Bus size={14} color={color.p500} />;
  return <MapPin size={14} color={color.alert} />;
}

export default function RouteDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; dest?: string }>();
  const dest = params.dest || DEFAULT_DESTINATION;
  const route = (params.id && findRoute(params.id)) || EXACT_ROUTES[0];
  const rel = tone[route.reliabilityTone];
  const scrollRef = useRef<ScrollView>(null);
  const [saved, setSaved] = useState(false);
  const [tripStarted, setTripStarted] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.mapBlock}>
        <AlitaptapMap />
        <Pressable
          accessibilityLabel="Back to route options"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.roundBtn,
            { top: insets.top + 10, left: 14 },
            pressed && styles.pressed,
          ]}
        >
          <ChevronLeft size={20} color={color.textBody} />
        </Pressable>
        <Pressable
          accessibilityLabel={saved ? "Remove saved route" : "Save route"}
          accessibilityRole="button"
          accessibilityState={{ selected: saved }}
          onPress={() => setSaved((value) => !value)}
          style={({ pressed }) => [
            styles.roundBtn,
            { top: insets.top + 10, right: 14 },
            saved && styles.savedBtn,
            pressed && styles.pressed,
          ]}
        >
          <Heart
            size={18}
            color={saved ? color.alert : color.p600}
            fill={saved ? color.alert : "transparent"}
          />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <Text style={styles.toLabel}>To {dest}</Text>
              {route.recommended && (
                <Pill bg={color.primarySoft} fg={color.p700}>
                  Best balance
                </Pill>
              )}
            </View>
            <View style={styles.fareBox}>
              <Text style={styles.duration}>{route.duration}</Text>
              <Text style={styles.fare}>{route.fare}</Text>
            </View>
          </View>
          <View style={styles.signalRow}>
            <SignalBox label="Crowd" bg="transparent">
              <CrowdMeter level={route.crowd} size="sm" label={false} />
            </SignalBox>
            <View style={styles.signalDivider} />
            <SignalBox
              label="Reliability"
              value={route.reliability}
              valueColor={rel.text}
              bg="transparent"
            />
            <View style={styles.signalDivider} />
            <SignalBox label="Walk" value={route.walk} bg="transparent" />
          </View>
        </View>

        <View style={styles.tripSection}>
          <View style={styles.tripHeading}>
            <View>
              <Text style={styles.tripEyebrow}>
                {route.steps.length} checkpoints
              </Text>
              <Text style={styles.tripTitle}>Follow the trip</Text>
            </View>
            <View
              style={[styles.readyMark, tripStarted && styles.progressMark]}
            >
              <Text
                style={[styles.readyText, tripStarted && styles.progressText]}
              >
                {tripStarted ? "In progress" : "Ready"}
              </Text>
            </View>
          </View>
          <View style={styles.timeline}>
            {route.steps.map((step, i) => (
              <Fragment key={i}>
                <View style={styles.stepRow}>
                  <View style={styles.stepRail}>
                    <View
                      style={[
                        styles.stepIcon,
                        tripStarted && i === 0 && styles.stepIconActive,
                      ]}
                    >
                      {stepIcon(step.kind)}
                    </View>
                    {i < route.steps.length - 1 && (
                      <View style={styles.stepLine} />
                    )}
                  </View>
                  <View
                    style={[
                      styles.stepBody,
                      i < route.steps.length - 1 && styles.stepBodySpaced,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepTitle,
                        tripStarted && i === 0 && styles.stepTitleActive,
                      ]}
                    >
                      {step.title || dest}
                    </Text>
                    <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                    {tripStarted && i === 0 && (
                      <Text style={styles.currentStep}>Current checkpoint</Text>
                    )}
                  </View>
                </View>
              </Fragment>
            ))}
          </View>
        </View>

        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Rider reviews</Text>
          <View style={styles.reviewScore}>
            <Star size={16} color={color.warn} fill={color.warn} />
            <Text style={styles.reviewScoreText}>{route.score}</Text>
            <Text style={styles.reviewCount}>· {route.reviewCount}</Text>
          </View>
        </View>
        {MOCK_REVIEWS.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 14 }]}>
        <Button
          variant="outline"
          icon={<Plus size={18} color={color.textStrong} />}
          onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          Review
        </Button>
        <Button
          full
          icon={<Navigation size={18} color={color.textOnPrimary} />}
          onPress={() => setTripStarted(true)}
        >
          {tripStarted ? "Trip in progress" : "Start trip"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgApp },
  mapBlock: { height: 200 },
  roundBtn: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.sm,
  },
  pressed: { opacity: 0.7 },
  savedBtn: { backgroundColor: color.alertBg },
  sheet: { flex: 1, marginTop: -24 },
  sheetContent: { padding: 16, gap: 14, paddingBottom: 24 },
  heroCard: {
    backgroundColor: color.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    padding: 18,
    gap: 14,
    ...shadow.lifted,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroLeft: { gap: 6 },
  toLabel: {
    fontSize: text.xs,
    fontFamily: font.sansBold,
    textTransform: "uppercase",
    letterSpacing: 0.44,
    color: color.textMuted,
  },
  fareBox: { alignItems: "flex-end" },
  duration: { fontFamily: font.monoMedium, fontSize: 28, color: color.textStrong },
  fare: { fontFamily: font.mono, fontSize: text.bodyMd, color: color.textMuted },
  signalRow: { flexDirection: "row", gap: 10 },
  signalDivider: {
    width: 1,
    marginVertical: 8,
    backgroundColor: color.borderSubtle,
  },
  tripSection: { paddingVertical: 8, paddingHorizontal: 4 },
  tripHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tripEyebrow: {
    fontSize: text.xs,
    fontFamily: font.sansBold,
    textTransform: "uppercase",
    letterSpacing: 0.44,
    color: color.p600,
    marginBottom: 3,
  },
  tripTitle: {
    fontSize: text.h3,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  readyMark: {
    borderRadius: radius.pill,
    backgroundColor: color.goodBg,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  readyText: {
    fontSize: text.xs,
    fontFamily: font.sansBold,
    color: color.accent600,
  },
  progressMark: { backgroundColor: color.primarySoft },
  progressText: { color: color.p700 },
  timeline: { marginTop: 14 },
  stepRow: { flexDirection: "row", gap: 12 },
  stepRail: { alignItems: "center" },
  stepIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: color.sunken,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIconActive: {
    backgroundColor: color.primarySoft,
    borderWidth: 2,
    borderColor: color.p400,
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 22,
    backgroundColor: color.p200,
  },
  stepBody: { flex: 1 },
  stepBodySpaced: { paddingBottom: 18 },
  stepTitle: {
    fontSize: text.bodyMd,
    fontFamily: font.sansSemiBold,
    color: color.textStrong,
  },
  stepTitleActive: { color: color.p700 },
  stepSubtitle: {
    fontSize: text.sm,
    fontFamily: font.sans,
    color: color.textMuted,
    marginTop: 2,
  },
  currentStep: {
    marginTop: 5,
    fontSize: text.xs,
    fontFamily: font.sansBold,
    color: color.p600,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewTitle: {
    fontSize: text.h2,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  reviewScore: { flexDirection: "row", alignItems: "center", gap: 5 },
  reviewScoreText: { fontFamily: font.sansBold, color: color.textStrong },
  reviewCount: {
    fontFamily: font.sansMedium,
    color: color.textMuted,
    fontSize: text.sm,
  },
  actionBar: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: color.borderSubtle,
    backgroundColor: color.card,
  },
});
