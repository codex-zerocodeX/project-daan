import { Bus, Footprints } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { color, font, radius, text } from "../../lib/theme";

type Props = { mode: "walk" | "bus"; label: string; sm?: boolean };

export function ModeBadge({ mode, label, sm = false }: Props) {
  const bus = mode === "bus";
  const Icon = bus ? Bus : Footprints;
  return (
    <View
      style={[
        styles.badge,
        { height: sm ? 22 : 26 },
        { backgroundColor: bus ? color.p500 : color.sunken },
      ]}
    >
      <Icon size={sm ? 12 : 14} color={bus ? color.textOnPrimary : color.textBody} />
      <Text
        style={[styles.label, { color: bus ? color.textOnPrimary : color.textBody }]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    borderRadius: radius.sm,
  },
  label: { fontSize: text.xs, fontFamily: font.sansBold },
});
