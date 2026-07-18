import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { color, font, radius, text } from "../../lib/theme";

type Props = {
  label: string;
  value?: string;
  valueColor?: string;
  bg?: string;
  children?: ReactNode; // rendered instead of `value` (e.g. a CrowdMeter)
};

export function SignalBox({
  label,
  value,
  valueColor = color.textBody,
  bg = color.sunken,
  children,
}: Props) {
  return (
    <View style={[styles.box, { backgroundColor: bg }]}>
      <Text style={styles.label}>{label}</Text>
      {children ?? (
        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
    minHeight: 64,
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontFamily: font.sansBold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: color.textMuted,
  },
  value: { fontSize: text.bodyMd, fontFamily: font.sansBold },
});
