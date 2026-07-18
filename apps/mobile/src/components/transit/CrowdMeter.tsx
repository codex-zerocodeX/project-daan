import { StyleSheet, Text, View } from "react-native";
import { color, font, text } from "../../lib/theme";
import type { CrowdLevel } from "../../lib/mockRoutes";

type Props = { level: CrowdLevel; size?: "sm" | "md"; label?: boolean };

const LABELS: Record<CrowdLevel, string> = {
  1: "Seats free",
  2: "Light crowd",
  3: "Moderate",
  4: "Packed",
};

export function crowdColor(level: CrowdLevel): string {
  return level <= 2 ? color.good : level === 3 ? color.warn : color.alert;
}

export function CrowdMeter({ level, size = "md", label = true }: Props) {
  const fill = crowdColor(level);
  const barWidth = size === "sm" ? 9 : 12;
  const baseHeight = size === "sm" ? 7 : 9;
  return (
    <View style={styles.row}>
      <View style={styles.bars}>
        {([1, 2, 3, 4] as const).map((i) => (
          <View
            key={i}
            style={{
              width: barWidth,
              height: baseHeight + i * 3,
              borderRadius: 3,
              backgroundColor: i <= level ? fill : color.n200,
            }}
          />
        ))}
      </View>
      {label && <Text style={styles.label}>{LABELS[level]}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 3 },
  label: {
    fontSize: text.sm,
    fontFamily: font.sansSemiBold,
    color: color.textBody,
  },
});
