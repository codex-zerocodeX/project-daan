// Lakbay design tokens, from "Mobile commuting app design system" (repo root
// zip). Color values are that system's oklch() tokens converted to sRGB hex —
// React Native cannot parse oklch().

const neutral = {
  n0: "#ffffff",
  n50: "#f7fbfc",
  n100: "#eff4f6",
  n200: "#e1e7eb",
  n300: "#d0d7db",
  n400: "#a4acb1",
  n500: "#7a8389",
  n600: "#5c656c",
  n700: "#3e464d",
  n800: "#272f36",
  n900: "#181f25",
};

const primary = {
  p50: "#e5f8fa",
  p100: "#caeef2",
  p200: "#a1dbe1",
  p400: "#48abb2",
  p500: "#11939a",
  p600: "#007882",
  p700: "#005d69",
};

export const color = {
  ...neutral,
  ...primary,

  accent100: "#d3f1de",
  accent500: "#5eab81",
  accent600: "#448d69",

  good: "#69b183",
  goodBg: "#dbf7e4",
  warn: "#d6b069",
  warnBg: "#fff0d0",
  warnFg: "#815b1f", // readable warn text on warnBg
  alert: "#c35f59",
  alertBg: "#ffe8e4",

  bgApp: neutral.n50,
  card: neutral.n0,
  sunken: neutral.n100,
  primarySoft: primary.p50,

  textStrong: neutral.n900,
  textBody: neutral.n800,
  textMuted: neutral.n500,
  textOnPrimary: "#f8fdfd",

  borderSubtle: neutral.n200,
  borderStrong: neutral.n300,
};

export const space = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const text = {
  display: 32,
  h1: 24,
  h2: 20,
  h3: 17,
  bodyLg: 16,
  bodyMd: 15,
  sm: 13,
  xs: 11,
};

// Static font files: each weight is its own family (loaded in app/_layout.tsx).
export const font = {
  sans: "PlusJakartaSans_400Regular",
  sansMedium: "PlusJakartaSans_500Medium",
  sansSemiBold: "PlusJakartaSans_600SemiBold",
  sansBold: "PlusJakartaSans_700Bold",
  sansExtraBold: "PlusJakartaSans_800ExtraBold",
  mono: "DMMono_400Regular",
  monoMedium: "DMMono_500Medium",
};

// Status tones: `fg` for dots/icons, `bg` for chip fills, `text` stays
// readable on `bg` (warn's yellow is too light to double as text).
export const tone = {
  good: { fg: color.good, bg: color.goodBg, text: color.good },
  warn: { fg: color.warn, bg: color.warnBg, text: color.warnFg },
  alert: { fg: color.alert, bg: color.alertBg, text: color.alert },
} as const;

const shadowBase = "#394a56";

export const shadow = {
  xs: {
    shadowColor: shadowBase,
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sm: {
    shadowColor: shadowBase,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  card: {
    shadowColor: shadowBase,
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  lifted: {
    shadowColor: shadowBase,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;
