import { useRouter } from "expo-router";
import {
  Circle,
  Clock,
  ChevronRight,
  MapPin,
  Navigation,
  Star,
} from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlitaptapMap } from "../../src/components/AlitaptapMap";
import { Button } from "../../src/components/ui/Button";
import { DEFAULT_DESTINATION, MOCK_ORIGIN } from "../../src/lib/mockRoutes";
import { color, font, radius, shadow, text } from "../../src/lib/theme";

const savedPlace = ["Home", "Work", "Gateway Mall"];
const recentPlace = ["Ortigas Center", "BGC Bus Stop"];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [destination, setDestination] = useState("");

  const openRoute = (place: string) =>
    router.push({ pathname: "/results", params: { dest: place } });

  return (
    <View style={styles.container}>
      <View style={styles.mapBlock}>
        <AlitaptapMap />
        <View style={styles.mapWash} />
        <View style={styles.mapScrim} />
        <View style={[styles.mapHeader, { top: insets.top + 10 }]}>
          <View>
            <Text style={styles.brandName}>Alitaptap · Metro Manila</Text>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.headline}>Where to today?</Text>
          </View>
          <Pressable
            accessibilityLabel="Open profile"
            onPress={() => router.push("/profile")}
            style={({ pressed }) => [
              styles.avatar,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.avatarText}>A</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.journeyPanel}>
          <View style={styles.locationStack}>
            <View style={styles.originRow}>
              <View style={styles.locationMark}>
                <Circle size={11} color={color.good} fill={color.good} />
              </View>
              <View style={styles.locationCopy}>
                <Text style={styles.locationLabel}>Starting from</Text>
                <Text style={styles.originText}>{MOCK_ORIGIN}</Text>
              </View>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.destRow}>
              <View style={styles.locationMark}>
                <MapPin size={17} color={color.p500} />
              </View>
              <TextInput
                accessibilityLabel="Destination"
                value={destination}
                onChangeText={setDestination}
                placeholder="Where do you want to go?"
                placeholderTextColor={color.textMuted}
                style={styles.destInput}
                returnKeyType="search"
                onSubmitEditing={() =>
                  openRoute(destination || DEFAULT_DESTINATION)
                }
              />
            </View>
          </View>
          <Button
            size="lg"
            full
            icon={<Navigation size={18} color={color.textOnPrimary} />}
            onPress={() => openRoute(destination || DEFAULT_DESTINATION)}
          >
            Find routes
          </Button>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick places</Text>
          <Text style={styles.sectionHint}>One tap away</Text>
        </View>
        <View style={styles.shortcutRow}>
          {savedPlace.map((place) => (
            <Pressable
              key={place}
              accessibilityLabel={`Find routes to ${place}`}
              onPress={() => openRoute(place)}
              style={({ pressed }) => [
                styles.shortcut,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.shortcutIcon}>
                <Star size={15} color={color.warnFg} fill={color.warn} />
              </View>
              <Text numberOfLines={2} style={styles.shortcutText}>
                {place}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.sectionHeader, styles.recentHeader]}>
          <Text style={styles.sectionTitle}>Recent</Text>
        </View>
        {recentPlace.map((place, index) => (
          <Pressable
            key={place}
            accessibilityLabel={`Find routes to ${place}`}
            onPress={() => openRoute(place)}
            style={({ pressed }) => [
              styles.recentRow,
              index < recentPlace.length - 1 && styles.recentDivider,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.recentIcon}>
              <Clock size={16} color={color.p600} />
            </View>
            <Text style={styles.recentText}>{place}</Text>
            <ChevronRight size={18} color={color.n400} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgApp },
  mapBlock: { height: 340 },
  mapWash: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: "none",
    backgroundColor: "rgba(229, 248, 250, 0.24)",
  },
  mapScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 118,
    pointerEvents: "none",
    backgroundColor: "rgba(247, 251, 252, 0.78)",
  },
  mapHeader: {
    position: "absolute",
    left: 14,
    right: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: text.sm,
    color: color.textMuted,
    fontFamily: font.sansSemiBold,
  },
  brandName: {
    fontSize: text.xs,
    color: color.brandTeal,
    fontFamily: font.sansExtraBold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  headline: {
    fontSize: text.h2,
    fontFamily: font.sansExtraBold,
    color: color.textStrong,
    letterSpacing: -0.4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.xs,
  },
  avatarText: { fontFamily: font.sansBold, color: color.p600 },
  sheet: { flex: 1, marginTop: -40 },
  sheetContent: { padding: 16, paddingBottom: 32, gap: 12 },
  journeyPanel: {
    backgroundColor: color.card,
    borderRadius: radius.xl,
    padding: 16,
    gap: 12,
    ...shadow.lifted,
  },
  locationStack: {
    borderRadius: radius.lg,
    backgroundColor: color.sunken,
    overflow: "hidden",
  },
  originRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 58,
    paddingHorizontal: 14,
  },
  locationMark: { width: 28, alignItems: "flex-start" },
  locationCopy: { flex: 1, gap: 2 },
  locationLabel: {
    fontSize: text.xs,
    fontFamily: font.sansBold,
    color: color.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.44,
  },
  originText: {
    fontSize: text.bodyMd,
    fontFamily: font.sansSemiBold,
    color: color.textStrong,
  },
  locationDivider: {
    height: 1,
    marginLeft: 42,
    backgroundColor: color.borderSubtle,
  },
  destRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 58,
    paddingHorizontal: 14,
  },
  destInput: {
    flex: 1,
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    color: color.textStrong,
    paddingVertical: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: text.bodyLg,
    fontFamily: font.sansBold,
    color: color.textStrong,
  },
  sectionHint: {
    fontSize: text.sm,
    fontFamily: font.sansMedium,
    color: color.textMuted,
  },
  shortcutRow: { flexDirection: "row", gap: 8 },
  shortcut: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    gap: 7,
    paddingVertical: 6,
  },
  shortcutIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: color.warnBg,
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutText: {
    minHeight: 34,
    textAlign: "center",
    fontSize: text.sm,
    lineHeight: text.sm * 1.3,
    fontFamily: font.sansSemiBold,
    color: color.textBody,
  },
  recentHeader: { marginTop: 8 },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 54,
    paddingHorizontal: 2,
  },
  recentDivider: {
    borderBottomWidth: 1,
    borderBottomColor: color.borderSubtle,
  },
  recentIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: color.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  recentText: {
    flex: 1,
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    color: color.textBody,
  },
  pressed: { opacity: 0.7 },
});
