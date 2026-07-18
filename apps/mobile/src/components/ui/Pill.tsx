import { StyleSheet, Text, View } from "react-native";
import { font, radius, text } from "../../lib/theme";

type Props = { children: string; bg: string; fg: string };

export function Pill({ children, bg, fg }: Props) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: fg }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  label: { fontSize: text.xs, fontFamily: font.sansBold },
});
