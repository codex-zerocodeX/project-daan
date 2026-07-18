import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";
import { color, font, radius, shadow, text } from "../../lib/theme";

type Props = {
  children: string;
  onPress?: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "md" | "lg";
  full?: boolean;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
};

const variantStyles: Record<NonNullable<Props["variant"]>, ViewStyle> = {
  primary: { backgroundColor: color.p500, ...shadow.sm },
  outline: {
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  ghost: { backgroundColor: "transparent" },
};

const labelColor: Record<NonNullable<Props["variant"]>, string> = {
  primary: color.textOnPrimary,
  outline: color.textStrong,
  ghost: color.p600,
};

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  full = false,
  icon,
  loading = false,
  disabled = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        { height: size === "lg" ? 52 : 44 },
        full && styles.full,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={labelColor[variant]} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              {
                color: labelColor[variant],
                fontSize: size === "lg" ? text.bodyLg : text.bodyMd,
              },
            ]}
          >
            {children}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  full: { alignSelf: "stretch", flexGrow: 1 },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
  label: { fontFamily: font.sansSemiBold },
});
