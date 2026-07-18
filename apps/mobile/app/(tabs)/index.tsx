import { useRouter } from "expo-router";
import {
  Circle,
  Clock,
  LocateFixed,
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
import { KomyutMap } from "../../src/components/KomyutMap";
import { Button } from "../../src/components/ui/Button";
import { DEFAULT_DESTINATION, MOCK_ORIGIN } from "../../src/lib/mockRoutes";
import { color, font, radius, shadow, text } from "../../src/lib/theme";

const SAVED_PLACES = ["Home", "Work", "Gateway Mall"];
const RECENTS = ["Ortigas Center", "BGC Bus Stop"];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [dest, setDest] = useState("");

  const search = (destination: string) =>
    router.push({ pathname: "/results", params: { dest: destination } });

  return (
    <View style={styles.container}>
      <View style={styles.mapBlock}>
        <KomyutMap />
        <View style={[styles.mapHeader, { top: insets.top + 10 }]}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.headline}>Where to today?</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </View>
        <View style={styles.locateBtn}>
          <LocateFixed size={20} color={color.p500} />
        </View>
      </View>

      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchCard}>
          <View style={styles.originRow}>
            <Circle size={12} color={color.good} fill={color.good} />
            <Text style={styles.originText}>{MOCK_ORIGIN}</Text>
          </View>
          <View style={styles.destRow}>
            <MapPin size={16} color={color.p500} />
            <TextInput
              value={dest}
              onChangeText={setDest}
              placeholder="Where to?"
              placeholderTextColor={color.textMuted}
              style={styles.destInput}
              returnKeyType="search"
              onSubmitEditing={() => search(dest || DEFAULT_DESTINATION)}
            />
          </View>
          <Button
            size="lg"
            full
            icon={<Navigation size={18} color={color.textOnPrimary} />}
            onPress={() => search(dest || DEFAULT_DESTINATION)}
          >
            Find routes
          </Button>
        </View>

        <View style={styles.chipRow}>
          {SAVED_PLACES.map((place) => (
            <Pressable
              key={place}
              onPress={() => search(place)}
              style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
            >
              <Star size={13} color={color.warn} fill={color.warn} />
              <Text style={styles.chipText}>{place}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Recent</Text>
        {RECENTS.map((place) => (
          <Pressable
            key={place}
            onPress={() => search(place)}
            style={({ pressed }) => [styles.recentRow, pressed && styles.pressed]}
          >
            <Clock size={16} color={color.textMuted} />
            <Text style={styles.recentText}>{place}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgApp },
  mapBlock: { height: 340 },
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
  locateBtn: {
    position: "absolute",
    bottom: 64,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.sm,
  },
  sheet: { flex: 1, marginTop: -40 },
  sheetContent: { padding: 16, gap: 12 },
  searchCard: {
    backgroundColor: color.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    padding: 14,
    gap: 10,
    ...shadow.lifted,
  },
  originRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: color.sunken,
  },
  originText: {
    fontSize: text.bodyMd,
    fontFamily: font.sansSemiBold,
    color: color.textStrong,
  },
  destRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  destInput: {
    flex: 1,
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    color: color.textStrong,
    paddingVertical: 0,
  },
  chipRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    ...shadow.xs,
  },
  chipText: {
    fontSize: text.sm,
    fontFamily: font.sansSemiBold,
    color: color.textBody,
  },
  sectionLabel: {
    fontSize: text.xs,
    fontFamily: font.sansBold,
    textTransform: "uppercase",
    letterSpacing: 0.44,
    color: color.textMuted,
    marginTop: 4,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  recentText: {
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    color: color.textBody,
  },
  pressed: { opacity: 0.7 },
});
