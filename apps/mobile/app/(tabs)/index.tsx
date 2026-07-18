import { useRouter } from "expo-router";
import {
  Circle,
  Clock,
  LocateFixed,
  MapPin,
  MessageCirclePlus,
  Navigation,
  Search,
  Star,
  TriangleAlert,
} from "lucide-react-native";
import { useMemo, useState } from "react";
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
import {
  PLACES,
  resolvePlace,
  searchPlaces,
  type Place,
} from "../../src/lib/places";
import { color, font, radius, shadow, text } from "../../src/lib/theme";

/**
 * Every place the UI offers must come from the gazetteer, because the results
 * screen is given coordinates, not a name. Free text that does not resolve is
 * a dead end by design - we offer to ask the community instead of guessing.
 */

/** The corridor our seeded community data actually covers. */
const DEFAULT_ORIGIN: Place =
  resolvePlace("Ateneo Gate 3, Katipunan") ?? PLACES[0];

/** Resolve a list of names at module load so no shortcut can be unresolvable. */
function gazetteerList(names: string[]): Place[] {
  return names
    .map((name) => resolvePlace(name))
    .filter((place): place is Place => place !== null);
}

const SAVED_PLACES = gazetteerList([
  "Ayala Avenue, Makati",
  "SM North EDSA",
  "Araneta Center-Cubao LRT-2",
]);

const RECENTS = gazetteerList([
  "Ortigas MRT-3 Station",
  "SM Mall of Asia",
  "Antipolo LRT-2",
]);

const SUGGESTION_LIMIT = 6;

type Field = "origin" | "dest";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [origin, setOrigin] = useState<Place>(DEFAULT_ORIGIN);
  const [originText, setOriginText] = useState(DEFAULT_ORIGIN.name);
  const [destText, setDestText] = useState("");
  // Set only when the user picks a suggestion; typing clears it again.
  const [destPick, setDestPick] = useState<Place | null>(null);
  const [active, setActive] = useState<Field | null>(null);

  // A typed destination still counts if it resolves outright ("ayala"), so the
  // user is not forced to tap a suggestion.
  const dest = useMemo(
    () => destPick ?? resolvePlace(destText),
    [destPick, destText],
  );

  const suggestions = useMemo(() => {
    if (active === "origin") {
      return originText.trim() === "" || originText === origin.name
        ? []
        : searchPlaces(originText, SUGGESTION_LIMIT);
    }
    if (active === "dest") {
      return destText.trim() === "" || destText === destPick?.name
        ? []
        : searchPlaces(destText, SUGGESTION_LIMIT);
    }
    return [];
  }, [active, originText, origin.name, destText, destPick]);

  const destUnknown = destText.trim() !== "" && dest === null;

  const go = (destination: Place) => {
    router.push({
      pathname: "/results",
      params: {
        originName: origin.name,
        destName: destination.name,
        oLat: String(origin.lat),
        oLng: String(origin.lng),
        dLat: String(destination.lat),
        dLng: String(destination.lng),
      },
    });
  };

  const search = () => {
    // Never navigate without coordinates - that is what produces NaN downstream.
    if (!dest) return;
    setActive(null);
    go(dest);
  };

  const askCommunity = () => {
    router.push({ pathname: "/ask", params: { destName: destText.trim() } });
  };

  const pickSuggestion = (place: Place) => {
    if (active === "origin") {
      setOrigin(place);
      setOriginText(place.name);
    } else {
      setDestPick(place);
      setDestText(place.name);
    }
    setActive(null);
  };

  const shortcut = (place: Place) => {
    setDestPick(place);
    setDestText(place.name);
    go(place);
  };

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
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchCard}>
          <View style={styles.originRow}>
            <Circle size={12} color={color.good} fill={color.good} />
            <TextInput
              value={originText}
              onChangeText={setOriginText}
              onFocus={() => setActive("origin")}
              // Keep the origin valid at all times: commit the draft if it
              // resolves, otherwise snap back to the last real place. Resolving
              // from the text (not from `origin`) also makes this safe when
              // blur fires right after a suggestion tap.
              onBlur={() => {
                const match = resolvePlace(originText);
                if (match) {
                  setOrigin(match);
                  setOriginText(match.name);
                } else {
                  setOriginText(origin.name);
                }
              }}
              placeholder="Starting point"
              placeholderTextColor={color.textMuted}
              style={styles.fieldInput}
              returnKeyType="done"
            />
          </View>

          <View style={styles.destRow}>
            <MapPin size={16} color={color.p500} />
            <TextInput
              value={destText}
              onChangeText={(value) => {
                setDestText(value);
                setDestPick(null);
              }}
              onFocus={() => setActive("dest")}
              placeholder="Where to?"
              placeholderTextColor={color.textMuted}
              style={styles.fieldInput}
              returnKeyType="search"
              onSubmitEditing={search}
            />
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestions}>
              {suggestions.map((place) => (
                <Pressable
                  key={place.name}
                  onPress={() => pickSuggestion(place)}
                  style={({ pressed }) => [
                    styles.suggestionRow,
                    pressed && styles.pressed,
                  ]}
                >
                  <Search size={15} color={color.textMuted} />
                  <Text style={styles.suggestionText}>{place.name}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {destUnknown && (
            <View style={styles.unknownBox}>
              <View style={styles.unknownHead}>
                <TriangleAlert size={16} color={color.warnFg} />
                <Text style={styles.unknownTitle}>
                  We don&apos;t know that place yet
                </Text>
              </View>
              <Text style={styles.unknownBody}>
                &ldquo;{destText.trim()}&rdquo; isn&apos;t in our map yet, so we
                can&apos;t plan a trip to it. Ask the community and someone who
                knows the way can answer.
              </Text>
              <Button
                variant="outline"
                full
                icon={<MessageCirclePlus size={17} color={color.textStrong} />}
                onPress={askCommunity}
              >
                Ask the community
              </Button>
            </View>
          )}

          <Button
            size="lg"
            full
            disabled={dest === null}
            icon={<Navigation size={18} color={color.textOnPrimary} />}
            onPress={search}
          >
            Find routes
          </Button>
        </View>

        <View style={styles.chipRow}>
          {SAVED_PLACES.map((place) => (
            <Pressable
              key={place.name}
              onPress={() => shortcut(place)}
              style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
            >
              <Star size={13} color={color.warn} fill={color.warn} />
              <Text style={styles.chipText}>{place.name}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Recent</Text>
        {RECENTS.map((place) => (
          <Pressable
            key={place.name}
            onPress={() => shortcut(place)}
            style={({ pressed }) => [styles.recentRow, pressed && styles.pressed]}
          >
            <Clock size={16} color={color.textMuted} />
            <Text style={styles.recentText}>{place.name}</Text>
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
  fieldInput: {
    flex: 1,
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    color: color.textStrong,
    paddingVertical: 0,
  },
  suggestions: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    backgroundColor: color.card,
    overflow: "hidden",
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: color.borderSubtle,
  },
  suggestionText: {
    flex: 1,
    fontSize: text.bodyMd,
    fontFamily: font.sansMedium,
    color: color.textBody,
  },
  unknownBox: {
    borderRadius: radius.md,
    backgroundColor: color.warnBg,
    padding: 12,
    gap: 8,
  },
  unknownHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  unknownTitle: {
    fontSize: text.bodyMd,
    fontFamily: font.sansBold,
    color: color.warnFg,
  },
  unknownBody: {
    fontSize: text.sm,
    fontFamily: font.sans,
    lineHeight: text.sm * 1.5,
    color: color.warnFg,
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
